import React, { useMemo } from 'react';
import { SeasonalThemeId } from '../types';
import { SEASONAL_THEMES } from '../utils/themes';

interface SeasonalParticlesProps {
  themeId: SeasonalThemeId;
  enabled: boolean;
}

export const SeasonalParticles: React.FC<SeasonalParticlesProps> = ({ themeId, enabled }) => {
  if (!enabled) return null;

  const currentTheme = SEASONAL_THEMES[themeId];

  // Deterministic particle specs for smooth floating without re-randomizing every render
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${(i * 8.5 + 4) % 100}%`,
      animationDuration: `${12 + (i % 5) * 3}s`,
      animationDelay: `${(i * 1.7) % 8}s`,
      opacity: 0.25 + (i % 4) * 0.12,
      size: `${14 + (i % 3) * 6}px`,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-float"
          style={{
            left: p.left,
            top: '-20px',
            fontSize: p.size,
            opacity: p.opacity,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          {currentTheme.ambientParticle}
        </span>
      ))}
      <style>{`
        @keyframes floatDown {
          0% {
            transform: translateY(0vh) rotate(0deg) translateX(0px);
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(25px);
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-25px);
          }
        }
        .animate-float {
          animation-name: floatDown;
        }
      `}</style>
    </div>
  );
};
