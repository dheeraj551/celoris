"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Film,
  Layers,
} from "lucide-react";
import { createClient } from "@/lib/supabase-client";

export interface ReelRoleSlide {
  badge: string;
  title: string;
  subtitle: string;
  engagement: string;
  skills: string[];
  accent: string;
}

type ThemeKey = "emerald" | "amber" | "cyan";

const THEMES: Record<
  ThemeKey,
  {
    name: string;
    bgTop: string;
    bgBottom: string;
    primary: string;
    secondary: string;
    ctaBg: string;
    ctaText: string;
    glowA: string;
    glowB: string;
  }
> = {
  emerald: {
    name: "Celoris Emerald",
    bgTop: "#050A0E",
    bgBottom: "#030507",
    primary: "#10B981",
    secondary: "#FACC15",
    ctaBg: "#FACC15",
    ctaText: "#09090B",
    glowA: "rgba(16, 185, 129, 0.28)",
    glowB: "rgba(250, 204, 21, 0.16)",
  },
  amber: {
    name: "Urgent Alert",
    bgTop: "#0D0905",
    bgBottom: "#050506",
    primary: "#F59E0B",
    secondary: "#EF4444",
    ctaBg: "#FACC15",
    ctaText: "#09090B",
    glowA: "rgba(245, 158, 11, 0.30)",
    glowB: "rgba(239, 68, 68, 0.18)",
  },
  cyan: {
    name: "Electric Tech",
    bgTop: "#040A10",
    bgBottom: "#030508",
    primary: "#0EA5E9",
    secondary: "#FACC15",
    ctaBg: "#FACC15",
    ctaText: "#09090B",
    glowA: "rgba(14, 165, 233, 0.28)",
    glowB: "rgba(16, 185, 129, 0.18)",
  },
};

const DEFAULT_ROLES: ReelRoleSlide[] = [
  {
    badge: "ROLE 01 · CERTIFIED",
    title: "Website Enhancement & API Integration Specialist",
    subtitle: "Digital Web & Integration Partner · Remote",
    engagement: "Project-Based · Milestone Scoped",
    skills: ["PHP / HTML / JS", "REST & GraphQL APIs", "Webhooks", "SEM & Analytics"],
    accent: "#0EA5E9",
  },
  {
    badge: "ROLE 02 · CERTIFIED",
    title: "Short-Form Video Editor (Instagram Reels)",
    subtitle: "Celoris Creator & Viral Media Partner · Remote",
    engagement: "Ongoing Weekly Batches · 15–45s Reels",
    skills: ["Premiere / AE / DaVinci", "Speed Ramps & Cuts", "Kinetic Captions", "9:16 Viral Pacing"],
    accent: "#F59E0B",
  },
  {
    badge: "ROLE 03 · CERTIFIED",
    title: "Full-Stack Web & Mobile MVP Developer",
    subtitle: "Venture & Digital Product Partner · Remote",
    engagement: "Project-Based · Monetization & MVP",
    skills: ["Web + iOS / Mobile", "Stripe / Razorpay / IAP", "AdMob / Subscriptions", "UI/UX Design"],
    accent: "#10B981",
  },
];

const CANVAS_W = 1080;
const CANVAS_H = 1920;
const DURATION_SEC = 18;
const FPS = 30;

