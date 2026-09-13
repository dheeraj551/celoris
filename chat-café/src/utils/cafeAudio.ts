/**
 * Procedural Web Audio Ambient Café Synthesizer
 * Generates warm lofi chords, gentle rain against the cafe window,
 * soft cafe room murmur, and ceramic cup clink sounds with zero external files.
 */

class CafeSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  private musicInterval: any = null;

  // Track user preferences
  public enabled = false;
  public rainVolume = 0.25;
  public musicVolume = 0.15;
  public sfxVolume = 0.4;

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create procedural rain noise (filtered pink noise)
  private startRain() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like rain on window glass
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 1.2;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = this.rainVolume;

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    whiteNoise.start(0);
    this.rainNode = whiteNoise;
  }

  // Play a soft relaxing lofi chord note
  private playLofiNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm Rhodes/piano electric tone
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

    // Soft attack & long dreamy decay
    noteGain.gain.setValueAtTime(0.001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.15);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Play peaceful gentle ambient cafe chords
  private startAmbientChords() {
    if (!this.ctx || !this.masterGain) return;

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.musicVolume;
    this.musicGain.connect(this.masterGain);

    // Warm jazz cafe chords (Fmaj9, Em7, Dm9, Cmaj7)
    const chords = [
      [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj9
      [164.81, 196.00, 246.94, 293.66, 329.63], // Em7
      [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
      [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9
    ];

    let chordIdx = 0;

    const tickChord = () => {
      if (!this.isPlaying || !this.ctx) return;
      const currentChord = chords[chordIdx % chords.length];
      const now = this.ctx.currentTime;

      currentChord.forEach((f, i) => {
        // slight strum offset for cozy acoustic feel
        this.playLofiNote(f, now + i * 0.08, 4.5);
      });

      chordIdx++;
    };

    tickChord();
    this.musicInterval = setInterval(tickChord, 4800);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      this.enabled = false;
      return false;
    } else {
      this.start();
      this.enabled = true;
      return true;
    }
  }

  public start() {
    try {
      this.initContext();
      if (this.isPlaying) return;
      this.isPlaying = true;
      this.startRain();
      this.startAmbientChords();
    } catch (e) {
      console.warn('Audio context initialization prevented:', e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.rainNode) {
      try {
        (this.rainNode as any).stop();
      } catch (_) {}
      this.rainNode = null;
    }
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public setRainVolume(val: number) {
    this.rainVolume = val;
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  public setMusicVolume(val: number) {
    this.musicVolume = val;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  // SFX: Ceramic cup clinking when gifting drinks or cheering
  public playCupClink() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2450, now);
      osc1.frequency.exponentialRampToValueAtTime(2400, now + 0.35);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(3680, now);
      osc2.frequency.exponentialRampToValueAtTime(3600, now + 0.25);

      gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch (_) {}
  }

  // SFX: Bubble pop when message arrives
  public playBubblePop() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (_) {}
  }

  // SFX: Retro 2000s Instant Messenger Notification Ding (AIM/Yahoo style)
  public playRetroDing() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880.00, now + 0.08); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, now); // D6
      osc2.frequency.setValueAtTime(1760.00, now + 0.08); // A6

      gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch (_) {}
  }

  // SFX: CRT Monitor Power-On Degauss Coil & High-Voltage Rise
  public playCrtPowerOn() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;

      // 1. Low magnetic degauss thunk & decaying hum
      const oscLow = this.ctx.createOscillator();
      const gainLow = this.ctx.createGain();
      oscLow.type = 'sawtooth';
      oscLow.frequency.setValueAtTime(70, now);
      oscLow.frequency.exponentialRampToValueAtTime(25, now + 0.35);

      gainLow.gain.setValueAtTime(this.sfxVolume * 0.3, now);
      gainLow.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      oscLow.connect(gainLow);
      gainLow.connect(this.masterGain);

      oscLow.start(now);
      oscLow.stop(now + 0.35);

      // 2. High-voltage flyback transformer whine ascending to CRT frequency
      const oscHigh = this.ctx.createOscillator();
      const gainHigh = this.ctx.createGain();
      oscHigh.type = 'sine';
      oscHigh.frequency.setValueAtTime(2500, now + 0.05);
      oscHigh.frequency.exponentialRampToValueAtTime(14000, now + 0.45);

      gainHigh.gain.setValueAtTime(0.0001, now);
      gainHigh.gain.setValueAtTime(this.sfxVolume * 0.12, now + 0.08);
      gainHigh.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      oscHigh.connect(gainHigh);
      gainHigh.connect(this.masterGain);

      oscHigh.start(now + 0.05);
      oscHigh.stop(now + 0.55);
    } catch (_) {}
  }

  // SFX: 8-bit Arcade Coin Insert (authentic high double chime)
  public playArcadeCoin() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.07); // E6

      gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (_) {}
  }

  // SFX: Permanent Guestbook Signing (Ceremonial Brass Chime & Quill)
  public playGuestbookSign() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // Elegant major chord fanfare: C5, E5, G5, C6
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.setValueAtTime(this.sfxVolume * 0.22, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.6);
      });
    } catch (_) {}
  }

  // SFX: Wall of Fame Plaque Tribute / Salute (sparkling chime)
  public playPlaqueTribute() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const freqs = [880, 1174.66, 1760];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(this.sfxVolume * 0.15, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.3);
      });
    } catch (_) {}
  }

  // SFX: Vintage mechanical keyboard tactile click
  public playKeyClick() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.025);

      gain.gain.setValueAtTime(this.sfxVolume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (_) {}
  }

  // SFX: Arcade Zap/Laser
  public playArcadeZap() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

      gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (_) {}
  }

  // SFX: Arcade Score / Pickup
  public playArcadePickup() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.05); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.15); // C6

      gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (_) {}
  }
}

export const cafeAudio = new CafeSoundEngine();
