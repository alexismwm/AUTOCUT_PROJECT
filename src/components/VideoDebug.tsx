import React, { useState, useRef, useEffect } from 'react';
import { VideoAsset } from '../types/video';

interface VideoDebugProps {
  video: VideoAsset;
  onClose: () => void;
}

export const VideoDebug: React.FC<VideoDebugProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState({
    loaded: false,
    error: false,
    duration: 0,
    currentTime: 0,
    readyState: 0,
    networkState: 0,
    errorMessage: ''
  });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      console.log('✅ Video metadata loaded:', {
        duration: videoElement.duration,
        readyState: videoElement.readyState,
        networkState: videoElement.networkState
      });
      setVideoState(prev => ({
        ...prev,
        loaded: true,
        duration: videoElement.duration,
        readyState: videoElement.readyState,
        networkState: videoElement.networkState
      }));
    };

    const handleTimeUpdate = () => {
      setVideoState(prev => ({
        ...prev,
        currentTime: videoElement.currentTime
      }));
    };

    const handleError = (e: Event) => {
      console.error('❌ Video error:', e);
      const error = videoElement.error;
      let errorMessage = 'Unknown error';
      
      if (error) {
        switch (error.code) {
          case 1:
            errorMessage = 'MEDIA_ERR_ABORTED - Loading aborted';
            break;
          case 2:
            errorMessage = 'MEDIA_ERR_NETWORK - Network error';
            break;
          case 3:
            errorMessage = 'MEDIA_ERR_DECODE - Decoding error';
            break;
          case 4:
            errorMessage = 'MEDIA_ERR_SRC_NOT_SUPPORTED - Source not supported';
            break;
          default:
            errorMessage = `Error code: ${error.code}`;
        }
      }

      setVideoState(prev => ({
        ...prev,
        error: true,
        errorMessage
      }));
    };

    const handleCanPlay = () => {
      console.log('🎬 Video can play');
    };

    const handleCanPlayThrough = () => {
      console.log('🎬 Video can play through');
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('canplaythrough', handleCanPlayThrough);

    // Load the video
    videoElement.load();

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [video]);

  const testDirectUrl = () => {
    if (videoRef.current) {
      const originalUrl = video.videoUrl.replace('/api/fetch?url=', '');
      console.log('🔄 Testing direct URL:', originalUrl);
      videoRef.current.src = originalUrl;
      setVideoState(prev => ({ ...prev, error: false, errorMessage: '' }));
    }
  };

  const testProxyUrl = () => {
    if (videoRef.current) {
      console.log('🔄 Testing proxy URL:', video.videoUrl);
      videoRef.current.src = video.videoUrl;
      setVideoState(prev => ({ ...prev, error: false, errorMessage: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                🔍 Video Debug - {video.title}
              </h2>
              <p className="text-sm text-slate-400">ID: {video.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors text-xl hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-white mb-2">Video Properties</h3>
              <div className="space-y-1 text-slate-300">
                <div>Duration: {video.duration}s</div>
                <div>Resolution: {video.width}x{video.height}</div>
                <div>Theme: {video.theme}</div>
                <div>Author: {video.author.name}</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Video State</h3>
              <div className="space-y-1 text-slate-300">
                <div>Loaded: {videoState.loaded ? '✅' : '❌'}</div>
                <div>Error: {videoState.error ? '❌' : '✅'}</div>
                <div>Duration: {videoState.duration.toFixed(1)}s</div>
                <div>Current Time: {videoState.currentTime.toFixed(1)}s</div>
                <div>Ready State: {videoState.readyState}</div>
                <div>Network State: {videoState.networkState}</div>
              </div>
            </div>
          </div>

          {videoState.error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
              <h3 className="font-semibold text-red-400 mb-2">❌ Error</h3>
              <p className="text-red-300">{videoState.errorMessage}</p>
            </div>
          )}

          {/* URLs */}
          <div>
            <h3 className="font-semibold text-white mb-2">URLs</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Proxy URL:</label>
                <div className="bg-slate-700 rounded p-2 text-xs font-mono text-slate-300 break-all">
                  {video.videoUrl}
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Direct URL:</label>
                <div className="bg-slate-700 rounded p-2 text-xs font-mono text-slate-300 break-all">
                  {video.videoUrl.replace('/api/fetch?url=', '')}
                </div>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={testProxyUrl}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
            >
              Test Proxy URL
            </button>
            <button
              onClick={testDirectUrl}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm"
            >
              Test Direct URL
            </button>
          </div>
        </div>

        {/* Video Preview */}
        <div className="p-6">
          <div className="relative aspect-[9/16] max-h-96 mx-auto bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              playsInline
              controls
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
          >
            Close Debug
          </button>
        </div>
      </div>
    </div>
  );
}; 