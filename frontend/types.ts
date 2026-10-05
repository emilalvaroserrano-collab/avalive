
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isFinal: boolean;
}

export type VideoMode = 'none' | 'webcam' | 'screen';
