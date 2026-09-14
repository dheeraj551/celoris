"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  Users,
  Sparkles,
  ArrowRight,
  Gift,
  Radio,
  Zap,
  BookOpen,
  Lightbulb,
  TreePine,
} from 'lucide-react';
import { cafeAudio } from '@/components/chat-cafe/utils/cafeAudio';

// The 4 themed tables from Chat Cafe data
const CAFE_TABLES = [
  {
    id: 'idea_roastery',
    name: 'The Idea Roastery',
    icon: Lightbulb,
    emoji: '💡',
    vibe: 'Brainstorms & Epiphanies',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
    tagColor: 'text-amber-400',
  },
  {
    id: 'main_lounge',
    name: 'Celoris Main Lounge',
    icon: Coffee,
    emoji: '☕',
    vibe: 'Casual Greetings & Lofi Tunes',
    color: 'from-fuchsia-500/20 to-purple-500/10 border-fuchsia-500/30 text-fuchsia-300',
    tagColor: 'text-fuchsia-400',
  },
  {
    id: 'study_nook',
    name: 'Books & Study Nook',
    icon: BookOpen,
    emoji: '📚',
    vibe: 'Quiet Focus & Readers',
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300',
    tagColor: 'text-cyan-400',
  },
  {
    id: 'mindful_patio',
    name: 'Mindful Garden Patio',
    icon: TreePine,
    emoji: '🌿',
    vibe: 'Calm Musings & Zen',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
    tagColor: 'text-emerald-400',
  },
];

// Interactive drinks patrons can gift in the demo
const QUICK_DRINKS = [
  { id: 'latte', name: 'Vanilla Latte', icon: '☕', tag: 'Smooth & Warm' },
  { id: 'matcha', name: 'Ceremonial Matcha', icon: '🍵', tag: 'Fresh Froth' },
  { id: 'boba', name: 'Brown Sugar Boba', icon: '🧋', tag: 'Sweet Pearls' },
  { id: 'croissant', name: 'Almond Brioche', icon: '🥐', tag: 'Oven-Fresh' },
];

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text?: string;
  drink?: string;
  isGift?: boolean;
  color: string;
  role?: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'Barista Nora',
    avatar: '🐱',
    role: 'Host',
    color: 'text-amber-400',
    text: 'Welcome to the Idea Roastery! Fresh cinnamon brew on the counter ☕',
    time: 'just now',
  },
  {
    id: 'm-2',
    sender: 'Captain_Byte99',
    avatar: '⚡',
    color: 'text-cyan-400',
    text: 'Fixed that 3am memory leak! Best feeling ever 🎉',
    time: 'just now',
  },
  {
    id: 'm-3',
    sender: 'MysticMira',
    avatar: '🔮',
    isGift: true,
    drink: 'Velvet Vanilla Latte ☕',
    color: 'text-fuchsia-400',
    time: 'just now',
  },
  {
    id: 'm-4',
    sender: 'RonnieFromAccounts',
    avatar: '☕',
    color: 'text-emerald-400',
    text: 'The 1999 Yahoo-Chat vibes here are pure nostalgia ✨',
    time: 'just now',
  },
];

const SIMULATED_POOL = [
  {
    sender: 'NeoFox',
    avatar: '🦊',
    color: 'text-orange-400',
    text: 'Anyone listening to the lofi stream? Track 3 is sublime 🎧',
  },
  {
    sender: 'PixelSamurai',
    avatar: '👾',
    color: 'text-pink-400',
    text: 'Just signed the permanent Wall of Fame guestbook! ✍️',
  },
  {
    sender: 'MatchaBunny',
    avatar: '🐰',
    color: 'text-emerald-400',
    text: 'Pulling up a chair with ceremonial matcha. So cozy in here! 🍵',
  },
  {
    sender: 'Barista Nora',
    avatar: '🐱',
    role: 'Host',
    color: 'text-amber-400',
    text: 'Guided discussion starting in 5m: "Small Rituals that Reset Your Mind" 💡',
  },
  {
    sender: 'CyberKitten',
    avatar: '🐾',
    color: 'text-purple-400',
    isGift: true,
    drink: 'Brown Sugar Boba 🧋',
  },
  {
    sender: 'Captain_Byte99',
    avatar: '⚡',
    color: 'text-cyan-400',
    text: 'Treating the whole table to drinks! Who wants coffee? ☕',
  },
];

interface FloatingHeart {
  id: number;
  emoji: string;
  x: number;
}

