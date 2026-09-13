import React from 'react';

interface RetroSmileyProps {
  type?: 'happy' | 'cool' | 'wink' | 'grin' | 'angel' | 'tongue' | 'barista' | 'robot';
  size?: number;
  className?: string;
}

export function RetroSmiley({ type = 'happy', size = 16, className = '' }: RetroSmileyProps) {
  if (type === 'cool') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block flex-shrink-0 ${className}`}
      >
        <circle cx="8" cy="8" r="7" fill="#FFCC00" stroke="#CC9900" strokeWidth="1" />
        {/* Sunglasses */}
        <path d="M2 6h12v2H2z" fill="#111" />
        <path d="M3 6h4v3a2 2 0 01-4 0V6zM9 6h4v3a2 2 0 01-4 0V6z" fill="#222" stroke="#000" strokeWidth="0.5" />
        <path d="M4 7h2v1H4zM10 7h2v1H10z" fill="#666" />
        {/* Smirk */}
        <path d="M6 12c1 0.8 3 0.8 4 0" stroke="#996600" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'wink') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block flex-shrink-0 ${className}`}
      >
        <circle cx="8" cy="8" r="7" fill="#FFCC00" stroke="#CC9900" strokeWidth="1" />
        {/* Left eye open */}
        <circle cx="5.5" cy="6.5" r="1.2" fill="#222" />
        {/* Right eye wink */}
        <path d="M9.5 6.5l2 1" stroke="#222" strokeWidth="1.2" strokeLinecap="round" />
        {/* Smile */}
        <path d="M5 10c1 2 5 2 6 0" stroke="#996600" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'grin') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block flex-shrink-0 ${className}`}
      >
        <circle cx="8" cy="8" r="7" fill="#FFCC00" stroke="#CC9900" strokeWidth="1" />
        <circle cx="5.5" cy="6" r="1.2" fill="#222" />
        <circle cx="10.5" cy="6" r="1.2" fill="#222" />
        {/* Wide Grin with teeth */}
        <path d="M4.5 9.5c0 2.5 7 2.5 7 0z" fill="#FFF" stroke="#996600" strokeWidth="1" />
        <line x1="4.5" y1="10" x2="11.5" y2="10" stroke="#996600" strokeWidth="0.7" />
      </svg>
    );
  }

  if (type === 'tongue') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block flex-shrink-0 ${className}`}
      >
        <circle cx="8" cy="8" r="7" fill="#FFCC00" stroke="#CC9900" strokeWidth="1" />
        <circle cx="5.5" cy="6" r="1.2" fill="#222" />
        <circle cx="10.5" cy="6" r="1.2" fill="#222" />
        <path d="M5 9.5h6" stroke="#996600" strokeWidth="1" />
        <path d="M7 9.5v2a1.5 1.5 0 003 0v-2z" fill="#FF3366" stroke="#CC0033" strokeWidth="0.5" />
      </svg>
    );
  }

  if (type === 'barista') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block flex-shrink-0 ${className}`}
      >
        <circle cx="8" cy="8" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
        {/* Star */}
        <path
          d="M8 2.5l1.5 3 3.5.5-2.5 2.5.6 3.5L8 10.3l-3.1 1.7.6-3.5L3 6l3.5-.5L8 2.5z"
          fill="#FEF3C7"
          stroke="#D97706"
          strokeWidth="0.5"
        />
      </svg>
    );
  }

  if (type === 'robot') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block flex-shrink-0 ${className}`}
      >
        <rect x="2.5" y="4" width="11" height="9" rx="1" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
        <rect x="7" y="1.5" width="2" height="2.5" fill="#64748B" />
        <circle cx="8" cy="1.5" r="1" fill="#EF4444" />
        <rect x="4.5" y="6.5" width="2.5" height="2.5" fill="#38BDF8" />
        <rect x="9" y="6.5" width="2.5" height="2.5" fill="#38BDF8" />
        <line x1="5" y1="11" x2="11" y2="11" stroke="#334155" strokeWidth="1" strokeDasharray="1 1" />
      </svg>
    );
  }

  // Default classic yellow smiley (matching the screenshot!)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 ${className}`}
    >
      <circle cx="8" cy="8" r="7" fill="#FFCC00" stroke="#CC9900" strokeWidth="1" />
      <circle cx="5.5" cy="6" r="1.2" fill="#222" />
      <circle cx="10.5" cy="6" r="1.2" fill="#222" />
      <path d="M5 10c1 2 5 2 6 0" stroke="#996600" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export const RETRO_EMOTICONS = [
  { code: ':-)', emoji: '😊', label: 'Smile' },
  { code: ';-)', emoji: '😉', label: 'Wink' },
  { code: ':-D', emoji: '😃', label: 'Big Grin' },
  { code: ':-P', emoji: '😛', label: 'Tongue' },
  { code: '8-)', emoji: '😎', label: 'Cool Shades' },
  { code: ':-O', emoji: '😮', label: 'Surprised' },
  { code: ':-*', emoji: '😘', label: 'Kiss' },
  { code: ':-(', emoji: '🙁', label: 'Sad' },
  { code: '<3', emoji: '❤️', label: 'Heart' },
  { code: '(arcade)', emoji: '🕹️', label: 'Arcade Joystick' },
  { code: '(coffee)', emoji: '☕', label: 'Hot Coffee' },
  { code: '(cake)', emoji: '🍰', label: 'Cake Slice' },
  { code: '(coin)', emoji: '🪙', label: 'Arcade 25¢ Coin' },
  { code: '(star)', emoji: '⭐', label: 'Gold Star' },
];
