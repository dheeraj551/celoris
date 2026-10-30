"use client";
import React, { useState } from 'react';
import { X, Check, AtSign, User as UserIcon, Loader2 } from 'lucide-react';
import { User } from '../types';
import { soundManager } from '../utils/sound';

interface EditProfileModalProps {
  currentUser: User;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  currentUser,
  onClose,
  onUpdateUser,
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [username, setUsername] = useState(currentUser.username || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
    const cleanName = name.trim();

    if (!cleanUsername) {
      setError('Username cannot be empty');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // 1. Persist to API
      await fetch('/api/social/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          username: cleanUsername,
          name: cleanName || cleanUsername,
        }),
      });

      // 2. Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('celoris_pulse_username', cleanUsername);
        localStorage.setItem('celoris_pulse_name', cleanName || cleanUsername);
      }

      // 3. Update React state
      const updated: User = {
        ...currentUser,
        name: cleanName || cleanUsername,
        username: cleanUsername,
      };

      soundManager.playSendSound();
      onUpdateUser(updated);
      onClose();
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err?.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
            Edit Profile & Nickname
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* User Preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <div>
              <p className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                @{username || 'username'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {name || 'Full Name'}
              </p>
            </div>
          </div>

          {/* Display Name / Nickname */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Full Name / Nickname
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-neutral-400">
                <UserIcon size={16} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Jairath"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              This name will appear on your profile and posts.
            </p>
          </div>

          {/* Handle / Username */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Handle / Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-neutral-400">
                <AtSign size={16} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="e.g. ananya_jairath"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Letters, numbers, and underscores only. No email addresses or spaces.
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
