import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Sparkles, 
  ArrowRight, 
  Code, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Calendar, 
  BarChart3, 
  Terminal, 
  Cpu, 
  Volume2, 
  Radio, 
  ChevronRight,
  Layers,
  Lock,
  Play,
  Mic,
  Monitor
} from 'lucide-react';
import { UserRole } from '../Header';

interface LandingPageProps {
  onEnterEnvironment: (initialTab?: 'video' | 'pipeline' | 'schedule' | 'analytics', role?: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterEnvironment }) => {
  // Animated equalizer simulation in the hero preview
  const [heroFreqs, setHeroFreqs] = useState<number[]>([40, 75, 55, 90, 60, 35, 80]);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroFreqs([
        Math.floor(25 + Math.random() * 65),
        Math.floor(40 + Math.random() * 55),
        Math.floor(20 + Math.random() * 75),
        Math.floor(50 + Math.random() * 45),
        Math.floor(30 + Math.random() * 65),
        Math.floor(35 + Math.random() * 60),
        Math.floor(15 + Math.random() * 80),
      ]);
    }, 140);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: 'Automated Scoring & Rubric Synthesis',
      description: 'Continuous calibrated scoring across 5 weighted technical dimensions. AI-assisted synthesis generates objective executive summaries, observed strengths, and debrief follow-up probes.',
      badge: 'Continuous Rubric Math',
      icon: Sparkles
    },
    {
      title: 'Dual Video & Collaborative Code Sandbox',
      description: 'High-definition 1080p WebRTC calling with synchronized multi-language code execution (TypeScript, Python, SQL) and live architecture diagrams.',
      badge: 'Sub-15ms Latency',
      icon: Code
    },
    {
      title: 'Integrated Panel Scheduling & ICS Export',
      description: 'Multi-round panel availability detection, conflict resolution, one-click RFC 5545 .ics calendar generation, and branded candidate self-booking portals.',
      badge: 'Outlook & Google Cal',
      icon: Calendar
    },
    {
      title: 'Candidate ATS & Calibration Matrix',
      description: 'Multi-stage Kanban boards, candidate dossiers with full scorecard audit logs, and side-by-side comparative matrices for hiring committee consensus.',
      badge: 'Hiring Committee Consensus',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-[#030705] text-[#e2f5ea] flex flex-col font-sans selection:bg-emerald-500 selection:text-black relative overflow-x-hidden select-none">
      {/* Background Animated Aurora Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[160px] animate-aurora" />
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-emerald-800/10 rounded-full blur-[180px] animate-aurora" style={{ animationDelay: '-4s' }} />
        {/* Subtle grid lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.4) 1px, transparent 1px)', 
            backgroundSize: '48px 48px' 
          }} 
        />
      </div>

      {/* Top Floating Glass Navigation matching Header style */}
      <header className="h-14 border-b border-emerald-950/60 bg-[#060a08]/90 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between shadow-[0_1px_12px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg btn-metallic flex items-center justify-center text-emerald-400 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <Video className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_#10b981]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">VantageHire</span>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              Enterprise Suite
            </span>
          </div>
        </div>

        {/* Quick Nav Anchors */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-emerald-300/80 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Platform Architecture</a>
          <a href="#workspace" className="hover:text-white transition-colors">Video & Sandbox</a>
          <a href="#scoring" className="hover:text-white transition-colors">Rubric Engine</a>
          <a href="#security" className="hover:text-white transition-colors">Enterprise Security</a>
        </nav>

        {/* Enter Environment CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEnterEnvironment('pipeline')}
            className="btn-metallic hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            <span>Candidate Board</span>
          </button>
          
          <button
            onClick={() => onEnterEnvironment('video')}
            className="btn-metallic-emerald flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold shadow-[0_0_16px_rgba(16,185,129,0.4)] group"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative z-10 pt-14 pb-12 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Animated Metallic Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c120f] border border-white/10 text-emerald-300 text-xs font-mono font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_0_12px_rgba(16,185,129,0.2)] mb-6 animate-float">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span>VANTAGEHIRE v4.2 · ENTERPRISE VIDEO INTERVIEW SUITE</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl text-balance">
          The Video Interview Platform for{' '}
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(16,185,129,0.4)]">
            High-Bar Engineering
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-emerald-100/70 max-w-2xl leading-relaxed text-balance">
          Engineered from the ground up for technical hiring. Pair real-time WebRTC video with synchronized coding scratchpads, automated rubric scoring, and multi-round panel coordination.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
          <button
            onClick={() => onEnterEnvironment('video', 'interviewer')}
            className="btn-metallic-emerald flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold shadow-[0_4px_24px_rgba(16,185,129,0.5)] group w-full sm:w-auto"
          >
            <Video className="w-4 h-4 text-white" />
            <span>Enter Live Video Room</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onEnterEnvironment('pipeline', 'hiring_manager')}
            className="btn-metallic flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold w-full sm:w-auto"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Explore ATS Candidate Pipeline</span>
          </button>
        </div>

        {/* Role Presets Bar in Metallic Segmented Style */}
        <div className="mt-8 p-1.5 bg-[#0c120f] rounded-xl border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-emerald-500 font-mono px-2 text-[11px]">Instant Role Preview:</span>
          
          <button
            onClick={() => onEnterEnvironment('video', 'interviewer')}
            className="px-3 py-1 rounded-lg btn-metallic text-emerald-300 font-mono transition-all flex items-center gap-1.5 text-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            <span>Lead Interviewer View</span>
          </button>

          <button
            onClick={() => onEnterEnvironment('pipeline', 'hiring_manager')}
            className="px-3 py-1 rounded-lg btn-metallic text-emerald-300 font-mono transition-all flex items-center gap-1.5 text-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            <span>Hiring Committee View</span>
          </button>

          <button
            onClick={() => onEnterEnvironment('video', 'candidate')}
            className="px-3 py-1 rounded-lg btn-metallic text-emerald-300 font-mono transition-all flex items-center gap-1.5 text-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            <span>Candidate Portal View</span>
          </button>
        </div>

        {/* MacBook Pro Space Black Chassis Interactive Teaser */}
        <div id="workspace" className="mt-14 w-full max-w-5xl relative group">
          {/* Subtle Outer Neon Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-emerald-400/20 to-teal-500/30 rounded-[32px] blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* MacBook Outer Bezel */}
          <div className="relative rounded-[28px] bg-gradient-to-b from-[#252e29] via-[#121915] to-[#0a0f0d] p-3 border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.25)]">
            {/* Top Display Bezel with Camera Notch */}
            <div className="h-6 flex items-center justify-between px-4 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex items-center gap-1.5 bg-[#030604] px-3 py-0.5 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-400 font-bold">1080p Studio Cam Active</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-mono">
                VH-9024-CAL
              </div>
            </div>

            {/* Inner Screen Preview - Pure Black and Green Theme with Metallic Glassy Finish */}
            <div 
              onClick={() => onEnterEnvironment('video')}
              className="relative rounded-2xl overflow-hidden bg-[#060a08] border border-emerald-950/70 cursor-pointer shadow-inner min-h-[440px] flex flex-col md:flex-row"
            >
              {/* Left Video Stage Preview */}
              <div className="flex-1 p-3.5 flex flex-col justify-between relative bg-[#060a08]/95">
                {/* Top meeting title */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-950/60">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg btn-metallic flex items-center justify-center text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                      <Video className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <div>
                      <p className="text-[9px] text-emerald-500 font-medium leading-none font-mono">Thursday, 15 Oct 2026</p>
                      <h4 className="text-xs font-bold text-white leading-none mt-0.5">Elena Rostova · Staff Interview</h4>
                    </div>
                  </div>
                  <div className="bg-[#0c120f] px-2 py-0.5 rounded-md border border-white/10 text-[10px] font-mono text-emerald-300">
                    01:23:08
                  </div>
                </div>

                {/* Main Video Stage with Vertical Thumbnails */}
                <div className="flex-1 flex gap-2.5 min-h-[260px] relative">
                  {/* Dominant Speaker Frame */}
                  <div className="flex-1 relative rounded-xl overflow-hidden border border-emerald-500/30 bg-[#040806] shadow-lg flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80"
                      alt="Candidate"
                      className="w-full h-full object-cover filter brightness-100"
                    />

                    {/* Recording pill */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-[#040806]/80 px-2 py-1 rounded-full text-[10px] text-white border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_6px_#f43f5e]" />
                      <span className="font-mono text-[9px] text-emerald-200">14:08 / 60 min</span>
                    </div>

                    {/* Speaker name */}
                    <div className="absolute bottom-2.5 left-2.5 z-10 bg-[#040806]/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Elena Rostova</span>
                    </div>

                    {/* Floating emoji reactions bar */}
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 bg-[#07120c]/90 px-2.5 py-1 rounded-xl border border-emerald-500/40 flex items-center gap-1.5 text-xs shadow-[0_0_16px_rgba(16,185,129,0.25)]">
                      <span>😂</span>
                      <span>🎉</span>
                      <span>👍</span>
                      <span>👎</span>
                      <span>👏</span>
                      <span>😮</span>
                      <span>❤️</span>
                    </div>
                  </div>

                  {/* Right Attendee Vertical Column */}
                  <div className="w-20 flex flex-col gap-1.5 shrink-0">
                    {[
                      { name: 'Sarah', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
                      { name: 'Claire', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
                      { name: 'Devon', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
                    ].map((att, i) => (
                      <div key={i} className="h-16 rounded-lg overflow-hidden relative border border-white/10 bg-[#060a08] shadow-sm">
                        <img src={att.img} alt={att.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 text-[8px] text-white drop-shadow font-medium font-mono">
                          {att.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Call Controls Preview */}
                <div className="h-10 mt-2 px-3 bg-[#08120d] border-t border-emerald-950/70 flex items-center justify-between rounded-lg">
                  <div className="w-6 h-6 rounded btn-metallic flex items-center justify-center text-emerald-400 text-[10px]" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg btn-metallic flex items-center justify-center text-emerald-400"><Mic className="w-3.5 h-3.5" /></div>
                    <div className="w-7 h-7 rounded-lg btn-metallic flex items-center justify-center text-emerald-400"><Video className="w-3.5 h-3.5" /></div>
                    <div className="w-7 h-7 rounded-lg btn-metallic flex items-center justify-center text-emerald-400"><Monitor className="w-3.5 h-3.5" /></div>
                    <div className="h-7 px-3 rounded-lg bg-gradient-to-b from-rose-600 to-rose-900 text-white font-bold text-[10px] flex items-center justify-center shadow-sm">End</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-6 h-6 rounded btn-metallic" />
                    <div className="w-6 h-6 rounded btn-metallic-emerald" />
                  </div>
                </div>
              </div>

              {/* Right Side: Meeting Details Chat Preview in Black and Green */}
              <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-emerald-950/70 bg-[#060b08]/95 p-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-emerald-950/70">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                      <span>Meeting Details</span>
                    </span>
                    <span className="text-[10px] text-emerald-500">✕</span>
                  </div>

                  <div className="flex rounded-lg bg-[#0c120f] p-0.5 text-[10px] font-medium border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
                    <div className="flex-1 py-1 rounded btn-metallic-emerald text-white text-center shadow-[0_0_8px_rgba(16,185,129,0.3)]">Chat</div>
                    <div className="flex-1 py-1 text-emerald-300/70 text-center">Scorecard</div>
                    <div className="flex-1 py-1 text-emerald-300/70 text-center">People (4)</div>
                  </div>

                  <div className="space-y-2 text-[11px] pt-1">
                    <div className="p-2 rounded-xl bg-[#09150f] text-emerald-100 text-[10px] leading-tight border border-emerald-950/80">
                      <span className="font-bold text-emerald-400 block text-[9px] mb-0.5">Martin · 12:05 AM</span>
                      Hey team, everyone ready for the product review?
                    </div>
                    <div className="p-2 rounded-xl btn-metallic-emerald text-white text-[10px] leading-tight text-right ml-4 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                      <span className="font-bold text-emerald-200 block text-[9px] mb-0.5">You · 12:06 AM</span>
                      Yes, Elena is ready on distributed rate limiting!
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-950/70">
                  <span className="btn-metallic-emerald w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Click to Enter Active Room</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics & Benchmark Bar */}
      <section className="py-10 border-y border-emerald-950/80 bg-[#050a07] relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-white font-mono drop-shadow-[0_0_10px_#10b981]">
              &lt; 14ms
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-1">Global WebRTC Latency</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono drop-shadow-[0_0_10px_#10b981]">
              4.6 / 5.0
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-1">Calibrated Bar Raiser Score</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono drop-shadow-[0_0_10px_#10b981]">
              100%
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-1">Objective Rubric Math</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono drop-shadow-[0_0_10px_#10b981]">
              AES-256
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-1">Compliant Stream Encryption</div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            Enterprise Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4">
            Four Core Systems. One Unified Hiring Machine.
          </h2>
          <p className="text-sm text-emerald-200/70 mt-3 leading-relaxed">
            Eliminate fragmented tools, disconnected coding scratchpads, and subjective debrief opinions with an integrated hiring platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                onClick={() => onEnterEnvironment(index === 0 ? 'analytics' : index === 1 ? 'video' : index === 2 ? 'schedule' : 'pipeline')}
                className="p-7 rounded-3xl metallic-card border border-emerald-950/80 hover:border-emerald-500/40 transition-all duration-300 shadow-xl cursor-pointer group space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl btn-metallic flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                    <Icon className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_6px_#10b981]" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-emerald-200/70 leading-relaxed mt-2">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore in console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security & Enterprise Grade */}
      <section id="security" className="py-16 px-6 max-w-7xl mx-auto relative z-10">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0c1811] via-[#070e0a] to-[#0c1811] border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.2)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Enterprise Security & Compliance</h3>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Every interview stream is end-to-end encrypted with zero external data sharing. Full support for SOC2 Type II compliance, automated 7-year audit retention policies, and single-tenant VPC options.
            </p>
          </div>

          <button
            onClick={() => onEnterEnvironment('video')}
            className="btn-metallic-emerald px-6 py-3 rounded-xl text-xs font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] shrink-0"
          >
            Launch Calibrated Room Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-emerald-950/80 bg-[#040806] py-8 px-6 text-xs text-emerald-600 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-sans">
            <Video className="w-4 h-4 text-emerald-400" />
            <span>VantageHire Enterprise Inc.</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-500">
            <span>© 2026 Acme Cloud Systems</span>
            <span>·</span>
            <span>All streams encrypted</span>
            <span>·</span>
            <span>High-Bar Engineering</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
