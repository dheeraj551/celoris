import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  Zap, 
  ShieldCheck, 
  BellRing, 
  Award,
  Check
} from 'lucide-react';
import { GUIDED_TOUR_STEPS } from '../data/mockData';
import { soundFx } from '../utils/audio';

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: 'jobs' | 'progression' | 'exams') => void;
}

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = GUIDED_TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    soundFx.playClick();
    if (currentStepIndex < GUIDED_TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (nextIdx === 0 && onNavigateToTab) onNavigateToTab('jobs');
      if (nextIdx === 1 && onNavigateToTab) onNavigateToTab('progression');
      if (nextIdx === 2 && onNavigateToTab) onNavigateToTab('exams');
      if (nextIdx === 3 && onNavigateToTab) onNavigateToTab('jobs');
      if (nextIdx === 4 && onNavigateToTab) onNavigateToTab('progression');
    } else {
      soundFx.playCelebration();
      onClose();
    }
  };

  const handlePrev = () => {
    soundFx.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#7C9070]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#D4A373]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#7C9070]" />;
      case 'BellRing':
        return <BellRing className="w-5 h-5 text-[#C47A53]" />;
      case 'Award':
      default:
        return <Award className="w-5 h-5 text-[#D4A373]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2420]/60 backdrop-blur-sm pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-lg bg-[#FDFBF7] border-2 border-[#7C9070]/60 rounded-2xl shadow-2xl p-6 text-[#453C38] space-y-5"
      >
        {/* Floating header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#7C9070]/20 text-[#425439] border border-[#7C9070]/40 text-xs font-bold font-mono">
              {currentStep.badgeLabel}
            </span>
            <span className="text-xs text-[#8C7E74] font-medium">Beginner Walkthrough</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#8C7E74] hover:text-[#2D2420] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F0ECE1] border border-[#DDD5C7] flex items-center justify-center shrink-0 shadow-inner">
            {renderIcon(currentStep.icon)}
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-[#2D2420] tracking-tight font-serif-heading">
              {currentStep.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C504A] leading-relaxed font-normal">
              {currentStep.content}
            </p>
          </div>
        </div>

        {/* Dots progress indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {GUIDED_TOUR_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'w-6 bg-[#7C9070]'
                  : idx < currentStepIndex
                  ? 'w-2 bg-[#5B6E50]'
                  : 'w-2 bg-[#DDD5C7]'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D9]">
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={handlePrev}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#8C7E74] hover:text-[#2D2420] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#8C7E74] hover:text-[#2D2420] transition-colors"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7C9070] to-[#5B6E50] hover:from-[#6B7F5F] hover:to-[#4A5D40] text-white text-xs font-bold shadow-md shadow-[#7C9070]/30 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              {currentStepIndex === GUIDED_TOUR_STEPS.length - 1 ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Start Exploring</span>
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
