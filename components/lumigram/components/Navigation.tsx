"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  Hash,
  Bell,
  Mail,
  BarChart2,
  Briefcase,
  User as UserIcon,
  MoreHorizontal,
  Settings,
  Sun,
  Moon,
  PlusSquare,
  ArrowUpFromLine,
} from 'lucide-react';
import { User, ThemeMode } from '../types';

interface NavigationProps {
  activeTab: 'feed' | 'explore' | 'messages' | 'activity' | 'profile' | 'ads';
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  currentUser: User;
  theme: ThemeMode;
  walletBalance?: number;
  isProUser?: boolean;
  onSelectTab: (tab: 'feed' | 'explore' | 'messages' | 'activity' | 'profile' | 'ads') => void;
  onOpenCreate: () => void;
  onOpenArch?: () => void;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  unreadMessagesCount,
  unreadNotificationsCount,
  currentUser,
  theme,
  walletBalance = 10000,
  isProUser = false,
  onSelectTab,
  onOpenCreate,
  onOpenSettings,
  onToggleTheme,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <>
      {/* DESKTOP SIDEBAR - Rich Reference Design */}
      <aside className="hidden md:flex flex-col justify-between w-60 lg:w-64 h-screen sticky top-0 border-r border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-5 z-40 transition-colors select-none">
        <div className="space-y-5">
          {/* Brand Logo: celoris. */}
          <div className="px-2">
            <button
              onClick={() => onSelectTab('feed')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
              aria-label="Celoris Home"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <ArrowUpFromLine size={18} strokeWidth={2.4} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-white leading-none">
                celoris<span className="text-emerald-500">.</span>
              </span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1" aria-label="Main Navigation">
            {/* 1. Home */}
            <button
              onClick={() => onSelectTab('feed')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[14px] transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-neutral-100/90 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 font-bold text-neutral-900 dark:text-neutral-100 shadow-2xs'
                  : 'font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white border border-transparent'
              }`}
            >
              <Home size={20} className={activeTab === 'feed' ? 'stroke-[2.4px]' : 'stroke-[1.9px]'} />
              <span>Home</span>
            </button>

            {/* 2. Explore */}
            <button
              onClick={() => onSelectTab('explore')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[14px] transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-neutral-100/90 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 font-bold text-neutral-900 dark:text-neutral-100 shadow-2xs'
                  : 'font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white border border-transparent'
              }`}
            >
              <Hash size={20} className={activeTab === 'explore' ? 'stroke-[2.4px]' : 'stroke-[1.9px]'} />
              <span>Explore</span>
            </button>

