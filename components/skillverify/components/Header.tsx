import React, { useState, useRef, useEffect } from 'react';
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
  Award,
  Clock,
  ExternalLink,
  HelpCircle,
  Settings,
  Plus,
  LogOut,
} from 'lucide-react';
import { UserProfile, UserTierLevel } from '../types';
import { LEVEL_TIERS } from '../data/mockData';
import { soundFx } from '../utils/audio';
import { useAuth } from '@/components/providers/AuthProvider';

interface HeaderProps {
  user: UserProfile;
  activeView: 'jobs' | 'progression' | 'exams';
  setActiveView: (view: 'jobs' | 'progression' | 'exams') => void;
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

  // Account (Credits + avatar) — moved down here from the dashboard's own
  // top bar, which is hidden on this page to avoid a duplicate nav row.
  // The avatar itself now lives inside the L{level} badge below instead
  // of as a second, separate circle.
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
    <header className="border-b border-slate-200 bg-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Main Tabs — brand/logo dropped here since DashboardShell's own
              header + sidebar ("celoris" / "JOB CENTER") already provide
              that, so this stays a single, non-duplicated nav bar. */}
          <div className="flex items-center gap-6 lg:gap-10">
            {/* Main Navigation tabs */}
            <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                id="nav-jobs"
                onClick={() => {
                  soundFx.playClick();
                  setActiveView('jobs');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'jobs'
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Jobs
              </button>

              <button
                id="nav-exams"
                onClick={() => {
                  soundFx.playClick();
                  setActiveView('exams');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'exams'
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpenCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Exams</span>
              </button>

              <button
                id="nav-progression"
                onClick={() => {
                  soundFx.playClick();
                  setActiveView('progression');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'progression'
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Progression</span>
                {user.verifiedBadges.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                    {user.verifiedBadges.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Right Balanced Actions (Simplified & Clutter-Free) */}
          <div className="flex items-center gap-3">

            {/* Credits (moved down from the dashboard's own top bar) */}
            {authUser && (
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700">
                <Plus className="w-3 h-3" />
                {authProfile?.wallet_balance?.toString() || '0'} Credits
              </div>
            )}

            {/* Job Alerts Bell */}
            <button
              id="tour-alerts-panel"
              type="button"
              onClick={() => {
                soundFx.playClick();
                onOpenAlerts();
              }}
              className="relative w-9 h-9 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 bg-white flex items-center justify-center transition-colors shadow-xs"
              aria-label="Job alerts notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white shadow-xs">
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
                className={`flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all shadow-xs ${
                  isMenuOpen
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="relative w-7 h-7 shrink-0">
                  <img
                    src={avatarUrl}
                    alt={authProfile?.full_name || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-white shadow-inner"
                  />
                  <span
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-white shadow-xs"
                    style={{ backgroundColor: currentTierInfo.color }}
                  >
                    {user.level}
                  </span>
                </div>

                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold leading-tight">
                    {user.currentXP} XP
                  </span>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {/* Dropdown Menu Overlay */}
              {isMenuOpen && (
                <div 
                  id="header-dropdown-menu"
                  className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-white border border-slate-200 shadow-xl py-3 px-3 text-slate-800 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Candidate Status Capsule */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 shrink-0">
                          <img
                            src={avatarUrl}
                            alt={authProfile?.full_name || 'User'}
                            className="w-8 h-8 rounded-full object-cover border border-white shadow-xs"
                          />
                          <span
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-white shadow-xs"
                            style={{ backgroundColor: currentTierInfo.color }}
                          >
                            {user.level}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{user.name}</h4>
                          <span className="text-[11px] text-slate-500">{currentTierInfo.name}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {user.honorScore}% Honor
                      </span>
                    </div>

                    {/* Progress to next level */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                        <span>XP Progress</span>
                        <span className="font-mono text-emerald-700 font-bold">{user.currentXP} / {user.nextLevelXP} XP</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-slate-600 truncate">{user.verifiedBadges.length} Badges</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-slate-600 truncate">{formatSeconds(user.totalTimeSpentSeconds)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Tools */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block">
                      Quick Actions
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setIsMenuOpen(false);
                        setActiveView('exams');
                      }}
                      className="w-full p-2 rounded-xl hover:bg-emerald-50 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-emerald-900 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <BookOpenCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <span className="block font-bold">Available Exams</span>
                          <span className="text-[10px] text-slate-500 font-normal">View skill certifications & tests</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
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
                      className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <span className="block font-bold">View Progression Passport</span>
                        <span className="text-[10px] text-slate-500 font-normal">Badges, level roadmaps & perks</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playNotification();
                        setIsMenuOpen(false);
                        onStartTour();
                      }}
                      className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
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
                        className="w-full p-2 rounded-xl hover:bg-rose-50 flex items-center gap-2 text-xs font-semibold text-rose-600 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
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
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between px-2 text-xs">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      {soundEnabled ? (
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5 text-slate-400" />
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
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {soundEnabled ? 'Enabled' : 'Muted'}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

