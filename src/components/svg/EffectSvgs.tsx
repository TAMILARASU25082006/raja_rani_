import React from 'react';

export const GunSvg: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gunMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#635348" />
          <stop offset="50%" stopColor="#352820" />
          <stop offset="100%" stopColor="#211710" />
        </linearGradient>
        <linearGradient id="muzzleFlash" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="40%" stopColor="#FF7F6A" />
          <stop offset="100%" stopColor="#B94738" />
        </linearGradient>
      </defs>

      {/* Gun Barrel & Slide */}
      <rect x="35" y="25" width="60" height="16" rx="2" fill="url(#gunMetal)" stroke="#B58A42" strokeWidth="1.5" />
      {/* Front Sight */}
      <rect x="90" y="21" width="4" height="4" fill="#B58A42" />
      {/* Gun Grip */}
      <path d="M45 41 L55 70 L40 73 L30 45 Z" fill="#8C682A" stroke="#352820" strokeWidth="1.5" />
      {/* Trigger Guard */}
      <path d="M48 41 C48 50 58 50 58 41" stroke="#352820" strokeWidth="2" fill="none" />
      <path d="M52 42 Q50 46 54 48" stroke="#352820" strokeWidth="2" strokeLinecap="round" />

      {/* Muzzle Flash Blast Spark */}
      <polygon points="95,33 115,22 105,33 120,33 105,37 115,45 95,37" fill="url(#muzzleFlash)" />
      <circle cx="102" cy="33" r="5" fill="#FFD700" />
    </svg>
  );
};

export const GrenadeSvg: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grenadeBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#635348" />
          <stop offset="50%" stopColor="#352820" />
          <stop offset="100%" stopColor="#211710" />
        </linearGradient>
        <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="50%" stopColor="#FF7F6A" />
          <stop offset="100%" stopColor="#B94738" />
        </linearGradient>
      </defs>

      {/* Explosion Flames Backdrop */}
      <path
        d="M50 10 L65 30 L90 20 L80 45 L100 65 L75 75 L85 105 L55 90 L40 115 L30 85 L5 80 L25 55 L10 30 L35 35 Z"
        fill="url(#fireGrad)"
        opacity="0.85"
      />

      {/* Grenade Oval Ribbed Body */}
      <ellipse cx="50" cy="70" rx="26" ry="32" fill="url(#grenadeBody)" stroke="#B58A42" strokeWidth="2" />
      {/* Grooves */}
      <line x1="26" y1="70" x2="74" y2="70" stroke="#8C682A" strokeWidth="2" />
      <line x1="30" y1="55" x2="70" y2="55" stroke="#8C682A" strokeWidth="2" />
      <line x1="30" y1="85" x2="70" y2="85" stroke="#8C682A" strokeWidth="2" />
      <line x1="50" y1="38" x2="50" y2="102" stroke="#8C682A" strokeWidth="2" />

      {/* Pin & Lever */}
      <rect x="44" y="28" width="12" height="12" fill="#B58A42" stroke="#352820" strokeWidth="1.5" />
      <circle cx="36" cy="32" r="6" stroke="#FFD700" strokeWidth="2.5" fill="none" />
      <path d="M50 28 Q62 20 68 38" stroke="#B58A42" strokeWidth="3" fill="none" />
    </svg>
  );
};

export const CrackedGlassSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="glassGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#FFF8EF" floodOpacity="0.8" />
        </filter>
      </defs>

      <g stroke="#FFF8EF" strokeWidth="2" filter="url(#glassGlow)" opacity="0.85">
        {/* Center Impact point */}
        <circle cx="200" cy="200" r="14" fill="#FFFFFF" fillOpacity="0.4" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="200" cy="200" r="30" fill="none" strokeDasharray="6 4" strokeWidth="1.5" />

        {/* Major Fracture Lines */}
        <path d="M200 200 L120 110 L50 80 L0 50" />
        <path d="M200 200 L280 100 L340 40 L400 20" />
        <path d="M200 200 L310 240 L380 320 L400 390" />
        <path d="M200 200 L140 280 L90 350 L0 380" />
        <path d="M200 200 L210 320 L190 400" />
        <path d="M200 200 L190 80 L200 0" />
        <path d="M200 200 L80 190 L0 180" />
        <path d="M200 200 L320 180 L400 200" />

        {/* Secondary Web Cracks */}
        <path d="M120 110 L140 160 L80 190" />
        <path d="M280 100 L250 150 L320 180" />
        <path d="M310 240 L260 270 L210 320" />
        <path d="M140 280 L160 240 L80 190" />
      </g>
    </svg>
  );
};
