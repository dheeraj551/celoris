import React from 'react';
import { motion } from 'motion/react';

interface CeloLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const CeloLogo: React.FC<CeloLogoProps> = ({
  size = 36,
  className = '',
  showText = true,
}) => {
  return (
    <motion.div
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Emblem SVG: Book + Mind Head Profile + Glowing 'C' + Sparkles */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        {/* Ambient Glow */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#00d2ff]/30 via-[#8b5cf6]/30 to-[#ec4899]/30 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <svg
          width={size}
          height={size}
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_2px_12px_rgba(0,210,255,0.4)] overflow-visible"
        >
          <defs>
            {/* Outer book/profile gradient: Cyan to Indigo to Pink/Magenta */}
            <linearGradient id="book-profile-grad" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="25%" stopColor="#00b4d8" />
              <stop offset="50%" stopColor="#4361ee" />
              <stop offset="75%" stopColor="#7209b7" />
              <stop offset="100%" stopColor="#f72585" />
            </linearGradient>

            {/* Inner secondary page contour gradient */}
            <linearGradient id="inner-page-grad" x1="0%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Inner Glowing 'C' gradient */}
            <linearGradient id="celo-c-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f5d4" />
              <stop offset="35%" stopColor="#00bbf9" />
              <stop offset="70%" stopColor="#9b5de5" />
              <stop offset="100%" stopColor="#f15bb5" />
            </linearGradient>

            {/* Center Nebula Radial Light */}
            <radialGradient id="sparkle-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="20%" stopColor="#a5f3fc" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#00e5ff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </radialGradient>

            {/* AI Text Gradient */}
            <linearGradient id="ai-text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d2ff" />
              <stop offset="50%" stopColor="#705bf7" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            {/* Subtle Filter for Star Glow */}
            <filter id="star-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Layer 1: Outer Spine & Left Page of Book */}
          <path
            d="M26 44C26 36 33 30 42 28C40 40 38 78 40 102C32 100 26 94 26 86Z"
            fill="none"
            stroke="url(#inner-page-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-70"
          />

          {/* Main Integrated Book-to-Head Profile Contour */}
          <path
            d="M 40 28
               C 56 24, 76 24, 94 30
               C 106 35, 115 45, 117 56
               C 118 61, 114 65, 112 68
               C 114 71, 119 74, 118 78
               C 116 83, 111 85, 109 88
               C 110 93, 112 98, 108 103
               C 102 110, 88 116, 70 118
               C 58 119, 48 114, 40 104
               C 36 90, 36 50, 40 28 Z"
            fill="none"
            stroke="url(#book-profile-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary Layer: Inner fold of book page */}
          <path
            d="M 42 38
               C 55 35, 68 36, 78 40"
            fill="none"
            stroke="url(#book-profile-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-60"
          />

          {/* Central Nebula Sparkle Flare Field */}
          <circle cx="70" cy="70" r="26" fill="url(#sparkle-core-glow)" />

          {/* Tiny Stardust Particles around the C */}
          {/* Top sparkles */}
          <circle cx="68" cy="38" r="1.8" fill="#ffffff" filter="url(#star-glow)" />
          <circle cx="58" cy="44" r="1.2" fill="#a5f3fc" />
          <circle cx="78" cy="42" r="1.5" fill="#a5f3fc" filter="url(#star-glow)" />
          <circle cx="84" cy="50" r="1.2" fill="#ffffff" />
          {/* Core sparkles */}
          <circle cx="70" cy="70" r="2.8" fill="#ffffff" filter="url(#star-glow)" />
          <circle cx="63" cy="65" r="1.4" fill="#a5f3fc" />
          <circle cx="77" cy="67" r="1.5" fill="#c4b5fd" />
          <circle cx="66" cy="76" r="1.2" fill="#ffffff" />
          <circle cx="74" cy="78" r="1.3" fill="#a5f3fc" />
          {/* 4-point central brilliant star */}
          <path
            d="M70 60 Q70 70 60 70 Q70 70 70 80 Q70 70 80 70 Q70 70 70 60 Z"
            fill="#ffffff"
            filter="url(#star-glow)"
          />
          <path
            d="M68 38 Q68 43 63 43 Q68 43 68 48 Q68 43 73 43 Q68 43 68 38 Z"
            fill="#ffffff"
            filter="url(#star-glow)"
            transform="scale(0.6) translate(40, 20)"
          />

          {/* Glowing Stylized 'C' within the silhouette */}
          <path
            d="M 86 54
               C 74 44, 56 46, 52 64
               C 48 82, 64 94, 82 90
               C 87 89, 90 85, 90 85"
            fill="none"
            stroke="url(#celo-c-grad)"
            strokeWidth="7.5"
            strokeLinecap="round"
          />

          {/* Bright highlight on top of C */}
          <path
            d="M 70 48 C 60 52, 54 60, 53 68"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-70"
          />
        </svg>
      </div>

      {/* Brand Typography: Metallic Silver "Celo" + Chromatic Neon "AI" */}
      {showText && (
        <div className="flex items-center gap-1.5 font-bold tracking-tight">
          <span className="text-2xl font-bold bg-gradient-to-b from-[#e3e8ef] via-[#adb5bd] to-[#868e96] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Celo
          </span>
          <span className="text-2xl font-black bg-gradient-to-r from-[#00d2ff] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,210,255,0.4)]">
            AI
          </span>
        </div>
      )}
    </motion.div>
  );
};
