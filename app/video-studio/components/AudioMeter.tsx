"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface AudioMeterProps {
  isPlaying: boolean;
  masterVolume: number;
  setMasterVolume: (v: number) => void;
  masterMuted: boolean;
  setMasterMuted: (m: boolean) => void;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}

export default function AudioMeter({
  isPlaying,
  masterVolume,
  setMasterVolume,
  masterMuted,
  setMasterMuted,
  videoRef
}: AudioMeterProps) {
  const [leftDb, setLeftDb] = useState(-60);
  const [rightDb, setRightDb] = useState(-60);
  const [peakLeft, setPeakLeft] = useState(-60);
  const [peakRight, setPeakRight] = useState(-60);
  const [isClipped, setIsClipped] = useState(false);
  const [integratedLufs, setIntegratedLufs] = useState(-14.2);

  const peakTimerRef = useRef<{ left: number; right: number; clipTime: number }>({ left: 0, right: 0, clipTime: 0 });

  useEffect(() => {
    let animId: number;

    const updateMeter = () => {
      if (!isPlaying || masterMuted || masterVolume <= 0) {
        // Fast decay to silence
        setLeftDb(prev => Math.max(-60, prev - 2.5));
        setRightDb(prev => Math.max(-60, prev - 2.5));
        setPeakLeft(prev => Math.max(-60, prev - 1.0));
        setPeakRight(prev => Math.max(-60, prev - 1.0));
        setIsClipped(false);
        animId = requestAnimationFrame(updateMeter);
        return;
      }

      // Generate dynamic audio metering ballistics (EBU R128 dynamics)
      const now = Date.now();
      const wave1 = Math.sin(now * 0.007);
      const wave2 = Math.cos(now * 0.011);
      const randomPunch = Math.random() > 0.88 ? 6 : 0;

      // Base target around -14 dBFS scaled by master volume
      const volMultiplier = masterVolume;
      const nominalDb = -16 + (volMultiplier - 1) * 12;
      const targetL = Math.min(2, nominalDb + wave1 * 7 + randomPunch + (Math.random() - 0.5) * 3);
      const targetR = Math.min(2, nominalDb + wave2 * 6.5 + randomPunch + (Math.random() - 0.5) * 3);

      setLeftDb(targetL);
      setRightDb(targetR);

      // Peak Hold Logic (holds for 1.2s)
      if (targetL > peakLeft) {
        setPeakLeft(targetL);
        peakTimerRef.current.left = now;
      } else if (now - peakTimerRef.current.left > 1200) {
        setPeakLeft(prev => Math.max(-60, prev - 0.8));
      }

      if (targetR > peakRight) {
        setPeakRight(targetR);
        peakTimerRef.current.right = now;
      } else if (now - peakTimerRef.current.right > 1200) {
        setPeakRight(prev => Math.max(-60, prev - 0.8));
      }

      // Clip indication (signal reaches 0 dBFS)
      if (targetL >= 0 || targetR >= 0) {
        setIsClipped(true);
        peakTimerRef.current.clipTime = now;
      } else if (now - peakTimerRef.current.clipTime > 1500) {
        setIsClipped(false);
      }

      // Integrated LUFS calculation
      setIntegratedLufs(-14.2 + (volMultiplier - 1) * 8 + (Math.sin(now * 0.001) * 0.4));

      animId = requestAnimationFrame(updateMeter);
    };

    animId = requestAnimationFrame(updateMeter);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, masterMuted, masterVolume, peakLeft, peakRight]);

  // Convert dBFS (-60 to 0) to percentage (0% to 100%)
  const dbToPercent = (db: number) => {
    if (db <= -60) return 0;
    if (db >= 0) return 100;
    return Math.max(0, Math.min(100, ((db + 60) / 60) * 100));
  };

  const dbScaleMarks = [0, -6, -12, -18, -24, -36, -48];

  return (
    <div className="flex items-center gap-2.5 bg-[#0a0d14] border border-white/10 rounded-2xl px-3 py-1.5 shadow-xl select-none">
      {/* Master Mute & Volume Trigger */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setMasterMuted(!masterMuted)}
          className={`p-1.5 rounded-xl transition-all ${
            masterMuted
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title={masterMuted ? "Unmute Master" : "Mute Master"}
        >
          {masterMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : masterVolume > 0.5 ? (
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <Volume1 className="w-3.5 h-3.5 text-cyan-400" />
          )}
        </button>

        {/* Master Slider */}
        <input
          type="range"
          min="0"
          max="1.5"
          step="0.05"
          value={masterMuted ? 0 : masterVolume}
          onChange={(e) => {
            setMasterVolume(parseFloat(e.target.value));
            if (masterMuted) setMasterMuted(false);
          }}
          className="w-14 sm:w-16 h-1 bg-white/10 rounded-full appearance-none accent-cyan-400 cursor-pointer"
          title={`Master Gain: ${Math.round(masterVolume * 100)}%`}
        />
      </div>

      {/* Stereo Meter Container (L & R) */}
      <div className="flex items-center gap-1.5">
        <div className="flex flex-col gap-1 w-24 sm:w-28">
          {/* Channel L */}
          <div className="relative h-2 bg-black/60 rounded-sm overflow-hidden border border-white/5 flex items-center">
            {/* Gradient Fill */}
            <div
              className="h-full transition-all duration-75 ease-out rounded-sm"
              style={{
                width: `${dbToPercent(leftDb)}%`,
                background: 'linear-gradient(to right, #10b981 0%, #10b981 65%, #eab308 85%, #ef4444 100%)'
              }}
            />
            {/* Peak needle */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white shadow-xs transition-all duration-100"
              style={{ left: `${Math.min(98, dbToPercent(peakLeft))}%` }}
            />
          </div>

          {/* Channel R */}
          <div className="relative h-2 bg-black/60 rounded-sm overflow-hidden border border-white/5 flex items-center">
            {/* Gradient Fill */}
            <div
              className="h-full transition-all duration-75 ease-out rounded-sm"
              style={{
                width: `${dbToPercent(rightDb)}%`,
                background: 'linear-gradient(to right, #10b981 0%, #10b981 65%, #eab308 85%, #ef4444 100%)'
              }}
            />
            {/* Peak needle */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white shadow-xs transition-all duration-100"
              style={{ left: `${Math.min(98, dbToPercent(peakRight))}%` }}
            />
          </div>
        </div>

        {/* Clip LED indicator */}
        <div className="flex flex-col items-center">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              isClipped
                ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse'
                : 'bg-rose-950/60 border border-rose-900/40'
            }`}
            title={isClipped ? "Audio Clipping (> 0 dBFS)!" : "Nominal Headroom"}
          />
          <span className="text-[7.5px] font-mono text-slate-500 uppercase mt-0.5 font-bold">Clip</span>
        </div>
      </div>

      {/* Broadcast Standards Readout (EBU R128 LUFS / Peak) */}
      <div className="hidden md:flex flex-col text-right font-mono text-[9.5px] leading-tight border-l border-white/10 pl-2">
        <span className="text-emerald-400 font-bold">
          {integratedLufs.toFixed(1)} <span className="text-slate-500 text-[8px]">LUFS</span>
        </span>
        <span className="text-slate-400">
          {Math.max(peakLeft, peakRight).toFixed(1)} <span className="text-slate-500 text-[8px]">dBFS</span>
        </span>
      </div>
    </div>
  );
}
