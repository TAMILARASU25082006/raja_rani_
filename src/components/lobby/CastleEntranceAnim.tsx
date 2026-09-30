import React from 'react';
import { CastleSvg } from '../svg/CastleSvg';

export const CastleEntranceAnim: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-royal-dark/80 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in pointer-events-none">
      <div className="w-full max-w-2xl transform scale-110">
        <CastleSvg className="w-full h-auto drop-shadow-2xl" showGateOpen={true} />
      </div>
      <div className="mt-6 text-center animate-bounce">
        <h2 className="font-serif font-black text-2xl sm:text-3xl text-gold-light tracking-widest drop-shadow-md">
          ENTERING THE ROYAL PALACE...
        </h2>
        <p className="text-sm text-sand-light mt-1 font-sans">
          The Palace Gates Swing Open
        </p>
      </div>
    </div>
  );
};
