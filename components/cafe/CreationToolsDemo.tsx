import React, { useState } from 'react';
import { 
  Video, 
  Image, 
  Box, 
  Play, 
  Sliders, 
  Sparkles, 
  Download, 
  Radio, 
  Layers, 
  RefreshCw,
  Camera,
  Music,
  Trash2,
  Maximize2
} from 'lucide-react';

interface CreationToolsDemoProps {
  toolId: 'video' | 'image' | '3d';
}

export default function CreationToolsDemo({ toolId }: CreationToolsDemoProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [timerId, setTimerId] = useState<any>(null);

  const [activeImageTemplate, setActiveImageTemplate] = useState('tech-glow');
  const [selectedAsset, setSelectedAsset] = useState('desk-neon');

  // Video recording timer simulation
  const toggleRecording = () => {
    if (isRecording) {
      clearInterval(timerId);
      setIsRecording(false);
      setRecordTime(0);
    } else {
      setIsRecording(true);
      const id = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
      setTimerId(id);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#0b0b0b] border border-emerald-950/30 rounded-2xl p-6 md:p-8 space-y-8">
      {/* Tool Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-emerald-950/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            {toolId === 'video' && <Video className="w-6 h-6 text-emerald-400" />}
            {toolId === 'image' && <Image className="w-6 h-6 text-emerald-400" />}
            {toolId === '3d' && <Box className="w-6 h-6 text-emerald-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                Professional Suite
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h2 className="text-xl md:text-2xl font-display font-black italic text-white tracking-wide mt-1 uppercase">
              {toolId === 'video' ? 'Celoris Video Studio' : toolId === 'image' ? 'Portfolio Image Studio' : 'Immersive 3D Studio'}
            </h2>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 max-w-sm md:text-right leading-relaxed">
          {toolId === 'video' 
            ? 'Record HD presentations, skill-sharing tutorials, and community screen-shares instantly.' 
            : toolId === 'image' 
              ? 'Polish your project screenshots and design mockups with premium filters and glowing overlays.' 
              : 'Create custom virtual 3D tables, avatars, and desk spaces for customized team hangouts.'
          }
        </p>
      </div>

      {/* Render Specific Tool Playground */}
      {toolId === 'video' && (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Monitor area */}
          <div className="lg:col-span-8 bg-[#070707] rounded-2xl border border-emerald-950/30 overflow-hidden relative group">
            {/* Aspect box */}
            <div className="aspect-video w-full flex flex-col items-center justify-center p-6 text-center">
              {isRecording ? (
                <div className="space-y-4">
                  {/* Camera overlay mock or pulse effect */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/20 border border-emerald-400/40 flex items-center justify-center animate-pulse mx-auto">
                    <Camera className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-xl font-mono text-white font-bold">{formatTime(recordTime)}</span>
                    <span className="text-xs text-red-400 animate-pulse uppercase tracking-wider font-bold">● Recording Active</span>
                  </div>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Streaming and recording audio and display layout at 1080p, 60 FPS. Mics noise-cancelling is currently enabled.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-w-sm">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-emerald-950/40 flex items-center justify-center mx-auto shadow-inner">
                    <Radio className="w-6 h-6 text-emerald-500/40 animate-pulse" />
                  </div>
                  <h3 className="text-base font-bold text-white">Capture Card & Screen Recording</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Instantly capture your screen, microphone, and webcam. Perfect for making 2-minute coding hacks or Canva design tutorial clips.
                  </p>
                  <button 
                    onClick={toggleRecording}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0a] font-bold text-xs transition-all hover:scale-102 flex items-center gap-1.5 mx-auto"
                  >
                    <Play className="w-4 h-4 fill-current text-[#0a0a0a]" />
                    <span>Initialize Capture Stream</span>
                  </button>
                </div>
              )}
            </div>

            {/* Absolute indicator overlays */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="text-[10px] bg-red-900/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                {isRecording ? 'LIVE' : 'STANDBY'}
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                1080p 60FPS
              </span>
            </div>
          </div>

          {/* Right sidebar details */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>Studio Controls</span>
            </h3>

            <div className="space-y-4">
              {/* Noise cancel */}
              <div className="p-4 rounded-xl bg-[#121212]/50 border border-emerald-950/20 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-white">Smart Noise Gate</span>
                  <span className="text-[10px] text-gray-500 block">AI filter for Indian traffic/fan noise</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <div className="w-11 h-6 bg-emerald-950 rounded-full border border-emerald-500/20 relative">
                    <div className="absolute top-0.5 left-5.5 w-4.5 h-4.5 rounded-full bg-emerald-400 transition-all"></div>
                  </div>
                </div>
              </div>

              {/* Source selections */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Audio Input Source</label>
                <select className="w-full bg-[#121212] border border-emerald-950/40 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-emerald-500/50">
                  <option>System Default Microphone (Dynamic Stereo)</option>
                  <option>High-Fi Studio Audio Filter</option>
                  <option>Mute Audio Capture</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Video Source Layout</label>
                <select className="w-full bg-[#121212] border border-emerald-950/40 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-emerald-500/50">
                  <option>Screen Share only (FullScreen)</option>
                  <option>Picture-in-Picture (Webcam + Screen)</option>
                  <option>Webcam Portrait only</option>
                </select>
              </div>

              <div className="pt-4 border-t border-emerald-950/10 flex gap-2">
                <button 
                  onClick={toggleRecording}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer
                    ${isRecording 
                      ? 'bg-red-500 hover:bg-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0a] shadow-[0_4px_12px_rgba(16,185,129,0.15)]'}
                  `}
                >
                  {isRecording ? 'Stop & Save Clip' : 'Start Recording'}
                </button>
                <button 
                  disabled={!isRecording}
                  className="px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-gray-500 hover:text-white hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toolId === 'image' && (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main preview frame */}
          <div className="lg:col-span-8 bg-[#070707] rounded-2xl border border-emerald-950/30 overflow-hidden relative p-8 flex items-center justify-center min-h-[300px]">
            {/* Simulated Canvas image wrapper with chosen glow template */}
            <div className={`
              w-full max-w-md aspect-[4/3] rounded-xl border p-6 flex flex-col justify-between transition-all duration-300 relative
              ${activeImageTemplate === 'tech-glow' 
                ? 'bg-gradient-to-br from-emerald-950/50 to-zinc-950 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                : activeImageTemplate === 'neon-future'
                  ? 'bg-gradient-to-br from-teal-950/50 to-zinc-950 border-teal-400/30 shadow-[0_0_30px_rgba(20,184,166,0.15)]'
                  : 'bg-zinc-900/90 border-zinc-800 shadow-none'}
            `}>
              <div className="absolute top-4 right-4 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest">
                Portfolio Mockup
              </div>

              <div>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Celoris Designer</span>
                <h3 className="text-xl font-display font-black italic text-white mt-1 leading-tight uppercase">
                  My Advanced Financial Model
                </h3>
                <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 max-w-xs">
                  A comprehensive options backtester built with Excel macro formulas and dynamic array dashboards.
                </p>
              </div>

              {/* Simulated user footer */}
              <div className="flex items-center gap-3 mt-6 border-t border-emerald-950/20 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
                  alt="Rohan Mehta"
                  className="w-8 h-8 rounded-full object-cover border border-emerald-500/30"
                />
                <div className="text-left">
                  <span className="block text-xs font-bold text-white">Rohan Mehta</span>
                  <span className="text-[10px] text-gray-500">SRCC Delhi · Trading Expert</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Canvas Presets</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Select Glow Template</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setActiveImageTemplate('tech-glow')}
                    className={`p-3 rounded-xl border text-left transition-all ${activeImageTemplate === 'tech-glow' ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900/40 border-transparent text-gray-400'}`}
                  >
                    <span className="block text-xs font-bold">Emerald Cyber</span>
                    <span className="text-[9px] text-gray-500">Tech gradient glow</span>
                  </button>
                  <button 
                    onClick={() => setActiveImageTemplate('neon-future')}
                    className={`p-3 rounded-xl border text-left transition-all ${activeImageTemplate === 'neon-future' ? 'bg-teal-950/20 border-teal-500/50 text-teal-400' : 'bg-zinc-900/40 border-transparent text-gray-400'}`}
                  >
                    <span className="block text-xs font-bold">Teal Aurora</span>
                    <span className="text-[9px] text-gray-500">Subtle clean pastel</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Card Overlay Details</label>
                <div className="p-3 bg-[#121212]/50 rounded-xl border border-emerald-950/20 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400"><span className="text-[11px]">Watermark Badge</span><span className="text-emerald-400 font-bold">Enabled</span></div>
                  <div className="flex justify-between text-gray-400"><span className="text-[11px]">Creator Info</span><span className="text-emerald-400 font-bold">Shown</span></div>
                  <div className="flex justify-between text-gray-400"><span className="text-[11px]">Resolution</span><span>4K Export Ready</span></div>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-950/10 flex gap-2">
                <button 
                  onClick={() => alert("Simulated Download: Portfolio mockup image compiled in 4K resolution!")}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0a] font-bold text-xs transition-all hover:scale-102 flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Mockup png</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toolId === '3d' && (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main 3D viewport canvas */}
          <div className="lg:col-span-8 bg-[#070707] rounded-2xl border border-emerald-950/30 overflow-hidden relative p-6 flex flex-col justify-between min-h-[300px]">
            {/* Aspect center: 3D scene visualizer simulation */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
              {/* Spinning orbital shape */}
              <div className="w-32 h-32 rounded-3xl border-2 border-emerald-500/20 flex items-center justify-center animate-spin-slow shadow-[0_0_40px_rgba(16,185,129,0.1)] mb-4">
                <div className="w-20 h-20 rounded-2xl border-2 border-teal-400/40 flex items-center justify-center animate-ping">
                  <Box className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs text-emerald-400 font-bold tracking-widest uppercase">Celoris spatial view</span>
                <h3 className="text-sm font-bold text-white">Active Scene Asset: {selectedAsset === 'desk-neon' ? 'Cyber Neon Co-working Table' : 'Indie Acoustic Jam Stage'}</h3>
              </div>
            </div>

            <div className="absolute top-4 left-4">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                OpenGL Render Active
              </span>
            </div>
          </div>

          {/* Controls sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" />
              <span>3D Workspace Assets</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">Select Lounge Asset Preset</label>
                <div className="space-y-2">
                  <button 
                    onClick={() => setSelectedAsset('desk-neon')}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${selectedAsset === 'desk-neon' ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900/40 border-transparent text-gray-400'}`}
                  >
                    <div>
                      <span className="block text-xs font-bold">Cyber Neon Table</span>
                      <span className="text-[9px] text-gray-500">6 study chairs + coding board</span>
                    </div>
                    {selectedAsset === 'desk-neon' && <Sparkles className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button 
                    onClick={() => setSelectedAsset('jam-stage')}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${selectedAsset === 'jam-stage' ? 'bg-teal-950/20 border-teal-500/50 text-teal-400' : 'bg-zinc-900/40 border-transparent text-gray-400'}`}
                  >
                    <div>
                      <span className="block text-xs font-bold">Indie Acoustic Stage</span>
                      <span className="text-[9px] text-gray-500">Audio visualizer + mic stands</span>
                    </div>
                    {selectedAsset === 'jam-stage' && <Sparkles className="w-4 h-4 text-teal-400" />}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-950/10 flex gap-2">
                <button 
                  onClick={() => alert(`Simulated Render: Spawning virtual 3D workspace table with ${selectedAsset === 'desk-neon' ? 'Cyber Table' : 'Acoustic Stage'} asset!`)}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0a] font-bold text-xs transition-all hover:scale-102 flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
                >
                  <Box className="w-4 h-4" />
                  <span>Deploy Spatial Room</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
