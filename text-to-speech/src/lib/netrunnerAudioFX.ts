// Cyberpunk 2077 Audio DSP Engine
// Dual Persona DSP:
// 1. Alt Cunningham: Cyberspace compromised connection data crackles, bitcrush, comms EQ, and cybernetic resonance
// 2. Judy Alvarez: Braindance studio neuro-acoustic saturation, analog tape/tube warmth, sensory layer filtering, and Lizzie's basement acoustics

export type CyberpunkPersona = 'alt' | 'judy';

export interface NetrunnerFXSettings {
  enabled: boolean;
  persona: CyberpunkPersona;
  // Alt Cunningham Settings (Cyberspace Netrunner)
  crackleIntensity: number; // 0 to 1 (compromised data packet crackle & static)
  bitcrushAmount: number; // 0 to 1 (digital decimation / quantum distortion)
  commsBandpass: boolean; // Telecommunication neural link bandpass
  cyberResonance: number; // 0 to 1 (synthetic cyberspace comb filter)
  // Judy Alvarez Settings (Braindance Technician)
  analogWarmth: number; // 0 to 1 (neuro-acoustic tape/tube saturation)
  bdAudioLayerFilter: boolean; // BD sensory vocal layer calibration
  thermalLayerPresence: number; // 0 to 1 (chest/throat resonance 280-360Hz)
  lizziesRoomAcoustic: number; // 0 to 1 (intimate basement studio reflection)
}

export const DEFAULT_NETRUNNER_FX: NetrunnerFXSettings = {
  enabled: true,
  persona: 'alt',
  crackleIntensity: 0.65,
  bitcrushAmount: 0.35,
  commsBandpass: true,
  cyberResonance: 0.4,
  analogWarmth: 0.75,
  bdAudioLayerFilter: true,
  thermalLayerPresence: 0.65,
  lizziesRoomAcoustic: 0.5,
};

// Helper to convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert AudioBuffer to 16-bit PCM WAV base64
export function audioBufferToWavBase64(buffer: AudioBuffer): string {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = length * blockAlign;

  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  // Write RIFF header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave and write 16-bit PCM samples
  let offset = 44;
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  for (let i = 0; i < length; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][i];
      // Soft clamp
      sample = Math.max(-1, Math.min(1, sample));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return btoa(binary);
}

