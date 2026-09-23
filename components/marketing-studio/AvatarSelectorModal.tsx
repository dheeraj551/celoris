"use client"

import React, { useState, useRef } from 'react';
import { DemoAvatar, DEMO_AVATARS } from './marketingStudioData';
import { X, Upload, Check, UserCheck, Sparkles } from 'lucide-react';

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAvatar: (avatar: DemoAvatar) => void;
  selectedAvatar?: DemoAvatar | null;
}

export function AvatarSelectorModal({
  isOpen,
  onClose,
  onSelectAvatar,
  selectedAvatar,
}: AvatarSelectorModalProps) {
  const [activeTab, setActiveTab] = useState<'creators' | 'upload'>('creators');
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState('');
  const [roleName, setRoleName] = useState('Brand Face / Creator');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomAvatarPreview(event.target?.result as string);
        setAvatarName(file.name.replace(/\.[^/.]+$/, ""));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustom = () => {
    if (customAvatarPreview) {
      const customAv: DemoAvatar = {
        id: `avatar-${Date.now()}`,
        name: avatarName || 'Custom Model',
        role: roleName || 'Brand Ambassador',
        vibe: 'Custom uploaded brand ambassador',
        avatarUrl: customAvatarPreview,
        badge: 'Custom',
      };
      onSelectAvatar(customAv);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F1016] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow ambient */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#D4FF00]/15 rounded-full blur-[80px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4FF00]/15 border border-[#D4FF00]/30 flex items-center justify-center text-[#D4FF00]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Select AI Creator / Model</h3>
              <p className="text-xs text-neutral-400">Bring your product to life with relatable human UGC models & ambassadors</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 my-5 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('creators')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'creators'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            AI Model Personas
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Custom Face
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'creators' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DEMO_AVATARS.map((av) => {
                const isSelected = selectedAvatar?.id === av.id;
                return (
                  <div
                    key={av.id}
                    onClick={() => {
                      onSelectAvatar(av);
                      onClose();
                    }}
                    className={`group relative p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#D4FF00] ring-1 ring-[#D4FF00]/50 bg-[#D4FF00]/5'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/40 mb-3 border border-white/5">
                      <img
                        src={av.avatarUrl}
                        alt={av.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#D4FF00] text-black flex items-center justify-center shadow-lg">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                      <span className="absolute bottom-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white/90 border border-white/10">
                        {av.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{av.name}</h4>
                      <p className="text-[10px] text-neutral-400 truncate">{av.role}</p>
                      <p className="text-[9px] text-neutral-500 line-clamp-1 mt-0.5">{av.vibe}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {!customAvatarPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 hover:border-[#D4FF00]/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-white/[0.02] group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-[#D4FF00]/15 group-hover:text-[#D4FF00] border border-white/10 flex items-center justify-center text-neutral-400 mb-4 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Click to upload avatar / face photo</h4>
                  <p className="text-xs text-neutral-400 max-w-sm">
                    Upload a portrait photo to generate personalized ads featuring your founder, influencer or brand ambassador.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center p-2">
                    <img
                      src={customAvatarPreview}
                      alt="Uploaded avatar"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={() => setCustomAvatarPreview(null)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                        Creator / Model Name
                      </label>
                      <input
                        type="text"
                        value={avatarName}
                        onChange={(e) => setAvatarName(e.target.value)}
                        placeholder="e.g. Sarah"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#D4FF00]/60"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                        Style / Tone
                      </label>
                      <input
                        type="text"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        placeholder="e.g. Casual UGC Unboxing"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#D4FF00]/60"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      Change Photo
                    </button>
                    <button
                      onClick={handleApplyCustom}
                      className="px-5 py-2 rounded-xl bg-[#D4FF00] text-black text-xs font-bold hover:shadow-[0_0_20px_rgba(212,255,0,0.4)] transition-all cursor-pointer"
                    >
                      Use This Avatar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
