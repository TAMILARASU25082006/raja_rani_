import React from 'react';

interface ChairSvgProps {
  className?: string;
  isOccupied?: boolean;
  isReady?: boolean;
  isOwner?: boolean;
  isDisconnected?: boolean;
  isSelected?: boolean;
}

export const ChairSvg: React.FC<ChairSvgProps> = ({
  className = 'w-14 h-16',
  isOccupied = false,
  isReady = false,
  isSelected = false,
}) => {
  return (
    <svg
      viewBox="0 0 80 90"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="chairWood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8C3A5" />
          <stop offset="50%" stopColor="#BFA886" />
          <stop offset="100%" stopColor="#8C682A" />
        </linearGradient>
        <linearGradient id="cushionGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8EF" />
          <stop offset="100%" stopColor="#F5EBDD" />
        </linearGradient>
        <linearGradient id="cushionReady" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AA5D" />
          <stop offset="100%" stopColor="#B58A42" />
        </linearGradient>
        <linearGradient id="cushionSelected" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7F6A" />
          <stop offset="100%" stopColor="#B94738" />
        </linearGradient>
      </defs>

      {/* Backrest Frame */}
      <path
        d="M20 60 L20 20 Q40 8 60 20 L60 60 Z"
        fill="url(#chairWood)"
        stroke={isSelected ? '#B94738' : '#8C682A'}
        strokeWidth="2"
      />

      {/* Inner Backrest Cushion */}
      <path
        d="M26 56 L26 24 Q40 14 54 24 L54 56 Z"
        fill={
          isSelected
            ? 'url(#cushionSelected)'
            : isReady
            ? 'url(#cushionReady)'
            : isOccupied
            ? 'url(#cushionGold)'
            : '#E6D7C3'
        }
        stroke="#8C682A"
        strokeWidth="1"
      />

      {/* Seat Cushion */}
      <rect
        x="15"
        y="58"
        width="50"
        height="14"
        rx="4"
        fill={
          isSelected
            ? 'url(#cushionSelected)'
            : isReady
            ? 'url(#cushionReady)'
            : isOccupied
            ? 'url(#cushionGold)'
            : '#E6D7C3'
        }
        stroke={isSelected ? '#B94738' : '#8C682A'}
        strokeWidth="2"
      />

      {/* Chair Legs */}
      <rect x="18" y="72" width="6" height="15" rx="1.5" fill="#352820" />
      <rect x="56" y="72" width="6" height="15" rx="1.5" fill="#352820" />

      {/* Subtle Wood Carvings */}
      <circle cx="40" cy="20" r="2.5" fill="#B58A42" />
    </svg>
  );
};
