"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  X, 
  Bot,
  Briefcase, 
  GraduationCap, 
  Zap, 
  Sparkles, 
  Bell, 
  Smartphone,
  ArrowRight,
  BookOpen,
  MessagesSquare,
  MessageSquare
} from 'lucide-react';
import { PhoneView } from './types';
import { SupportView } from './views/SupportView';
import { WhatsChatView } from './views/WhatsChatView';
import { JobCenterView } from './views/JobCenterView';
import { ClassroomsView } from './views/ClassroomsView';
import { AppsView } from './views/AppsView';

function CelorisChatIcon({ className }: { className?: string }) {
  return <MessagesSquare className={className} />;
}

// Desktop phone frame: full height is 505px, but on short windows (laptops
// with the browser zoomed, small screens) it has to shrink so the top of the
// phone never goes off-screen. The closed state always leaves 50px peeking.
const PHONE_FULL_HEIGHT = 505;
const PHONE_PEEK = 50;

const TEASER_SEEN_KEY = 'celoris-phone-teaser-seen';

export function CelorisPhoneOS() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PhoneView>('support');
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState('10:00');
  const [currentDate, setCurrentDate] = useState('FRI, SEP 25');
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [phoneHeight, setPhoneHeight] = useState(PHONE_FULL_HEIGHT);

  const phoneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Responsive mobile check & instant desktop open to Celoris Support
  useEffect(() => {
    const checkMobile = () => {
      const mob = window.innerWidth < 768;
      setIsMobile(mob);
      setPhoneHeight(Math.max(360, Math.min(PHONE_FULL_HEIGHT, window.innerHeight - 16)));
      // On desktop, immediately show Celoris Support as the page loads
      if (!mob) {
        setOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Programmatic event listener to open phone from buttons (Chat, Phone, Call, etc.)
  useEffect(() => {
    const handleOpenPhone = (e: any) => {
      const targetView = e?.detail?.view || 'support';
      setView(targetView);
      setOpen(true);
      setTeaserVisible(false);
    };
    window.addEventListener('celoris:open-phone', handleOpenPhone);
    return () => window.removeEventListener('celoris:open-phone', handleOpenPhone);
  }, []);

  // Live Digital Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase());
    };
    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

  // Outside click & ESC listeners
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (phoneRef.current && !phoneRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Teaser timeout
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(TEASER_SEEN_KEY) === '1';
    } catch {
      // best-effort
    }
    if (seen) return;

    const timer = setTimeout(() => {
      setTeaserVisible(true);
      try {
        sessionStorage.setItem(TEASER_SEEN_KEY, '1');
      } catch {
        // best-effort
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleHomeBarClick = () => {
    if (view !== 'home') {
      setView('home');
    } else {
      setOpen(false);
    }
  };

  const openApp = (appView: PhoneView) => {
    setView(appView);
    setOpen(true);
    setTeaserVisible(false);
    setHasUnread(false);
  };

  // Render the current active subview
  const renderCurrentView = () => {
    switch (view) {
      case 'support':
        return <SupportView onBack={() => setView('home')} onClose={() => setOpen(false)} />;
      case 'whatschat':
      case 'whatsapp' as any:
        return <WhatsChatView onBack={() => setView('home')} onClose={() => setOpen(false)} />;
      case 'jobs':
        return <JobCenterView onBack={() => setView('home')} onClose={() => setOpen(false)} />;
      case 'classrooms':
        return <ClassroomsView onBack={() => setView('home')} onClose={() => setOpen(false)} />;
      case 'apps':
        return <AppsView onBack={() => setView('home')} onClose={() => setOpen(false)} />;
      default:
        return renderHomeScreen();
    }
  };

  // Home Screen with the balanced 6 apps lineup (Pristine White iOS Style)
  const renderHomeScreen = () => (
    <motion.div
      key="phone-home"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="flex-1 flex flex-col justify-between p-3.5 text-slate-800 select-none overflow-y-auto custom-scrollbar bg-[#F8FAFC]"
    >
      {/* Phone Header / Lock Widget */}
      <div className="pt-1 text-center">
        <div className="text-[10px] font-mono font-bold text-emerald-600 tracking-widest uppercase mb-0.5">
          {currentDate}
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          {currentTime}
        </div>
        <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[9px] font-mono text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Celoris OS 3.0 • 50K+ Creators</span>
        </div>
      </div>

      {/* Perfectly Balanced 6 Apps Grid (2 Columns x 3 Rows) */}
      <div className="grid grid-cols-2 gap-2.5 my-auto py-2">
        {/* App 1: Celoris Support (Live Chat, Callback & FAQ) */}
        <button
          type="button"
          onClick={() => openApp('support')}
          className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-emerald-400/60 transition-all flex flex-col items-center text-center group cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] relative"
        >
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-1.5 shadow-[0_4px_12px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
            <MessageSquare className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-bold text-slate-900 block">Celoris Support</span>
          <span className="text-[8.5px] text-emerald-700 font-medium mt-0.5">Live Help &amp; WhatsApp</span>
        </button>

        {/* App 2: Celoris Chat (Student Connect) */}
        <button
          type="button"
          onClick={() => openApp('whatschat')}
          className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-sky-400/60 transition-all flex flex-col items-center text-center group cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] relative"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white mb-1.5 shadow-[0_4px_12px_rgba(14,165,233,0.3)] group-hover:scale-105 transition-transform">
            <CelorisChatIcon className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-bold text-slate-900 block">Celoris Chat</span>
          <span className="text-[8.5px] text-sky-700 font-medium mt-0.5">Student Connect</span>
        </button>

        {/* App 3: Job Center */}
        <button
          type="button"
          onClick={() => openApp('jobs')}
          className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-amber-400/60 transition-all flex flex-col items-center text-center group cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mb-1.5 shadow-[0_4px_12px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">
            <Briefcase className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-bold text-slate-900 block">Job Center</span>
          <span className="text-[8.5px] text-amber-700 font-medium mt-0.5">Verified Gigs</span>
        </button>

        {/* App 4: Classrooms */}
        <button
          type="button"
          onClick={() => openApp('classrooms')}
          className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-purple-400/60 transition-all flex flex-col items-center text-center group cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white mb-1.5 shadow-[0_4px_12px_rgba(168,85,247,0.3)] group-hover:scale-105 transition-transform">
            <GraduationCap className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-bold text-slate-900 block">Classrooms</span>
          <span className="text-[8.5px] text-purple-700 font-medium mt-0.5">Live Classes</span>
        </button>

        {/* App 5: Teach on Celoris (0% Commission Educator Network) */}
        <Link
          href="/teach"
          onClick={() => setOpen(false)}
          className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-rose-400/60 transition-all flex flex-col items-center text-center group cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white mb-1.5 shadow-[0_4px_12px_rgba(244,63,94,0.3)] group-hover:scale-105 transition-transform">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-bold text-slate-900 block">Teach</span>
          <span className="text-[8.5px] text-rose-700 font-medium mt-0.5">0% Commission</span>
        </Link>

        {/* App 6: Studio Suite */}
        <button
          type="button"
          onClick={() => openApp('apps')}
          className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-cyan-400/60 transition-all flex flex-col items-center text-center group cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-1.5 shadow-[0_4px_12px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-bold text-slate-900 block">Studio Suite</span>
          <span className="text-[8.5px] text-cyan-700 font-medium mt-0.5">5 Cloud Tools</span>
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="pt-1 pb-0.5 text-center">
        <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-widest">
          Tap any app • No sign-up to explore
        </span>
      </div>
    </motion.div>
  );

  return (
    <>
      {/* 1. Proactive Notification Teaser (When Closed) */}
      <AnimatePresence>
        {teaserVisible && !open && (
          <motion.div
            key="teaser"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-[56px] right-4 sm:right-6 z-[60] w-[285px] max-w-[85vw] flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] pl-3 pr-2 py-2 select-none"
          >
            <button
              onClick={() => {
                setTeaserVisible(false);
                setOpen(true);
              }}
              className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer"
            >
              <div className="relative h-8 w-8 shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_2px_8px_rgba(16,185,129,0.35)]">
                  <Smartphone className="h-4 w-4 text-white" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-500 border border-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-slate-900 truncate">Celoris Phone OS</p>
                  <span className="text-[8.5px] text-emerald-600 font-mono font-semibold shrink-0">online</span>
                </div>
                <p className="text-[9.5px] text-slate-500 truncate">
                  Support, Chat, Jobs &amp; Classrooms
                </p>
              </div>
            </button>
            <button
              onClick={() => setTeaserVisible(false)}
              aria-label="Dismiss"
              className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MOBILE PRESENTATION (< 768px): Full-Screen Native Bottom Sheet */}
      {isMobile ? (
        <AnimatePresence>
          {open ? (
            <motion.div
              key="mobile-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 top-12 z-50 rounded-t-[28px] bg-white border-t border-slate-200 shadow-[0_-20px_50px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,16px)]"
            >
              {/* Native Drag Handle */}
              <div className="pt-2 pb-1 flex justify-center cursor-pointer" onClick={() => setOpen(false)}>
                <div className="w-12 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors" />
              </div>

              {/* Sheet Top Bar */}
              <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 text-slate-900 bg-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold font-mono tracking-wider text-slate-800">CELORIS OS</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500">{currentTime}</span>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Content Screen */}
              <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC]">
                {renderCurrentView()}
              </div>

              {/* Mobile Home Bar */}
              <div
                onClick={handleHomeBarClick}
                className="py-2.5 flex items-center justify-center bg-white border-t border-slate-100 cursor-pointer"
              >
                <div className="w-28 h-1 rounded-full bg-slate-300" />
              </div>
            </motion.div>
          ) : (
            /* Mobile Floating Trigger Pill */
            <button
              onClick={() => {
                setOpen(true);
                setTeaserVisible(false);
              }}
              className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200 text-slate-900 shadow-xl cursor-pointer active:scale-95 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold tracking-tight">Celoris Phone</span>
              {hasUnread && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          )}
        </AnimatePresence>
      ) : (
        /* 3. DESKTOP PRESENTATION (≥ 768px): Sleek 3D Animated Smartphone Chassis (Pristine White iOS) */
        <motion.div
          ref={phoneRef}
          initial={false}
          animate={{
            y: open ? 0 : phoneHeight - PHONE_PEEK, // only the top 50px peeks out when closed
          }}
          whileHover={!open ? { y: phoneHeight - PHONE_PEEK - 8 } : undefined}
          style={{ height: phoneHeight }}
          transition={
            reduceMotion
              ? { duration: 0.1 }
              : { type: 'spring', stiffness: 350, damping: 28, mass: 0.8 }
          }
          className="fixed bottom-0 right-6 z-50 w-[285px] sm:w-[295px] rounded-t-[38px] rounded-b-[24px] border-[5px] border-b-0 border-[#222836] bg-[#F8FAFC] shadow-[0_20px_70px_rgba(0,0,0,0.65),0_0_0_1px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden origin-bottom select-none"
        >
          {/* Top Status Bar & Dynamic Island */}
          <div
            onClick={() => {
              if (!open) {
                setOpen(true);
                setTeaserVisible(false);
              }
            }}
            className={`pt-2 pl-5 pr-4 pb-1.5 flex items-center justify-between z-30 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-mono select-none transition-colors ${
              !open ? 'cursor-pointer hover:bg-slate-100/80' : 'border-b border-slate-100'
            }`}
            title={!open ? 'Click to open Celoris Phone' : undefined}
          >
            {/* Clock & Notification Dot */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-slate-900">{currentTime}</span>
              {hasUnread && !open && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)] animate-pulse" />
              )}
            </div>

            {/* Apple Dynamic Island Capsule */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black text-white shadow-inner cursor-pointer"
              onClick={(e) => {
                if (open) {
                  e.stopPropagation();
                  setOpen(false);
                }
              }}
              title={open ? 'Click to minimize phone' : undefined}
            >
              {/* Camera Lens */}
              <div className="w-2 h-2 rounded-full bg-[#111] border border-blue-400/40 relative flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-blue-400" />
              </div>
              {/* Speaker Slit */}
              <div className="w-5 h-0.5 rounded-full bg-white/30" />
              {/* Live Signal Pulse */}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
            </div>

            {/* 5G, Battery & Chevron */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold text-slate-700">5G</span>
              <div className="w-4 h-2 rounded-2xs border border-slate-700/80 p-0.5 flex items-center">
                <div className="h-full w-4/5 bg-emerald-500 rounded-3xs" />
              </div>
              {open ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  className="p-0.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Minimize phone"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ) : (
                <ChevronUp className="w-3 h-3 text-emerald-600 animate-bounce" />
              )}
            </div>
          </div>

          {/* Smartphone Screen Canvas */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC] relative overflow-hidden">
            {renderCurrentView()}
          </div>

          {/* Bottom Apple Home Indicator Bar */}
          <div
            onClick={handleHomeBarClick}
            className="py-2 flex items-center justify-center bg-white border-t border-slate-100 cursor-pointer group hover:bg-slate-50 transition-colors"
            title={view === 'home' ? 'Click to slide down phone' : 'Click to return to home screen'}
          >
            <div className="w-24 h-1 rounded-full bg-slate-300 group-hover:bg-slate-500 transition-colors shadow-2xs" />
          </div>
        </motion.div>
      )}
    </>
  );
}
