import React from 'react';
import { Sliders, Sparkles, MessageSquare, Eye, EyeOff, Activity } from 'lucide-react';
import { Theme } from '../hooks/useTheme';
import { AvatarSettings } from '../types';

interface Props {
  isTranscriptionPanelOpen: boolean;
  setIsTranscriptionPanelOpen: (open: boolean) => void;
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isAvatarVisible: boolean;
  setIsAvatarVisible: (visible: boolean) => void;
  avatarSettings: AvatarSettings;
  onOpenCustomizer: () => void;
}

export const TopBar: React.FC<Props> = ({
  isTranscriptionPanelOpen,
  setIsTranscriptionPanelOpen,
  showDebug,
  setShowDebug,
  theme,
  setTheme,
  isAvatarVisible,
  setIsAvatarVisible,
  avatarSettings,
  onOpenCustomizer
}) => {
  return (
    <>
      {/* Top Left Controls */}
      <div className="absolute top-5 left-5 z-50 flex items-center gap-2">
        {/* Toggle Transcript Panel */}
        <button
          onClick={() => setIsTranscriptionPanelOpen(!isTranscriptionPanelOpen)}
          className={`p-2.5 backdrop-blur-md rounded-2xl border shadow-sm transition-all duration-200 ${
            isTranscriptionPanelOpen
              ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
              : 'bg-white/90 dark:bg-gray-900/80 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Toggle Transcript Panel"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Toggle Avatar Visibility */}
        <button
          onClick={() => setIsAvatarVisible(!isAvatarVisible)}
          className={`p-2.5 backdrop-blur-md rounded-2xl border shadow-sm transition-all duration-200 ${
            isAvatarVisible
              ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
              : 'bg-white/90 dark:bg-gray-900/80 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title={isAvatarVisible ? 'Hide Avatar Video' : 'Show Avatar Video'}
        >
          {isAvatarVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Customize Avatar Button */}
        <button
          onClick={onOpenCustomizer}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/90 dark:bg-gray-900/80 hover:bg-gray-100 dark:hover:bg-gray-800 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm text-gray-800 dark:text-gray-200 transition-all group"
          title="Customize Avatar Image or Video"
        >
          <Sliders className="w-4 h-4 text-blue-500 group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline">Customize Avatar</span>
          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
            <Sparkles className="w-2.5 h-2.5" />
            {avatarSettings.mode === 'custom-image' ? 'Photo' : avatarSettings.mode === 'custom-video' ? 'Clip' : avatarSettings.presetName}
          </span>
        </button>

        {/* Debug Panel Toggle */}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className={`p-2.5 backdrop-blur-md rounded-2xl border shadow-sm transition-all duration-200 ${
            showDebug
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
              : 'bg-white/90 dark:bg-gray-900/80 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Toggle Stream Diagnostics"
        >
          <Activity className="w-4 h-4" />
        </button>
      </div>

      {/* Top Right Controls (Theme Toggle) */}
      <div className="absolute top-5 right-5 z-50">
        <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm transition-colors">
          {theme === 'dark' ? (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : theme === 'light' ? (
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="bg-transparent text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer appearance-none pr-4"
          >
            <option value="system" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">System</option>
            <option value="light" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Light</option>
            <option value="dark" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Dark</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};
