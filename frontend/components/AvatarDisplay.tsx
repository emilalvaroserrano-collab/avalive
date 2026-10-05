import React, { useState } from 'react';
import { Sparkles, Sliders } from 'lucide-react';
import { AvatarSettings } from '../types';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  hasVideo: boolean;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  isAvatarVisible: boolean;
  agentTalking: boolean;
  avatarSettings: AvatarSettings;
  onOpenCustomizer: () => void;
}

export const AvatarDisplay: React.FC<Props> = ({
  videoRef,
  hasVideo,
  isConnected,
  isLoading,
  error,
  isAvatarVisible,
  agentTalking,
  avatarSettings,
  onOpenCustomizer
}) => {
  const [aspectRatio, setAspectRatio] = useState<number>(9 / 16);

  // Determine avatar background / standby media source
  const getAvatarSource = (): { isVideo: boolean; src: string } => {
    if (avatarSettings.mode === 'custom-video' && avatarSettings.customVideoUrl) {
      return { isVideo: true, src: avatarSettings.customVideoUrl };
    }
    if (avatarSettings.mode === 'custom-image' && avatarSettings.customImagePreviewUrl) {
      return { isVideo: false, src: avatarSettings.customImagePreviewUrl };
    }

    // Default preset
    const avatarBaseUrl = 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars';
    const avatarName = (avatarSettings.presetName || 'ben').toLowerCase();
    const avatarImageUrls: { [avatarValue: string]: string } = {
      ben: avatarBaseUrl + '/ben.png',
      carmen: avatarBaseUrl + '/carmen_2.png',
      ingrid: avatarBaseUrl + '/ingrid.png',
      jay: avatarBaseUrl + '/jay.png',
      kai: avatarBaseUrl + '/kai.png',
      kira: avatarBaseUrl + '/kira.png',
      leo: avatarBaseUrl + '/leo.png',
      paul: avatarBaseUrl + '/paul.png',
      piper: avatarBaseUrl + '/piper.png',
      sam: avatarBaseUrl + '/sam.png',
      vera: avatarBaseUrl + '/vera.png',
    };
    return { isVideo: false, src: avatarImageUrls[avatarName] || `${avatarBaseUrl}/${avatarName}.png` };
  };

  const avatarMedia = getAvatarSource();

  let micContainerClasses = 'relative flex items-center justify-center w-32 h-32 rounded-full bg-white dark:bg-gray-800 transition-all duration-500 ';
  if (isLoading) {
    micContainerClasses += 'animate-pulse shadow-[0_0_60px_rgba(234,179,8,0.6)] scale-110';
  } else if (isConnected && agentTalking) {
    micContainerClasses += 'animate-pulse shadow-[0_0_60px_rgba(59,130,246,0.6)] scale-110';
  } else {
    micContainerClasses += 'shadow-lg scale-100';
  }

  return (
    <div
      className={`relative group transition-all duration-500 flex-shrink-0 ${
        isAvatarVisible
          ? `rounded-3xl overflow-hidden bg-gray-900 ${
              agentTalking
                ? 'shadow-[0_0_50px_rgba(59,130,246,0.45)] ring-2 ring-blue-500/50'
                : isConnected
                ? 'shadow-[0_0_40px_rgba(34,197,94,0.2)]'
                : 'shadow-2xl'
            }`
          : 'flex flex-col items-center justify-center w-full max-w-md aspect-square'
      }`}
      style={
        isAvatarVisible
          ? {
              width: '100%',
              maxWidth: `min(85vw, 68%, 78vh * ${aspectRatio})`,
              aspectRatio: aspectRatio,
            }
          : {}
      }
    >
      {/* The video element MUST remain in the DOM and have a non-zero size for audio/video to play */}
      <video
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          hasVideo && isAvatarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none -z-10'
        }`}
        playsInline
        autoPlay
      />

      {isAvatarVisible ? (
        <>
          {/* Custom Vertical Video Clip Standby */}
          {avatarMedia.isVideo ? (
            <video
              src={avatarMedia.src}
              autoPlay
              loop
              muted
              playsInline
              onLoadedMetadata={(e) => {
                const { videoWidth, videoHeight } = e.currentTarget;
                if (videoWidth && videoHeight) {
                  setAspectRatio(videoWidth / videoHeight);
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                hasVideo ? 'opacity-0' : 'opacity-100'
              }`}
            />
          ) : (
            <img
              src={avatarMedia.src}
              alt="AI Avatar"
              onLoad={(e) => {
                const { naturalWidth, naturalHeight } = e.currentTarget;
                if (naturalWidth && naturalHeight) {
                  setAspectRatio(naturalWidth / naturalHeight);
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                hasVideo ? 'opacity-0' : 'opacity-100'
              }`}
            />
          )}

          {/* Talking Indicator Glow Waves */}
          {agentTalking && (
            <div className="absolute inset-0 pointer-events-none border-2 border-blue-400/60 rounded-3xl animate-pulse" />
          )}

          {/* Hover Button to Customize Avatar */}
          <div className="absolute top-4 right-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={onOpenCustomizer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-semibold shadow-lg border border-white/20 transition-all hover:scale-105 active:scale-95"
              title="Customize Avatar Image or Video"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Customize</span>
            </button>
          </div>

          {/* Current Avatar Label Chip */}
          <div className="absolute top-4 left-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 text-white/90 backdrop-blur-md text-[10px] font-medium border border-white/10">
              <Sparkles className="w-3 h-3 text-blue-400" />
              {avatarSettings.mode === 'custom-image'
                ? 'Custom Photo'
                : avatarSettings.mode === 'custom-video'
                ? 'Vertical Clip'
                : `Preset: ${avatarSettings.presetName}`}
            </span>
          </div>
        </>
      ) : (
        <div className={micContainerClasses}>
          <svg className={`w-12 h-12 transition-colors duration-300 ${isConnected ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-black/65 backdrop-blur-md px-4 py-2 rounded-full shadow-lg z-50 pointer-events-none border border-white/10">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            error
              ? 'bg-red-500'
              : isLoading
              ? 'bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]'
              : isConnected
              ? agentTalking
                ? 'bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,1)]'
                : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'
              : 'bg-gray-400'
          }`}
        />
        <span className="text-xs font-semibold text-white whitespace-nowrap">
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : isLoading ? (
            'Connecting Live Avatar...'
          ) : isConnected ? (
            agentTalking ? 'Avatar Speaking...' : 'Connected • Listening'
          ) : (
            'Ready to Connect'
          )}
        </span>
      </div>
    </div>
  );
};
