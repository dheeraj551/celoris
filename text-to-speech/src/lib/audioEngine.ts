// Audio engine supporting Gemini Neural TTS and Browser Web Speech API

export interface TTSResponse {
  success: boolean;
  audioBase64: string;
  mimeType: string;
  duration: number;
  voice: string;
  style: string;
}

export async function synthesizeWithGemini(
  text: string,
  voice: string,
  style: string,
  speed: number = 1.0,
  pitch: number = 0.0,
  adminKey?: string
): Promise<TTSResponse> {
  const keyToUse = adminKey || (typeof window !== 'undefined' ? localStorage.getItem('celoris_admin_key') || '' : '');
  const userApiKey = typeof window !== 'undefined' ? localStorage.getItem('celoris_tts_api_key') || '' : '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (keyToUse) {
    headers['x-admin-key'] = keyToUse;
  }
  if (userApiKey) {
    headers['x-api-key'] = userApiKey;
  }

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, voice, style, speed, pitch }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `Server responded with status ${response.status}`;
    const error: any = new Error(errorMessage);
    error.status = response.status;
    error.requiresAdminAuth = response.status === 401 || Boolean(errorData.requiresAdminAuth);
    error.isQuotaExhausted = errorData.isQuotaExhausted || response.status === 429 || errorMessage.includes('quota') || errorMessage.includes('429');
    throw error;
  }

  const data = await response.json();
  return data;
}

// Convert base64 WAV string to an Object URL for playback
export function createAudioUrlFromBase64(base64: string, mimeType = 'audio/wav'): string {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}

// Check if browser speech synthesis is supported
export function isBrowserSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Retrieve available system voices
export function getBrowserVoices(): SpeechSynthesisVoice[] {
  if (!isBrowserSpeechAvailable()) return [];
  return window.speechSynthesis.getVoices();
}

// Generate offline fallback WAV for browser synthesis or offline mode
export async function generateFallbackAudioWav(
  text: string,
  durationSec: number = 3.0
): Promise<string> {
  // Uses Web Audio OfflineAudioContext to render a melodic audible voice-synthesized preview WAV
  const sampleRate = 24000;
  const totalSamples = Math.max(sampleRate, Math.floor(sampleRate * Math.min(durationSec, 5)));
  const offlineCtx = new OfflineAudioContext(1, totalSamples, sampleRate);

  const osc = offlineCtx.createOscillator();
  const gain = offlineCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180, 0);
  
  // Modulate frequency based on text length to simulate speech intonation
  const words = text.split(/\s+/).length;
  for (let i = 0; i < Math.min(words, 15); i++) {
    const time = (i / words) * (totalSamples / sampleRate);
    const freq = 160 + (i % 3) * 40 + (i % 2) * 20;
    osc.frequency.setValueAtTime(freq, time);
  }

  gain.gain.setValueAtTime(0.01, 0);
  gain.gain.linearRampToValueAtTime(0.3, 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, totalSamples / sampleRate - 0.05);

  osc.connect(gain);
  gain.connect(offlineCtx.destination);

  osc.start(0);
  osc.stop(totalSamples / sampleRate);

  const renderedBuffer = await offlineCtx.startRendering();
  const channelData = renderedBuffer.getChannelData(0);

  // Convert float32 to int16 PCM
  const pcm16 = new Int16Array(channelData.length);
  for (let i = 0; i < channelData.length; i++) {
    const s = Math.max(-1, Math.min(1, channelData[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  // Create WAV header
  const dataSize = pcm16.byteLength;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // 16-bit
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Copy PCM data
  new Uint8Array(buffer, 44).set(new Uint8Array(pcm16.buffer));

  // Convert to base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