interface ChatCafeSectionProps {
  onEnter?: () => void;
}

export default function ChatCafeSection({ onEnter }: ChatCafeSectionProps) {
  const [activeTableIdx, setActiveTableIdx] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [typingUser, setTypingUser] = useState<{ sender: string; avatar: string } | null>({
    sender: 'NeoFox',
    avatar: '🦊',
  });
  const [floatingParticles, setFloatingParticles] = useState<FloatingHeart[]>([]);
  const poolIndexRef = useRef(0);
  const activeTable = CAFE_TABLES[activeTableIdx];

  // Simulated live chat typing & incoming messages stream
  useEffect(() => {
    const cycle = setInterval(() => {
      const nextCandidate = SIMULATED_POOL[poolIndexRef.current % SIMULATED_POOL.length];
      poolIndexRef.current += 1;

      // Show typing indicator first
      setTypingUser({
        sender: nextCandidate.sender,
        avatar: nextCandidate.avatar,
      });

      // After a natural typing delay, post the message
      setTimeout(() => {
        setTypingUser(null);
        setMessages((prev) => {
          const newMsg: ChatMessage = {
            id: `sim-${Date.now()}-${Math.random()}`,
            sender: nextCandidate.sender,
            avatar: nextCandidate.avatar,
            role: nextCandidate.role,
            color: nextCandidate.color,
            text: nextCandidate.text,
            drink: nextCandidate.drink,
            isGift: nextCandidate.isGift,
            time: 'just now',
          };
          // Keep max 4 visible for crisp layout
          return [...prev.slice(-3), newMsg];
        });
      }, 1600);
    }, 4800);

    return () => clearInterval(cycle);
  }, []);

  // Handle user clicking quick drink gifts in demo
  const handleGiftDrink = (drink: typeof QUICK_DRINKS[0]) => {
    try {
      cafeAudio.playCupClink();
    } catch (_) {}

    // Add floating particle animation
    const newParticle: FloatingHeart = {
      id: Date.now(),
      emoji: drink.icon,
      x: 20 + Math.random() * 60,
    };
    setFloatingParticles((prev) => [...prev.slice(-6), newParticle]);

    // Add to chat feed
    setMessages((prev) => [
      ...prev.slice(-3),
      {
        id: `gift-${Date.now()}`,
        sender: 'You (Guest)',
        avatar: '✨',
        isGift: true,
        drink: `${drink.name} ${drink.icon}`,
        color: 'text-amber-300 font-bold',
        time: 'just now',
      },
    ]);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-gradient-to-b from-[#140b1e] via-[#0e0716] to-[#07040b] p-6 sm:p-8 lg:p-10 shadow-2xl shadow-fuchsia-950/40">
      {/* Animated Cyber-Retro Border Sheen */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent animate-pulse" />
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent" />

      {/* Floating ambient glowing orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.12, 0.22, 0.12],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.04)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Floating Coffee Aroma / Steam Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 120, x: `${15 + i * 15}%` }}
            animate={{
              opacity: [0, 0.4, 0],
              y: [-20, -140],
              x: [`${15 + i * 15}%`, `${15 + i * 15 + (i % 2 === 0 ? 3 : -3)}%`],
            }}
            transition={{
              duration: 7 + i * 1.5,
              repeat: Infinity,
              delay: i * 1.4,
              ease: 'easeOut',
            }}
            className="absolute bottom-0 text-fuchsia-400/20 text-xs font-mono select-none"
          >
            {i % 2 === 0 ? '☕' : '✨'}
          </motion.span>
        ))}
      </div>

      <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
        {/* ================= LEFT COLUMN: HERO CONTENT ================= */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center"
        >
          {/* Top Live Signal Badge */}
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-fuchsia-950/60 to-purple-900/40 border border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-pink-200 to-cyan-300">
                1999 Yahoo-Chat Era • Now Live
              </span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-[10px] font-mono text-cyan-300/80">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Lofi Radio</span>
            </div>
          </div>

          {/* Main Title with Retro Neon Glow */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black italic tracking-tight mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-200 to-cyan-300 drop-shadow-[0_4px_16px_rgba(217,70,239,0.35)]">
              CELORIS CHAT CAFÉ
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300/90 leading-relaxed mb-6 font-normal">
            Step into our cozy throwback coffeehouse. Pull up a chair at one of four themed retro tables,
            trade hot drinks, customize your avatar & chat bubbles, and vibe to relaxing lofi beats in real-time.
          </p>

          {/* Interactive Table Picker / Atmosphere Showcase */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-fuchsia-400/80 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Select a Table Atmosphere:
              </span>
              <span className="text-[10px] font-mono text-cyan-400/80 animate-pulse">
                ● 4 tables buzzing
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {CAFE_TABLES.map((t, idx) => {
                const isSelected = activeTableIdx === idx;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTableIdx(idx);
                      try {
                        cafeAudio.playCupClink();
                      } catch (_) {}
                    }}
                    className={`group relative flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? `bg-fuchsia-950/50 border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.25)] scale-[1.02]`
                        : `bg-[#130b1c]/60 border-white/5 hover:border-fuchsia-500/30 hover:bg-fuchsia-950/20`
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40'
                          : 'bg-white/5 text-gray-400 border border-white/10 group-hover:text-fuchsia-300'
                      }`}
                    >
                      <span className="text-sm">{t.emoji}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-xs font-semibold truncate ${
                            isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                          }`}
                        >
                          {t.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 block truncate">
                        {t.vibe}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Feature Perks with Animated Neon Badges */}
          <div className="grid grid-cols-3 gap-2.5 mb-7">
            {[
              { label: 'Drink Gifting', desc: 'Send coffees & boba', icon: Gift, color: 'text-amber-400' },
              { label: 'Retro Avatars', desc: '90s custom bubbles', icon: Sparkles, color: 'text-fuchsia-400' },
              { label: 'Arcade & Wall', desc: 'Mini-game & guestbook', icon: Zap, color: 'text-cyan-400' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col gap-1 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-fuchsia-500/20 transition-all hover:translate-y-[-2px]"
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${f.color}`} />
                    <span className="text-xs font-bold text-gray-200">{f.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 leading-tight">{f.desc}</span>
                </div>
              );
            })}
          </div>

          {/* CTA & Active Patrons Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnter}
              className="relative group overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-fuchsia-950/60 hover:shadow-fuchsia-600/30 transition-all duration-300 cursor-pointer"
            >
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
              <Coffee className="w-4 h-4 text-fuchsia-200 animate-bounce" />
              <span>Pull Up a Chair</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>

            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span>18 patrons mingling live</span>
            </div>
          </div>
        </motion.div>

        {/* ================= RIGHT COLUMN: INTERACTIVE RETRO CHAT TERMINAL & POSTER ================= */}
        <div className="lg:col-span-6 xl:col-span-7 relative flex flex-col items-center">
          {/* Main Retro Terminal Window */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="w-full rounded-2xl border border-fuchsia-500/30 bg-[#0d0713]/95 shadow-[0_20px_60px_-15px_rgba(217,70,239,0.35)] backdrop-blur-xl overflow-hidden relative z-10 flex flex-col"
          >
            {/* CRT Screen Scanline subtle effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-30 z-30" />

            {/* Terminal Window Header (NeXT/Mac 90s style) */}
            <div className="relative flex items-center justify-between px-4 py-2.5 border-b border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-950/50 via-[#150a20] to-cyan-950/40 select-none z-20">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)] cursor-pointer" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 border border-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.5)] cursor-pointer" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] cursor-pointer" />
                </div>
                <div className="h-3.5 w-[1px] bg-white/10 mx-1" />
                <span className="text-[11px] font-mono text-fuchsia-300 font-semibold tracking-wide flex items-center gap-1.5">
                  <Coffee className="w-3 h-3 text-fuchsia-400" />
                  chat-cafe-lounge.exe
                </span>
              </div>

              {/* Lofi Audio Visualizer & Table Indicator */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20">
                  <span className="text-[9px] font-mono text-fuchsia-300 font-bold uppercase tracking-wider">
                    {activeTable.name}
                  </span>
                </div>

                {/* Animated Lofi Equalizer Bars */}
                <div className="flex items-end gap-0.5 h-3">
                  <motion.span
                    animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                    className="w-0.5 bg-fuchsia-400 rounded-full"
                  />
                  <motion.span
                    animate={{ height: ['60%', '20%', '100%', '50%', '60%'] }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
                    className="w-0.5 bg-purple-400 rounded-full"
                  />
                  <motion.span
                    animate={{ height: ['40%', '90%', '30%', '100%', '40%'] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                    className="w-0.5 bg-cyan-400 rounded-full"
                  />
                  <motion.span
                    animate={{ height: ['80%', '30%', '70%', '20%', '80%'] }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                    className="w-0.5 bg-emerald-400 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Chat Messages Feed with Live Framer Motion animations */}
            <div className="p-4 space-y-2.5 min-h-[220px] max-h-[260px] overflow-hidden flex flex-col justify-end relative z-20">
              {/* Floating Drink Confetti Particles */}
              <AnimatePresence>
                {floatingParticles.map((fp) => (
                  <motion.span
                    key={fp.id}
                    initial={{ opacity: 1, y: 80, x: `${fp.x}%`, scale: 0.8 }}
                    animate={{
                      opacity: [1, 1, 0],
                      y: -140,
                      scale: [0.8, 1.4, 1.1],
                      rotate: [0, -15, 15, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.2, ease: 'easeOut' }}
                    className="absolute bottom-12 pointer-events-none text-2xl z-40"
                  >
                    {fp.emoji}
                  </motion.span>
                ))}
              </AnimatePresence>

              {/* Message List */}
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 14, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-2 text-xs md:text-sm font-mono leading-relaxed ${
                      msg.isGift
                        ? 'p-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-fuchsia-500/15 to-transparent border border-amber-400/30'
                        : 'px-1'
                    }`}
                  >
                    <span className="text-sm flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {msg.avatar}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-bold ${msg.color}`}>{msg.sender}</span>
                        {msg.role && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase font-bold">
                            {msg.role}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-500">{msg.time}</span>
                      </div>

                      {msg.isGift ? (
                        <div className="text-amber-200 text-xs flex items-center gap-1.5 mt-0.5">
                          <Gift className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>
                            treated the table to{' '}
                            <strong className="text-white font-bold">{msg.drink}</strong>!
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-300 text-xs md:text-[13px] font-sans break-words mt-0.5">
                          {msg.text}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Live Typing Indicator */}
              {typingUser && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 pt-1 text-xs font-mono text-fuchsia-300/80"
                >
                  <span className="text-sm">{typingUser.avatar}</span>
                  <span className="text-[11px]">{typingUser.sender} is typing</span>
                  <span className="flex gap-1 items-center">
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 0.9, delay: 0 }}
                      className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"
                    />
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 0.9, delay: 0.2 }}
                      className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"
                    />
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 0.9, delay: 0.4 }}
                      className="w-1.5 h-1.5 rounded-full bg-fuchsia-400"
                    />
                  </span>
                </motion.div>
              )}
            </div>

            {/* Interactive Drink Gifting Dock inside the window */}
            <div className="p-3 border-t border-fuchsia-500/20 bg-[#120819]/90 relative z-20">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-fuchsia-400/90 flex items-center gap-1">
                  <Gift className="w-3 h-3 text-fuchsia-400 animate-bounce" /> Click to send a drink:
                </span>
                <span className="text-[10px] font-mono text-gray-400 hidden sm:inline">
                  Interactive Preview
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {QUICK_DRINKS.map((d) => (
                  <motion.button
                    key={d.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleGiftDrink(d)}
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-2 rounded-lg bg-fuchsia-950/40 hover:bg-fuchsia-900/50 border border-fuchsia-500/30 hover:border-fuchsia-400 text-white transition-colors group cursor-pointer shadow-sm"
                  >
                    <span className="text-base group-hover:rotate-12 transition-transform">
                      {d.icon}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-gray-200 group-hover:text-white truncate">
                      {d.name.split(' ')[0]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating Café Poster & VIP Pass - Layered Overlap */}
          <div className="w-full flex items-center justify-between mt-4 px-2 relative z-20">
            {/* Left Mini floating card: Poster Thumbnail */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="flex items-center gap-3 p-2 pr-4 rounded-xl bg-[#12091c]/90 border border-fuchsia-500/30 shadow-xl backdrop-blur-md"
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-fuchsia-400/40 flex-shrink-0">
                <img
                  src="/celoris_cafe.png"
                  alt="Celoris Chat Café"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div>
                <span className="text-[9px] font-mono text-fuchsia-400 tracking-wider uppercase block font-bold">
                  Retro Lounge
                </span>
                <span className="text-xs font-bold text-white block">Yahoo-Chat Vibe</span>
              </div>
            </motion.div>

            {/* Right Mini floating card: Table Status */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#12091c]/90 border border-cyan-500/30 shadow-xl backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="text-[11px] font-mono font-bold text-cyan-300">
                {activeTable.emoji} {activeTable.name}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

