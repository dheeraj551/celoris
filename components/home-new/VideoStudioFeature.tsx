"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  LayoutTemplate, 
  Image as ImageIcon, 
  Type, 
  Wand2, 
  Music, 
  Video, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { LazyLoopVideo, SHOWCASE_MEDIA } from './ShowcaseMedia';

// The showcase reel: four AI clips of the same character cut into one 12s
// loop (one small muted file from Cloudflare R2). The timeline below follows
// the playing video, and clicking a clip jumps to it.
const REEL_SECONDS = 12;
const SEGMENTS = [
  { label: 'Racetrack selfie', start: 0, dur: 3.5, thumb: 'video-studio-clip1.jpg' },
  { label: 'Neon street drift', start: 3.5, dur: 2.5, thumb: 'video-studio-clip2.jpg' },
  { label: 'Stadium concert', start: 6, dur: 3.5, thumb: 'video-studio-clip3.jpg' },
  { label: 'Tiny me', start: 9.5, dur: 2.5, thumb: 'video-studio-clip4.jpg' },
];

function segmentAt(t: number) {
  for (let i = SEGMENTS.length - 1; i >= 0; i--) if (t >= SEGMENTS[i].start) return i;
  return 0;
}

function timecode(t: number) {
  const s = Math.max(0, Math.floor(t));
  return `0:${s < 10 ? '0' : ''}${s}`;
}