            {/* 3. Notifications */}
            <button
              onClick={() => onSelectTab('activity')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] transition-all cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-neutral-100/90 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 font-bold text-neutral-900 dark:text-neutral-100 shadow-2xs'
                  : 'font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Bell size={20} className={activeTab === 'activity' ? 'stroke-[2.4px]' : 'stroke-[1.9px]'} />
                <span>Notifications</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* 4. Messages */}
            <button
              onClick={() => onSelectTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] transition-all cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-neutral-100/90 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 font-bold text-neutral-900 dark:text-neutral-100 shadow-2xs'
                  : 'font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Mail size={20} className={activeTab === 'messages' ? 'stroke-[2.4px]' : 'stroke-[1.9px]'} />
                <span>Messages</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-500 text-white min-w-[18px] text-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* 5. Ad Studio (Pro Users Only) */}
            {isProUser && (
              <button
                onClick={() => onSelectTab('ads')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] transition-all cursor-pointer ${
                  activeTab === 'ads'
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 font-bold text-neutral-900 dark:text-neutral-100 shadow-2xs'
                    : 'font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <BarChart2 size={20} className="text-emerald-500 stroke-[2px]" />
                  <span>Ad Studio</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              </button>
            )}

            {/* 6. Jobs (Celoris Job Center) */}
            <Link
              href="/job-center"
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
            >
              <Briefcase size={20} className="stroke-[1.9px]" />
              <span>Jobs</span>
            </Link>

            {/* 7. My profile */}
            <button
              onClick={() => onSelectTab('profile')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[14px] transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-neutral-100/90 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 font-bold text-neutral-900 dark:text-neutral-100 shadow-2xs'
                  : 'font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white border border-transparent'
              }`}
            >
              <UserIcon size={20} className={activeTab === 'profile' ? 'stroke-[2.4px]' : 'stroke-[1.9px]'} />
              <span>My profile</span>
            </button>

            {/* 8. More */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <MoreHorizontal size={20} className="stroke-[1.9px]" />
                <span>More</span>
              </button>

              {showMoreMenu && (
                <div className="absolute left-0 bottom-12 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Settings size={16} />
                    <span>Settings &amp; Privacy</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onToggleTheme();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                      <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {theme === 'dark' ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Compact Footer with spacing above global floating XP pill */}
        <div className="pb-14">
          <div className="text-[11px] text-neutral-400 dark:text-neutral-500 space-y-1 select-none leading-relaxed px-1">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <span className="hover:underline cursor-pointer">Business</span>
              <span>·</span>
              <button onClick={onToggleTheme} className="hover:underline cursor-pointer">Theme</button>
              <span>·</span>
              <Link href="/job-center" className="hover:underline">Jobs</Link>
              <span>·</span>
              <Link href="/contact" className="hover:underline">Help</Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <span>·</span>
              <Link href="/terms" className="hover:underline">Terms</Link>
            </div>
            <p className="pt-0.5 text-[10px] text-neutral-400">
              © 2026 Celoris Corp.
            </p>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => onSelectTab('feed')}
          className="flex items-center gap-2 cursor-pointer text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
            <ArrowUpFromLine size={14} strokeWidth={2.4} />
          </div>
          <span className="font-extrabold text-base text-neutral-900 dark:text-white">
            celoris<span className="text-emerald-500">.</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          {isProUser && (
            <button
              onClick={() => onSelectTab(activeTab === 'ads' ? 'feed' : 'ads')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold cursor-pointer"
            >
              <BarChart2 size={13} className="text-emerald-500" />
              <span>Ad Studio</span>
            </button>
          )}

          <button
            onClick={() => onSelectTab('messages')}
            aria-label="Direct messages"
            className="relative p-2 rounded-full text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <Mail size={20} />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
            )}
          </button>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 px-4 py-2 flex items-center justify-around"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => onSelectTab('feed')}
          aria-label="Home Feed"
          className={`p-2.5 rounded-xl cursor-pointer ${
            activeTab === 'feed'
              ? 'text-neutral-900 dark:text-neutral-100 font-bold'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          <Home size={22} className={activeTab === 'feed' ? 'stroke-[2.5px]' : ''} />
        </button>

        <button
          onClick={() => onSelectTab('explore')}
          aria-label="Explore"
          className={`p-2.5 rounded-xl cursor-pointer ${
            activeTab === 'explore'
              ? 'text-neutral-900 dark:text-neutral-100 font-bold'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          <Hash size={22} className={activeTab === 'explore' ? 'stroke-[2.5px]' : ''} />
        </button>

        <button
          onClick={onOpenCreate}
          aria-label="Create Post"
          className="p-2.5 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
        >
          <PlusSquare size={22} />
        </button>

        <button
          onClick={() => onSelectTab('activity')}
          aria-label="Notifications"
          className={`p-2.5 rounded-xl cursor-pointer ${
            activeTab === 'activity'
              ? 'text-neutral-900 dark:text-neutral-100 font-bold'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          <Bell size={22} className={activeTab === 'activity' ? 'stroke-[2.5px]' : ''} />
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          aria-label="Profile"
          className="p-2 rounded-xl cursor-pointer"
        >
          <UserIcon
            size={22}
            className={activeTab === 'profile' ? 'stroke-[2.5px] text-neutral-900 dark:text-neutral-100' : 'text-neutral-500'}
          />
        </button>
      </nav>
    </>
  );
};
