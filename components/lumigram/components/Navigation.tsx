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
      {/* DESKTOP SIDEBAR - Matches Reference Screenshot (ColibriPlus style) */}
      <aside className="hidden md:flex flex-col justify-between w-60 lg:w-64 h-screen sticky top-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-5 z-40 transition-colors select-none">
        <div className="space-y-4">
          {/* Top Hummingbird / Minimalist Mark */}
          <div className="px-2">
            <button
              onClick={() => onSelectTab('feed')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
              aria-label="Home Feed"
            >
              {/* Minimalist Colibri / Bird Silhouette */}
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-neutral-900 dark:text-neutral-100 fill-current group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                <path d="M22.5 4.5c-2.4 1.4-4.8 2-7.1 1.7-1.6-.2-3.1-.9-4.3-2-1-.9-1.8-2-2.3-3.2-.2-.5-.8-.7-1.3-.4-.5.2-.7.8-.4 1.3 1 2.3 2.5 4.1 4.5 5.3-2.1.8-4.5 1.1-7 .9-1.9-.2-3.8-.7-5.5-1.6-.5-.3-1.1-.1-1.4.4-.3.5-.1 1.1.4 1.4 2.8 1.6 5.8 2.4 8.9 2.5-1.7 1.8-3.9 3.1-6.4 3.9-.5.2-.8.7-.6 1.2.2.5.7.8 1.2.6 3.1-1 5.8-2.6 7.9-4.8.4 1.5 1.2 2.9 2.3 4 1.8 1.8 4.1 2.8 6.6 2.9 1.1.1 2.3 0 3.4-.3 1.2-.4 2.3-1 3.2-1.8.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0-.8.7-1.7 1.2-2.7 1.5-1 .3-2 .3-3-.1-2.1-.2-4-1-5.5-2.5-.9-.9-1.5-2-1.8-3.2 2.1-.4 4.1-1.2 5.9-2.3 2.5-1.5 4.6-3.5 6.2-5.9.3-.5.2-1.1-.3-1.4-.5-.3-1.1-.2-1.4.3-1.4 2.1-3.3 3.9-5.5 5.2z" />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1" aria-label="Main Navigation">
            {/* 1. Home */}
            <button
              onClick={() => onSelectTab('feed')}
              className={`w-full flex items-center gap-4 px-3.5 py-3 rounded-full text-[15px] transition-colors cursor-pointer ${
                activeTab === 'feed'
                  ? 'font-bold text-neutral-900 dark:text-neutral-100'
                  : 'font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Home size={22} className={activeTab === 'feed' ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
              <span>Home</span>
            </button>

            {/* 2. Explore */}
            <button
              onClick={() => onSelectTab('explore')}
              className={`w-full flex items-center gap-4 px-3.5 py-3 rounded-full text-[15px] transition-colors cursor-pointer ${
                activeTab === 'explore'
                  ? 'font-bold text-neutral-900 dark:text-neutral-100'
                  : 'font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Hash size={22} className={activeTab === 'explore' ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
              <span>Explore</span>
            </button>

            {/* 3. Notifications */}
            <button
              onClick={() => onSelectTab('activity')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-full text-[15px] transition-colors cursor-pointer ${
                activeTab === 'activity'
                  ? 'font-bold text-neutral-900 dark:text-neutral-100'
                  : 'font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <Bell size={22} className={activeTab === 'activity' ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
                <span>Notifications</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              )}
            </button>

            {/* 4. Messages */}
            <button
              onClick={() => onSelectTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-full text-[15px] transition-colors cursor-pointer ${
                activeTab === 'messages'
                  ? 'font-bold text-neutral-900 dark:text-neutral-100'
                  : 'font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <Mail size={22} className={activeTab === 'messages' ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
                <span>Messages</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* 5. Ad Studio (Pro Users Only) */}
            {isProUser && (
              <button
                onClick={() => onSelectTab('ads')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-full text-[15px] transition-colors cursor-pointer ${
                  activeTab === 'ads'
                    ? 'font-bold text-neutral-900 dark:text-neutral-100'
                    : 'font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <BarChart2 size={22} className={activeTab === 'ads' ? 'stroke-[2.5px] text-emerald-500' : 'text-emerald-500 stroke-[2px]'} />
                  <span>Ad Studio</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              </button>
            )}

            {/* 6. Jobs (Celoris Job Center) */}
            <Link
              href="/job-center"
              className="w-full flex items-center gap-4 px-3.5 py-3 rounded-full text-[15px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <Briefcase size={22} className="stroke-[2px]" />
              <span>Jobs</span>
            </Link>

            {/* 7. My profile */}
            <button
              onClick={() => onSelectTab('profile')}
              className={`w-full flex items-center gap-4 px-3.5 py-3 rounded-full text-[15px] transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'font-bold text-neutral-900 dark:text-neutral-100'
                  : 'font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <UserIcon size={22} className={activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-[2px]'} />
              <span>My profile</span>
            </button>

            {/* 8. More */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="w-full flex items-center gap-4 px-3.5 py-3 rounded-full text-[15px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                <MoreHorizontal size={22} className="stroke-[2px]" />
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

        {/* Footer Links matching Reference Screenshot */}
        <div className="pt-4 text-[11px] text-neutral-400 dark:text-neutral-500 space-y-1.5 select-none leading-relaxed">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="hover:underline cursor-pointer">Business account</span>
            <span>·</span>
            <button onClick={onToggleTheme} className="hover:underline cursor-pointer">Theme</button>
            <span>·</span>
            <Link href="/job-center" className="hover:underline">Jobs</Link>
            <span>·</span>
            <Link href="/contact" className="hover:underline">Help center</Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <Link href="/privacy" className="hover:underline">Privacy policy</Link>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Cookies policy</span>
            <span>·</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Language</span>
          </div>
          <p className="pt-1 text-[10px] text-neutral-400">
            Celoris Pulse © 2026
          </p>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => onSelectTab('feed')}
          className="flex items-center gap-2 cursor-pointer text-left"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-neutral-900 dark:text-neutral-100 fill-current">
            <path d="M22.5 4.5c-2.4 1.4-4.8 2-7.1 1.7-1.6-.2-3.1-.9-4.3-2-1-.9-1.8-2-2.3-3.2-.2-.5-.8-.7-1.3-.4-.5.2-.7.8-.4 1.3 1 2.3 2.5 4.1 4.5 5.3-2.1.8-4.5 1.1-7 .9-1.9-.2-3.8-.7-5.5-1.6-.5-.3-1.1-.1-1.4.4-.3.5-.1 1.1.4 1.4 2.8 1.6 5.8 2.4 8.9 2.5-1.7 1.8-3.9 3.1-6.4 3.9-.5.2-.8.7-.6 1.2.2.5.7.8 1.2.6 3.1-1 5.8-2.6 7.9-4.8.4 1.5 1.2 2.9 2.3 4 1.8 1.8 4.1 2.8 6.6 2.9 1.1.1 2.3 0 3.4-.3 1.2-.4 2.3-1 3.2-1.8.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0-.8.7-1.7 1.2-2.7 1.5-1 .3-2 .3-3-.1-2.1-.2-4-1-5.5-2.5-.9-.9-1.5-2-1.8-3.2 2.1-.4 4.1-1.2 5.9-2.3 2.5-1.5 4.6-3.5 6.2-5.9.3-.5.2-1.1-.3-1.4-.5-.3-1.1-.2-1.4.3-1.4 2.1-3.3 3.9-5.5 5.2z" />
          </svg>
          <span className="font-bold text-base text-neutral-900 dark:text-neutral-100">
            Home
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
