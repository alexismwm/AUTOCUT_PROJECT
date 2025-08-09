export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    if (!url) {
      return new Response('Missing url', { status: 400 });
    }

    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return new Response('Invalid protocol', { status: 400 });
    }

    // Special handling for Pexels API
    if (parsed.hostname === 'api.pexels.com') {
      const pexelsUrl = new URL(parsed.pathname + parsed.search, 'https://api.pexels.com');
      const apiKey = searchParams.get('apiKey');
      
      if (!apiKey) {
        return new Response('Missing API key for Pexels', { status: 400 });
      }

      const upstream = await fetch(pexelsUrl.toString(), {
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; SnapcutProxy/1.0; +https://vercel.app)'
        }
      });

      if (!upstream.ok) {
        const errorText = await upstream.text();
        return new Response(`Pexels API error: ${upstream.status} - ${errorText}`, { 
          status: upstream.status 
        });
      }

      const data = await upstream.json();
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
          'Cross-Origin-Resource-Policy': 'cross-origin'
        }
      });
    }

    // Regular proxy for other URLs
    const upstream = await fetch(url, {
      // Some CDNs block unknown UA; set a common UA and Accept for images/videos
      headers: {
        'Accept': 'image/*,video/*;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (compatible; SnapcutProxy/1.0; +https://vercel.app)'
      },
      redirect: 'follow'
    });

    if (!upstream.ok) {
      return new Response('Upstream error', { status: 502 });
    }

    const ct = upstream.headers.get('content-type') || 'application/octet-stream';
    const buf = await upstream.arrayBuffer();
    const len = buf.byteLength.toString();

    return new Response(buf, {
      headers: {
        'Content-Type': ct,
        'Content-Length': len,
        'Cache-Control': 'public, max-age=3600, immutable',
        // allow usage under COEP
        'Cross-Origin-Resource-Policy': 'cross-origin'
      }
    });
  } catch (err) {
    return new Response('Proxy error', { status: 500 });
  }
} 