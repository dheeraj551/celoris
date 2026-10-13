import React from 'react';

// Custom Green-and-Black Bespoke Vector Graphics for Celoris Cloud

export const CelorisSpeedGauge: React.FC<{ score?: number; className?: string }> = ({
  score = 100,
  className = 'w-10 h-10',
}) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 44 44" className="w-full h-full transform -rotate-90">
      <circle
        cx="22"
        cy="22"
        r="18"
        fill="transparent"
        stroke="#1A1A1A"
        strokeWidth="3.5"
      />
      <circle
        cx="22"
        cy="22"
        r="18"
        fill="transparent"
        stroke="#10B981"
        strokeWidth="3.5"
        strokeDasharray="113.1"
        strokeDashoffset={113.1 * (1 - score / 100)}
        strokeLinecap="round"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
        {score}
      </span>
    </div>
  </div>
);

// High-tech NVMe M.2 PCIe Gen4 Graphic
export const CelorisNvmeGraphic: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="5" y="8" width="30" height="24" rx="4" fill="#0A0A0A" stroke="#10B981" strokeWidth="1.5" />
    {/* Microcontroller core */}
    <rect x="13" y="13" width="14" height="14" rx="2" fill="#141414" stroke="#34D399" strokeWidth="1" />
    <circle cx="20" cy="20" r="3" fill="#10B981" />
    {/* Traces */}
    <path d="M8 12H11M8 16H11M8 20H11M8 24H11M8 28H11" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M29 12H32M29 16H32M29 20H32M29 24H32M29 28H32" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
    {/* Golden/Emerald pins */}
    <rect x="15" y="32" width="10" height="2.5" rx="1" fill="#10B981" />
  </svg>
);

// Let's Encrypt TLS 1.3 Cryptographic Padlock Graphic
export const CelorisTlsGraphic: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="8" y="16" width="24" height="18" rx="4" fill="#0A0A0A" stroke="#10B981" strokeWidth="1.5" />
    {/* Shackle */}
    <path
      d="M14 16V12C14 8.68629 16.6863 6 20 6C23.3137 6 26 8.68629 26 12V16"
      stroke="#34D399"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Keyhole */}
    <circle cx="20" cy="24" r="2.5" fill="#10B981" />
    <path d="M20 26.5V29" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 100% Ad-Free Clean Content Shield Graphic
export const CelorisAdFreeGraphic: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20 6L9 10.5V19C9 26.5 13.7 33.5 20 35C26.3 33.5 31 26.5 31 19V10.5L20 6Z"
      fill="#0A0A0A"
      stroke="#10B981"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Blocked banner diagonal */}
    <circle cx="20" cy="20" r="7" stroke="#34D399" strokeWidth="1.5" />
    <path d="M15 15L25 25" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Isolated CGroup Container Pod Graphic
export const CelorisContainerGraphic: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Outer pod perimeter */}
    <rect x="6" y="6" width="28" height="28" rx="6" fill="#0A0A0A" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 2" />
    {/* Inner dedicated memory node */}
    <rect x="12" y="12" width="16" height="16" rx="3" fill="#141414" stroke="#34D399" strokeWidth="1.2" />
    <path d="M16 17H24M16 20H24M16 23H21" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="20" cy="8" r="1.5" fill="#10B981" />
    <circle cx="32" cy="20" r="1.5" fill="#10B981" />
    <circle cx="20" cy="32" r="1.5" fill="#10B981" />
    <circle cx="8" cy="20" r="1.5" fill="#10B981" />
  </svg>
);

// Student Portfolio Persona Graphic
export const CelorisStudentPersonaGraphic: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="8" width="28" height="22" rx="4" fill="#0A0A0A" stroke="#10B981" strokeWidth="1.5" />
    <rect x="10" y="12" width="8" height="6" rx="1.5" fill="#161616" stroke="#34D399" strokeWidth="1" />
    <path d="M21 14H29M21 17H27M11 22H29M11 25H25" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14 30L11 34H29L26 30" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Freelance Web Designer Persona Graphic
export const CelorisFreelancerPersonaGraphic: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="7" y="10" width="26" height="22" rx="4" fill="#0A0A0A" stroke="#10B981" strokeWidth="1.5" />
    <path d="M15 10V7C15 6.44772 15.4477 6 16 6H24C24.5523 6 25 6.44772 25 7V10" stroke="#34D399" strokeWidth="1.5" />
    <rect x="17" y="18" width="6" height="5" rx="1" fill="#141414" stroke="#10B981" strokeWidth="1" />
    <path d="M7 16H33" stroke="#10B981" strokeWidth="1.2" />
  </svg>
);

// Celoris Course Learner Sandbox Graphic
export const CelorisLearnerPersonaGraphic: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="8" width="28" height="24" rx="4" fill="#0A0A0A" stroke="#10B981" strokeWidth="1.5" />
    <path d="M6 14H34" stroke="#1A1A1A" strokeWidth="1.5" />
    <circle cx="10" cy="11" r="1.2" fill="#10B981" />
    <circle cx="14" cy="11" r="1.2" fill="#34D399" />
    <circle cx="18" cy="11" r="1.2" fill="#10B981" />
    <path d="M12 21L15 24L12 27" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 24H25" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Creator & Blogger Hub Persona Graphic
export const CelorisCreatorPersonaGraphic: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="20" cy="20" r="14" fill="#0A0A0A" stroke="#10B981" strokeWidth="1.5" />
    {/* Broadcasting hub waves */}
    <circle cx="20" cy="20" r="5" fill="#141414" stroke="#34D399" strokeWidth="1.2" />
    <circle cx="20" cy="20" r="2" fill="#10B981" />
    <path d="M11 20C11 15 15 11 20 11" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M29 20C29 25 25 29 20 29" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
