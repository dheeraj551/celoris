import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Zap, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';
import { UserTierLevel } from '../types';
import { LEVEL_TIERS } from '../data/mockData';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  newLevel: UserTierLevel;
  isOpen: boolean;
  onClose: () => void;
  onViewJobs: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  isOpen,
  onClose,
  onViewJobs,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundFx.playCelebration();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const info = LEVEL_TIERS[newLevel];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85 }}
        className="relative w-full max-w-md bg-slate-900 border-2 border-emerald-500/60 rounded-3xl shadow-2xl p-6 sm:p-8 text-center text-slate-100 space-y-6 overflow-hidden"
      >
        {/* Confetti sparkle icon */}
        <div className="relative mx-auto w-20 h-20">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl animate-bounce"
            style={{ backgroundColor: info.color }}
          >
            L{newLevel}
          </div>
          <Sparkles className="w-6 h-6 text-emerald-400 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        <div className="space-y-1.5">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
            Level Up Achieved!
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {info.name}
          </h2>
          <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
            {info.desc}
          </p>
        </div>

        {/* Unlocked Perks List */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2.5">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
            Newly Unlocked Privileges:
          </span>
          <ul className="space-y-2 text-xs text-slate-200">
            {info.perks.map((perk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewJobs();
            }}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Explore Unlocked Certified Roles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
