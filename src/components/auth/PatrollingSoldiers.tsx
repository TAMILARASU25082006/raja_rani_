'use client';

import React from 'react';
import { SoldierSvg } from '../svg/SoldierSvg';
import { useSound } from '@/hooks/useSound';

export const PatrollingSoldiers: React.FC = () => {
  const { reducedMotion } = useSound();

  return (
    <div className="relative w-full max-w-2xl h-28 mx-auto flex items-end justify-between px-6 pointer-events-none select-none">
      <div
        className={`transform origin-bottom ${
          reducedMotion ? '' : 'animate-patrol-left'
        }`}
      >
        <SoldierSvg className="w-14 h-24 drop-shadow-md" />
      </div>

      <div
        className={`transform origin-bottom ${
          reducedMotion ? '' : 'animate-patrol-right'
        }`}
      >
        <SoldierSvg className="w-14 h-24 drop-shadow-md" />
      </div>
    </div>
  );
};
