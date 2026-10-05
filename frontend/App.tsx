import React, { useState, useRef, useCallback } from 'react';
import { TranscriptionPanel } from './components/TranscriptionPanel';
import { UserWebCamDisplay } from './components/UserWebCamDisplay';
import { TopBar } from './components/TopBar';
import { DebugPanel } from './components/DebugPanel';
import { AvatarDisplay } from './components/AvatarDisplay';
import { ControlBar } from './components/ControlBar';
import { useTheme } from './hooks/useTheme';
import { useMediaDevices } from './hooks/useMediaDevices';
import { useLiveSession } from './hooks/useLiveSession';
import { VideoMode } from './types';

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

  const webcamVideoRef = useRef<HTMLVideoElement>(null);

  const {
    isConnected, isConnecting, isWaitingForVideo, hasVideo, error: sessionError,
    chatHistory, liveInput, liveOutput, debugStats, videoRef, agentTalking,
    connect, disconnect, switchMicrophone, sendTextMessage
  } = useLiveSession(selectedAudioOutputId, isMuted, videoMode !== 'none', webcamVideoRef);

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

      <div className="relative flex-1 flex flex-col items-center justify-center gap-4 pb-6 pt-12 transition-all duration-300">
        <TopBar
          isTranscriptionPanelOpen={isTranscriptionPanelOpen}
          setIsTranscriptionPanelOpen={setIsTranscriptionPanelOpen}
          showDebug={showDebug}
          setShowDebug={setShowDebug}
          theme={theme}
          setTheme={setTheme}
          isAvatarVisible={isAvatarVisible}
          setIsAvatarVisible={setIsAvatarVisible}
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
    </div>
  );
};

export default App;
