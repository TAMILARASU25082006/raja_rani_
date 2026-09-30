import React from 'react';

interface ThroneSvgProps {
  className?: string;
}

export const ThroneSvg: React.FC<ThroneSvgProps> = ({ className = 'w-48 h-64' }) => {
  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="throneGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="70%" stopColor="#B58A42" />
          <stop offset="100%" stopColor="#8C682A" />
        </linearGradient>
        <linearGradient id="velvetRed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF7F6A" />
          <stop offset="50%" stopColor="#B94738" />
          <stop offset="100%" stopColor="#7A2216" />
        </linearGradient>
        <filter id="throneShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#352820" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Podium Steps */}
      <polygon points="10,230 190,230 180,215 20,215" fill="#D8C3A5" stroke="#B58A42" strokeWidth="2" />
      <polygon points="25,215 175,215 165,200 35,200" fill="#BFA886" stroke="#8C682A" strokeWidth="2" />

      <g filter="url(#throneShadow)">
        {/* Throne High Backrest Frame */}
        <path
          d="M50 200 L50 70 Q100 15 150 70 L150 200 Z"
          fill="url(#throneGold)"
          stroke="#FFE89E"
          strokeWidth="3"
        />

        {/* Backrest Royal Crest Finial */}
        <polygon points="100,10 90,30 110,30" fill="url(#throneGold)" stroke="#FFE89E" strokeWidth="2" />
        <circle cx="100" cy="22" r="4" fill="#B94738" />

        {/* Velvet Inner Cushion */}
        <path
          d="M62 185 L62 75 Q100 35 138 75 L138 185 Z"
          fill="url(#velvetRed)"
          stroke="#B58A42"
          strokeWidth="2"
        />

        {/* Velvet Tufting Diamonds */}
        <circle cx="100" cy="75" r="3" fill="#FFD700" />
        <circle cx="82" cy="105" r="3" fill="#FFD700" />
        <circle cx="118" cy="105" r="3" fill="#FFD700" />
        <circle cx="100" cy="135" r="3" fill="#FFD700" />
        <circle cx="82" cy="165" r="3" fill="#FFD700" />
        <circle cx="118" cy="165" r="3" fill="#FFD700" />

        {/* Seat Cushion */}
        <rect x="42" y="165" width="116" height="30" rx="8" fill="url(#velvetRed)" stroke="#B58A42" strokeWidth="2.5" />

        {/* Gold Armrests */}
        <path d="M36 140 C36 130 54 130 54 150 L54 185 L36 185 Z" fill="url(#throneGold)" stroke="#FFE89E" strokeWidth="2" />
        <circle cx="45" cy="135" r="7" fill="url(#throneGold)" stroke="#FFE89E" strokeWidth="1.5" />

        <path d="M146 140 C146 130 164 130 164 150 L164 185 L146 185 Z" fill="url(#throneGold)" stroke="#FFE89E" strokeWidth="2" />
        <circle cx="155" cy="135" r="7" fill="url(#throneGold)" stroke="#FFE89E" strokeWidth="1.5" />

        {/* Throne Legs */}
        <rect x="42" y="195" width="14" height="20" rx="2" fill="url(#throneGold)" stroke="#8C682A" strokeWidth="1.5" />
        <rect x="144" y="195" width="14" height="20" rx="2" fill="url(#throneGold)" stroke="#8C682A" strokeWidth="1.5" />
      </g>
    </svg>
  );
};
