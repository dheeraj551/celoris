import React from 'react';

interface FiveMLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  glow?: boolean;
}

export const FiveMLogo: React.FC<FiveMLogoProps> = ({
  className = '',
  size = 'md',
  glow = false,
}) => {
  let dimension = 24;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'xs':
        dimension = 16;
        break;
      case 'sm':
        dimension = 20;
        break;
      case 'md':
        dimension = 28;
        break;
      case 'lg':
        dimension = 40;
        break;
      case 'xl':
        dimension = 64;
        break;
    }
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={dimension}
      height={dimension}
      xmlns="http://www.w3.org/2000/svg"
      className={`${glow ? 'drop-shadow-[0_0_12px_rgba(243,112,33,0.7)]' : ''} ${className}`}
      fill="none"
    >
      <title>FiveM</title>
      {/* Upper Right Facet */}
      <path
        d="M18.73 3.513c-.027 0-.056.004-.083.013l-4.708 1.488a.386.386 0 0 0-.256.284l-.845 4.316a.386.386 0 0 0 .198.406l4.633 2.455c.16.085.358.043.468-.1l4.032-5.263a.385.385 0 0 0 .04-.378l-3.08-3.057a.386.386 0 0 0-.399-.164z"
        fill="#FA8B28"
      />
      {/* Main Center & Right Stem */}
      <path
        d="M9.715 6.366a.386.386 0 0 0-.256.284L5.617 21.056a.386.386 0 0 0 .524.432l5.06-2.502a.386.386 0 0 0 .194-.413l-1.428-7.29a.386.386 0 0 1 .465-.446l4.475 1.077a.386.386 0 0 0 .428-.184l3.125-5.247a.386.386 0 0 0-.083-.497L9.99 3.535a.386.386 0 0 0-.275-.019z"
        fill="#F37021"
      />
      {/* Bottom Left Triangular Wing */}
      <path
        d="M2.87 9.53a.386.386 0 0 0-.353.232L.034 16.096a.386.386 0 0 0 .167.498l4.31 2.378a.386.386 0 0 0 .493-.133l3.208-4.78a.386.386 0 0 0-.012-.444l-4.99-4.015a.386.386 0 0 0-.34-.07z"
        fill="#E25814"
      />
    </svg>
  );
};
