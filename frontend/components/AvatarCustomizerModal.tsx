import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  Check, 
  X, 
  Volume2, 
  RefreshCw, 
  AlertCircle,
  Play,
  Pause,
  UserCheck
} from 'lucide-react';
import { AvatarSettings, AvatarPreset } from '../types';
import { processPortraitImage, processVerticalVideo } from '../services/mediaCustomizerUtils';

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'ben', name: 'Ben', gender: 'Male', title: 'Consultant', recommendedVoice: 'Puck', imageUrl: 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars/ben.png' },
  { id: 'carmen', name: 'Carmen', gender: 'Female', title: 'Product Specialist', recommendedVoice: 'Kore', imageUrl: 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars/carmen_2.png' },
  { id: 'ingrid', name: 'Ingrid', gender: 'Female', title: 'Executive Coach', recommendedVoice: 'Zephyr', imageUrl: 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars/ingrid.png' },
  { id: 'jay', name: 'Jay', gender: 'Male', title: 'Creative Strategist', recommendedVoice: 'Fenrir', imageUrl: 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars/jay.png' },
  { id: 'kai', name: 'Kai', gender: 'Male', title: 'Tech Architect', recommendedVoice: 'Charon', imageUrl: 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars/kai.png' },
  { id: 'kira', name: 'Kira', gender: 'Female', title: 'Brand Ambassador', recommendedVoice: 'Aoede', imageUrl: 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars/kira.png' },
  { id: 'leo', name: 'Leo', gender: 'Male', title: 'Customer Success', recommendedVoice: 'Puck', imageUrl: 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars/leo.png' },
  { id: 'paul', name: 'Paul', gender: 'Male', title: 'Financial Advisor', recommendedVoice: 'Fenrir', imageUrl: 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars/paul.png' },
  { id: 'piper', name: 'Piper', gender: 'Female', title: 'Interactive Host', recommendedVoice: 'Zephyr', imageUrl: 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars/piper.png' },
  { id: 'sam', name: 'Sam', gender: 'Neutral', title: 'Support Lead', recommendedVoice: 'Kore', imageUrl: 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars/sam.png' },
  { id: 'vera', name: 'Vera', gender: 'Female', title: 'Operations Director', recommendedVoice: 'Charon', imageUrl: 'https://www.gstatic.com/pantheon/images/aiplatform/vertex_ai_studio/avatars/vera.png' },
];

export const AVAILABLE_VOICES = [
  { name: 'Puck', tone: 'Natural, lively & warm', gender: 'Male' },
  { name: 'Charon', tone: 'Dignified, calm & grounded', gender: 'Male' },
  { name: 'Kore', tone: 'Clear, modern & empathetic', gender: 'Female' },
  { name: 'Fenrir', tone: 'Deep, resonant & authoritative', gender: 'Male' },
  { name: 'Aoede', tone: 'Melodic, expressive & friendly', gender: 'Female' },
  { name: 'Zephyr', tone: 'Smooth, bright & professional', gender: 'Neutral' },
];

// Sample portrait images for 1-click test customization
export const SAMPLE_PORTRAITS = [
  {
    name: 'Studio Portrait (Elegance)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&q=80',
    title: 'Model A'
  },
  {
    name: 'Executive Tech Lead',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&q=80',
    title: 'Model B'
  },
  {
    name: 'Modern Creative',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=720&q=80',
    title: 'Model C'
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: AvatarSettings;
  onSaveSettings: (settings: AvatarSettings) => void;
  isConnected: boolean;
}

export const AvatarCustomizerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentSettings,
  onSaveSettings,
  isConnected,
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'presets' | 'voice'>('image');
  const [tempSettings, setTempSettings] = useState<AvatarSettings>(currentSettings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  const handleImageFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const result = await processPortraitImage(file);
      setTempSettings(prev => ({
        ...prev,
        mode: 'custom-image',
        customImageData: result.base64,
        customImageMime: result.mimeType,
        customImagePreviewUrl: result.dataUrl,
        customImageFileName: result.fileName
      }));
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing portrait image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVideoFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const result = await processVerticalVideo(file);
      setTempSettings(prev => ({
        ...prev,
        mode: 'custom-video',
        customVideoUrl: result.videoUrl,
        customVideoMime: result.mimeType,
        customVideoFileName: result.fileName,
        customVideoPosterData: result.posterBase64,
        customImageData: result.posterBase64,
        customImageMime: 'image/jpeg',
        customImagePreviewUrl: result.posterDataUrl
      }));
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing vertical video clip.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSampleImageSelect = async (sampleUrl: string, sampleName: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const file = new File([blob], `${sampleName.toLowerCase().replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
      await handleImageFile(file);
    } catch (err) {
      setErrorMessage('Could not load sample image. Please try uploading a local image.');
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    onSaveSettings(tempSettings);
    onClose();
  };

  const currentPreviewSource = () => {
    if (tempSettings.mode === 'custom-image' && tempSettings.customImagePreviewUrl) {
      return tempSettings.customImagePreviewUrl;
    }
    if (tempSettings.mode === 'custom-video' && tempSettings.customImagePreviewUrl) {
      return tempSettings.customImagePreviewUrl;
    }
    const preset = AVATAR_PRESETS.find(p => p.name.toLowerCase() === tempSettings.presetName.toLowerCase()) || AVATAR_PRESETS[0];
    return preset.imageUrl;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
          title="Close Customizer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Live Preview Stage */}
        <div className="w-full md:w-80 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-900 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 shrink-0">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Live Preview
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {tempSettings.mode === 'custom-image' ? 'Custom Photo' : tempSettings.mode === 'custom-video' ? 'Vertical Clip' : `Preset: ${tempSettings.presetName}`}
            </span>
          </div>

          {/* 9:16 Vertical Portrait Frame */}
          <div className="relative w-full aspect-[9/16] max-w-[220px] rounded-2xl overflow-hidden shadow-xl bg-black border-2 border-white/20 dark:border-white/10 group">
            {tempSettings.mode === 'custom-video' && tempSettings.customVideoUrl ? (
              <>
                <video
                  ref={previewVideoRef}
                  src={tempSettings.customVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (previewVideoRef.current) {
                      if (previewVideoRef.current.paused) {
                        previewVideoRef.current.play();
                        setIsVideoPlaying(true);
                      } else {
                        previewVideoRef.current.pause();
                        setIsVideoPlaying(false);
                      }
                    }
                  }}
                  className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </>
            ) : (
              <img
                src={currentPreviewSource()}
                alt="Avatar Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {/* Subdued overlay frame lines */}
            <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
              <span className="truncate">{tempSettings.mode === 'preset' ? tempSettings.presetName : 'Custom Avatar'}</span>
              <span className="flex items-center gap-1 font-mono text-[10px] text-blue-300">
                <Volume2 className="w-3 h-3" />
                {tempSettings.voiceName}
              </span>
            </div>
          </div>

          {/* Mode switch quick actions */}
          <div className="w-full mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Avatar dynamically updates Gemini Live video stream & standby view.
            </p>
          </div>
        </div>

        {/* Right Side: Tab Navigation & Controls */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header & Tabs */}
          <div className="p-6 pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Customize AI Avatar</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upload your own portrait photo, vertical video clip, or select a studio preset.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('image')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'image'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Upload Portrait Image
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'video'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Video className="w-4 h-4" />
                Upload Vertical Video
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'presets'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Studio Presets
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('voice')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'voice'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                Voice Persona
              </button>
            </div>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: UPLOAD PORTRAIT IMAGE */}
            {activeTab === 'image' && (
              <div className="space-y-4">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                />

                {/* Dropzone */}
                <div
                  onClick={() => imageInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50/50 dark:bg-gray-800/40 group"
                >
                  <div className="p-3.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Click to select or drag a portrait photo here
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                    Recommended: Vertical 9:16 or 3:4 orientation, clear lighting, face centered. Supports JPG, PNG, WebP up to 15MB.
                  </p>
                  {isProcessing && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Optimizing image for Gemini Live...
                    </div>
                  )}
                </div>

                {/* Current Image Details */}
                {tempSettings.mode === 'custom-image' && tempSettings.customImageFileName && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs">
                    <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 truncate">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="font-medium truncate">Selected: {tempSettings.customImageFileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-[11px] shrink-0 ml-2"
                    >
                      Change Photo
                    </button>
                  </div>
                )}

                {/* Sample Portrait Suggestions */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Or select a sample portrait model to try:
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {SAMPLE_PORTRAITS.map((sample) => (
                      <button
                        key={sample.name}
                        type="button"
                        onClick={() => handleSampleImageSelect(sample.url, sample.name)}
                        disabled={isProcessing}
                        className="group relative rounded-xl overflow-hidden aspect-[3/4] border-2 border-transparent hover:border-blue-500 transition-all text-left shadow-sm"
                      >
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                          <span className="text-[11px] font-bold text-white leading-tight">{sample.title}</span>
                          <span className="text-[9px] text-white/70 truncate">{sample.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: UPLOAD VERTICAL VIDEO */}
            {activeTab === 'video' && (
              <div className="space-y-4">
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleVideoFile(file);
                  }}
                />

                <div
                  onClick={() => videoInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleVideoFile(file);
                  }}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50/50 dark:bg-gray-800/40 group"
                >
                  <div className="p-3.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform mb-3">
                    <Video className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Click to select or drag a vertical video clip (9:16)
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                    Upload an MP4 or WebM vertical clip. We will use the clip for seamless standby playback and auto-extract high-quality reference frames for Gemini avatar synthesis.
                  </p>
                  {isProcessing && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Extracting video keyframe & preparing preview...
                    </div>
                  )}
                </div>

                {tempSettings.mode === 'custom-video' && tempSettings.customVideoFileName && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 text-xs">
                    <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 truncate">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="font-medium truncate">Selected Clip: {tempSettings.customVideoFileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold text-[11px] shrink-0 ml-2"
                    >
                      Choose Another Video
                    </button>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 text-xs text-gray-600 dark:text-gray-300">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    How vertical video clips work with Gemini Live
                  </div>
                  <p className="leading-relaxed">
                    When you upload a vertical video clip, the application loops your video during standby mode, and provides an optimized reference frame to Gemini Live’s video rendering model so the real-time AI conversation matches your avatar aesthetics.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: STUDIO PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Select a built-in Vertex AI Studio avatar persona:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = tempSettings.mode === 'preset' && tempSettings.presetName.toLowerCase() === preset.name.toLowerCase();
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setTempSettings(prev => ({
                            ...prev,
                            mode: 'preset',
                            presetName: preset.name,
                            voiceName: preset.recommendedVoice
                          }));
                        }}
                        className={`group relative p-2.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-500 ring-2 ring-blue-500/30'
                            : 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-gray-200 dark:bg-gray-900">
                          <img
                            src={preset.imageUrl}
                            alt={preset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                              {preset.name}
                              {isSelected && <Check className="w-3 h-3 text-blue-500" />}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">{preset.title}</div>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {preset.recommendedVoice}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: VOICE PERSONA */}
            {activeTab === 'voice' && (
              <div className="space-y-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Select a voice for Gemini Live that pairs best with your avatar appearance:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_VOICES.map((voice) => {
                    const isSelected = tempSettings.voiceName.toLowerCase() === voice.name.toLowerCase();
                    return (
                      <button
                        key={voice.name}
                        type="button"
                        onClick={() => {
                          setTempSettings(prev => ({
                            ...prev,
                            voiceName: voice.name
                          }));
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 ring-2 ring-blue-500/20'
                            : 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}>
                            <Volume2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                              {voice.name}
                              <span className="text-[10px] font-normal text-gray-500 dark:text-gray-400">({voice.gender})</span>
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400">{voice.tone}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 px-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {isConnected ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Note: Customization will apply on your next connection.
                </span>
              ) : (
                <span>Changes will be applied immediately.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all transform active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Avatar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
