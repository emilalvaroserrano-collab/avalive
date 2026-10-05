export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isFinal: boolean;
}

export type VideoMode = 'none' | 'webcam' | 'screen';

export type AvatarMode = 'preset' | 'custom-image' | 'custom-video';

export interface AvatarPreset {
  id: string;
  name: string;
  gender: 'Female' | 'Male' | 'Neutral';
  title: string;
  recommendedVoice: string;
  imageUrl: string;
}

export interface AvatarSettings {
  mode: AvatarMode;
  presetName: string;
  // Custom Portrait Image
  customImageData?: string; // Pure Base64 string for API payload
  customImageMime?: string;
  customImagePreviewUrl?: string; // Data URL or object URL for display
  customImageFileName?: string;
  // Custom Vertical Video Clip
  customVideoUrl?: string; // Object URL or source for video playback
  customVideoMime?: string;
  customVideoFileName?: string;
  customVideoPosterData?: string; // Extracted frame Base64 for avatarConfig
  // Voice Persona
  voiceName: string;
  systemInstruction?: string;
}
