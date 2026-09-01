import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Info, Sparkles, ShieldCheck } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface AnimatedTooltipProps {
  id?: string;
  title?: string;
  content: string;
  badge?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  iconType?: 'info' | 'help' | 'sparkle' | 'shield';
  children?: React.ReactNode;
  showPulse?: boolean;
  className?: string;
}

export const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  id,
  title,
  content,
  badge,
  position = 'top',
  iconType = 'info',
  children,
  showPulse = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'bottom':
        return '-top-1 left-1/2 -translate-x-1/2 border-b border-l border-[#3D3530] bg-[#241F1C]';
      case 'left':
        return '-right-1 top-1/2 -translate-y-1/2 border-t border-r border-[#3D3530] bg-[#241F1C]';
      case 'right':
        return '-left-1 top-1/2 -translate-y-1/2 border-b border-l border-[#3D3530] bg-[#241F1C]';
      case 'top':
      default:
        return '-bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-[#3D3530] bg-[#241F1C]';
    }
  };

  const renderIcon = () => {
    switch (iconType) {
      case 'help':
        return <HelpCircle className="w-3.5 h-3.5 text-[#7C9070]" />;
      case 'sparkle':
        return <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />;
      case 'shield':
        return <ShieldCheck className="w-3.5 h-3.5 text-[#7C9070]" />;
      case 'info':
      default:
        return <Info className="w-3.5 h-3.5 text-[#7C9070]" />;
    }
  };

  const handleMouseEnter = () => {
    soundFx.playClick();
    setIsOpen(true);
  };

  return (
    <div
      id={id}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={handleMouseEnter}
      onBlur={() => setIsOpen(false)}
    >
      {children ? (
        children
      ) : (
        <button
          type="button"
          aria-label={title || 'More information'}
          className="relative p-1 rounded-full text-[#8C7E74] hover:text-[#7C9070] hover:bg-[#F0ECE1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7C9070]"
        >
          {renderIcon()}
          {showPulse && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C9070] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C9070]"></span>
            </span>
          )}
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: position === 'top' ? 6 : position === 'bottom' ? -6 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`absolute z-50 pointer-events-none w-64 max-w-xs p-3 rounded-xl bg-[#241F1C] text-[#EDE6DE] shadow-2xl border border-[#3D3530] backdrop-blur-md text-xs ${getPositionClasses()}`}
          >
            {/* Arrow indicator */}
            <div className={`absolute w-2.5 h-2.5 rotate-45 ${getArrowClasses()}`} />

            <div className="relative z-10 space-y-1.5">
              {(title || badge) && (
                <div className="flex items-center justify-between gap-2 border-b border-[#332B27] pb-1">
                  {title && <span className="font-semibold text-white tracking-tight font-serif-heading">{title}</span>}
                  {badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#7C9070]/20 text-[#A3B899] border border-[#7C9070]/40 text-[10px] font-medium">
                      {badge}
                    </span>
                  )}
                </div>
              )}
              <p className="text-[#D5CABE] leading-relaxed font-normal">{content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
