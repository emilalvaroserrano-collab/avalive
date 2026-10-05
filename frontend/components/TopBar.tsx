import React from 'react';
import { Theme } from '../hooks/useTheme';

interface Props {
  isTranscriptionPanelOpen: boolean;
  setIsTranscriptionPanelOpen: (open: boolean) => void;
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isAvatarVisible: boolean;
  setIsAvatarVisible: (visible: boolean) => void;
}

export const TopBar: React.FC<Props> = ({
  isTranscriptionPanelOpen,
  setIsTranscriptionPanelOpen,
  showDebug,
  setShowDebug,
  theme,
  setTheme,
  isAvatarVisible,
  setIsAvatarVisible
}) => {
  return (
    <>
      {/* Top Left Controls (Transcription Toggle, Avatar Toggle & Debug) */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsTranscriptionPanelOpen(!isTranscriptionPanelOpen)}
          className={`p-2 backdrop-blur-md rounded-full border shadow-sm transition-colors ${isTranscriptionPanelOpen
              ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
              : 'bg-white/90 dark:bg-black/60 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          title="Toggle Transcription Panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>

        <button
          onClick={() => setIsAvatarVisible(!isAvatarVisible)}
          className={`p-2 backdrop-blur-md rounded-full border shadow-sm transition-colors ${isAvatarVisible
              ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
              : 'bg-white/90 dark:bg-black/60 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10'
            }`}
          title={isAvatarVisible ? "Hide Avatar" : "Show Avatar"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>

        <button
          onClick={() => setShowDebug(!showDebug)}
          className="p-2 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full border border-gray-200 dark:border-white/10 shadow-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          title="Toggle Debug Panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex items-center gap-2 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 shadow-sm transition-colors">
          {theme === 'dark' ? (
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : theme === 'light' ? (
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          )}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 outline-none cursor-pointer appearance-none pr-4"
          >
            <option value="system" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">System</option>
            <option value="light" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Light</option>
            <option value="dark" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Dark</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
    </>
  );
};
