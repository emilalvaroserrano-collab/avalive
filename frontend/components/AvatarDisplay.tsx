import React, { useState } from 'react';
import { liveServiceConfiguration } from '../resources/live_service_configuration';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  hasVideo: boolean;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  isAvatarVisible: boolean;
  agentTalking: boolean;
}

export const AvatarDisplay: React.FC<Props> = ({ videoRef, hasVideo, isConnected, isLoading, error, isAvatarVisible, agentTalking }) => {
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  const avatarData = (liveServiceConfiguration as any).avatarConfig?.customizedAvatar?.imageData || '';
  const avatarMime = (liveServiceConfiguration as any).avatarConfig?.customizedAvatar?.imageMimeType || 'image/png';
  const avatarName = (liveServiceConfiguration as any).avatarConfig?.avatarName || '';

  let avatarSrc = '';
  if (avatarData) {
    avatarSrc = `data:${avatarMime};base64,${avatarData}`;
  } else if (avatarName) {
    const avatarBaseUrl = 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars';
    const avatarImageUrls: {[avatarValue: string]: string} = {
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
    const avatarValue = avatarName.toLowerCase();
    avatarSrc = avatarImageUrls[avatarValue] || avatarBaseUrl + '/' + avatarValue + '.png';
  }

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
      className={`relative transition-all duration-500 flex-shrink-0 ${
        isAvatarVisible
          ? `rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-950 ${isConnected ? 'shadow-[0_0_40px_rgba(34,197,94,0.2)]' : 'shadow-lg'}`
          : 'flex flex-col items-center justify-center w-full max-w-md aspect-square'
      }`}
      style={isAvatarVisible ? {
        width: '100%',
        maxWidth: `min(85vw, 70%, 80vh * ${aspectRatio})`,
        aspectRatio: aspectRatio
      } : {}}
    >
      {/* The video element MUST remain in the DOM and have a non-zero size for audio to play, even when the avatar is hidden. */}
      <video
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hasVideo && isAvatarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none -z-10'}`}
        playsInline
        autoPlay
      />

      {isAvatarVisible ? (
        <img
          src={avatarSrc}
          alt="AI Avatar"
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.currentTarget;
            if (naturalWidth && naturalHeight) {
              setAspectRatio(naturalWidth / naturalHeight);
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hasVideo ? 'opacity-0' : 'opacity-100'}`}
        />
      ) : (
        <div className={micContainerClasses}>
          <svg className={`w-12 h-12 transition-colors duration-300 ${isConnected ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm z-50 pointer-events-none">
        <div className={`w-2.5 h-2.5 rounded-full ${error ? 'bg-red-500' :
            isLoading ? 'bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]' :
              isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' :
                'bg-gray-400'
          }`}></div>
        <span className="text-sm font-medium text-white whitespace-nowrap">
          {error ? <span className="text-red-400">{error}</span> :
            isLoading ? 'Connecting...' :
              isConnected ? 'Connected' : 'Ready to connect'}
        </span>
      </div>
    </div>
  );
};
