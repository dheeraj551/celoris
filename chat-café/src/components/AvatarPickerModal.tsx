import React, { useState } from 'react';
import { X, Check, Sparkles, User, Palette, Coffee, Shield, Smile } from 'lucide-react';
import { UserProfile, BubbleStyleId, UserRole } from '../types';
import { AVATAR_CHARACTERS, STATUS_PRESETS, CAFE_DRINKS } from '../data/cafeData';
import { BUBBLE_STYLES } from '../utils/themes';

interface AvatarPickerModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [avatarId, setAvatarId] = useState(currentUser.avatarId);
  const [avatarColor, setAvatarColor] = useState(currentUser.avatarColor);
  const [accessory, setAccessory] = useState(currentUser.accessory);
  const [statusText, setStatusText] = useState(currentUser.statusText);
  const [currentDrink, setCurrentDrink] = useState(currentUser.currentDrink);
  const [bubbleStyle, setBubbleStyle] = useState<BubbleStyleId>(currentUser.bubbleStyle || 'ceramic');
  const [role, setRole] = useState<UserRole>(currentUser.role);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      name: name.trim() || 'Cozy Patron',
      avatarId,
      avatarColor,
      accessory,
      statusText,
      currentDrink,
      bubbleStyle,
      role,
    });
    onClose();
  };

  const selectedChar = AVATAR_CHARACTERS.find((c) => c.id === avatarId) || AVATAR_CHARACTERS[0];
  const selectedBubbleConfig = BUBBLE_STYLES[bubbleStyle] || BUBBLE_STYLES.ceramic;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        id="avatar-picker-modal"
        className="bg-stone-900 border border-stone-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-stone-100 p-5 sm:p-6 space-y-6"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl border border-amber-500/30">
              ☕
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-amber-100">
                Café Persona & Chat Bubble Studio
              </h2>
              <p className="text-xs text-stone-400">
                Customize your avatar, drink, cafe mood, and message bubble aesthetic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
          <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Chat Preview</span>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <div
              className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-xl shadow-md border border-white/20`}
            >
              {selectedChar.icon}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-amber-100">{name || 'Your Name'}</span>
                {role === 'moderator' && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-700/40 text-[10px] font-medium">
                    🛡️ Staff Mod
                  </span>
                )}
                {role === 'barista' && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-600/40 text-amber-200 border border-amber-500/40 text-[10px] font-medium">
                    ☕ Barista
                  </span>
                )}
                <span className="text-[10px] text-stone-400">• {currentDrink}</span>
              </div>

              {/* Chat bubble preview */}
              <div
                className={`inline-block px-4 py-2.5 text-sm leading-relaxed ${selectedBubbleConfig.selfClasses} ${selectedBubbleConfig.tailShape}`}
              >
                "Hello everyone at Chat Café! Just settling in with my {currentDrink}."
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Display Name & Role Switch */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-stone-300">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={28}
              placeholder="e.g., Oliver, Maya, Luna"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-sm text-amber-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Café Role</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-amber-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="patron">Patron (Guest)</option>
              <option value="regular">Regular Patron ⭐</option>
              <option value="barista">Barista Apprentice ☕</option>
              <option value="moderator">Staff Moderator 🛡️</option>
            </select>
          </div>
        </div>

        {/* Section 2: Avatar Characters */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-stone-300">Choose Character Companion</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {AVATAR_CHARACTERS.map((char) => {
              const isSelected = char.id === avatarId;
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    setAvatarId(char.id);
                    setAvatarColor(char.color);
                    setAccessory(char.accessory);
                  }}
                  className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 border transition-all text-center ${
                    isSelected
                      ? 'bg-amber-600/30 border-amber-500 text-white shadow-md'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                  }`}
                >
                  <span className="text-2xl">{char.icon}</span>
                  <span className="text-[11px] font-medium leading-tight">{char.name}</span>
                  <span className="text-[9px] text-stone-400 truncate w-full">{char.accessory}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Custom Chat Bubble Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Custom Chat Bubble Style</span>
            </label>
            <span className="text-[11px] text-amber-300 font-medium">
              {selectedBubbleConfig.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {Object.values(BUBBLE_STYLES).map((bubble) => {
              const isSelected = bubble.id === bubbleStyle;
              return (
                <button
                  key={bubble.id}
                  onClick={() => setBubbleStyle(bubble.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'border-amber-400 bg-stone-800/90 shadow-md ring-1 ring-amber-400/50'
                      : 'border-stone-800 bg-stone-950/60 hover:bg-stone-800/50 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-amber-200 flex items-center gap-1">
                      <span>{bubble.icon}</span>
                      <span>{bubble.name}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">{bubble.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Current Drink & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Drink</span>
            </label>
            <select
              value={currentDrink}
              onChange={(e) => setCurrentDrink(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-amber-100 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {CAFE_DRINKS.map((drink) => (
                <option key={drink.id} value={drink.name}>
                  {drink.icon} {drink.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              <span>Café Status & Mood</span>
            </label>
            <input
              type="text"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              maxLength={40}
              placeholder="e.g. Reading Murakami 📖"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-amber-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Quick status presets */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => setStatusText(preset)}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 hover:text-amber-200 hover:border-amber-600/40 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-300 transition-colors"
          >
            Cancel
          </button>
          <button
            id="save-persona-btn"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-950/40 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Persona</span>
          </button>
        </div>
      </div>
    </div>
  );
};
