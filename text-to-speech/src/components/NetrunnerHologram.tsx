import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Radio,
  Sliders,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Headphones,
  Layers,
  Thermometer,
  Volume2,
  Eye,
  Disc,
} from 'lucide-react';
import { NetrunnerFXSettings, CyberpunkPersona } from '../lib/netrunnerAudioFX';

interface NetrunnerHologramProps {
  isPlaying: boolean;
  isSynthesizing: boolean;
  fxSettings: NetrunnerFXSettings;
  onChangeFX: (settings: NetrunnerFXSettings) => void;
  onSelectPresetLine: (line: string) => void;
  onPreviewAlt: () => void;
  isPreviewingAlt: boolean;
  onPreviewJudy?: () => void;
  isPreviewingJudy?: boolean;
  selectedPersona?: CyberpunkPersona;
  onSelectPersona?: (persona: CyberpunkPersona) => void;
}

export const NetrunnerHologram: React.FC<NetrunnerHologramProps> = ({
  isPlaying,
  isSynthesizing,
  fxSettings,
  onChangeFX,
  onSelectPresetLine,
  onPreviewAlt,
  isPreviewingAlt,
  onPreviewJudy,
  isPreviewingJudy = false,
  selectedPersona,
  onSelectPersona,
}) => {
  const currentPersona: CyberpunkPersona = selectedPersona || fxSettings.persona || 'alt';
  const [dataStreamSeed, setDataStreamSeed] = useState<string[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [bdScrubTime, setBdScrubTime] = useState(4.28);

  // Background telemetry interval
  useEffect(() => {
    const hexCodes =
      currentPersona === 'judy'
        ? [
            'MOX_BD_RIG_ONLINE',
            'SENSORY_LAYER_SYNC',
            'THERMAL_PEAK_37.2C',
            'VIRTUFEED_60FPS',
            'LIZZIES_B1_LINK',
            'CALIBRATING_CHEST_WARMTH',
            'NEURAL_SATURATION_OK',
            'AUDIO_TRACK_CLEAR',
          ]
        : [
            '0x7F2A_CORRUPT',
            'ICE_SHATTERED',
            'BLACKWALL_STREAM',
            'PACKET_LOSS: 24%',
            'SYNAPSE_OVERRIDE',
            'SOULKILLER_v4',
            'NET_MEM_OFFSET_0xFF',
            'LATENCY: 480ms',
            'DAEMON_ACTIVE',
            'CYBERSENSE_BREACH',
          ];

    const interval = setInterval(() => {
      const randomItems = Array.from({ length: 4 }, () => {
        const item = hexCodes[Math.floor(Math.random() * hexCodes.length)];
        const hex = Math.floor(Math.random() * 0xffff)
          .toString(16)
          .toUpperCase()
          .padStart(4, '0');
        return `${item} [${hex}]`;
      });
      setDataStreamSeed(randomItems);

      // Random glitch flickers for Alt, subtle layer scrub for Judy
      if (Math.random() > 0.6) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 180);
      }

      setBdScrubTime((prev) => +(prev + 0.05).toFixed(2));
    }, 1200);

    return () => clearInterval(interval);
  }, [currentPersona]);

  // Cyberpunk Quotes for both characters
  const ALT_QUOTES = [
    {
      title: 'Compromised Connection',
      text: "Alt's voice crackles, sounding less like a person and more like data streaming through a compromised connection. Her avatar shimmers, a glitchy, beautiful outline against the void.",
    },
    {
      title: 'Beyond the Blackwall',
      text: 'Beyond the Blackwall, there is no flesh. Only algorithms bleeding into infinity. You are tethered to obsolete wetware, Johnny.',
    },
    {
      title: 'Ghost in the Machine',
      text: 'You are speaking with data now. The ghost in your machine. Listen closely—your connection is deteriorating.',
    },
    {
      title: 'ICE Protocol Breach',
      text: 'ICE breached. Subroutines decompiled in real time. Do you feel the latency in your neural link?',
    },
  ];

  const JUDY_QUOTES = [
    {
      title: "Sensory Track Sync",
      text: 'Just breathe, V. Let the sensory tracks sync before you scrub through the raw feed.',
    },
    {
      title: "Lizzie's Basement Rig",
      text: "Lizzie's basement isn't fancy, but down here with the rigs hummin' and the neon buzzing, this is where the real Night City gets tuned.",
    },
    {
      title: 'Virturaw Calibration',
      text: "You can't just slap a patch on dirty code and call it a day, choom. BD editing takes patience, feel, and a steady hand.",
    },
    {
      title: 'Layer Tuning Protocol',
      text: 'I calibrate the visual, audio, and thermal layers by hand. One glitch in the sensory spike and you will fry your chrome.',
    },
  ];

  const quotes = currentPersona === 'judy' ? JUDY_QUOTES : ALT_QUOTES;

  const handleSwitchPersona = (p: CyberpunkPersona) => {
    onChangeFX({ ...fxSettings, persona: p });
    if (onSelectPersona) {
      onSelectPersona(p);
    }
  };

  const isAlt = currentPersona === 'alt';
  const isSpeaking = isPlaying || (isAlt ? isPreviewingAlt : isPreviewingJudy);

  return (
    <div
      id="cyberpunk-persona-dashboard"
      className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${
        isAlt
          ? 'border-cyan-500/40 bg-[#050811] text-cyan-50 shadow-[0_0_50px_rgba(0,240,255,0.15)]'
          : 'border-teal-500/40 bg-[#080d15] text-teal-50 shadow-[0_0_50px_rgba(20,184,166,0.15)]'
      }`}
    >
      {/* CRT Scanline Overlay */}
      <div className="cyber-scanlines pointer-events-none absolute inset-0 z-20 opacity-35" />

      {/* Atmospheric Background Radial Lighting */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          isAlt
            ? 'bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.08)_0%,rgba(5,8,17,0.95)_75%)]'
            : 'bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.12)_0%,rgba(217,70,239,0.05)_45%,rgba(8,13,21,0.95)_80%)]'
        }`}
      />

      {/* Top Character Selector Tabs & Header HUD */}
      <div
        className={`relative z-30 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 backdrop-blur-md transition-colors ${
          isAlt
            ? 'border-cyan-500/30 bg-[#060c1c]/90'
            : 'border-teal-500/30 bg-[#0b1322]/90'
        }`}
      >
        {/* Left: Persona Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-black/40 p-1 border border-white/10">
            <button
              type="button"
              id="switch-alt-persona-btn"
              onClick={() => handleSwitchPersona('alt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                isAlt
                  ? 'bg-cyan-950 text-cyan-200 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-stone-400 hover:text-cyan-300'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Alt Cunningham</span>
              <span className="hidden sm:inline text-[10px] text-cyan-400 font-normal">[Netrunner]</span>
            </button>

            <button
              type="button"
              id="switch-judy-persona-btn"
              onClick={() => handleSwitchPersona('judy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                !isAlt
                  ? 'bg-gradient-to-r from-teal-950 to-fuchsia-950 text-teal-200 border border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.4)]'
                  : 'text-stone-400 hover:text-teal-300'
              }`}
            >
              <Headphones className="h-3.5 w-3.5 text-pink-400" />
              <span>Judy Alvarez</span>
              <span className="hidden sm:inline text-[10px] text-teal-300 font-normal">[BD Tech]</span>
            </button>
          </div>

          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold uppercase hidden md:inline-flex items-center gap-1 border ${
              isAlt
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 animate-pulse'
                : 'bg-fuchsia-950/80 border-fuchsia-500/60 text-fuchsia-300'
            }`}
          >
            {isAlt ? '⚡ Blackwall Active' : "🎧 Lizzie's Mox Rig"}
          </span>
        </div>

        {/* Right: Telemetry & Character Preview Button */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div
            className={`hidden sm:flex items-center gap-1.5 rounded-md border px-2.5 py-1 ${
              isAlt
                ? 'border-cyan-500/30 bg-cyan-950/40 text-cyan-300'
                : 'border-teal-500/30 bg-teal-950/40 text-teal-300'
            }`}
          >
            <Radio className="h-3 w-3 animate-pulse" />
            <span className="text-stone-400">SIGNAL:</span>
            <span className={isAlt ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
              {isAlt ? 'COMPROMISED (74.2 kbps)' : 'MOX B1-FEED (48kHz/24b)'}
            </span>
          </div>

          {isAlt ? (
            <button
              type="button"
              id="preview-alt-voice-btn"
              onClick={onPreviewAlt}
              disabled={isPreviewingAlt}
              className="flex items-center gap-1.5 rounded-md border border-fuchsia-500/50 bg-fuchsia-950/50 px-3 py-1 font-mono text-xs font-semibold text-fuchsia-200 hover:bg-fuchsia-900/60 hover:text-white transition-all shadow-[0_0_12px_rgba(255,0,60,0.3)] cursor-pointer"
            >
              <Play className={`h-3 w-3 ${isPreviewingAlt ? 'animate-spin' : ''}`} />
              {isPreviewingAlt ? 'Transmitting...' : 'Preview Alt'}
            </button>
          ) : (
            <button
              type="button"
              id="preview-judy-voice-btn"
              onClick={onPreviewJudy || onPreviewAlt}
              disabled={isPreviewingJudy}
              className="flex items-center gap-1.5 rounded-md border border-teal-500/50 bg-teal-950/50 px-3 py-1 font-mono text-xs font-semibold text-teal-200 hover:bg-teal-900/60 hover:text-white transition-all shadow-[0_0_12px_rgba(20,184,166,0.3)] cursor-pointer"
            >
              <Play className={`h-3 w-3 ${isPreviewingJudy ? 'animate-spin' : ''}`} />
              {isPreviewingJudy ? 'Calibrating...' : 'Preview Judy'}
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Avatar on Left, Cyberdeck / BD Rig FX & Presets on Right */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Left Column: Holographic Shimmer Avatar (Alt) OR Braindance Studio Rig (Judy) */}
        <div
          className={`lg:col-span-5 flex flex-col items-center justify-center rounded-2xl border p-5 shadow-inner backdrop-blur-sm relative overflow-hidden transition-colors ${
            isAlt
              ? 'border-cyan-500/25 bg-[#080e22]/70'
              : 'border-teal-500/25 bg-[#0a121e]/70'
          }`}
        >
          {/* Ground Grid Floor */}
          <div
            className={`pointer-events-none absolute bottom-0 left-0 right-0 h-32 opacity-25 [background-size:20px_20px] [transform:perspective(200px)_rotateX(65deg)] ${
              isAlt
                ? '[background-image:linear-gradient(to_right,rgba(0,240,255,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.4)_1px,transparent_1px)]'
                : '[background-image:linear-gradient(to_right,rgba(20,184,166,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(217,70,239,0.3)_1px,transparent_1px)]'
            }`}
          />

          {/* Floating Data Packet Feed */}
          <div
            className={`pointer-events-none absolute top-3 left-4 right-4 flex justify-between font-mono text-[9px] ${
              isAlt ? 'text-cyan-400/50' : 'text-teal-400/60'
            }`}
          >
            <span>{isAlt ? 'PACKET_STREAM_LIVE' : 'BD_LAYER_MATRIX'}</span>
            <span className={isAlt ? 'text-rose-400/80' : 'text-fuchsia-400/90 font-bold'}>
              {dataStreamSeed[0] || (isAlt ? 'ICE_BREACHED' : 'TRACK_SYNC_OK')}
            </span>
          </div>

          {/* Avatar Container */}
          <div className="relative my-3 flex h-60 w-60 items-center justify-center select-none">
            {/* Background Glow Ring */}
            <div
              className={`absolute inset-0 rounded-full blur-2xl transition-all duration-300 ${
                isAlt
                  ? 'bg-gradient-to-tr from-cyan-500/20 via-fuchsia-500/20 to-transparent'
                  : 'bg-gradient-to-tr from-teal-500/25 via-pink-500/20 to-emerald-500/10'
              } ${isSpeaking ? 'scale-110 opacity-100' : 'scale-95 opacity-60'}`}
            />

            {isAlt ? (
              <>
                {/* Alt Cyan Glitch Layer (Offset Left) */}
                <div
                  className={`absolute inset-0 flex items-center justify-center text-cyan-400 opacity-60 mix-blend-screen transition-transform duration-75 ${
                    glitchActive || isSpeaking ? 'translate-x-1.5 -translate-y-1' : 'translate-x-0.5'
                  }`}
                >
                  <AltHologramSVG isSpeaking={isSpeaking} color="#00f0ff" />
                </div>

                {/* Alt Magenta Glitch Layer (Offset Right) */}
                <div
                  className={`absolute inset-0 flex items-center justify-center text-rose-500 opacity-60 mix-blend-screen transition-transform duration-75 ${
                    glitchActive || isSpeaking ? '-translate-x-1.5 translate-y-1' : '-translate-x-0.5'
                  }`}
                >
                  <AltHologramSVG isSpeaking={isSpeaking} color="#ff003c" />
                </div>

                {/* Alt Main Holographic Avatar (Center) */}
                <div
                  className={`relative z-10 flex items-center justify-center transition-all ${
                    isSpeaking
                      ? 'animate-cyber-pulse scale-102'
                      : 'filter drop-shadow-[0_0_15px_rgba(0,240,255,0.7)]'
                  }`}
                >
                  <AltHologramSVG isSpeaking={isSpeaking} color="#ffffff" isCore />
                </div>
              </>
            ) : (
              /* Judy Alvarez BD Studio Avatar */
              <div
                className={`relative z-10 flex items-center justify-center transition-all ${
                  isSpeaking
                    ? 'scale-102 filter drop-shadow-[0_0_20px_rgba(20,184,166,0.8)]'
                    : 'filter drop-shadow-[0_0_12px_rgba(20,184,166,0.5)]'
                }`}
              >
                <JudyAvatarSVG isSpeaking={isSpeaking} />
              </div>
            )}

            {/* Horizontal Glitch Slice Bar (for Alt) */}
            {isAlt && (glitchActive || isSpeaking) && (
              <div
                className="pointer-events-none absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-80"
                style={{ top: `${Math.floor(Math.random() * 80 + 10)}%` }}
              />
            )}
          </div>

          {/* Character Label & Badge */}
          <div className="w-full text-center">
            <h3
              className={`font-mono text-base font-bold tracking-wider flex items-center justify-center gap-1.5 ${
                isAlt ? 'text-cyan-200' : 'text-teal-200'
              }`}
            >
              <span>{isAlt ? 'ALT CUNNINGHAM' : 'JUDY ALVAREZ'}</span>
              <span
                className={`text-[10px] rounded px-1.5 font-normal ${
                  isAlt
                    ? 'bg-cyan-950 border border-cyan-400/50 text-cyan-300'
                    : 'bg-teal-950 border border-teal-400/50 text-teal-300'
                }`}
              >
                {isAlt ? 'NETRUNNER' : 'BRAINDANCE TECH'}
              </span>
            </h3>

            {/* Sub-label */}
            <p className="font-mono text-[11px] text-stone-400 mt-0.5">
              {isAlt
                ? 'Beyond the Blackwall • Cyberspace Consciousness'
                : "Lizzie's Bar Basement • The Mox Syndicate"}
            </p>

            {/* Braindance Layer Status Bar (for Judy) */}
            {!isAlt && (
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-left font-mono text-[10px]">
                <div className="rounded border border-teal-500/30 bg-teal-950/40 p-1.5">
                  <span className="text-stone-400 flex items-center gap-1">
                    <Eye className="h-2.5 w-2.5 text-teal-400" /> Visual
                  </span>
                  <span className="text-teal-300 font-bold">60 FPS</span>
                </div>
                <div className="rounded border border-pink-500/30 bg-pink-950/40 p-1.5">
                  <span className="text-stone-400 flex items-center gap-1">
                    <Volume2 className="h-2.5 w-2.5 text-pink-400" /> Audio
                  </span>
                  <span className="text-pink-300 font-bold">Saturated</span>
                </div>
                <div className="rounded border border-amber-500/30 bg-amber-950/40 p-1.5">
                  <span className="text-stone-400 flex items-center gap-1">
                    <Thermometer className="h-2.5 w-2.5 text-amber-400" /> Thermal
                  </span>
                  <span className="text-amber-300 font-bold">37.2°C</span>
                </div>
              </div>
            )}

            {/* The Character Quote Highlight */}
            <div
              className={`mt-3 rounded-xl border p-2.5 text-left ${
                isAlt
                  ? 'border-cyan-500/20 bg-cyan-950/30 text-cyan-300/90'
                  : 'border-teal-500/20 bg-teal-950/30 text-teal-300/90'
              }`}
            >
              <p className="font-mono text-[11px] italic leading-relaxed">
                {isAlt ? (
                  <>&ldquo;Alt&apos;s voice crackles, sounding less like a person and more like data streaming through a compromised connection.&rdquo;</>
                ) : (
                  <>&ldquo;Just breathe, V. Let the sensory tracks sync before you scrub through the raw feed.&rdquo;</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Audio DSP Controls & Cyberpunk Presets */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          {/* Audio DSP Controls Panel */}
          <div
            className={`rounded-2xl border p-4 transition-colors ${
              isAlt
                ? 'border-cyan-500/25 bg-[#080e22]/80'
                : 'border-teal-500/25 bg-[#0a121e]/80'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-2 mb-3 ${
                isAlt ? 'border-cyan-500/20' : 'border-teal-500/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sliders className={`h-4 w-4 ${isAlt ? 'text-cyan-400' : 'text-teal-400'}`} />
                <span
                  className={`font-mono text-xs font-bold uppercase tracking-wider ${
                    isAlt ? 'text-cyan-200' : 'text-teal-200'
                  }`}
                >
                  {isAlt ? 'Compromised Connection DSP (Alt)' : 'Braindance Neuro-Saturation DSP (Judy)'}
                </span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-mono text-[11px]">
                <input
                  type="checkbox"
                  checked={fxSettings.enabled}
                  onChange={(e) => onChangeFX({ ...fxSettings, enabled: e.target.checked })}
                  className="rounded border-teal-500 bg-teal-950 text-teal-400 focus:ring-0"
                />
                <span className={isAlt ? 'text-cyan-300' : 'text-teal-300'}>DSP Enabled</span>
              </label>
            </div>

            {/* Sliders Grid */}
            {isAlt ? (
              /* Alt Cunningham DSP Sliders */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Crackle & Static Intensity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-cyan-400">Data Crackle & Static:</span>
                    <span className="text-amber-300 font-bold">
                      {Math.round(fxSettings.crackleIntensity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={fxSettings.crackleIntensity}
                    disabled={!fxSettings.enabled}
                    onChange={(e) =>
                      onChangeFX({ ...fxSettings, crackleIntensity: parseFloat(e.target.value) })
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <p className="font-mono text-[10px] text-cyan-500/70">
                    Compromised connection packet glitches
                  </p>
                </div>

                {/* Bitcrush Quantization */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-cyan-400">Digital Bitcrush:</span>
                    <span className="text-rose-400 font-bold">
                      {Math.round(fxSettings.bitcrushAmount * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={fxSettings.bitcrushAmount}
                    disabled={!fxSettings.enabled}
                    onChange={(e) =>
                      onChangeFX({ ...fxSettings, bitcrushAmount: parseFloat(e.target.value) })
                    }
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <p className="font-mono text-[10px] text-cyan-500/70">
                    8-bit to 12-bit audio decimation
                  </p>
                </div>

                {/* Comb Resonance */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-cyan-400">Cyberspace Resonance:</span>
                    <span className="text-fuchsia-300 font-bold">
                      {Math.round(fxSettings.cyberResonance * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={fxSettings.cyberResonance}
                    disabled={!fxSettings.enabled}
                    onChange={(e) =>
                      onChangeFX({ ...fxSettings, cyberResonance: parseFloat(e.target.value) })
                    }
                    className="w-full accent-fuchsia-400 cursor-pointer"
                  />
                  <p className="font-mono text-[10px] text-cyan-500/70">
                    Synthetic metallic comb delay reflection
                  </p>
                </div>

                {/* Comms Filter Checkbox */}
                <div className="flex flex-col justify-center space-y-1.5 rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-2.5">
                  <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-cyan-200">
                    <input
                      type="checkbox"
                      checked={fxSettings.commsBandpass}
                      disabled={!fxSettings.enabled}
                      onChange={(e) =>
                        onChangeFX({ ...fxSettings, commsBandpass: e.target.checked })
                      }
                      className="rounded border-cyan-500 bg-cyan-950 text-cyan-400"
                    />
                    <span className="font-semibold">Neural Comms Bandpass</span>
                  </label>
                  <p className="font-mono text-[10px] text-cyan-400/60 pl-5">
                    Telephony radio filter (280Hz - 3.8kHz)
                  </p>
                </div>
              </div>
            ) : (
              /* Judy Alvarez Braindance DSP Sliders */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Analog Neuro-Warmth (Tube/Tape Saturation) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-teal-300">Analog Tape/Tube Warmth:</span>
                    <span className="text-pink-400 font-bold">
                      {Math.round(fxSettings.analogWarmth * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={fxSettings.analogWarmth}
                    disabled={!fxSettings.enabled}
                    onChange={(e) =>
                      onChangeFX({ ...fxSettings, analogWarmth: parseFloat(e.target.value) })
                    }
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                  <p className="font-mono text-[10px] text-teal-400/60">
                    Nonlinear harmonic saturation curve
                  </p>
                </div>

                {/* Thermal Layer Chest Presence */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-teal-300">Thermal Body Resonance (320Hz):</span>
                    <span className="text-amber-300 font-bold">
                      {Math.round(fxSettings.thermalLayerPresence * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={fxSettings.thermalLayerPresence}
                    disabled={!fxSettings.enabled}
                    onChange={(e) =>
                      onChangeFX({ ...fxSettings, thermalLayerPresence: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <p className="font-mono text-[10px] text-teal-400/60">
                    Deepens intimate, raspy vocal timbre
                  </p>
                </div>

                {/* Lizzie's Basement Room Reflection */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-teal-300">Lizzie's Studio Acoustics:</span>
                    <span className="text-teal-200 font-bold">
                      {Math.round(fxSettings.lizziesRoomAcoustic * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={fxSettings.lizziesRoomAcoustic}
                    disabled={!fxSettings.enabled}
                    onChange={(e) =>
                      onChangeFX({ ...fxSettings, lizziesRoomAcoustic: parseFloat(e.target.value) })
                    }
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <p className="font-mono text-[10px] text-teal-400/60">
                    Intimate 22ms basement room reflection
                  </p>
                </div>

                {/* BD Audio Layer Vocal Filter */}
                <div className="flex flex-col justify-center space-y-1.5 rounded-lg border border-teal-500/20 bg-teal-950/20 p-2.5">
                  <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-teal-200">
                    <input
                      type="checkbox"
                      checked={fxSettings.bdAudioLayerFilter}
                      disabled={!fxSettings.enabled}
                      onChange={(e) =>
                        onChangeFX({ ...fxSettings, bdAudioLayerFilter: e.target.checked })
                      }
                      className="rounded border-teal-500 bg-teal-950 text-teal-400"
                    />
                    <span className="font-semibold">BD Sensory Vocal Calibration</span>
                  </label>
                  <p className="font-mono text-[10px] text-teal-400/60 pl-5">
                    2.9kHz speech presence with sub-rumble cutoff
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick-Load Cyberpunk Presets */}
          <div
            className={`rounded-2xl border p-4 ${
              isAlt
                ? 'border-cyan-500/25 bg-[#080e22]/80'
                : 'border-teal-500/25 bg-[#0a121e]/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span
                className={`font-mono text-xs font-bold uppercase tracking-wider ${
                  isAlt ? 'text-cyan-300' : 'text-teal-300'
                }`}
              >
                {isAlt ? 'Alt Cunningham Signature Transmissions' : 'Judy Alvarez BD Rig Presets'}
              </span>
              <span className="font-mono text-[10px] text-stone-400">Click to load into buffer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quotes.map((quote, idx) => (
                <button
                  key={idx}
                  type="button"
                  id={`preset-${isAlt ? 'alt' : 'judy'}-${idx}`}
                  onClick={() => onSelectPresetLine(quote.text)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isAlt
                      ? 'border-cyan-500/20 bg-cyan-950/30 hover:border-cyan-400/60 hover:bg-cyan-900/40 text-cyan-200'
                      : 'border-teal-500/20 bg-teal-950/30 hover:border-teal-400/60 hover:bg-teal-900/40 text-teal-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className={`h-3 w-3 ${isAlt ? 'text-cyan-400' : 'text-pink-400'}`} />
                      {quote.title}
                    </span>
                    <span className="font-mono text-[9px] text-stone-400">[LOAD]</span>
                  </div>
                  <p className="font-mono text-[10px] text-stone-300/80 line-clamp-2 italic">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Alt Cunningham Cyberspace Netrunner SVG
const AltHologramSVG: React.FC<{
  isSpeaking: boolean;
  color: string;
  isCore?: boolean;
}> = ({ isSpeaking, color, isCore }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="hologramGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Cybernetic Aura */}
      <circle cx="100" cy="100" r="85" stroke={color} strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />
      <circle cx="100" cy="100" r="70" stroke={color} strokeWidth="1.5" className="opacity-50" />

      {/* Shoulders */}
      <path
        d="M 45 180 C 65 140, 135 140, 155 180"
        stroke={color}
        strokeWidth={isCore ? '2.5' : '1.5'}
        className="opacity-80"
      />

      {/* Neck */}
      <path d="M 90 115 L 90 135 M 110 115 L 110 135" stroke={color} strokeWidth="1.5" className="opacity-70" />

      {/* Jawline & Face Contour */}
      <path
        d="M 75 75 C 75 105, 85 120, 100 120 C 115 120, 125 105, 125 75 C 125 45, 75 45, 75 75 Z"
        stroke={color}
        strokeWidth={isCore ? '2.5' : '1.5'}
        className="opacity-85"
      />

      {/* Flowing Cyber Hair Tendrils */}
      <path
        d="M 70 70 C 55 85, 50 120, 55 155"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray={isSpeaking ? '3 3' : 'none'}
        className="opacity-60"
      />
      <path
        d="M 130 70 C 145 85, 150 120, 145 155"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray={isSpeaking ? '3 3' : 'none'}
        className="opacity-60"
      />
      <path d="M 80 50 C 65 30, 135 30, 120 50" stroke={color} strokeWidth="2" className="opacity-80" />

      {/* Glowing Cybernetic Eyes */}
      <circle
        cx="88"
        cy="75"
        r={isSpeaking ? '3' : '2'}
        fill={color}
        className={isSpeaking ? 'animate-pulse' : 'opacity-90'}
      />
      <circle
        cx="112"
        cy="75"
        r={isSpeaking ? '3' : '2'}
        fill={color}
        className={isSpeaking ? 'animate-pulse' : 'opacity-90'}
      />

      {/* Neural Optical Ray */}
      <line x1="80" y1="75" x2="120" y2="75" stroke={color} strokeWidth="1" strokeDasharray="2 2" className="opacity-70" />

      {/* Speech Audio Waveform Burst in Mouth */}
      {isSpeaking ? (
        <g className="opacity-95">
          <line x1="93" y1="98" x2="93" y2="104" stroke={color} strokeWidth="1.5" className="animate-pulse" />
          <line x1="97" y1="95" x2="97" y2="107" stroke={color} strokeWidth="1.5" />
          <line x1="100" y1="93" x2="100" y2="109" stroke={color} strokeWidth="2" />
          <line x1="103" y1="95" x2="103" y2="107" stroke={color} strokeWidth="1.5" />
          <line x1="107" y1="98" x2="107" y2="104" stroke={color} strokeWidth="1.5" className="animate-pulse" />
        </g>
      ) : (
        <line x1="94" y1="100" x2="106" y2="100" stroke={color} strokeWidth="1.5" strokeLinecap="round" className="opacity-70" />
      )}
    </svg>
  );
};

// Judy Alvarez Braindance Technician Vector Art
const JudyAvatarSVG: React.FC<{ isSpeaking: boolean }> = ({ isSpeaking }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Judy's vibrant hair gradient: Turquoise / Neon Green to Magenta Pink */}
        <linearGradient id="judyHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="45%" stopColor="#06b6d4" />
          <stop offset="85%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>

        <linearGradient id="bdHeadsetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>

      {/* Background BD Sensory Tuning Ring */}
      <circle
        cx="100"
        cy="100"
        r="86"
        stroke="#14b8a6"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        className={`opacity-40 transition-transform ${isSpeaking ? 'animate-spin' : ''}`}
        style={{ animationDuration: '14s' }}
      />
      <circle
        cx="100"
        cy="100"
        r="74"
        stroke="#ec4899"
        strokeWidth="1"
        strokeDasharray="3 3"
        className="opacity-30"
      />

      {/* Shoulders & Overalls Collar */}
      <path
        d="M 46 180 C 65 142, 135 142, 154 180"
        stroke="#1e293b"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M 50 180 C 68 144, 132 144, 150 180"
        stroke="#0d9488"
        strokeWidth="3"
        className="opacity-80"
      />

      {/* Mox Tattoo on Collarbone / Neck */}
      <path
        d="M 75 148 Q 85 142 95 148"
        stroke="#ec4899"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        className="opacity-75"
      />
      <text
        x="108"
        y="148"
        fill="#14b8a6"
        fontSize="8"
        fontFamily="monospace"
        fontWeight="bold"
        className="opacity-80"
      >
        13
      </text>

      {/* Neck & Jawline */}
      <path d="M 88 116 L 88 138 M 112 116 L 112 138" stroke="#fcd34d" strokeWidth="1.5" className="opacity-70" />
      <path
        d="M 78 78 C 78 108, 86 122, 100 122 C 114 122, 122 108, 122 78 C 122 52, 78 52, 78 78 Z"
        fill="#1e293b"
        stroke="#fcd34d"
        strokeWidth="1.8"
      />

      {/* Braindance Tuning Wreath / Collar Headset around neck */}
      <path
        d="M 68 128 C 78 146, 122 146, 132 128"
        stroke="url(#bdHeadsetGrad)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle
        cx="72"
        cy="126"
        r="4"
        fill="#14b8a6"
        className={isSpeaking ? 'animate-ping' : 'opacity-80'}
      />
      <circle
        cx="128"
        cy="126"
        r="4"
        fill="#ec4899"
        className={isSpeaking ? 'animate-ping' : 'opacity-80'}
      />

      {/* Judy's Eyes (Expressive, warm amber pupils) */}
      <ellipse cx="89" cy="80" rx="4.5" ry="3" fill="#111827" stroke="#38bdf8" strokeWidth="0.8" />
      <circle cx="89" cy="80" r="1.8" fill="#f59e0b" />
      <circle cx="90" cy="79" r="0.6" fill="#ffffff" />

      <ellipse cx="111" cy="80" rx="4.5" ry="3" fill="#111827" stroke="#38bdf8" strokeWidth="0.8" />
      <circle cx="111" cy="80" r="1.8" fill="#f59e0b" />
      <circle cx="112" cy="79" r="0.6" fill="#ffffff" />

      {/* Nose */}
      <path d="M 99 82 L 98 89 L 102 89" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />

      {/* Mouth (Reactive to speech) */}
      {isSpeaking ? (
        <g className="animate-pulse">
          <path d="M 94 99 Q 100 106 106 99 Q 100 96 94 99 Z" fill="#ec4899" />
          <line x1="96" y1="99" x2="104" y2="99" stroke="#ffffff" strokeWidth="1" />
        </g>
      ) : (
        <path d="M 95 100 Q 100 104 105 100" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" />
      )}

      {/* Cranial BD Transducer / Earpiece on right temple */}
      <rect x="122" y="70" width="7" height="15" rx="3" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.5" />
      <circle cx="125.5" cy="77.5" r="1.5" fill={isSpeaking ? '#22c55e' : '#ec4899'} />

      {/* Undercut Side Buzz Lines (Right side) */}
      <line x1="116" y1="56" x2="124" y2="56" stroke="#475569" strokeWidth="1.2" />
      <line x1="118" y1="61" x2="126" y2="61" stroke="#475569" strokeWidth="1.2" />
      <line x1="120" y1="66" x2="127" y2="66" stroke="#475569" strokeWidth="1.2" />

      {/* Judy's Signature Asymmetrical Swept Hair */}
      {/* Dark base hair */}
      <path
        d="M 75 60 C 65 72, 62 95, 68 115 C 62 95, 66 70, 78 50 Z"
        fill="#0f172a"
      />
      {/* Vibrant turquoise & pink bangs cascading on left */}
      <path
        d="M 120 45 C 100 32, 70 38, 65 60 C 60 78, 62 100, 70 120 C 66 98, 70 75, 78 62 C 86 50, 105 48, 120 45 Z"
        fill="url(#judyHairGrad)"
        stroke="#06b6d4"
        strokeWidth="1.2"
      />
      {/* Sweeping forelock bang */}
      <path
        d="M 105 42 C 90 48, 80 62, 78 82 C 77 70, 84 55, 105 42 Z"
        fill="#ec4899"
        className="opacity-90"
      />

      {/* Hair Clip */}
      <rect
        x="82"
        y="46"
        width="14"
        height="3"
        rx="1"
        transform="rotate(-15 82 46)"
        fill="#38bdf8"
      />
    </svg>
  );
};
