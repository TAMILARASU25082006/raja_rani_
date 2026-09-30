import React from 'react';

interface CrownSvgProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CrownSvg: React.FC<CrownSvgProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <svg
      viewBox="0 0 100 80"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="70%" stopColor="#B58A42" />
          <stop offset="100%" stopColor="#8C682A" />
        </linearGradient>
        <filter id="crownGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#B58A42" floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter="url(#crownGlow)">
        {/* Crown Body with 5 Peaks */}
        <path
          d="M15 62 L20 28 L38 45 L50 15 L62 45 L80 28 L85 62 Z"
          fill="url(#crownGold)"
          stroke="#FFE89E"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Crown Base Band */}
        <rect x="15" y="62" width="70" height="12" rx="3" fill="url(#crownGold)" stroke="#FFE89E" strokeWidth="2" />

        {/* Ruby Jewels on Peaks */}
        <circle cx="20" cy="26" r="4.5" fill="#FF7F6A" stroke="#B94738" strokeWidth="1.5" />
        <circle cx="50" cy="13" r="6" fill="#B94738" stroke="#FF7F6A" strokeWidth="1.5" />
        <circle cx="80" cy="26" r="4.5" fill="#FF7F6A" stroke="#B94738" strokeWidth="1.5" />

        {/* Band Jewels */}
        <circle cx="28" cy="68" r="3" fill="#B94738" />
        <circle cx="50" cy="68" r="3.5" fill="#FF7F6A" />
        <circle cx="72" cy="68" r="3" fill="#B94738" />
      </g>
    </svg>
  );
};
