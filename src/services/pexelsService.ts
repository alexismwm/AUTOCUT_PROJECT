import { 
  VideoTheme, 
  VideoAsset, 
  VideoSearchParams, 
  PexelsResponse, 
  PexelsVideo,
  VideoServiceError 
} from '../types/video';

// Configuration de l'API Pexels
const PEXELS_API_URL = 'https://api.pexels.com/videos';
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || import.meta.env.PEXELS_API_KEY || '';

// Helper: proxy same-origin via Edge function to comply with COEP require-corp
function proxy(url: string): string {
  try {
    return `/api/fetch?url=${encodeURIComponent(url)}`;
  } catch {
    return url;
  }
}

// Limites de l'API (version gratuite)
const API_LIMITS = {
  requestsPerHour: 200,
  requestsPerMonth: 20000
};

class PexelsService {
  private requestCount = 0;
  private lastResetTime = Date.now();

  /**
   * Configuration des headers pour l'API Pexels
   */
  private getHeaders(): HeadersInit {
    return {
      'Authorization': PEXELS_API_KEY,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Vérifie si on peut faire une requête (respect des quotas)
   */
  private canMakeRequest(): boolean {
    const now = Date.now();
    const hoursSinceReset = (now - this.lastResetTime) / (1000 * 60 * 60);
    
    if (hoursSinceReset >= 1) {
      // Reset du compteur toutes les heures
      this.requestCount = 0;
      this.lastResetTime = now;
    }
    
    return this.requestCount < API_LIMITS.requestsPerHour;
  }

  /**
   * Transforme une vidéo Pexels en VideoAsset
   */
  private transformPexelsVideo(pexelsVideo: PexelsVideo, theme: VideoTheme): VideoAsset {
    // Trouver la meilleure qualité vidéo (préférer HD)
    const bestVideo = pexelsVideo.video_files
      .filter(file => file.file_type === 'video/mp4')
      .sort((a, b) => {
        // Prioriser HD puis par taille
        if (a.quality === 'hd' && b.quality !== 'hd') return -1;
        if (b.quality === 'hd' && a.quality !== 'hd') return 1;
        return (b.width * b.height) - (a.width * a.height);
      })[0];

    // Thumbnail (première image disponible)
    const rawThumbnail = pexelsVideo.video_pictures[0]?.picture || pexelsVideo.image;

    return {
      id: pexelsVideo.id.toString(),
      title: pexelsVideo.tags.slice(0, 3).join(' ') || 'Video',
      thumbnail: proxy(rawThumbnail),
      videoUrl: bestVideo?.link ? proxy(bestVideo.link) : '',
      duration: pexelsVideo.duration,
      width: pexelsVideo.width,
      height: pexelsVideo.height,
      theme,
      tags: pexelsVideo.tags,
      avgColor: pexelsVideo.avg_color,
      author: {
        name: pexelsVideo.user.name,
        url: pexelsVideo.user.url
      }
    };
  }

  /**
   * Recherche de vidéos par thème avec mots-clés personnalisés
   */
  async searchVideosByTheme(params: VideoSearchParams, customKeywords?: string[]): Promise<VideoAsset[]> {
    if (!PEXELS_API_KEY) {
      console.warn('🔑 Pexels API key not found. Using mock data.');
      console.log('💡 To use real Pexels videos, add VITE_PEXELS_API_KEY to your .env file');
      return this.getMockVideos(params.theme, params.perPage || 15, customKeywords);
    }

    if (!this.canMakeRequest()) {
      throw new VideoServiceError(
        'API quota exceeded. Please try again later.',
        'QUOTA_EXCEEDED'
      );
    }

    try {
      // Combiner mots-clés du thème avec mots-clés personnalisés
      let allKeywords = this.getThemeKeywords(params.theme);
      if (customKeywords && customKeywords.length > 0) {
        // Priorité aux mots-clés personnalisés, puis ajouter quelques mots-clés du thème
        allKeywords = [...customKeywords, ...allKeywords.slice(0, 2)];
      }
      
      const searchQuery = allKeywords.join(' ');
      const url = new URL(`${PEXELS_API_URL}/search`);
      
      // Paramètres de recherche
      url.searchParams.set('query', searchQuery);
      url.searchParams.set('per_page', (params.perPage || 15).toString());
      url.searchParams.set('page', (params.page || 1).toString());
      
      if (params.orientation) {
        url.searchParams.set('orientation', params.orientation);
      }
      
      if (params.size) {
        url.searchParams.set('size', params.size);
      }

      console.log(`🔍 Searching Pexels for: "${searchQuery}"`);
      console.log(`📡 API URL: ${url.toString()}`);
      console.log(`🔑 Using API key: ${PEXELS_API_KEY ? 'Yes' : 'No'}`);
      console.log(`🎯 Custom keywords:`, customKeywords);
      console.log(`🎯 Theme keywords:`, this.getThemeKeywords(params.theme));
      console.log(`🎯 Final keywords:`, allKeywords);

      const response = await fetch(url.toString(), {
        headers: this.getHeaders()
      });

      this.requestCount++;

      if (!response.ok) {
        if (response.status === 429) {
          throw new VideoServiceError(
            'Too many requests. Please wait before trying again.',
            'QUOTA_EXCEEDED'
          );
        }
        throw new VideoServiceError(
          `API request failed: ${response.status}`,
          'API_ERROR'
        );
      }

      const data: PexelsResponse = await response.json();
      
      console.log(`📊 Pexels API Response: ${data.videos?.length || 0} videos found`);
      
      const videos = data.videos
        .filter(video => {
          // Filtrer par durée si spécifié
          if (params.minDuration && video.duration < params.minDuration) return false;
          if (params.maxDuration && video.duration > params.maxDuration) return false;
          return true;
        })
        .map(video => this.transformPexelsVideo(video, params.theme))
        .filter(video => video.videoUrl); // S'assurer qu'on a une URL valide

      const keywordInfo = customKeywords && customKeywords.length > 0 
        ? ` with keywords: [${customKeywords.join(', ')}]` 
        : '';
      console.log(`🎬 Loaded ${videos.length} videos for theme "${params.theme}"${keywordInfo}`);
      return videos;

    } catch (error) {
      if (error instanceof VideoServiceError) {
        throw error;
      }
      
      console.error('Pexels API error:', error);
      console.log('🔄 Falling back to mock data due to API error');
      return this.getMockVideos(params.theme, params.perPage || 15, customKeywords);
    }
  }

  /**
   * Vidéos populaires par thème
   */
  async getPopularVideos(theme: VideoTheme, limit = 20): Promise<VideoAsset[]> {
    if (!PEXELS_API_KEY) {
      return this.getMockVideos(theme, limit);
    }

    if (!this.canMakeRequest()) {
      throw new VideoServiceError(
        'API quota exceeded. Please try again later.',
        'QUOTA_EXCEEDED'
      );
    }

    try {
      const url = new URL(`${PEXELS_API_URL}/popular`);
      url.searchParams.set('per_page', limit.toString());

      const response = await fetch(url.toString(), {
        headers: this.getHeaders()
      });

      this.requestCount++;

      if (!response.ok) {
        throw new VideoServiceError(
          `Failed to fetch popular videos: ${response.status}`,
          'API_ERROR'
        );
      }

      const data: PexelsResponse = await response.json();
      const keywords = this.getThemeKeywords(theme);
      
      // Filtrer les vidéos populaires par thème
      const filteredVideos = data.videos
        .filter(video => {
          const videoTags = video.tags.map(tag => tag.toLowerCase());
          return keywords.some(keyword => 
            videoTags.some(tag => tag.includes(keyword.toLowerCase()))
          );
        })
        .slice(0, limit)
        .map(video => this.transformPexelsVideo(video, theme))
        .filter(video => video.videoUrl);

      console.log(`🔥 Loaded ${filteredVideos.length} popular videos for theme "${theme}"`);
      return filteredVideos;

    } catch (error) {
      if (error instanceof VideoServiceError) {
        throw error;
      }
      
      console.error('Popular videos API error:', error);
      return this.getMockVideos(theme, limit);
    }
  }

  /**
   * Mots-clés par thème pour les recherches Pexels
   */
  private getThemeKeywords(theme: VideoTheme): string[] {
    const themeKeywords: Record<VideoTheme, string[]> = {
      'Travel': ['travel', 'vacation', 'adventure', 'destination', 'journey', 'explore', 'wanderlust', 'tourism'],
      'Lifestyle': ['lifestyle', 'home', 'family', 'daily life', 'routine', 'comfort', 'living', 'modern life'],
      'Fashion': ['fashion', 'style', 'clothing', 'model', 'trendy', 'outfit', 'runway', 'designer'],
      'Retro': ['retro', 'vintage', 'classic', 'old school', 'nostalgic', '80s', '90s', 'throwback'],
      'Party': ['party', 'celebration', 'dancing', 'nightlife', 'fun', 'festive', 'music', 'crowd'],
      'Sport': ['sport', 'fitness', 'exercise', 'athletic', 'training', 'competition', 'active', 'gym'],
      'Games': ['gaming', 'video games', 'esports', 'console', 'player', 'competition', 'online', 'fun'],
      'Food': ['food', 'cooking', 'cuisine', 'restaurant', 'chef', 'delicious', 'dining', 'meal'],
      'Vlog': ['vlog', 'blogger', 'camera', 'content', 'creator', 'recording', 'social media', 'lifestyle'],
      'social': ['social media', 'community', 'people', 'connection', 'sharing', 'networking', 'friends', 'online']
    };

    return themeKeywords[theme] || ['video', 'content'];
  }

  /**
   * Données de démonstration si pas d'API key
   */
  private getMockVideos(theme: VideoTheme, limit = 15, customKeywords?: string[]): VideoAsset[] {
    // Generate a proper list of mock authors
    const mockAuthors = [
      'John Smith', 'Emma Wilson', 'Michael Brown', 'Sarah Davis', 'David Miller',
      'Lisa Garcia', 'James Johnson', 'Maria Rodriguez', 'Robert Martinez', 'Jennifer Taylor',
      'William Anderson', 'Patricia Thomas', 'Richard Jackson', 'Linda White', 'Thomas Harris'
    ];

    // Theme-specific video URLs for variety - Using working demo videos
    const themeVideos = {
      'Travel': [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      ],
      'Lifestyle': [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
      ],
      'Fashion': [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMob.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      ],
      'Retro': [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      ],
      'Party': [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMob.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
      ],
      'Sport': [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      ],
      'Games': [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMob.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
      ],
      'Food': [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      ],
      'Vlog': [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      ],
      'social': [
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMob.mp4',
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
      ]
    };

    const videos = themeVideos[theme] || themeVideos['Travel'];

    const mockData: VideoAsset[] = Array.from({ length: limit }, (_, i) => {
      const authorIndex = i % mockAuthors.length;
      const videoIndex = i % videos.length;
      const duration = 8 + Math.random() * 22; // 8-30 seconds, more realistic
      
      // Créer un titre plus intelligent basé sur les mots-clés
      let title = `${theme} video ${i + 1}`;
      if (customKeywords && customKeywords.length > 0) {
        const keyword = customKeywords[0]; // Prendre le premier mot-clé
        title = `${keyword} ${theme} video ${i + 1}`;
      }
      
      return {
        id: `mock-${theme}-${i}-${Date.now()}`, // Add timestamp for uniqueness
        title: title,
        thumbnail: `https://picsum.photos/400/300?random=${theme}${i}${Date.now()}`, // Direct URL for thumbnails
        videoUrl: proxy(videos[videoIndex]),
        duration: Math.round(duration * 10) / 10, // Round to 1 decimal
        width: 1920,
        height: 1080,
        theme,
        tags: customKeywords ? [...customKeywords, ...this.getThemeKeywords(theme).slice(0, 2)] : this.getThemeKeywords(theme).slice(0, 3),
        avgColor: '#' + Math.floor(Math.random()*16777215).toString(16),
        author: {
          name: mockAuthors[authorIndex],
          url: '#'
        }
      };
    });

    console.log(`🎭 Using mock data: ${mockData.length} videos for theme "${theme}"`);
    console.log(`📹 Mock video URLs:`, videos);
    return mockData;
  }

  /**
   * Obtient les statistiques d'utilisation de l'API
   */
  getUsageStats() {
    const hoursSinceReset = (Date.now() - this.lastResetTime) / (1000 * 60 * 60);
    return {
      requestsThisHour: this.requestCount,
      maxRequestsPerHour: API_LIMITS.requestsPerHour,
      timeUntilReset: Math.max(0, 60 - (hoursSinceReset * 60)), // minutes
      hasApiKey: !!PEXELS_API_KEY
    };
  }
}

// Instance singleton
export const pexelsService = new PexelsService();
export default pexelsService; 