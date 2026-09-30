"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  LayoutTemplate, 
  Image as ImageIcon, 
  Type, 
  Wand2, 
  Music, 
  Video, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { LazyLoopVideo, SHOWCASE_MEDIA } from "@/components/home-new/ShowcaseMedia";

const REEL_SECONDS = 12;
const SEGMENTS = [
  { label: "Racetrack selfie", start: 0, dur: 3.5, thumb: "video-studio-clip1.jpg" },
  { label: "Neon street drift", start: 3.5, dur: 2.5, thumb: "video-studio-clip2.jpg" },
  { label: "Stadium concert", start: 6, dur: 3.5, thumb: "video-studio-clip3.jpg" },
  { label: "Tiny me (AI Action Figure)", start: 9.5, dur: 2.5, thumb: "video-studio-clip4.jpg" },
];

function segmentAt(t: number) {
  for (let i = SEGMENTS.length - 1; i >= 0; i--) if (t >= SEGMENTS[i].start) return i;
  return 0;
}

function timecode(t: number) {
  const s = Math.max(0, Math.floor(t));
  return `0:${s < 10 ? "0" : ""}${s}`;
}

export function CourseVideoStudioShowcase() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playheadRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLSpanElement | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  // Move the playhead with the video in real-time
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
    const onSeeked = () => {
      if (!v.paused) return;
      tick();
      stop();
    };
    v.addEventListener("play", start);
    v.addEventListener("pause", stop);
    v.addEventListener("seeked", onSeeked);
    if (!v.paused) start();
    return () => {
      stop();
      v.removeEventListener("play", start);
      v.removeEventListener("pause", stop);
      v.removeEventListener("seeked", onSeeked);
    };
  }, []);

  const jumpTo = (i: number) => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.currentTime = SEGMENTS[i].start + 0.05;
      v.play?.().catch(() => undefined);
    } catch {
      // ignore seek race
    }
  };

  const scrollToEnroll = () => {
    const el = document.querySelector("[data-enroll]");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full my-6">
      <SpotlightCard
        radius="1.75rem"
        beamColor="rgba(59, 130, 246, 0.85)"
        glowColor="rgba(37, 99, 235, 0.12)"
        className="shadow-[0_0_50px_rgba(37,99,235,0.12)] overflow-hidden"
        innerClassName="bg-[#08090d]/90 backdrop-blur-3xl p-5 sm:p-7 md:p-9 border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
      >
        {/* Background Dot Grid */}
        <div className="absolute top-1/4 right-6 w-48 h-48 bg-[radial-gradient(circle,rgba(37,99,235,0.15)_2px,transparent_2px)] [background-size:20px_20px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-16 left-6 w-40 h-40 bg-[radial-gradient(circle,rgba(37,99,235,0.15)_2px,transparent_2px)] [background-size:20px_20px] opacity-60 pointer-events-none" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10">
          {/* Header Section */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                Hands-On Editing Studio
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-2 tracking-tight">
              Create. Edit. Inspire.
              <br />
              <span className="text-blue-500">Viral Short-Form Studio</span>
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-xl">
              See the exact timeline workflows taught in this masterclass — from 1.5s retention hooks to AI clone transitions and audio layering. Click any clip to scrub!
            </p>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative w-full h-[400px] sm:h-[430px] md:h-[450px] mb-6 flex items-center justify-center">
            
            {/* Center Video Preview Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute top-0 md:top-4 md:left-1/2 md:-translate-x-1/2 w-full md:w-[480px] h-[220px] sm:h-[250px] bg-[#0d0d0d] rounded-2xl border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.15)] overflow-hidden flex items-center justify-center z-20"
            >
              {/* The showcase reel (muted loop from Cloudflare R2) */}
              <LazyLoopVideo
                videoRef={videoRef}
                src={`${SHOWCASE_MEDIA}video-studio-reel.mp4`}
                poster={`${SHOWCASE_MEDIA}video-studio-reel.jpg`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />

              {/* Now playing indicator */}
              <div className="absolute bottom-3 left-3 sm:left-14 right-3 z-20 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white">
                  <Play className="w-3 h-3 text-blue-400 fill-current" />
                  {SEGMENTS[active].label}
                </span>
                <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-200">
                  Clip {active + 1}/{SEGMENTS.length}
                </span>
              </div>

              {/* Mock Aspect Ratio / Camera Controls */}
              <div className="hidden sm:flex absolute top-3 left-3 flex-col gap-2 z-20">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-5 h-5 rounded border border-white/20 bg-black/50 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 border border-white/50 rounded-xs" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Left Sidebar Tools */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col items-center gap-4 py-4 w-20 bg-[#0d0d0d]/85 backdrop-blur-xl rounded-2xl border border-blue-500/20 shadow-[0_0_25px_rgba(37,99,235,0.1)] z-30"
            >
              {[
                { icon: LayoutTemplate, label: "Hooks" },
                { icon: ImageIcon, label: "B-Roll" },
                { icon: Type, label: "Captions" },
                { icon: Wand2, label: "AI Magic" },
                { icon: Music, label: "Sound FX" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 cursor-pointer group">
                  <item.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  <span className="text-[8px] text-slate-400 group-hover:text-blue-400 font-medium uppercase tracking-wider transition-colors">{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Right floating badges */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex absolute right-1 top-1/2 -translate-y-1/2 flex-col gap-3 z-30"
            >
              <div className="w-16 h-16 bg-[#0d0d0d] rounded-2xl border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:border-blue-400 transition-colors cursor-pointer group">
                <Video className="w-6 h-6 text-blue-500 group-hover:text-blue-400 group-hover:scale-110 transition-all fill-current" />
              </div>
              <div className="w-16 h-16 bg-[#0d0d0d] rounded-2xl border border-indigo-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:border-indigo-400 transition-colors cursor-pointer group">
                <span className="text-2xl font-black bg-gradient-to-br from-indigo-400 to-purple-500 bg-clip-text text-transparent group-hover:scale-110 transition-all">AI</span>
              </div>
            </motion.div>

            {/* Bottom Timeline Mock */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute bottom-0 w-full md:w-[94%] h-28 bg-[#0d0d0d]/95 backdrop-blur-xl rounded-2xl border border-blue-500/20 shadow-[0_0_35px_rgba(37,99,235,0.15)] overflow-hidden z-30"
            >
              {/* Timeline Header */}
              <div className="flex items-center px-3.5 py-1.5 border-b border-white/5 bg-black/30">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                <div className="flex gap-3 text-[9px] text-slate-500 font-mono tracking-widest opacity-60">
                  <span>0:00</span><span>0:03</span><span>0:06</span><span>0:09</span><span>0:12</span>
                </div>
                <span ref={timeRef} className="ml-auto text-[10px] font-mono text-blue-400 font-bold">0:00</span>
              </div>
              
              {/* Video Track with Thumbnails */}
              <div className="px-3.5 py-2.5 border-b border-white/5">
                <div className="relative flex gap-1.5 items-center">
                  {/* Playhead */}
                  <div
                    ref={playheadRef}
                    className="absolute -top-2.5 -bottom-2.5 w-px bg-blue-500 z-10 shadow-[0_0_10px_rgba(59,130,246,1)] pointer-events-none"
                    style={{ left: "0%" }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-xs border-2 border-blue-500" />
                  </div>
                  {SEGMENTS.map((seg, i) => (
                    <button
                      key={seg.label}
                      type="button"
                      onClick={() => jumpTo(i)}
                      title={seg.label}
                      aria-label={`Jump to ${seg.label}`}
                      className={`h-9 min-w-0 rounded border overflow-hidden transition-all cursor-pointer ${
                        i === active ? "border-blue-400 opacity-100 ring-1 ring-blue-400/60" : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                      style={{
                        flex: `${seg.dur} 1 0%`,
                        backgroundImage: `url(${SHOWCASE_MEDIA}${seg.thumb})`,
                        backgroundSize: "auto 100%",
                        backgroundRepeat: "repeat-x",
                        backgroundColor: "#1e293b",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Audio Waveform Track */}
              <div className="px-3.5 py-1.5 flex items-center opacity-70">
                <div className="w-full h-4 flex items-center justify-between gap-[2px]">
                  {[30,55,80,45,70,95,40,60,85,35,65,90,50,75,25,80,45,70,55,85,30,60,90,40,75,50,65,35,80,55,70,25,90,45,60,85,30,75,50,95,40,65,80,35,55,70,45,85,60,30,75,90,50,40,65,35,80,55,70,25,85,45,60,90,30,75,50,95,40,65,80,35,55].map((h, i) => (
                    <div key={i} className="w-1 bg-blue-500/50 rounded-full" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </motion.div>

          </div>

          {/* Action Button */}
          <div className="w-full flex justify-center mt-6 relative z-40">
            <button 
              type="button"
              onClick={scrollToEnroll}
              className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-blue-400/40 bg-blue-500/15 hover:bg-blue-500/25 text-blue-200 hover:text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-[0_0_25px_rgba(59,130,246,0.25)] hover:shadow-[0_0_35px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98] backdrop-blur-xl cursor-pointer"
            >
              <span>Master These Editing Workflows in Batch 04</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </SpotlightCard>
    </div>
  );
}