// Process an audio WAV base64 with Cyberpunk DSP effects (Alt or Judy)
export async function applyCyberpunkNetrunnerDSP(
  inputWavBase64: string,
  settings: NetrunnerFXSettings = DEFAULT_NETRUNNER_FX
): Promise<string> {
  if (!settings.enabled) {
    return inputWavBase64;
  }

  try {
    const arrayBuffer = base64ToArrayBuffer(inputWavBase64);
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const decodeCtx = new AudioContextClass();
    const decodedBuffer = await decodeCtx.decodeAudioData(arrayBuffer);
    await decodeCtx.close();

    const sampleRate = decodedBuffer.sampleRate;
    const length = decodedBuffer.length;
    const offlineCtx = new OfflineAudioContext(decodedBuffer.numberOfChannels, length, sampleRate);

    // Source buffer
    const sourceNode = offlineCtx.createBufferSource();
    sourceNode.buffer = decodedBuffer;

    if (settings.persona === 'judy') {
      // ==========================================
      // JUDY ALVAREZ: BRAINDANCE STUDIO DSP
      // ==========================================

      // 1. Highpass to clean sub-sonic rumble (95Hz)
      const highpass = offlineCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(95, 0);
      highpass.Q.setValueAtTime(0.7, 0);

      // 2. Thermal layer presence (280Hz - 340Hz low-mid warm vocal body)
      const thermalPeak = offlineCtx.createBiquadFilter();
      thermalPeak.type = 'peaking';
      thermalPeak.frequency.setValueAtTime(320, 0);
      thermalPeak.gain.setValueAtTime(settings.thermalLayerPresence * 5.0, 0); // up to +5 dB
      thermalPeak.Q.setValueAtTime(1.1, 0);

      // 3. Braindance audio layer vocal articulation (2800Hz presence peak)
      const vocalAir = offlineCtx.createBiquadFilter();
      vocalAir.type = 'peaking';
      vocalAir.frequency.setValueAtTime(2900, 0);
      vocalAir.gain.setValueAtTime(settings.bdAudioLayerFilter ? 3.8 : 0, 0);
      vocalAir.Q.setValueAtTime(1.3, 0);

      // 4. Smooth tape high-frequency roll-off (14,000Hz gentle cut)
      const lowpass = offlineCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(14000, 0);
      lowpass.Q.setValueAtTime(0.7, 0);

      // 5. Lizzie's Bar basement room reflection (intimate 20ms early reflection)
      const dryGain = offlineCtx.createGain();
      dryGain.gain.setValueAtTime(1.0, 0);

      const delay = offlineCtx.createDelay();
      delay.delayTime.setValueAtTime(0.022, 0); // 22ms early reflection

      const feedback = offlineCtx.createGain();
      feedback.gain.setValueAtTime(Math.min(0.35, settings.lizziesRoomAcoustic * 0.3), 0);

      const wetGain = offlineCtx.createGain();
      wetGain.gain.setValueAtTime(settings.lizziesRoomAcoustic * 0.28, 0);

      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wetGain);

      // Wire Judy's filter chain
      sourceNode.connect(highpass);
      highpass.connect(thermalPeak);
      thermalPeak.connect(vocalAir);
      vocalAir.connect(lowpass);

      lowpass.connect(dryGain);
      lowpass.connect(delay);

      const masterGain = offlineCtx.createGain();
      dryGain.connect(masterGain);
      wetGain.connect(masterGain);
      masterGain.connect(offlineCtx.destination);

      sourceNode.start(0);
      const rendered = await offlineCtx.startRendering();

      // Sample-level analog saturation pass (tape/tube harmonic warming)
      const channelData = rendered.getChannelData(0);
      const drive = 1 + settings.analogWarmth * 1.4;

      for (let i = 0; i < channelData.length; i++) {
        let s = channelData[i];

        // Soft hyperbolic tangent saturation curve
        s = Math.tanh(s * drive) / Math.tanh(drive);

        // Subtle analog tape noise warmth when speaking
        const isSpeaking = Math.abs(s) > 0.02;
        if (isSpeaking && settings.analogWarmth > 0.3) {
          const tapeNoise = (Math.random() * 2 - 1) * 0.004 * settings.analogWarmth;
          s += tapeNoise;
        }

        s = Math.max(-0.98, Math.min(0.98, s));
        channelData[i] = s;

        if (rendered.numberOfChannels > 1) {
          rendered.getChannelData(1)[i] = s;
        }
      }

      return audioBufferToWavBase64(rendered);
    } else {
      // ==========================================
      // ALT CUNNINGHAM: CYBERSPACE NETRUNNER DSP
      // ==========================================

      // Comms bandpass filter (simulates compromised telecommunications neural link)
      const highpass = offlineCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(settings.commsBandpass ? 280 : 40, 0);
      highpass.Q.setValueAtTime(0.7, 0);

      const lowpass = offlineCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(settings.commsBandpass ? 3800 : 18000, 0);
      lowpass.Q.setValueAtTime(1.2, 0);

      // Mid presence peak around 2400Hz
      const midPeak = offlineCtx.createBiquadFilter();
      midPeak.type = 'peaking';
      midPeak.frequency.setValueAtTime(2400, 0);
      midPeak.gain.setValueAtTime(settings.commsBandpass ? 4.5 : 0, 0);
      midPeak.Q.setValueAtTime(1.5, 0);

      // Cybernetic resonance comb filter / delay
      const dryGain = offlineCtx.createGain();
      dryGain.gain.setValueAtTime(1.0, 0);

      const delay = offlineCtx.createDelay();
      delay.delayTime.setValueAtTime(0.012, 0); // 12ms comb resonance

      const feedbackGain = offlineCtx.createGain();
      feedbackGain.gain.setValueAtTime(Math.min(0.6, settings.cyberResonance * 0.5), 0);

      const wetGain = offlineCtx.createGain();
      wetGain.gain.setValueAtTime(settings.cyberResonance * 0.45, 0);

      delay.connect(feedbackGain);
      feedbackGain.connect(delay);
      delay.connect(wetGain);

      sourceNode.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(midPeak);

      midPeak.connect(dryGain);
      midPeak.connect(delay);

      const merger = offlineCtx.createGain();
      dryGain.connect(merger);
      wetGain.connect(merger);
      merger.connect(offlineCtx.destination);

      sourceNode.start(0);
      const rendered = await offlineCtx.startRendering();

      // Sample-level DSP pass: Bitcrush + Data Streaming Crackle & Packet Loss Spikes
      const channelData = rendered.getChannelData(0);
      const crackleProb = settings.crackleIntensity * 0.007;
      const bitDepth = Math.max(8, 16 - Math.round(settings.bitcrushAmount * 6));
      const step = 2 / Math.pow(2, bitDepth);
      const downsampleStep = settings.bitcrushAmount > 0.5 ? 2 : 1;

      let holdSample = 0;
      for (let i = 0; i < channelData.length; i++) {
        if (i % downsampleStep === 0) {
          let s = channelData[i];

          // Bitcrush quantization
          if (settings.bitcrushAmount > 0.1) {
            s = Math.round(s / step) * step;
          }

          // Voice-reactive data stream crackle & static clicks
          const isSpeaking = Math.abs(s) > 0.02;
          if (isSpeaking && Math.random() < crackleProb) {
            const clickSign = Math.random() > 0.5 ? 1 : -1;
            const clickMag = 0.25 + Math.random() * 0.45 * settings.crackleIntensity;
            s += clickSign * clickMag;
          }

          // Subtle digital static hiss during vocal activity
          if (isSpeaking && settings.crackleIntensity > 0.2) {
            const hiss = (Math.random() * 2 - 1) * (0.015 * settings.crackleIntensity);
            s += hiss;
          }

          holdSample = Math.max(-0.98, Math.min(0.98, s));
        }

        channelData[i] = holdSample;

        if (rendered.numberOfChannels > 1) {
          rendered.getChannelData(1)[i] = holdSample;
        }
      }

      return audioBufferToWavBase64(rendered);
    }
  } catch (err) {
    console.warn('Failed to apply Cyberpunk DSP, returning original audio:', err);
    return inputWavBase64;
  }
}
