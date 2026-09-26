import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  Bell,
  Volume2,
  VolumeX,
  Zap,
  BookOpenCheck,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  Award,
  Clock,
  ExternalLink,
  HelpCircle,
  Settings,
  Plus,
  LogOut,
  UserRound,
  Wallet,
  Video,
  Check
} from 'lucide-react';
import { UserProfile, UserTierLevel } from '../types';
import { LEVEL_TIERS } from '../data/mockData';
import { soundFx } from '../utils/audio';
import { useAuth } from '@/components/providers/AuthProvider';

interface HeaderProps {
  user: UserProfile;
  activeView: 'jobs' | 'progression' | 'exams' | 'profile';
  setActiveView: (view: 'jobs' | 'progression' | 'exams' | 'profile') => void;
  onOpenAlerts: () => void;
  unreadAlertsCount: number;
  onStartTour: () => void;
  onOpenAIExamModal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeView,
  setActiveView,
  onOpenAlerts,
  unreadAlertsCount,
  onStartTour,
  onOpenAIExamModal,
  soundEnabled,
  onToggleSound,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user: authUser, profile: authProfile, signOut } = useAuth();
  const avatarUrl = authProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authProfile?.full_name || authUser?.email || 'User')}&background=10b981&color=fff`;

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const currentTierInfo = LEVEL_TIERS[user.level];
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((user.currentXP - currentTierInfo.minXP) / (user.nextLevelXP - currentTierInfo.minXP)) * 100))
  );

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#090b10] flex items-center justify-between px-3.5 sm:px-6 shrink-0 z-30 shadow-[0_4px_24px_rgba(0,0,0,0.6)] select-none">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT: BACK BUTTON + OFFICIAL CELORIS LOGO + STATUS BADGE */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-3">
        
        {/* Back Button */}
        <Link
          href="/"
          title="Back to Celoris Home"
          className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all flex items-center gap-1 shadow-xs group"
        >
          <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline text-[11px] font-semibold text-slate-300 group-hover:text-white pr-1">Exit</span>
        </Link>

        {/* Official Celoris Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <img
            src="/celoris-logo.png"
            alt="Celoris Logo"
            className="h-7 w-auto object-contain group-hover:opacity-90 group-hover:scale-102 transition-all duration-200"
          />
        </Link>

        {/* Job Center Status Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span>Job Center</span>
        </div>

        <div className="h-4 w-px bg-white/10 mx-0.5 hidden sm:block" />

        {/* ------------------------------------------------------------- */}
        {/* MAIN NAVIGATION TABS */}
        {/* ------------------------------------------------------------- */}
        <nav className="flex items-center gap-1 bg-[#131620] p-1 rounded-xl border border-white/10 shadow-inner">
          <button
            id="nav-jobs"
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveView('jobs');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'jobs'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Jobs
          </button>

          <button
            id="nav-exams"
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveView('exams');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'exams'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Exams</span>
          </button>

          <button
            id="nav-progression"
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveView('progression');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'progression'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Progression</span>
            {user.verifiedBadges.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                activeView === 'progression' ? 'bg-black text-[#10b981]' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {user.verifiedBadges.length}
              </span>
            )}
          </button>

          <button
            id="nav-profile"
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveView('profile');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'profile'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Profile</span>
          </button>
        </nav>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT: WALLET CREDITS + SOUND FX + ALERTS + USER PROFILE */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-2.5">

        {/* Credits Wallet pill */}
        {authUser && (
          <Link
            href="/social/profile"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/15 text-xs font-bold text-emerald-400 transition-all shadow-xs"
            title="Your Celoris AI Credits"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="font-mono">{authProfile?.wallet_balance?.toString() || '304'}</span>
            <span className="text-[10px] text-emerald-400/70 font-sans">Credits</span>
          </Link>
        )}

        {/* Sound Effects toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          title={soundEnabled ? "Sound Effects: Enabled" : "Sound Effects: Muted"}
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-all hidden md:flex items-center justify-center shadow-xs"
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {/* Job Alerts Bell */}
        <button
          id="tour-alerts-panel"
          type="button"
          onClick={() => {
            soundFx.playClick();
            onOpenAlerts();
          }}
          className="relative w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
          aria-label="Job alerts notifications"
          title="Job Alerts & Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-black shadow-xs animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Profile & Quick Actions Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            id="header-user-menu-btn"
            type="button"
            onClick={() => {
              soundFx.playClick();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl border transition-all shadow-xs ${
              isMenuOpen
                ? 'bg-white/10 border-white/30 ring-2 ring-emerald-500/20'
                : 'bg-white/[0.04] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="relative w-7 h-7 shrink-0">
              <img
                src={avatarUrl}
                alt={authProfile?.full_name || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-inner"
              />
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-black border border-black shadow-xs"
                style={{ backgroundColor: currentTierInfo.color }}
              >
                {user.level}
              </span>
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">
                {user.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold leading-tight font-mono">
                {user.currentXP} XP
              </span>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180 text-emerald-400' : ''}`} />
          </button>

          {/* Dropdown Menu Overlay */}
          {isMenuOpen && (
            <div 
              id="header-dropdown-menu"
              className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-[#0e1118]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] py-3 px-3 text-slate-200 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              {/* Candidate Status Capsule */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 shrink-0">
                      <img
                        src={avatarUrl}
                        alt={authProfile?.full_name || 'User'}
                        className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-xs"
                      />
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-black border border-black shadow-xs"
                        style={{ backgroundColor: currentTierInfo.color }}
                      >
                        {user.level}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{user.name}</h4>
                      <span className="text-[11px] text-slate-400">{currentTierInfo.name}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold">
                    {user.honorScore}% Honor
                  </span>
                </div>

                {/* Progress to next level */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>XP Progress</span>
                    <span className="font-mono text-emerald-400 font-bold">{user.currentXP} / {user.nextLevelXP} XP</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 truncate">{user.verifiedBadges.length} Badges</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 truncate">{formatSeconds(user.totalTimeSpentSeconds)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Tools */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block">
                  Quick Actions
                </span>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setIsMenuOpen(false);
                    setActiveView('exams');
                  }}
                  className="w-full p-2 rounded-xl hover:bg-white/[0.05] flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <BookOpenCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold">Available Exams</span>
                      <span className="text-[10px] text-slate-500 font-normal">View skill certifications & tests</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-md">
                    Explore
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setIsMenuOpen(false);
                    setActiveView('progression');
                  }}
                  className="w-full p-2 rounded-xl hover:bg-white/[0.05] flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Progression Passport</span>
                    <span className="text-[10px] text-slate-500 font-normal">Badges, level roadmaps & perks</span>
                  </div>
                </button>

                <Link
                  href="/video-studio"
                  className="w-full p-2 rounded-xl hover:bg-white/[0.05] flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">4K Video Studio</span>
                    <span className="text-[10px] text-slate-500 font-normal">C-Dance & Video Editor</span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playNotification();
                    setIsMenuOpen(false);
                    onStartTour();
                  }}
                  className="w-full p-2 rounded-xl hover:bg-white/[0.05] flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">Interactive Platform Tour</span>
                    <span className="text-[10px] text-slate-500 font-normal">Guided walkthrough of features</span>
                  </div>
                </button>

                {authUser && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full p-2 rounded-xl hover:bg-rose-500/10 flex items-center gap-2 text-xs font-semibold text-rose-400 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <LogOut className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold">Sign out</span>
                      <span className="text-[10px] text-slate-500 font-normal">{authUser.email}</span>
                    </div>
                  </button>
                )}
              </div>

              {/* System & Audio Preference */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between px-2 text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  Sound Effects
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSound();
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                    soundEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {soundEnabled ? 'Enabled' : 'Muted'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
