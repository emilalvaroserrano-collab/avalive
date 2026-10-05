import React, { useState, useRef, useCallback, useEffect } from 'react';
import { TranscriptionPanel } from './components/TranscriptionPanel';
import { UserWebCamDisplay } from './components/UserWebCamDisplay';
import { TopBar } from './components/TopBar';
import { DebugPanel } from './components/DebugPanel';
import { AvatarDisplay } from './components/AvatarDisplay';
import { ControlBar } from './components/ControlBar';
import { AvatarCustomizerModal } from './components/AvatarCustomizerModal';
import { useTheme } from './hooks/useTheme';
import { useMediaDevices } from './hooks/useMediaDevices';
import { useLiveSession } from './hooks/useLiveSession';
import { VideoMode, AvatarSettings } from './types';

const DEFAULT_AVATAR_SETTINGS: AvatarSettings = {
  mode: 'preset',
  presetName: 'Ben',
  voiceName: 'Puck',
};

const STORAGE_KEY = 'gemini_avatar_customizer_settings';

const App: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const {
    audioDevices, selectedDeviceId, setSelectedDeviceId,
    audioOutputDevices, selectedAudioOutputId, setSelectedAudioOutputId,
    videoDevices, selectedVideoDeviceId, setSelectedVideoDeviceId,
    deviceError
  } = useMediaDevices();

  const [isMuted, setIsMuted] = useState(false);
  const [videoMode, setVideoMode] = useState<VideoMode>('none');
  const [isTranscriptionPanelOpen, setIsTranscriptionPanelOpen] = useState(true);
  const [isAvatarVisible, setIsAvatarVisible] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Load avatar settings from localStorage or fallback
  const [avatarSettings, setAvatarSettings] = useState<AvatarSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Ignore
    }
    return DEFAULT_AVATAR_SETTINGS;
  });

  // Save changes to localStorage
  const handleSaveAvatarSettings = (newSettings: AvatarSettings) => {
    setAvatarSettings(newSettings);
    try {
      // Avoid storing huge video blobs in localStorage, store configuration
      const toStore = {
        mode: newSettings.mode,
        presetName: newSettings.presetName,
        voiceName: newSettings.voiceName,
        customImageMime: newSettings.customImageMime,
        customImagePreviewUrl: newSettings.customImagePreviewUrl,
        customImageFileName: newSettings.customImageFileName,
        customVideoFileName: newSettings.customVideoFileName,
        customImageData: newSettings.customImageData
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      console.warn('Could not store full avatar settings in localStorage', e);
    }
  };

  const webcamVideoRef = useRef<HTMLVideoElement>(null);

  const {
    isConnected, isConnecting, isWaitingForVideo, hasVideo, error: sessionError,
    chatHistory, liveInput, liveOutput, debugStats, videoRef, agentTalking,
    connect, disconnect, switchMicrophone, sendTextMessage
  } = useLiveSession(selectedAudioOutputId, isMuted, videoMode !== 'none', webcamVideoRef, avatarSettings);

  const handleDeviceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
    await switchMicrophone(newDeviceId);
  };

  const handleAudioOutputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAudioOutputId(e.target.value);
  };

  const handleConnect = () => {
    connect(selectedDeviceId);
  };

  // Memoize the callback to prevent infinite loops in UserWebCamDisplay's useEffect
  const handleVideoStop = useCallback(() => {
    setVideoMode('none');
  }, []);

  const error = deviceError || sessionError;
  const isLoading = isConnecting || isWaitingForVideo;

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <TranscriptionPanel
        isOpen={isTranscriptionPanelOpen}
        onClose={() => setIsTranscriptionPanelOpen(false)}
        history={chatHistory}
        liveInput={liveInput}
        liveOutput={liveOutput}
        onSendMessage={sendTextMessage}
        isConnected={isConnected}
        isAvatarVisible={isAvatarVisible}
      />

      <div className="relative flex-1 flex flex-col items-center justify-center gap-3 pb-6 pt-12 transition-all duration-300">
        <TopBar
          isTranscriptionPanelOpen={isTranscriptionPanelOpen}
          setIsTranscriptionPanelOpen={setIsTranscriptionPanelOpen}
          showDebug={showDebug}
          setShowDebug={setShowDebug}
          theme={theme}
          setTheme={setTheme}
          isAvatarVisible={isAvatarVisible}
          setIsAvatarVisible={setIsAvatarVisible}
          avatarSettings={avatarSettings}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />

        <DebugPanel showDebug={showDebug} debugStats={debugStats} />

        <AvatarDisplay
          videoRef={videoRef}
          hasVideo={hasVideo}
          isConnected={isConnected}
          isLoading={isLoading}
          error={error}
          isAvatarVisible={isAvatarVisible}
          agentTalking={agentTalking}
          avatarSettings={avatarSettings}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />

        <ControlBar
          isConnected={isConnected}
          isConnecting={isConnecting}
          isLoading={isLoading}
          connect={handleConnect}
          disconnect={disconnect}
          isMuted={isMuted}
          toggleMute={() => setIsMuted(!isMuted)}
          audioDevices={audioDevices}
          selectedDeviceId={selectedDeviceId}
          handleDeviceChange={handleDeviceChange}
          audioOutputDevices={audioOutputDevices}
          selectedAudioOutputId={selectedAudioOutputId}
          handleAudioOutputChange={handleAudioOutputChange}
          videoMode={videoMode}
          setVideoMode={setVideoMode}
          videoDevices={videoDevices}
          selectedVideoDeviceId={selectedVideoDeviceId}
          setSelectedVideoDeviceId={setSelectedVideoDeviceId}
        />
      </div>

      <UserWebCamDisplay
        videoMode={videoMode}
        deviceId={selectedVideoDeviceId}
        videoRef={webcamVideoRef}
        onVideoStop={handleVideoStop}
      />

      {/* Avatar Customization Modal */}
      <AvatarCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentSettings={avatarSettings}
        onSaveSettings={handleSaveAvatarSettings}
        isConnected={isConnected}
      />
    </div>
  );
};

export default App;
