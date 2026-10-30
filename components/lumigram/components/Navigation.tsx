"use client";
import React from 'react';
import {
  Home,
  Compass,
  MessageSquare,
  Heart,
  PlusSquare,
  User as UserIcon,
  Settings,
  Sun,
  Moon,
  BarChart2,
  Coins,
} from 'lucide-react';
import { User, ThemeMode } from '../types';

interface NavigationProps {
  activeTab: 'feed' | 'explore' | 'messages' | 'activity' | 'profile' | 'ads';
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  currentUser: User;
  theme: ThemeMode;
  walletBalance?: number;
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
  onSelectTab,
  onOpenCreate,
  onOpenSettings,
  onToggleTheme,
}) => {
  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-5 z-40 transition-colors">
        <div className="space-y-6">
          {/* Brand Logo with Official Celoris Pulse Artwork */}
          <button
            onClick={() => onSelectTab('feed')}
            className="flex items-center gap-3 px-2 py-2 text-left group cursor-pointer focus:outline-none"
          >
            <img
              src="/images/celoris-pulse-logo.png"
              alt="Celoris Pulse"
              className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-white leading-none">
                  celoris
                </span>
                <span className="font-extrabold text-xl tracking-tight text-emerald-500 leading-none">
                  PULSE
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium tracking-wide">
                a celoris social cloud
              </span>
            </div>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1.5" aria-label="Main Navigation">
            <button
              onClick={() => onSelectTab('feed')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-neutral-100 dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Home size={22} className={activeTab === 'feed' ? 'stroke-[2.5px] text-emerald-500' : ''} />
              <span>Home Feed</span>
            </button>

            <button
              onClick={() => onSelectTab('ads')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'ads'
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <BarChart2 size={22} className="text-emerald-500" />
                <span>Ad Studio</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                ₹{walletBalance.toLocaleString('en-IN')}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('explore')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-neutral-100 dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Compass size={22} className={activeTab === 'explore' ? 'stroke-[2.5px] text-emerald-500' : ''} />
              <span>Explore &amp; Search</span>
            </button>

            <button
              onClick={() => onSelectTab('messages')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-neutral-100 dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <MessageSquare size={22} className={activeTab === 'messages' ? 'stroke-[2.5px] text-emerald-500' : ''} />
                <span>Messages</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('activity')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-neutral-100 dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <Heart size={22} className={activeTab === 'activity' ? 'stroke-[2.5px] text-rose-500' : ''} />
                <span>Notifications</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              )}
            </button>

            <button
              onClick={onOpenCreate}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
            >
              <PlusSquare size={22} />
              <span>Create Post</span>
            </button>

            <button
              onClick={() => onSelectTab('profile')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-neutral-100 dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-neutral-300 dark:ring-neutral-700"
              />
              <span>Profile</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
          {/* Dark / Light Mode Switch */}
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              {theme === 'dark' ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => onSelectTab('feed')}
          className="flex items-center gap-2.5 cursor-pointer text-left"
        >
          <img
            src="/images/celoris-pulse-logo.png"
            alt="Celoris Pulse"
            className="w-8 h-8 object-contain shrink-0"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white leading-none">
                celoris
              </span>
              <span className="font-extrabold text-base tracking-tight text-emerald-500 leading-none">
                PULSE
              </span>
            </div>
            <span className="text-[8.5px] text-neutral-400 font-medium leading-tight">
              a celoris social cloud
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Ad Studio Wallet Quick Pill */}
          <button
            onClick={() => onSelectTab(activeTab === 'ads' ? 'feed' : 'ads')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-mono font-bold cursor-pointer"
          >
            <Coins size={13} className="text-emerald-500 animate-pulse" />
            <span>₹{walletBalance.toLocaleString('en-IN')}</span>
          </button>

          <button
            onClick={() => onSelectTab('messages')}
            aria-label="Direct messages"
            className="relative p-2 rounded-full text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <MessageSquare size={20} />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500" />
            )}
          </button>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 px-4 py-2 flex items-center justify-around"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => onSelectTab('feed')}
          aria-label="Home Feed"
          className={`p-2.5 rounded-xl cursor-pointer ${
            activeTab === 'feed'
              ? 'text-emerald-500 font-bold'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          <Home size={22} className={activeTab === 'feed' ? 'stroke-[2.5px] text-emerald-500' : ''} />
        </button>

        <button
          onClick={() => onSelectTab('explore')}
          aria-label="Explore"
          className={`p-2.5 rounded-xl cursor-pointer ${
            activeTab === 'explore'
              ? 'text-emerald-500 font-bold'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          <Compass size={22} className={activeTab === 'explore' ? 'stroke-[2.5px] text-emerald-500' : ''} />
        </button>

        <button
          onClick={onOpenCreate}
          aria-label="Create Post"
          className="p-2.5 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
        >
          <PlusSquare size={22} />
        </button>

        <button
          onClick={() => onSelectTab('ads')}
          aria-label="Ad Studio"
          className={`p-2.5 rounded-xl cursor-pointer ${
            activeTab === 'ads'
              ? 'text-emerald-500 font-bold'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          <BarChart2 size={22} className={activeTab === 'ads' ? 'stroke-[2.5px] text-emerald-500' : ''} />
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          aria-label="Profile"
          className="p-2 rounded-xl cursor-pointer"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className={`w-6 h-6 rounded-full object-cover ring-2 ${
              activeTab === 'profile'
                ? 'ring-emerald-500'
                : 'ring-transparent'
            }`}
          />
        </button>
      </nav>
    </>
  );
};
