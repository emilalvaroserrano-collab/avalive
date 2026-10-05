import React from 'react';
import { VideoMode } from '../types';

interface Props {
  isConnected: boolean;
  isConnecting: boolean;
  isLoading: boolean;
  connect: () => void;
  disconnect: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  audioDevices: MediaDeviceInfo[];
  selectedDeviceId: string;
  handleDeviceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  audioOutputDevices: MediaDeviceInfo[];
  selectedAudioOutputId: string;
  handleAudioOutputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  videoMode: VideoMode;
  setVideoMode: (mode: VideoMode) => void;
  videoDevices: MediaDeviceInfo[];
  selectedVideoDeviceId: string;
  setSelectedVideoDeviceId: (id: string) => void;
}

export const ControlBar: React.FC<Props> = ({
  isConnected, isConnecting, isLoading, connect, disconnect,
  isMuted, toggleMute,
  audioDevices, selectedDeviceId, handleDeviceChange,
  audioOutputDevices, selectedAudioOutputId, handleAudioOutputChange,
  videoMode, setVideoMode,
  videoDevices, selectedVideoDeviceId, setSelectedVideoDeviceId
}) => {
  return (
    <div className="flex flex-col items-center gap-3 z-50 w-full max-w-2xl px-4 mt-2">
      {/* Action Button */}
      <button
        onClick={isConnected ? disconnect : connect}
        disabled={isConnecting}
        className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md
          ${isConnected
            ? 'bg-red-500 hover:bg-red-600 text-white border border-red-400/50'
            : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-400/50'
          }`}>
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {isConnected ? 'End Conversation' : 'Connecting...'}
          </>
        ) : isConnected ? (
          'End Conversation'
        ) : (
          'Start Conversation'
        )}
      </button>

      {/* Device Controls Row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Mic Controls */}
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            onClick={toggleMute}
            className={`p-2 rounded-l-full transition-colors ${isMuted ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 18 18" aria-hidden="true" fill="currentColor">
                <path fillRule="evenodd" d="m11.023 8.613.007-4.417C11.03 2.974 10.12 2 8.98 2s-1.983.974-1.983 2.196v4.417c0 1.222.843 2.124 1.984 2.124 1.14 0 2.042-.902 2.042-2.124m-2.014 3.441c-1.896.095-3.641-1.725-3.641-3.934H4.2c0 2.51 1.868 4.883 4.153 5.244V16h1.311v-2.636c2.285-.354 4.153-2.726 4.153-5.244h-1.168c0 2.209-1.745 4.029-3.64 3.934"></path>
                <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 18 18" aria-hidden="true" fill="currentColor">
                <path fillRule="evenodd" d="m11.023 8.613.007-4.417C11.03 2.974 10.12 2 8.98 2s-1.983.974-1.983 2.196v4.417c0 1.222.843 2.124 1.984 2.124 1.14 0 2.042-.902 2.042-2.124m-2.014 3.441c-1.896.095-3.641-1.725-3.641-3.934H4.2c0 2.51 1.868 4.883 4.153 5.244V16h1.311v-2.636c2.285-.354 4.153-2.726 4.153-5.244h-1.168c0 2.209-1.745 4.029-3.64 3.934"></path>
              </svg>
            )}
          </button>
          <div className="w-px h-3 bg-gray-200 dark:bg-gray-700"></div>
          <div className="relative p-2 rounded-r-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center">
            <select
              value={selectedDeviceId}
              onChange={handleDeviceChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Select Microphone"
            >
              {audioDevices.length === 0 && <option value="">Default Microphone</option>}
              {audioDevices.map(device => (
                <option key={device.deviceId} value={device.deviceId} className="bg-white dark:bg-gray-905 text-gray-900 dark:text-white">
                  {device.label || `Microphone ${device.deviceId.slice(0, 5)}...`}
                </option>
              ))}
            </select>
            <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Speaker Controls */}
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-2 rounded-l-full text-gray-600 dark:text-gray-300">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
            </svg>
          </div>
          <div className="w-px h-3 bg-gray-200 dark:bg-gray-700"></div>
          <div className="relative p-2 rounded-r-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center">
            <select
              value={selectedAudioOutputId}
              onChange={handleAudioOutputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Select Speaker"
            >
              {audioOutputDevices.length === 0 && <option value="">Default Speaker</option>}
              {audioOutputDevices.map(device => (
                <option key={device.deviceId} value={device.deviceId} className="bg-white dark:bg-gray-905 text-gray-900 dark:text-white">
                  {device.label || `Speaker ${device.deviceId.slice(0, 5)}...`}
                </option>
              ))}
            </select>
            <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            onClick={() => setVideoMode(videoMode === 'webcam' ? 'none' : 'webcam')}
            className={`p-2 rounded-l-full transition-colors ${videoMode !== 'webcam' ? 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600' : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
            title={videoMode === 'webcam' ? "Disable Camera" : "Enable Camera"}
          >
            {videoMode === 'webcam' ? (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z"></path>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )}
          </button>
          <div className="w-px h-3 bg-gray-200 dark:bg-gray-700"></div>
          <div className="relative p-2 rounded-r-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center">
            <select
              value={selectedVideoDeviceId}
              onChange={(e) => setSelectedVideoDeviceId(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Select Camera"
            >
              {videoDevices.length === 0 && <option value="">Default Camera</option>}
              {videoDevices.map(device => (
                <option key={device.deviceId} value={device.deviceId} className="bg-white dark:bg-gray-905 text-gray-900 dark:text-white">
                  {device.label || `Camera ${device.deviceId.slice(0, 5)}...`}
                </option>
              ))}
            </select>
            <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Screen Share Controls */}
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            onClick={() => setVideoMode(videoMode === 'screen' ? 'none' : 'screen')}
            className={`p-2 rounded-full transition-colors ${videoMode !== 'screen' ? 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600' : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
            title={videoMode === 'screen' ? "Stop Screen Share" : "Share Screen"}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M8 21h8"></path>
              <path d="M12 17v4"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
