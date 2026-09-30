import React from 'react';

interface CastleSvgProps {
  className?: string;
  showGateOpen?: boolean;
}

export const CastleSvg: React.FC<CastleSvgProps> = ({ className = 'w-full h-auto', showGateOpen = false }) => {
  return (
    <svg
      viewBox="0 0 800 500"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5EBDD" />
          <stop offset="100%" stopColor="#E6D7C3" />
        </linearGradient>
        <linearGradient id="stoneWall" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8EF" />
          <stop offset="100%" stopColor="#D8C3A5" />
        </linearGradient>
        <linearGradient id="stoneDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BFA886" />
          <stop offset="100%" stopColor="#8C682A" />
        </linearGradient>
        <linearGradient id="goldRoof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#B58A42" />
          <stop offset="100%" stopColor="#8C682A" />
        </linearGradient>
        <linearGradient id="coralBanner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF7F6A" />
          <stop offset="100%" stopColor="#B94738" />
        </linearGradient>
        <filter id="castleShadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#352820" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Background Hill/Ground */}
      <path d="M0 430 Q400 400 800 430 L800 500 L0 500 Z" fill="#D8C3A5" />
      <path d="M50 460 Q400 430 750 460 L800 500 L0 500 Z" fill="#BFA886" opacity="0.4" />

      {/* Castle Base Structure */}
      <g filter="url(#castleShadow)">
        {/* Left Side Tower */}
        <rect x="140" y="160" width="100" height="270" rx="4" fill="url(#stoneWall)" stroke="#B58A42" strokeWidth="3" />
        {/* Left Tower Turret */}
        <polygon points="130,160 190,70 250,160" fill="url(#goldRoof)" stroke="#8C682A" strokeWidth="2" />
        {/* Left Tower Flag */}
        <line x1="190" y1="70" x2="190" y2="35" stroke="#352820" strokeWidth="3" />
        <path d="M190 35 L230 47 L190 60 Z" fill="url(#coralBanner)" />

        {/* Right Side Tower */}
        <rect x="560" y="160" width="100" height="270" rx="4" fill="url(#stoneWall)" stroke="#B58A42" strokeWidth="3" />
        {/* Right Tower Turret */}
        <polygon points="550,160 610,70 670,160" fill="url(#goldRoof)" stroke="#8C682A" strokeWidth="2" />
        {/* Right Tower Flag */}
        <line x1="610" y1="70" x2="610" y2="35" stroke="#352820" strokeWidth="3" />
        <path d="M610 35 L650 47 L610 60 Z" fill="url(#coralBanner)" />

        {/* Center Curtain Wall & Grand Fort */}
        <rect x="220" y="220" width="360" height="210" fill="url(#stoneWall)" stroke="#B58A42" strokeWidth="3" />

        {/* Battlements / Crenellations */}
        <rect x="230" y="200" width="30" height="20" fill="url(#stoneWall)" stroke="#B58A42" strokeWidth="2" />
        <rect x="280" y="200" width="30" height="20" fill="url(#stoneWall)" stroke="#B58A42" strokeWidth="2" />
        <rect x="330" y="200" width="30" height="20" fill="url(#stoneWall)" stroke="#B58A42" strokeWidth="2" />
        <rect x="380" y="200" width="30" height="20" fill="url(#stoneWall)" stroke="#B58A42" strokeWidth="2" />
        <rect x="430" y="200" width="30" height="20" fill="url(#stoneWall)" stroke="#B58A42" strokeWidth="2" />
        <rect x="480" y="200" width="30" height="20" fill="url(#stoneWall)" stroke="#B58A42" strokeWidth="2" />
        <rect x="530" y="200" width="30" height="20" fill="url(#stoneWall)" stroke="#B58A42" strokeWidth="2" />

        {/* Central High Spire Keep */}
        <rect x="330" y="110" width="140" height="110" rx="4" fill="url(#stoneWall)" stroke="#B58A42" strokeWidth="3" />
        <polygon points="315,110 400,20 485,110" fill="url(#goldRoof)" stroke="#8C682A" strokeWidth="2" />
        {/* Main Royal Standard Flag */}
        <line x1="400" y1="20" x2="400" y2="-15" stroke="#352820" strokeWidth="3" />
        <path d="M400 -15 L455 0 L400 15 Z" fill="url(#coralBanner)" />

        {/* Palace Windows */}
        <path d="M375 140 Q400 120 425 140 L425 175 L375 175 Z" fill="#352820" />
        <path d="M175 220 Q190 205 205 220 L205 250 L175 250 Z" fill="#352820" />
        <path d="M595 220 Q610 205 625 220 L625 250 L595 250 Z" fill="#352820" />

        {/* Royal Crest Above Gate */}
        <circle cx="400" cy="270" r="22" fill="#B58A42" stroke="#FFE89E" strokeWidth="2" />
        <polygon points="400,256 405,268 418,268 407,276 411,288 400,280 389,288 393,276 382,268 395,268" fill="#FFF8EF" />

        {/* Grand Arch Gateway */}
        <path d="M330 430 L330 340 Q400 290 470 340 L470 430 Z" fill="#211710" stroke="#B58A42" strokeWidth="4" />

        {/* Gate Doors */}
        <g className={showGateOpen ? 'transition-all duration-1000 origin-left -scale-x-0' : ''}>
          <path d="M334 428 L334 345 Q367 318 400 310 L400 428 Z" fill="#8C682A" stroke="#352820" strokeWidth="2" />
          <line x1="334" y1="360" x2="400" y2="360" stroke="#352820" strokeWidth="3" />
          <line x1="334" y1="400" x2="400" y2="400" stroke="#352820" strokeWidth="3" />
          <circle cx="390" cy="385" r="4" fill="#FFD700" />
        </g>
        <g className={showGateOpen ? 'transition-all duration-1000 origin-right -scale-x-0' : ''}>
          <path d="M466 428 L466 345 Q433 318 400 310 L400 428 Z" fill="#8C682A" stroke="#352820" strokeWidth="2" />
          <line x1="400" y1="360" x2="466" y2="360" stroke="#352820" strokeWidth="3" />
          <line x1="400" y1="400" x2="466" y2="400" stroke="#352820" strokeWidth="3" />
          <circle cx="410" cy="385" r="4" fill="#FFD700" />
        </g>

        {/* Castle Stone Texture Details */}
        <line x1="250" y1="260" x2="280" y2="260" stroke="#D8C3A5" strokeWidth="2" />
        <line x1="510" y1="280" x2="540" y2="280" stroke="#D8C3A5" strokeWidth="2" />
        <line x1="270" y1="340" x2="300" y2="340" stroke="#D8C3A5" strokeWidth="2" />
        <line x1="500" y1="360" x2="530" y2="360" stroke="#D8C3A5" strokeWidth="2" />
      </g>
    </svg>
  );
};
