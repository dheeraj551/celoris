import React from 'react';

interface CelorisLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}

export const CelorisLogo: React.FC<CelorisLogoProps> = ({
  className = '',
  size = 'md',
  showSubtext = true
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Celoris Cloud Prism Monogram Icon in Black & Emerald */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-[1.5px] shadow-sm shadow-emerald-500/20 ${iconSizes[size]}`}>
        <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center overflow-hidden relative">
          <svg
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-emerald-400"
          >
            {/* Hexagonal Prism "C" Node */}
            <path
              d="M19 8.5L14 5.5L9 8.5V19.5L14 22.5L19 19.5"
              stroke="url(#celoris-emerald-grad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner Cloud Vector */}
            <path
              d="M13 14H17C18.1 14 19 14.9 19 16C19 17.1 18.1 18 17 18H12C10.9 18 10 17.1 10 16C10 14.9 10.9 14 12 14"
              stroke="#10B981"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="14" cy="11" r="1.5" fill="#34D399" />
            <defs>
              <linearGradient id="celoris-emerald-grad" x1="9" y1="5.5" x2="19" y2="22.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34D399" />
                <stop offset="0.6" stopColor="#10B981" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex items-center gap-1.5 leading-none">
        <span className={`font-extrabold tracking-tight text-white font-sans ${textSizes[size]}`}>
          Celoris
        </span>
        {showSubtext && (
          <span className={`font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 ${textSizes[size]}`}>
            Cloud
          </span>
        )}
      </div>
    </div>
  );
};
