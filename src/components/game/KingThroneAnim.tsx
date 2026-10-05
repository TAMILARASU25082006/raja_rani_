'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import { useSound } from '@/hooks/useSound';
import { RajaRaniThroneScene } from '../svg/RajaRaniThroneScene';
import { CrownSvg } from '../svg/CrownSvg';
import { Sparkles, Trophy, Heart } from 'lucide-react';

export const KingThroneAnim: React.FC = () => {
  const { roomState } = useGame();
  const { playFanfare } = useSound();

  const [step, setStep] = useState<'walking' | 'seated'>('walking');

  useEffect(() => {
    // 4.5s of grand procession walk, then both majestically take their twin thrones with fanfare!
    const timer = setTimeout(() => {
      setStep('seated');
      playFanfare();
    }, 4500);

    return () => clearTimeout(timer);
  }, [playFanfare]);

  if (!roomState) return null;

  const kingSeatIndex = roomState.kingPlayerSeat;
  const kingSeat =
    kingSeatIndex !== undefined && kingSeatIndex !== null
      ? roomState.seats[kingSeatIndex]
      : null;

  const queenSeatIndex = roomState.queenPlayerSeat;
  const queenSeat =
    queenSeatIndex !== undefined && queenSeatIndex !== null
      ? roomState.seats[queenSeatIndex]
      : null;

  const kingNickname = kingSeat ? kingSeat.nickname : 'Raja (King)';
  const queenNickname = queenSeat ? queenSeat.nickname : 'Rani (Queen)';
  const hasQueen = Boolean(queenSeat);

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-cream via-cream-soft to-gold/20 rounded-3xl border-4 border-gold p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center justify-between min-h-[540px] relative overflow-hidden animate-fade-in">
      {/* Top Royal Proclamation */}
      <div className="flex flex-col items-center space-y-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40 animate-royal-pulse">
            <CrownSvg size="sm" />
          </div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-gold-dark font-serif">
            Grand Royal Coronation Ceremony • ராஜா ராணி அரியணை
          </span>
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40 animate-royal-pulse">
            <CrownSvg size="sm" />
          </div>
        </div>

        <h2 className="font-serif font-black text-2xl sm:text-4xl text-royal-brown tracking-widest drop-shadow-sm">
          {step === 'walking' ? 'RAJA & RANI APPROACH THE THRONES...' : 'ALL HAIL THE KING & QUEEN!'}
        </h2>

        {/* Twin Badges for Raja & Rani */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          {/* King Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-reef/20 to-cream px-4 py-1.5 rounded-2xl border-2 border-coral-deep/40 shadow-xs">
            <span className="text-lg">👑</span>
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-coral-deep tracking-wider">Raja / அரசர்</div>
              <div className="font-serif font-black text-sm sm:text-base text-royal-brown">
                {kingNickname} <span className="text-xs text-gold-dark font-mono font-bold">(10,000 Pts)</span>
              </div>
            </div>
          </div>

          {/* Queen Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-cream px-4 py-1.5 rounded-2xl border-2 border-pink-400/50 shadow-xs">
            <span className="text-lg">👸</span>
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-pink-700 tracking-wider">Rani / அரசி</div>
              <div className="font-serif font-black text-sm sm:text-base text-royal-brown">
                {queenNickname} <span className="text-xs text-pink-700 font-mono font-bold">(9,000 Pts)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centerpiece: Twin Thrones Scene with Raja and Rani */}
      <div className="my-3 w-full max-w-2xl mx-auto relative">
        <RajaRaniThroneScene
          step={step}
          kingName={kingNickname}
          queenName={queenNickname}
        />

        {/* Status Tag Overlay */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {step === 'walking' ? (
            <div className="bg-royal-brown text-cream text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-gold/50 flex items-center gap-2 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
              <span>Raja & Rani Ascending the Royal Thrones...</span>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-coral-deep via-pink-700 to-coral-deep text-cream text-xs sm:text-sm font-black px-5 py-2 rounded-full shadow-2xl border-2 border-gold flex items-center gap-2 animate-scale-up">
              <Sparkles className="w-4 h-4 text-gold animate-spin" />
              <span>👑👸 BOTH RAJA & RANI SEATED ON THE THRONES! (ராஜா & ராணி)</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Court Narration */}
      <div className="z-10 w-full max-w-2xl bg-white/95 px-6 py-3 rounded-2xl border-2 border-sand shadow-inner text-xs sm:text-sm font-serif font-semibold text-royal-brown flex items-center justify-center gap-2">
        {step === 'walking' ? (
          <>
            <span className="text-gold-dark text-base">⚔️</span>
            <span>
              King <strong className="text-coral-deep">{kingNickname}</strong> and Queen{' '}
              <strong className="text-pink-700">{queenNickname}</strong> walk side-by-side along the red carpet toward the golden thrones...
            </span>
          </>
        ) : (
          <>
            <span className="text-coral-deep text-base">👑</span>
            <span>
              Both Raja and Rani are seated in crowned sovereignty upon their golden thrones! Revealing the full court scoreboard...
            </span>
          </>
        )}
      </div>
    </div>
  );
};
