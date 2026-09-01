import React from 'react';
import { motion } from 'motion/react';

interface GeminiSparkleProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const GeminiSparkle: React.FC<GeminiSparkleProps> = ({
  size = 48,
  className = '',
  glow = true,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full blur-xl bg-gradient-to-tr from-blue-600/40 via-purple-500/40 to-pink-500/30 -z-10"
        />
      )}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          rotate: [0, 6, -6, 0],
          scale: [1, 1.04, 0.98, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="drop-shadow-[0_0_12px_rgba(168,85,247,0.35)]"
      >
        <defs>
          <linearGradient id="gemini-star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4385F4" />
            <stop offset="35%" stopColor="#9B72CB" />
            <stop offset="70%" stopColor="#D96570" />
            <stop offset="100%" stopColor="#FBBC04" />
          </linearGradient>
          <linearGradient id="gemini-glow-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#8AB4F8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C58AF9" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Outer subtle 4-point star path */}
        <path
          d="M24 0C24 13.2548 34.7452 24 48 24C34.7452 24 24 34.7452 24 48C24 34.7452 13.2548 24 0 24C13.2548 24 24 13.2548 24 0Z"
          fill="none"
          stroke="url(#gemini-star-gradient)"
          strokeWidth="1.5"
          className="opacity-70"
        />
        {/* Core glow star */}
        <path
          d="M24 3C24 14.598 33.402 24 45 24C33.402 24 24 33.402 24 45C24 33.402 14.598 24 3 24C14.598 24 24 14.598 24 3Z"
          fill="url(#gemini-glow-gradient)"
          className="opacity-20"
        />
        {/* Inner bright core */}
        <circle cx="24" cy="24" r="2" fill="#E8EAED" className="opacity-90" />
      </motion.svg>
    </div>
  );
};
