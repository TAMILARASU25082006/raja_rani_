import React from 'react';
import { CrownSvg } from './CrownSvg';

interface RoleIconProps {
  roleId: number;
  className?: string;
}

export const RoleIcon: React.FC<RoleIconProps> = ({ roleId, className = 'w-10 h-10' }) => {
  switch (roleId) {
    case 1: // King
    case 2: // Queen
    case 8: // Prince
    case 9: // Princess
      return <CrownSvg className={className} size="md" />;

    case 4: // Police
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="32" r="28" fill="#B58A42" stroke="#FFF8EF" strokeWidth="2" />
          <polygon points="32,12 36,24 49,24 38,32 42,45 32,37 22,45 26,32 15,24 28,24" fill="#FF7F6A" />
          <circle cx="32" cy="32" r="5" fill="#FFF8EF" />
        </svg>
      );

    case 5: // Thief
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="32" r="28" fill="#352820" stroke="#B58A42" strokeWidth="2" />
          <path d="M16 28 Q32 24 48 28 Q44 42 32 38 Q20 42 16 28 Z" fill="#211710" stroke="#FF7F6A" strokeWidth="1.5" />
          <circle cx="25" cy="31" r="2.5" fill="#FFF8EF" />
          <circle cx="39" cy="31" r="2.5" fill="#FFF8EF" />
        </svg>
      );

    default: // Minister, Soldier, Scholar, etc.
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="32" r="28" fill="#FFF8EF" stroke="#B58A42" strokeWidth="2" />
          <circle cx="32" cy="24" r="9" fill="#BFA886" />
          <path d="M18 48 C18 38 24 35 32 35 C40 35 46 38 46 48 Z" fill="#D8C3A5" />
          <polygon points="32,10 35,16 42,16 36,20 38,27 32,22 26,27 28,20 22,16 29,16" fill="#B58A42" />
        </svg>
      );
  }
};
