"use client"
import React from 'react';
import {
  X,
  Moon,
  Sun,
  Lock,
  Bell,
  Volume2,
  VolumeX,
  Shield,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AccountSettings, ThemeMode, ReportItem } from '../types';
import { soundManager } from '../utils/sound';

interface SettingsModalProps {
  settings: AccountSettings;
  theme: ThemeMode;
  reportsHistory: ReportItem[];
  onClose: () => void;
  onUpdateSettings: (newSettings: AccountSettings) => void;
  onToggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  theme,
  reportsHistory,
  onClose,
  onUpdateSettings,
  onToggleTheme,
}) => {
  const handleTogglePrivate = () => {
    soundManager.playSendSound();
    onUpdateSettings({
      ...settings,
      isPrivate: !settings.isPrivate,
    });
  };

  const handleTogglePushMaster = () => {
    soundManager.playSendSound();
    onUpdateSettings({
      ...settings,
      pushNotifications: {
        ...settings.pushNotifications,
        enabled: !settings.pushNotifications.enabled,
      },
    });
  };

  const handleToggleSound = () => {
    const nextSound = !settings.pushNotifications.sound;
    soundManager.setSoundEnabled(nextSound);
    if (nextSound) soundManager.playLikeSound();
    onUpdateSettings({
      ...settings,
      pushNotifications: {
        ...settings.pushNotifications,
        sound: nextSound,
      },
    });
  };

  const handleTogglePushChannel = (channel: keyof AccountSettings['pushNotifications']) => {
    soundManager.playSendSound();
    onUpdateSettings({
      ...settings,
      pushNotifications: {
        ...settings.pushNotifications,
        [channel]: !settings.pushNotifications[channel],
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
            Account & App Settings
          </h3>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-700 dark:text-neutral-300">
          {/* Appearance: Dark / Light Mode */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              Appearance
            </span>
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon size={20} className="text-pink-500" />
                ) : (
                  <Sun size={20} className="text-amber-500" />
                )}
                <div>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                    Dark Mode
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Switch between sleek dark and clean light aesthetic
                  </span>
                </div>
              </div>

              <button
                onClick={onToggleTheme}
                aria-label="Toggle theme mode"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  theme === 'dark' ? 'bg-pink-500' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Privacy: Private Account */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              Privacy & Access
            </span>
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-purple-500" />
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                      Private Account
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      When enabled, only approved followers can view your photos and stories.
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleTogglePrivate}
                  aria-label="Toggle private account"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    settings.isPrivate ? 'bg-purple-600' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.isPrivate ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {settings.isPrivate && (
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px]">
                  🔒 Your account is now private. Pending requests will appear in your Activity feed.
                </div>
              )}
            </div>
          </div>

          {/* Push Notifications Configuration */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              Push Notifications & Sound
            </span>
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-rose-500" />
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                      Enable In-App Push Banners
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Show instant floating banner notifications for interactions
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleTogglePushMaster}
                  aria-label="Toggle all push notifications"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    settings.pushNotifications.enabled
                      ? 'bg-rose-500'
                      : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.pushNotifications.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Sound effects toggle */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-3">
                  {settings.pushNotifications.sound ? (
                    <Volume2 size={18} className="text-pink-500" />
                  ) : (
                    <VolumeX size={18} className="text-neutral-400" />
                  )}
                  <div>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                      Tactile UI Sound Effects
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Pops on like, chimes on messages & notifications
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleToggleSound}
                  aria-label="Toggle UI sounds"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    settings.pushNotifications.sound
                      ? 'bg-pink-500'
                      : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.pushNotifications.sound ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Fine-grained channel toggles */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['likes', 'comments', 'directMessages', 'newFollowers'] as const).map((ch) => (
                  <label
                    key={ch}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications[ch]}
                      onChange={() => handleTogglePushChannel(ch)}
                      className="rounded text-pink-500"
                    />
                    <span className="capitalize">
                      {ch === 'directMessages' ? 'Direct Messages' : ch}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Safety & Moderation Reports Log */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              Safety Center & Filed Reports ({reportsHistory.length})
            </span>
            {reportsHistory.length > 0 ? (
              <div className="space-y-2">
                {reportsHistory.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                        <Shield size={14} className="text-amber-500" />
                        Report against @{rep.reportedUser.username}
                      </div>
                      <p className="text-[11px] text-neutral-500 capitalize">
                        Reason: {rep.category.replace('_', ' ')} • {rep.details}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 uppercase">
                      {rep.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center text-neutral-500 text-xs">
                No safety reports filed. Your account standing is clean.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

