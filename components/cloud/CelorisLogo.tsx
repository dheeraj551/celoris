import React from 'react';
import Image from 'next/image';

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
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Celoris Cloud Official Glowing Leaf & Cloud Emblem */}
      <div className={`relative rounded-xl overflow-hidden shadow-sm shadow-amber-500/30 border border-amber-500/30 bg-black flex-shrink-0 ${iconSizes[size]}`}>
        <Image
          src="/images/celoris-cloud-logo.png"
          alt="Celoris Cloud Logo"
          width={64}
          height={64}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Brand Text */}
      <div className="flex items-center gap-1.5 leading-none">
        <span className={`font-extrabold tracking-tight text-white font-sans ${textSizes[size]}`}>
          Celoris
        </span>
        {showSubtext && (
          <span className={`font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 ${textSizes[size]}`}>
            Cloud
          </span>
        )}
      </div>
    </div>
  );
};
