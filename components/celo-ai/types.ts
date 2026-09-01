export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: {
    name: string;
    type: string;
    size?: string;
    url?: string;
  }[];
  capabilityTag?: string;
  isStreaming?: boolean;
}

export interface CapabilityItem {
  id: string;
  label: string;
  iconName: 'android' | 'drive' | 'sheets' | 'gmail' | 'calendar' | 'docs' | 'cloud' | 'mic';
  category: string;
  promptTemplate: string;
  color: string;
}

export interface GenerationState {
  isGenerating: boolean;
  activeStep?: string;
  error?: string | null;
}
