'use client';

import React from 'react';
import { useGame } from '@/hooks/useGame';
import { useSound } from '@/hooks/useSound';
import { useLanguage } from '@/hooks/useLanguage';
import { GunSvg, GrenadeSvg, CrackedGlassSvg } from '../svg/EffectSvgs';
import { Crosshair } from 'lucide-react';

export const TargetedEffectOverlay: React.FC = () => {
  const { activeEffect, roomState } = useGame();
  const { reducedMotion } = useSound();
  const { t } = useLanguage();

  if (!roomState || roomState.phase !== 'EFFECT') return null;

  const accusationResult = roomState.accusationResult;

  if (activeEffect === 'gunshot') {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-red-950/40 backdrop-blur-xs">
        <div className="absolute inset-0 z-10 opacity-90">
          <CrackedGlassSvg />
        </div>

        <div
          className={`z-20 flex flex-col items-center justify-center p-6 bg-cream/90 rounded-3xl border-4 border-coral-deep shadow-2xl ${
            reducedMotion ? '' : 'animate-gunshot'
          }`}
        >
          <GunSvg className="w-36 h-36 drop-shadow-xl" />
          <div className="mt-3 text-center">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-coral-deep tracking-wider">
              💥 YOU WERE CAUGHT!
            </h2>
            <p className="text-xs font-bold text-royal-brown mt-1">
              The Police spotted you! (0 points)
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeEffect === 'grenade') {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-amber-950/40 backdrop-blur-xs">
        <div className="absolute inset-0 z-10 opacity-90">
          <CrackedGlassSvg />
        </div>

        <div
          className={`z-20 flex flex-col items-center justify-center p-6 bg-cream/90 rounded-3xl border-4 border-coral-deep shadow-2xl ${
            reducedMotion ? '' : 'animate-grenade'
          }`}
        >
          <GrenadeSvg className="w-36 h-36 drop-shadow-xl" />
          <div className="mt-3 text-center">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-coral-deep tracking-wider">
              💣 WRONG SUSPECT!
            </h2>
            <p className="text-xs font-bold text-royal-brown mt-1">
              {accusationResult?.isTimeout
                ? 'Time ran out! The Thief escaped!'
                : 'You accused the wrong person! The Thief escaped!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 bg-royal-dark/20 backdrop-blur-xs animate-fade-in">
      <div className="bg-cream/95 border-2 border-sand p-6 rounded-3xl shadow-2xl max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-gold/20 mx-auto flex items-center justify-center border border-gold/40">
          <Crosshair className="w-6 h-6 text-gold-dark" />
        </div>
        <h3 className="font-serif font-black text-xl text-royal-brown tracking-wide">
          {t.accusationResolved}
        </h3>
        <p className="text-xs text-royal-muted font-medium">
          The King prepares to reveal royal decree and ascend the throne...
        </p>
      </div>
    </div>
  );
};