export function VideoStudioFeature() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playheadRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  // Move the playhead with the video (straight on the DOM — no re-render per frame).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    const tick = () => {
      const t = (v.currentTime || 0) % REEL_SECONDS;
      if (playheadRef.current) playheadRef.current.style.left = `${(t / REEL_SECONDS) * 100}%`;
      if (timeRef.current) timeRef.current.textContent = timecode(t);
      const i = segmentAt(t);
      if (i !== activeRef.current) {
        activeRef.current = i;
        setActive(i);
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const stop = () => cancelAnimationFrame(raf);
    // A jump while paused still moves the playhead once.
    const onSeeked = () => {
      if (!v.paused) return;
      tick();
      stop();
    };
    v.addEventListener('play', start);
    v.addEventListener('pause', stop);
    v.addEventListener('seeked', onSeeked);
    if (!v.paused) start();
    return () => {
      stop();
      v.removeEventListener('play', start);
      v.removeEventListener('pause', stop);
      v.removeEventListener('seeked', onSeeked);
    };
  }, []);

  const jumpTo = (i: number) => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.currentTime = SEGMENTS[i].start + 0.05;
      v.play?.().catch(() => undefined);
    } catch {
      // not loaded yet
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-32 px-4">
      <SpotlightCard
        radius="2.5rem"
        beamColor="rgba(59, 130, 246, 0.85)"
        glowColor="rgba(37, 99, 235, 0.12)"
        className="shadow-[0_0_80px_rgba(37,99,235,0.12)]"
        innerClassName="bg-[#08090d]/85 backdrop-blur-3xl p-8 md:p-16 border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
      >

        {/* Background Dot Grid */}
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-[radial-gradient(circle,rgba(37,99,235,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-[radial-gradient(circle,rgba(37,99,235,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          {/* Header Section */}
          <div className="mb-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                AI Video Creation
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 tracking-tight">
              Video Studio
              <br />
              <span className="text-blue-500">Create. Edit. Inspire.</span>
            </h2>
            
            <p className="text-lg text-slate-300 font-light leading-relaxed max-w-xl">
              AI-powered video creation, smart editing tools, and stunning templates to bring your ideas to life.
            </p>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[500px] mb-12 flex items-center justify-center">
            
            {/* Center Video Preview Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute md:top-10 md:left-1/2 md:-translate-x-1/2 w-[85%] md:w-[600px] h-[250px] md:h-[300px] bg-[#0d0d0d] rounded-2xl border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.15)] overflow-hidden flex items-center justify-center z-20"
            >
              {/* The showcase reel (muted loop from Cloudflare R2) */}
              <LazyLoopVideo
                videoRef={videoRef}
                src={`${SHOWCASE_MEDIA}video-studio-reel.mp4`}
                poster={`${SHOWCASE_MEDIA}video-studio-reel.jpg`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />

              {/* Now playing */}
              <div className="absolute bottom-3 left-14 right-3 z-20 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white">
                  <Play className="w-3 h-3 text-blue-400" fill="currentColor" />
                  {SEGMENTS[active].label}
                </span>
                <span className="px-2 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-200">
                  Clip {active + 1}/{SEGMENTS.length}
                </span>
              </div>

              {/* Mock Video Controls UI */}
              <div className="absolute top-4 left-4 flex flex-col gap-3 z-20">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded border border-white/20 bg-black/40 flex items-center justify-center">
                    <div className="w-3 h-3 border border-white/50 rounded-sm" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Left Sidebar Tools */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col items-center gap-6 py-6 w-24 bg-[#0d0d0d]/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)] z-30"
            >
              {[
                { icon: LayoutTemplate, label: 'Templates' },
                { icon: ImageIcon, label: 'Media' },
                { icon: Type, label: 'Text' },
                { icon: Wand2, label: 'Effects' },
                { icon: Music, label: 'Music' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  <span className="text-[9px] text-slate-400 group-hover:text-blue-400 font-medium uppercase tracking-widest transition-colors">{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Right floating buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-4 z-30"
            >
              <div className="w-20 h-20 bg-[#0d0d0d] rounded-2xl border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:border-blue-400 transition-colors cursor-pointer group">
                <Video className="w-8 h-8 text-blue-500 group-hover:text-blue-400 group-hover:scale-110 transition-all" fill="currentColor" />
              </div>
              <div className="w-20 h-20 bg-[#0d0d0d] rounded-2xl border border-indigo-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:border-indigo-400 transition-colors cursor-pointer group">
                <span className="text-3xl font-black bg-gradient-to-br from-indigo-400 to-purple-500 bg-clip-text text-transparent group-hover:scale-110 transition-all">AI</span>
              </div>
            </motion.div>

            {/* Bottom Timeline Mock */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="absolute bottom-0 w-[95%] md:w-[85%] h-32 bg-[#0d0d0d]/90 backdrop-blur-xl rounded-2xl border border-blue-500/20 shadow-[0_0_40px_rgba(37,99,235,0.15)] overflow-hidden z-30"
            >
              {/* Timeline Header */}
              <div className="flex items-center px-4 py-2 border-b border-white/5 bg-black/20">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-4" />
                <div className="flex gap-4 text-[10px] text-slate-500 font-mono tracking-widest opacity-50">
                  <span>0:00</span><span>0:03</span><span>0:06</span><span>0:09</span><span>0:12</span>
                </div>
                <span ref={timeRef} className="ml-auto text-[10px] font-mono text-blue-300">0:00</span>
              </div>
              
              {/* Video Track */}
              <div className="px-4 py-3 border-b border-white/5">
                <div className="relative flex gap-1.5 items-center">
                  {/* Playhead (follows the reel) */}
                  <div
                    ref={playheadRef}
                    className="absolute -top-3 -bottom-3 w-px bg-blue-500 z-10 shadow-[0_0_10px_rgba(59,130,246,1)] pointer-events-none"
                    style={{ left: '0%' }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-sm border-2 border-blue-500" />
                  </div>
                  {SEGMENTS.map((seg, i) => (
                    <button
                      key={seg.label}
                      type="button"
                      onClick={() => jumpTo(i)}
                      title={seg.label}
                      aria-label={`Jump to ${seg.label}`}
                      className={`h-12 min-w-0 rounded border overflow-hidden transition-all cursor-pointer ${
                        i === active ? 'border-blue-400 opacity-100 ring-1 ring-blue-400/60' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                      style={{
                        flex: `${seg.dur} 1 0%`,
                        backgroundImage: `url(${SHOWCASE_MEDIA}${seg.thumb})`,
                        backgroundSize: 'auto 100%',
                        backgroundRepeat: 'repeat-x',
                        backgroundColor: '#1e293b',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Audio Track */}
              <div className="px-4 py-2 flex items-center opacity-70">
                 <div className="w-full h-6 flex items-center justify-between gap-[2px]">
                   {[30,55,80,45,70,95,40,60,85,35,65,90,50,75,25,80,45,70,55,85,30,60,90,40,75,50,65,35,80,55,70,25,90,45,60,85,30,75,50,95,40,65,80,35,55,70,45,85,60,30,75,90,50,40,65,35,80,55,70,25,85,45,60,90,30,75,50,95,40,65,80,35,55,70,45,85,60,30,75,50,40,65,35,80,55,70,25,85,45,60,90,30,75,50,95,40,65,80,35,55].map((h, i) => (
                     <div key={i} className="w-1 bg-blue-500/50 rounded-full" style={{ height: `${h}%` }} />
                   ))}
                 </div>
              </div>
            </motion.div>

          </div>

          {/* Action Button */}
          <div className="w-full flex justify-center mt-16 relative z-40">
            <Link 
              href="/video-studio" 
              className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full border border-blue-400/40 bg-blue-500/15 hover:bg-blue-500/25 text-blue-200 hover:text-white font-medium text-sm transition-all duration-300 shadow-[0_0_25px_rgba(59,130,246,0.25)] hover:shadow-[0_0_35px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98] backdrop-blur-xl"
            >
              <span>Explore Video Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </SpotlightCard>
    </div>
  );
}
