export type SpeechEngine = 'gemini' | 'browser';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Female' | 'Male' | 'Neutral';
  description: string;
  personality: string;
  avatarColor: string;
  samplePhrase: string;
}

export interface VoiceStyleOption {
  id: string;
  name: string;
  iconName: string;
  description: string;
  tagline: string;
  badgeColor: string;
}

export interface SavedAudioClip {
  id: string;
  title: string;
  text: string;
  voice: string;
  style: string;
  engine: SpeechEngine;
  speed: number;
  duration: number; // in seconds
  createdAt: number; // timestamp
  audioBase64: string; // WAV base64
  mimeType: string;
  fileSizeBytes: number;
  tags?: string[];
}

export interface GenerationParams {
  text: string;
  voice: string;
  style: string;
  speed: number;
  pitch: number;
  engine: SpeechEngine;
}
