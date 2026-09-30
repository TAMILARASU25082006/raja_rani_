import React from 'react';

interface SoldierSvgProps {
  className?: string;
}

export const SoldierSvg: React.FC<SoldierSvgProps> = ({ className = 'w-16 h-28' }) => {
  return (
    <svg
      viewBox="0 0 100 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8C3A5" />
          <stop offset="50%" stopColor="#BFA886" />
          <stop offset="100%" stopColor="#8C682A" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7F6A" />
          <stop offset="100%" stopColor="#B94738" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="152" rx="28" ry="6" fill="#352820" opacity="0.3" />

      {/* Spear */}
      <line x1="75" y1="10" x2="75" y2="150" stroke="#352820" strokeWidth="4" strokeLinecap="round" />
      <polygon points="75,2 70,22 80,22" fill="#B58A42" stroke="#352820" strokeWidth="1.5" />

      {/* Legs & Boots */}
      <rect x="36" y="105" width="10" height="42" rx="3" fill="#352820" />
      <rect x="52" y="105" width="10" height="42" rx="3" fill="#352820" />
      <rect x="32" y="142" width="15" height="8" rx="2" fill="#211710" />
      <rect x="51" y="142" width="15" height="8" rx="2" fill="#211710" />

      {/* Tunic / Body */}
      <path d="M30 65 L68 65 L64 110 L34 110 Z" fill="url(#armorGrad)" stroke="#352820" strokeWidth="2" />
      <rect x="32" y="85" width="34" height="6" fill="#B94738" />
      <circle cx="49" cy="88" r="3" fill="#FFD700" />

      {/* Head & Helmet */}
      <circle cx="49" cy="40" r="16" fill="#F5EBDD" stroke="#352820" strokeWidth="2" />
      {/* Helmet Plume & Visor */}
      <path d="M33 38 C33 22 65 22 65 38 Z" fill="#B58A42" stroke="#352820" strokeWidth="2" />
      <path d="M46 12 C44 2 54 2 52 14 Z" fill="#FF7F6A" />
      <rect x="39" y="38" width="20" height="4" rx="2" fill="#211710" />
      {/* Eyes */}
      <circle cx="44" cy="45" r="1.5" fill="#352820" />
      <circle cx="54" cy="45" r="1.5" fill="#352820" />

      {/* Shield */}
      <path d="M18 68 C18 68 40 65 42 85 C42 110 30 120 18 125 C6 120 -6 110 -6 85 C-4 65 18 68 18 68 Z"
            fill="url(#shieldGrad)" stroke="#FFE89E" strokeWidth="2" transform="translate(10, 0)" />
      <circle cx="28" cy="92" r="5" fill="#FFD700" />
    </svg>
  );
};
