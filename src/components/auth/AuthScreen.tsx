import React from 'react';
import { CastleSvg } from '../svg/CastleSvg';
import { PatrollingSoldiers } from './PatrollingSoldiers';
import { AuthCard } from './AuthCard';

export const AuthScreen: React.FC = () => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 overflow-hidden bg-gradient-to-b from-beige via-beige-light to-sand/40">
      <div className="w-full max-w-4xl mx-auto mb-2 opacity-95 transition-opacity">
        <CastleSvg className="w-full max-h-[300px] object-contain drop-shadow-lg" />
      </div>

      <div className="-mt-16 sm:-mt-20 w-full max-w-2xl z-0 mb-4">
        <PatrollingSoldiers />
      </div>

      <div className="w-full flex justify-center z-10">
        <AuthCard />
      </div>
    </div>
  );
};
