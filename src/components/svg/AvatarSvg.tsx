import React from 'react';

interface AvatarSvgProps {
  index: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarSvg: React.FC<AvatarSvgProps> = ({ index = 0, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const palettes = [
    { bg: '#B58A42', turban: '#B94738', jewel: '#FFD700' },
    { bg: '#FF7F6A', turban: '#352820', jewel: '#B58A42' },
    { bg: '#8C682A', turban: '#FF7F6A', jewel: '#FFF8EF' },
    { bg: '#BFA886', turban: '#B94738', jewel: '#FFD700' },
    { bg: '#352820', turban: '#B58A42', jewel: '#FF7F6A' },
  ];

  const p = palettes[index % palettes.length];

  return (
    <svg
      viewBox="0 0 64 64"
      className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="32" fill={p.bg} />
      {/* Royal Robe / Shoulders */}
      <path d="M12 60 C12 46 22 42 32 42 C42 42 52 46 52 60 Z" fill="#FFF8EF" stroke="#352820" strokeWidth="1.5" />
      {/* Face */}
      <circle cx="32" cy="30" r="12" fill="#F5EBDD" stroke="#352820" strokeWidth="1.5" />
      {/* Eyes & smile */}
      <circle cx="28" cy="30" r="1.5" fill="#352820" />
      <circle cx="36" cy="30" r="1.5" fill="#352820" />
      <path d="M29 35 Q32 38 35 35" stroke="#352820" strokeWidth="1.2" strokeLinecap="round" />
      {/* Turban / Headdress */}
      <path d="M20 25 C20 16 26 12 32 12 C38 12 44 16 44 25 C44 26 20 26 20 25 Z" fill={p.turban} stroke="#352820" strokeWidth="1.5" />
      <circle cx="32" cy="18" r="2.5" fill={p.jewel} />
    </svg>
  );
};