// Easing helpers
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOutCubic(t: number) {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

function easeOutBack(t: number) {
  const x = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Synthesizes a subtle, clean electronic beat + scene transition whooshes via Web Audio API
function scheduleReelAudio(
  audioCtx: AudioContext,
  dest: AudioNode,
  startTime: number
) {
  const bpm = 120;
  const beatDur = 60 / bpm; // 0.5s
  const totalBeats = Math.floor(DURATION_SEC / beatDur);

  for (let b = 0; b < totalBeats; b++) {
    const t = startTime + b * beatDur;

    // Soft punchy kick on every beat
    const kickOsc = audioCtx.createOscillator();
    const kickGain = audioCtx.createGain();
    kickOsc.type = "sine";
    kickOsc.frequency.setValueAtTime(128, t);
    kickOsc.frequency.exponentialRampToValueAtTime(42, t + 0.11);
    kickGain.gain.setValueAtTime(0.24, t);
    kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    kickOsc.connect(kickGain);
    kickGain.connect(dest);
    kickOsc.start(t);
    kickOsc.stop(t + 0.15);

    // Subtle hi-hat tick on off-beats
    if (b % 2 === 1) {
      const bufferSize = audioCtx.sampleRate * 0.04;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 7000;

      const hatGain = audioCtx.createGain();
      hatGain.gain.setValueAtTime(0.05, t);
      hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      whiteNoise.connect(filter);
      filter.connect(hatGain);
      hatGain.connect(dest);
      whiteNoise.start(t);
      whiteNoise.stop(t + 0.045);
    }
  }

  // Scene change pops/chimes at 0s, 2.5s, 6.5s, 10.5s, 14.5s
  const sceneTimes = [0, 2.5, 6.5, 10.5, 14.5];
  const notes = [523.25, 587.33, 659.25, 783.99, 1046.5];
  sceneTimes.forEach((sec, idx) => {
    const t = startTime + sec;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(notes[idx] * 0.75, t);
    osc.frequency.exponentialRampToValueAtTime(notes[idx], t + 0.09);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 0.26);
  });
}

export function JobAlertReelStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Template state
  const [themeKey, setThemeKey] = useState<ThemeKey>("emerald");
  const [alertPill, setAlertPill] = useState("CERTIFIED JOB ALERT");
  const [hookLine1, setHookLine1] = useState("3 NEW REMOTE");
  const [hookLine2, setHookLine2] = useState("CERTIFIED ROLES");
  const [hookSub, setHookSub] = useState("No endless bidding. Pass 10-min skill exam & apply directly.");
  const [ctaKeyword, setCtaKeyword] = useState("JOBS");
  const [ctaUrl, setCtaUrl] = useState("celorisdesigns.com/job-center");
  const [roles, setRoles] = useState<ReelRoleSlide[]>(DEFAULT_ROLES);

  // Playback & UI state
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportDoneMsg, setExportDoneMsg] = useState<string | null>(null);
  const [syncingJobs, setSyncingJobs] = useState(false);

  const timeRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);

  const renderFrame = useCallback(
    (ctx: CanvasRenderingContext2D, t: number, includeSafeZoneOverlay: boolean) => {
      const theme = THEMES[themeKey];

      // 1. Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      bgGrad.addColorStop(0, theme.bgTop);
      bgGrad.addColorStop(1, theme.bgBottom);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // 2. Animated subtle ambient radial glows
      const orb1X = CANVAS_W * (0.25 + 0.12 * Math.sin(t * 0.7));
      const orb1Y = CANVAS_H * (0.22 + 0.06 * Math.cos(t * 0.5));
      const gradA = ctx.createRadialGradient(orb1X, orb1Y, 40, orb1X, orb1Y, 540);
      gradA.addColorStop(0, theme.glowA);
      gradA.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradA;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      const orb2X = CANVAS_W * (0.78 + 0.1 * Math.cos(t * 0.6));
      const orb2Y = CANVAS_H * (0.74 + 0.07 * Math.sin(t * 0.8));
      const gradB = ctx.createRadialGradient(orb2X, orb2Y, 40, orb2X, orb2Y, 520);
      gradB.addColorStop(0, theme.glowB);
      gradB.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradB;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // 3. Subtle moving tech grid
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.035)";
      ctx.lineWidth = 1.5;
      const gridSize = 72;
      const gridOffset = (t * 28) % gridSize;
      for (let x = 0; x <= CANVAS_W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_H);
        ctx.stroke();
      }
      for (let y = -gridSize + gridOffset; y <= CANVAS_H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_W, y);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Persistent Top Header (inside safe zone: y ~ 170)
      ctx.save();
      // Celoris brand mark pill
      drawRoundedRect(ctx, 84, 155, 290, 64, 32);
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Live dot
      const pulse = 0.65 + 0.35 * Math.sin(t * 8);
      ctx.beginPath();
      ctx.arc(122, 187, 10, 0, Math.PI * 2);
      ctx.fillStyle = theme.primary;
      ctx.globalAlpha = pulse;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 28px Inter, system-ui, -apple-system, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText("CELORIS JOBS", 148, 188);

      // Right top indicator (Scene counter)
      const sceneLabel =
        t < 2.5
          ? "LIVE ALERT"
          : t < 6.5
          ? "01 / 03"
          : t < 10.5
          ? "02 / 03"
          : t < 14.5
          ? "03 / 03"
          : "APPLY NOW";

      drawRoundedRect(ctx, CANVAS_W - 294, 155, 210, 64, 32);
      ctx.fillStyle = "rgba(250, 204, 21, 0.14)";
      ctx.fill();
      ctx.strokeStyle = "rgba(250, 204, 21, 0.45)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#FACC15";
      ctx.font = "800 25px Inter, system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(sceneLabel, CANVAS_W - 189, 188);
      ctx.textAlign = "left";
      ctx.restore();

      // 5. Scene Timeline
      // Scene 1: 0.0 - 2.5s (Hook)
      if (t < 2.5) {
        const localT = t;
        const enter = easeOutBack(localT / 0.45);
        const exit = localT > 2.15 ? 1 - clamp01((localT - 2.15) / 0.35) : 1;

        ctx.save();
        ctx.globalAlpha = clamp01(localT / 0.2) * exit;
        ctx.translate(CANVAS_W / 2, CANVAS_H / 2 - 40);
        const scale = 0.85 + 0.15 * enter;
        ctx.scale(scale, scale);

        // Urgent Alert Badge
        const pillW = 540;
        const pillH = 76;
        drawRoundedRect(ctx, -pillW / 2, -330, pillW, pillH, 38);
        ctx.fillStyle = "rgba(239, 68, 68, 0.18)";
        ctx.fill();
        ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#FCA5A5";
        ctx.font = "800 30px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`●  ${alertPill.toUpperCase()}`, 0, -292);

        // Big Hook Headline
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "900 104px Inter, system-ui, sans-serif";
        ctx.fillText(hookLine1.toUpperCase(), 0, -140);

        ctx.fillStyle = theme.secondary;
        ctx.font = "900 104px Inter, system-ui, sans-serif";
        ctx.fillText(hookLine2.toUpperCase(), 0, -20);

        // Accent divider bar
        const barW = 240 * easeOutCubic(localT / 0.6);
        drawRoundedRect(ctx, -barW / 2, 70, barW, 10, 5);
        ctx.fillStyle = theme.primary;
        ctx.fill();

        // Subtitle wrapped
        ctx.fillStyle = "#CBD5E1";
        ctx.font = "500 40px Inter, system-ui, sans-serif";
        const subLines = wrapTextLines(ctx, hookSub, 820);
        subLines.forEach((line, idx) => {
          ctx.fillText(line, 0, 155 + idx * 56);
        });

        // Bottom Swipe / Watch cue
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "700 30px Inter, system-ui, sans-serif";
        ctx.fillText("WATCH ALL 3 ROLES  →", 0, 390);
        ctx.restore();
      }

      // Scenes 2, 3, 4: Role Cards (2.5-6.5, 6.5-10.5, 10.5-14.5)
      if (t >= 2.5 && t < 14.5) {
        const roleIdx = t < 6.5 ? 0 : t < 10.5 ? 1 : 2;
        const sceneStart = 2.5 + roleIdx * 4.0;
        const localT = t - sceneStart;
        const role = roles[roleIdx] || DEFAULT_ROLES[0];

        const slideIn = easeOutCubic(localT / 0.42);
        const slideOut = localT > 3.65 ? clamp01((localT - 3.65) / 0.35) : 0;
        const xOffset = (1 - slideIn) * 180 - slideOut * 180;
        const alpha = clamp01(localT / 0.22) * (1 - slideOut);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(xOffset, 0);

        // Main Glass Card (safe-zone centered: x=76, w=928, y=350, h=1070)
        const cardX = 76;
        const cardY = 340;
        const cardW = CANVAS_W - 152;
        const cardH = 1090;

        // Outer glow
        ctx.save();
        ctx.shadowColor = role.accent;
        ctx.shadowBlur = 55;
        ctx.globalAlpha = alpha * 0.22;
        drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 48);
        ctx.fillStyle = role.accent;
        ctx.fill();
        ctx.restore();

        // Card fill
        drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 48);
        const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
        cardGrad.addColorStop(0, "rgba(20, 24, 33, 0.94)");
        cardGrad.addColorStop(1, "rgba(10, 12, 18, 0.98)");
        ctx.fillStyle = cardGrad;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Top colored accent strip inside card
        ctx.save();
        drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 48);
        ctx.clip();
        ctx.fillStyle = role.accent;
        ctx.fillRect(cardX, cardY, cardW, 12);
        ctx.restore();

        // Role Badge Pill
        drawRoundedRect(ctx, cardX + 56, cardY + 68, 410, 62, 31);
        ctx.fillStyle = `${role.accent}26`;
        ctx.fill();
        ctx.strokeStyle = `${role.accent}88`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = role.accent;
        ctx.font = "800 26px Inter, system-ui, sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText(role.badge.toUpperCase(), cardX + 86, cardY + 100);

        // Role Title (Wrapped, Bold)
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "900 66px Inter, system-ui, sans-serif";
        ctx.textBaseline = "top";
        const titleLines = wrapTextLines(ctx, role.title, cardW - 112);
        let cursorY = cardY + 175;
        titleLines.slice(0, 3).forEach((line) => {
          ctx.fillText(line, cardX + 56, cursorY);
          cursorY += 82;
        });

        // Company / Subtitle
        ctx.fillStyle = "#94A3B8";
        ctx.font = "600 34px Inter, system-ui, sans-serif";
        ctx.fillText(role.subtitle, cardX + 56, cursorY + 18);
        cursorY += 86;

        // Engagement / Rate highlight box
        drawRoundedRect(ctx, cardX + 56, cursorY, cardW - 112, 92, 24);
        ctx.fillStyle = "rgba(250, 204, 21, 0.10)";
        ctx.fill();
        ctx.strokeStyle = "rgba(250, 204, 21, 0.35)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#FACC15";
        ctx.font = "800 32px Inter, system-ui, sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText(`⚡  ${role.engagement}`, cardX + 88, cursorY + 47);
        cursorY += 132;

        // Skills label
        ctx.fillStyle = "#64748B";
        ctx.font = "800 24px Inter, system-ui, sans-serif";
        ctx.textBaseline = "top";
        ctx.fillText("KEY SKILLS REQUIRED", cardX + 56, cursorY);
        cursorY += 46;

        // Staggered Skill Pills (2x2 or flowing rows)
        let pillX = cardX + 56;
        let pillY = cursorY;
        const maxPillRight = cardX + cardW - 56;

        role.skills.slice(0, 6).forEach((skill, sIdx) => {
          const skillEnter = easeOutBack((localT - 0.18 - sIdx * 0.1) / 0.35);
          if (skillEnter <= 0.01) return;

          ctx.font = "700 30px Inter, system-ui, sans-serif";
          const textW = ctx.measureText(skill).width;
          const pW = Math.min(textW + 58, cardW - 112);
          const pH = 68;

          if (pillX + pW > maxPillRight) {
            pillX = cardX + 56;
            pillY += pH + 20;
          }

          ctx.save();
          ctx.globalAlpha = alpha * clamp01((localT - 0.15 - sIdx * 0.1) / 0.2);
          ctx.translate(pillX + pW / 2, pillY + pH / 2);
          const sScale = 0.8 + 0.2 * skillEnter;
          ctx.scale(sScale, sScale);

          drawRoundedRect(ctx, -pW / 2, -pH / 2, pW, pH, 20);
          ctx.fillStyle = "rgba(255,255,255,0.07)";
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.16)";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = "#F8FAFC";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(skill, 0, 1);
          ctx.restore();

          pillX += pW + 20;
        });

        // Bottom Card Footer (10-min Exam Attached)
        const footerY = cardY + cardH - 110;
        drawRoundedRect(ctx, cardX + 56, footerY, cardW - 112, 66, 20);
        ctx.fillStyle = "rgba(16, 185, 129, 0.14)";
        ctx.fill();
        ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#34D399";
        ctx.font = "700 27px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✓  10-Min Certification Exam Attached · Direct Apply", CANVAS_W / 2, footerY + 34);

        ctx.restore();
      }

      // Scene 5: 14.5 - 18.0s (Outro CTA)
      if (t >= 14.5) {
        const localT = t - 14.5;
        const enter = easeOutBack(localT / 0.45);
        const fadeOut = localT > 3.2 ? 1 - clamp01((localT - 3.2) / 0.3) : 1;

        ctx.save();
        ctx.globalAlpha = clamp01(localT / 0.2) * fadeOut;
        ctx.translate(CANVAS_W / 2, CANVAS_H / 2 - 40);

        // Steps Pill
        ctx.fillStyle = theme.primary;
        ctx.font = "800 30px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("HOW TO APPLY IN 3 STEPS", 0, -340);

        const steps = [
          "1. Open Celoris Job Center",
          "2. Pass 10-Min Skill Exam",
          "3. Unlock Badge & Apply Direct",
        ];

        steps.forEach((step, i) => {
          const stepEnter = easeOutCubic((localT - i * 0.16) / 0.35);
          const yPos = -230 + i * 110;
          ctx.save();
          ctx.globalAlpha = clamp01(localT / 0.2) * fadeOut * stepEnter;
          ctx.translate(0, (1 - stepEnter) * 30);

          drawRoundedRect(ctx, -390, yPos - 42, 780, 84, 24);
          ctx.fillStyle = "rgba(255,255,255,0.06)";
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.14)";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = "#FFFFFF";
          ctx.font = "700 36px Inter, system-ui, sans-serif";
          ctx.fillText(step, 0, yPos + 1);
          ctx.restore();
        });

        // Big Pulsing Yellow CTA Button
        const ctaPulse = 1 + 0.03 * Math.sin(localT * 10);
        ctx.save();
        ctx.translate(0, 190);
        ctx.scale(enter * ctaPulse, enter * ctaPulse);

        ctx.shadowColor = theme.ctaBg;
        ctx.shadowBlur = 45;
        drawRoundedRect(ctx, -360, -64, 720, 128, 64);
        ctx.fillStyle = theme.ctaBg;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = theme.ctaText;
        ctx.font = "900 48px Inter, system-ui, sans-serif";
        ctx.fillText(`COMMENT "${ctaKeyword.toUpperCase()}" 👇`, 0, 2);
        ctx.restore();

        // URL below CTA
        ctx.fillStyle = "#94A3B8";
        ctx.font = "700 34px Inter, system-ui, sans-serif";
        ctx.fillText(`or visit  ${ctaUrl}`, 0, 345);

        ctx.restore();
      }

      // 6. Global Bottom Progress Bar (inside safe area above IG caption bar: y = 1545)
      const progressRatio = clamp01(t / DURATION_SEC);
      const barX = 84;
      const barY = 1525;
      const barW = CANVAS_W - 168;
      drawRoundedRect(ctx, barX, barY, barW, 12, 6);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fill();

      drawRoundedRect(ctx, barX, barY, Math.max(12, barW * progressRatio), 12, 6);
      ctx.fillStyle = theme.secondary;
      ctx.fill();

      // Brand watermark below bar
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = "700 24px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(ctaUrl.toUpperCase(), CANVAS_W / 2, 1575);
      ctx.textAlign = "left";

      // 7. Optional IG Safe-Zone Guide (ONLY on preview, NEVER on export)
      if (includeSafeZoneOverlay) {
        ctx.save();
        ctx.strokeStyle = "rgba(250, 204, 21, 0.35)";
        ctx.setLineDash([12, 12]);
        ctx.lineWidth = 3;
        // Bottom Reels caption zone (~320px from bottom)
        ctx.strokeRect(12, CANVAS_H - 320, CANVAS_W - 24, 308);
        // Right action icon column (~150px wide)
        ctx.strokeRect(CANVAS_W - 155, 920, 143, 660);

        ctx.fillStyle = "rgba(250, 204, 21, 0.55)";
        ctx.font = "700 22px Inter, system-ui, sans-serif";
        ctx.fillText("IG REELS UI SAFE-ZONE GUIDE (HIDDEN ON EXPORT)", 40, CANVAS_H - 285);
        ctx.restore();
      }
    },
    [themeKey, alertPill, hookLine1, hookLine2, hookSub, ctaKeyword, ctaUrl, roles]
  );

  // Animation playback loop
  useEffect(() => {
    if (isExporting) return;

    let rafId: number;
    const tick = (now: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = now;
      const dt = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;

      if (isPlaying) {
        timeRef.current = (timeRef.current + dt) % DURATION_SEC;
        setCurrentTime(timeRef.current);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) renderFrame(ctx, timeRef.current, showSafeZone);
      }

      rafId = requestAnimationFrame(tick);
    };

    lastFrameRef.current = null;
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isExporting, showSafeZone, renderFrame]);

  // Redraw immediately when scrubbing while paused
  useEffect(() => {
    if (isPlaying || isExporting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) renderFrame(ctx, currentTime, showSafeZone);
  }, [currentTime, isPlaying, isExporting, showSafeZone, renderFrame]);

  // Sync latest 3 active Certified Roles from Supabase
  const handleSyncFromSupabase = async () => {
    setSyncingJobs(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("certified_jobs")
        .select("title, company, location, salary_range, required_skills")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data && data.length > 0) {
        const accents = ["#0EA5E9", "#F59E0B", "#10B981"];
        const mapped: ReelRoleSlide[] = data.map((row: any, i: number) => ({
          badge: `ROLE 0${i + 1} · CERTIFIED`,
          title: row.title || `Certified Role ${i + 1}`,
          subtitle: `${row.company || "Celoris Partner"} · ${row.location || "Remote"}`,
          engagement: row.salary_range || "Remote · Certified Contract",
          skills: Array.isArray(row.required_skills)
            ? row.required_skills.slice(0, 4)
            : ["Remote", "Verified Exam"],
          accent: accents[i % accents.length],
        }));
        setRoles(mapped);
        setHookLine1(`${mapped.length} NEW REMOTE`);
      }
    } finally {
      setSyncingJobs(false);
    }
  };

  // Export real 1080x1920 video with optional synthesized audio
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isExporting) return;

    setIsExporting(true);
    setExportDoneMsg(null);
    setExportProgress(0);
    setIsPlaying(false);

    let audioCtx: AudioContext | null = null;
    try {
      const videoStream = canvas.captureStream(FPS);
      let combinedStream = videoStream;

      if (soundEnabled && typeof window !== "undefined") {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtx = new AudioCtx();
          const dest = audioCtx.createMediaStreamDestination();
          scheduleReelAudio(audioCtx, dest, audioCtx.currentTime + 0.05);
          combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...dest.stream.getAudioTracks(),
          ]);
        }
      }

      const preferredTypes = [
        "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
        "video/mp4",
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ];
      const mimeType =
        preferredTypes.find((type) => MediaRecorder.isTypeSupported(type)) || "video/webm";
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 8_000_000,
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const recordingDone = new Promise<void>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `celoris-job-alert-reel-9x16.${ext}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 4000);
          setExportDoneMsg(`Downloaded 1080×1920 Reel (.${ext})`);
          resolve();
        };
      });

      recorder.start();

      const ctx = canvas.getContext("2d");
      const startMs = performance.now();

      await new Promise<void>((resolve) => {
        const renderStep = () => {
          const elapsed = (performance.now() - startMs) / 1000;
          if (elapsed >= DURATION_SEC) {
            if (ctx) renderFrame(ctx, DURATION_SEC - 0.01, false);
            setExportProgress(100);
            resolve();
            return;
          }
          if (ctx) renderFrame(ctx, elapsed, false);
          setExportProgress(Math.min(99, Math.round((elapsed / DURATION_SEC) * 100)));
          requestAnimationFrame(renderStep);
        };
        requestAnimationFrame(renderStep);
      });

      recorder.stop();
      await recordingDone;
    } catch (err) {
      console.error("Export failed:", err);
      setExportDoneMsg("Export failed — please try in Chrome or Edge.");
    } finally {
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
      setIsExporting(false);
      timeRef.current = 0;
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const updateRoleField = (
    idx: number,
    field: keyof ReelRoleSlide,
    value: string | string[]
  ) => {
    setRoles((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#05070A]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/job-center"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Back to Job Center"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Film size={16} className="text-yellow-400" />
                <h1 className="text-sm sm:text-base font-bold tracking-tight">
                  Job Alert Reel Studio
                </h1>
                <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  9:16 · 1080×1920
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Animated 18s vertical Reel template for Instagram Reels, YouTube Shorts &amp; LinkedIn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncFromSupabase}
              disabled={syncingJobs || isExporting}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={13} className={syncingJobs ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Sync Latest 3 Roles</span>
            </button>

            <button
              onClick={handleExportVideo}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-zinc-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-lg shadow-yellow-400/20 disabled:opacity-60 cursor-pointer"
            >
              <Download size={14} />
              {isExporting ? `Rendering ${exportProgress}%...` : "Export 1080×1920 Reel"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 9:16 Phone Canvas Preview */}
        <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24">
          <div className="relative w-full max-w-[360px] rounded-[34px] p-2.5 bg-zinc-900/90 border border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.75)]">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[26px] bg-black">
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className="w-full h-full object-contain block"
              />

              {isExporting && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-400/15 border border-yellow-400/40 flex items-center justify-center mb-3">
                    <Sparkles size={22} className="text-yellow-400 animate-pulse" />
                  </div>
                  <p className="text-sm font-bold text-white">Rendering 1080×1920 Reel</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Recording real-time 18s animation + audio...
                  </p>
                  <div className="w-full max-w-[220px] h-2 bg-white/10 rounded-full overflow-hidden mt-4">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-150"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-yellow-400 mt-2">
                    {exportProgress}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Playback Controls */}
          <div className="w-full max-w-[360px] mt-4 p-3.5 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  disabled={isExporting}
                  className="px-3 py-1.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  onClick={() => {
                    timeRef.current = 0;
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  disabled={isExporting}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title="Restart"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowSafeZone((s) => !s)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                    showSafeZone
                      ? "bg-yellow-400/15 border-yellow-400/40 text-yellow-300"
                      : "bg-white/5 border-white/10 text-zinc-400"
                  }`}
                  title="Toggle Instagram Reels Safe-Zone Overlay"
                >
                  <Eye size={12} />
                  Safe Zone
                </button>
                <button
                  onClick={() => setSoundEnabled((s) => !s)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                    soundEnabled
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                      : "bg-white/5 border-white/10 text-zinc-400"
                  }`}
                  title="Include synthesized beat & SFX in exported video"
                >
                  {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                  SFX
                </button>
              </div>
            </div>

            {/* Scrubber */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={DURATION_SEC}
                step={0.05}
                value={currentTime}
                disabled={isExporting}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  timeRef.current = val;
                  setCurrentTime(val);
                  setIsPlaying(false);
                }}
                className="w-full accent-yellow-400 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>{currentTime.toFixed(1)}s</span>
                <span>
                  {currentTime < 2.5
                    ? "Scene 1: Hook"
                    : currentTime < 6.5
                    ? "Scene 2: Role 01"
                    : currentTime < 10.5
                    ? "Scene 3: Role 02"
                    : currentTime < 14.5
                    ? "Scene 4: Role 03"
                    : "Scene 5: CTA Outro"}
                </span>
                <span>{DURATION_SEC.toFixed(1)}s</span>
              </div>
            </div>

            {exportDoneMsg && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-3 py-2">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>{exportDoneMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Reusable Template Editor */}
        <div className="lg:col-span-7 space-y-5">
          {/* Style & Hook Settings */}
          <section className="p-5 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Layers size={15} className="text-emerald-400" />
                Hook, Theme &amp; CTA Settings
              </h2>
              <div className="flex items-center gap-1.5">
                {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setThemeKey(key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      themeKey === key
                        ? "bg-yellow-400 text-zinc-950 border-yellow-400"
                        : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {THEMES[key].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Alert Badge
                </label>
                <input
                  value={alertPill}
                  onChange={(e) => setAlertPill(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Hook Line 1
                </label>
                <input
                  value={hookLine1}
                  onChange={(e) => setHookLine1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Hook Line 2 (Yellow)
                </label>
                <input
                  value={hookLine2}
                  onChange={(e) => setHookLine2(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Hook Subtitle
                </label>
                <input
                  value={hookSub}
                  onChange={(e) => setHookSub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Comment CTA Word
                </label>
                <input
                  value={ctaKeyword}
                  onChange={(e) => setCtaKeyword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Footer Link / Brand URL
              </label>
              <input
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </section>

          {/* 3 Editable Role Cards */}
          <section className="space-y-3">
            {roles.map((role, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-extrabold uppercase tracking-wider"
                    style={{ color: role.accent }}
                  >
                    Slide 0{idx + 1} · {2.5 + idx * 4}s – {6.5 + idx * 4}s
                  </span>
                  <button
                    onClick={() => {
                      const target = 2.5 + idx * 4 + 1.2;
                      timeRef.current = target;
                      setCurrentTime(target);
                      setIsPlaying(false);
                    }}
                    className="text-[11px] text-zinc-400 hover:text-yellow-400 font-semibold cursor-pointer"
                  >
                    Preview Slide →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Role Title
                    </label>
                    <input
                      value={role.title}
                      onChange={(e) => updateRoleField(idx, "title", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Company &amp; Location
                    </label>
                    <input
                      value={role.subtitle}
                      onChange={(e) => updateRoleField(idx, "subtitle", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Engagement / Rate Pill
                    </label>
                    <input
                      value={role.engagement}
                      onChange={(e) => updateRoleField(idx, "engagement", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Skill Chips (comma-separated)
                    </label>
                    <input
                      value={role.skills.join(", ")}
                      onChange={(e) =>
                        updateRoleField(
                          idx,
                          "skills",
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
