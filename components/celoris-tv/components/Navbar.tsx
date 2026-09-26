import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { useAuth } from '@/components/providers/AuthProvider';
import { XpHeaderPill } from '@/components/xp/XpHeaderBits';
import {
  Search,
  GraduationCap,
  BookOpen,
  ListPlus,
  Tv,
  ChevronLeft,
  ChevronDown,
  Menu,
  Video,
  Briefcase,
  Wallet,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { CreatePlaylistModal } from './Modals/CreatePlaylistModal';

interface Props {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<Props> = ({ onToggleSidebar }) => {
  const {
    currentRole,
    setCurrentRole,
    searchQuery,
    setSearchQuery,
    currentView,
    setCurrentView,
    questions,
  } = useApp();

  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff`;

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const teacherUnansweredCount = questions.filter(
    q => q.answers.length === 0 && !q.isResolved
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full h-14 sm:h-16 bg-[#090b10]/95 backdrop-blur-xl border-b border-white/[0.08] px-3.5 sm:px-6 shrink-0 shadow-[0_4px_24px_rgba(0,0,0,0.6)] select-none text-slate-200">
      <div className="flex items-center justify-between gap-3 h-full max-w-7xl mx-auto">
        
        {/* ============================================================= */}
        {/* LEFT: MOBILE TOGGLE + BACK/EXIT + CELORIS LOGO + CELORIS TV BADGE */}
        {/* ============================================================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {/* Back to Home Button */}
          <Link
            href="/"
            title="Back to Celoris Home"
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all flex items-center gap-1 shadow-xs group shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline text-[11px] font-semibold text-slate-300 group-hover:text-white pr-1">Exit</span>
          </Link>

          {/* Official Celoris Designs Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" title="Celoris Home">
            <img
              src="/celoris-logo.png"
              alt="Celoris Designs"
              className="h-7 sm:h-8 w-auto object-contain group-hover:opacity-90 group-hover:scale-102 transition-all duration-200"
            />
          </Link>

          {/* Divider */}
          <div className="h-4 w-px bg-white/10 mx-0.5 hidden sm:block" />

          {/* Celoris TV Subapp Badge */}
          <button
            type="button"
            onClick={() => setCurrentView('explore')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/15 transition-colors cursor-pointer"
            title="Celoris TV — Academic Lecture Platform"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span>Celoris TV</span>
          </button>

          {/* Contextual Back to Explore (when inside a lecture or subview) */}
          {currentView !== 'explore' && (
            <button
              type="button"
              onClick={() => setCurrentView('explore')}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white px-2 sm:px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all shadow-xs group"
              title="Return to Explore Lectures"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden md:inline">Lectures</span>
            </button>
          )}
        </div>

        {/* ============================================================= */}
        {/* CENTER: SEARCH BAR */}
        {/* ============================================================= */}
        <div className="hidden md:flex flex-1 max-w-md mx-3">
          <div className="relative w-full group">
            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Search lectures, topics, professors, or Q&A..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-[#121622]/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ============================================================= */}
        {/* RIGHT: ROLE TOGGLE + NEW PLAYLIST + XP PILL + PROFILE MENU */}
        {/* ============================================================= */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Role Switcher (Student / Teacher toggle) */}
          <div className="p-1 bg-[#121622]/90 border border-white/10 rounded-xl flex items-center shadow-inner">
            <button
              onClick={() => setCurrentRole('student')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'student'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Student Mode"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Student</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('teacher');
                setCurrentView('teacher-studio');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'teacher'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-black font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Teacher Studio"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Teacher</span>
              {teacherUnansweredCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>
          </div>

          {/* New Playlist Action */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black rounded-xl text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all hover:scale-102 active:scale-98"
          >
            <ListPlus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Playlist</span>
          </button>

          {/* Celoris XP Header Pill */}
          <div className="hidden sm:block">
            <XpHeaderPill />
          </div>

          {/* User Profile Dropdown Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`flex items-center gap-1.5 p-1 rounded-xl border transition-all ${
                showProfileMenu
                  ? 'bg-white/10 border-white/30 ring-2 ring-emerald-500/20'
                  : 'bg-white/[0.04] border-white/10 hover:border-white/20'
              }`}
            >
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-inner"
              />
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform hidden sm:block ${showProfileMenu ? 'rotate-180 text-emerald-400' : ''}`} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0e1118]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3 z-50 text-slate-200 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                {/* User Identity Info */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <Wallet className="w-3 h-3 text-emerald-400" />
                        {profile?.wallet_balance ?? 0} Credits
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Navigation Links */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block">
                    Celoris Suite
                  </span>

                  <Link
                    href="/video-studio"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full p-2 rounded-xl hover:bg-white/[0.05] flex items-center gap-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                      <Video className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold">4K Video Studio</span>
                      <span className="text-[10px] text-slate-500 font-normal">AI Video Creator & C-Dance</span>
                    </div>
                  </Link>

                  <Link
                    href="/job-center"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full p-2 rounded-xl hover:bg-white/[0.05] flex items-center gap-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold">Job Center</span>
                      <span className="text-[10px] text-slate-500 font-normal">SkillVerify & Certified Roles</span>
                    </div>
                  </Link>

                  <Link
                    href="/classrooms"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full p-2 rounded-xl hover:bg-white/[0.05] flex items-center gap-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold">Classrooms & Campus</span>
                      <span className="text-[10px] text-slate-500 font-normal">Live classes & student lounge</span>
                    </div>
                  </Link>

                  <Link
                    href="/learn"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full p-2 rounded-xl hover:bg-white/[0.05] flex items-center gap-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold">Courses</span>
                      <span className="text-[10px] text-slate-500 font-normal">Certified tech programs</span>
                    </div>
                  </Link>
                </div>

                {/* Sign Out */}
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleSignOut();
                    }}
                    className="w-full p-2 rounded-xl hover:bg-rose-500/10 flex items-center gap-2 text-xs font-semibold text-rose-400 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <LogOut className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left">
                      <span className="block font-bold">Sign out</span>
                      <span className="text-[10px] text-slate-500 font-normal">{user?.email}</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </header>
  );
};
