import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useSound } from '../../context/SoundContext';
import { ThroneSvg } from '../svg/ThroneSvg';
import { CrownSvg } from '../svg/CrownSvg';
import { AvatarSvg } from '../svg/AvatarSvg';

export const KingThroneAnim: React.FC = () => {
  const { roomState } = useGame();
  const { reducedMotion } = useSound();

  const [step, setStep] = useState<'walking' | 'seated'>('walking');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('seated');
    }, 5500);

    return () => clearTimeout(timer);
  }, []);

  if (!roomState) return null;

  const kingSeatIndex = roomState.kingPlayerSeat;
  const kingSeat = kingSeatIndex !== undefined && kingSeatIndex !== null
    ? roomState.seats[kingSeatIndex]
    : null;

  const kingNickname = kingSeat ? kingSeat.nickname : 'The Monarch';

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-cream via-cream-soft to-gold/15 rounded-3xl border-4 border-gold p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center justify-between min-h-[440px] relative overflow-hidden animate-fade-in">
      <div className="flex flex-col items-center space-y-1 z-10">
        <div className="animate-royal-pulse">
          <CrownSvg size="lg" />
        </div>
        <h2 className="font-serif font-black text-2xl sm:text-4xl text-royal-brown tracking-widest mt-2">
          ALL HAIL THE KING!
        </h2>
        <div className="text-sm sm:text-base font-bold text-gold-dark font-serif">
          👑 King <span className="text-coral-deep text-lg">{kingNickname}</span> (10,000 Points)
        </div>
      </div>

      <div className="relative my-6 w-full flex items-center justify-center h-56">
        <div className="relative z-0">
          <ThroneSvg className="w-44 sm:w-52 h-56 drop-shadow-2xl" />
        </div>

        <div
          className={`absolute z-10 flex flex-col items-center transition-all duration-1000 ${
            step === 'seated'
              ? 'bottom-12 transform scale-95'
              : reducedMotion
              ? 'bottom-12'
              : 'bottom-0 animate-throne-walk'
          }`}
        >
          <div className="mb-0.5">
            <CrownSvg size="sm" />
          </div>

          <AvatarSvg
            index={kingSeatIndex ?? 0}
            size="lg"
            className="ring-4 ring-gold shadow-xl"
          />

          {step === 'walking' && (
            <div className="mt-1 bg-royal-brown text-cream text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-bounce">
              Approaching Throne...
            </div>
          )}
          {step === 'seated' && (
            <div className="mt-1 bg-gold text-cream text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
              👑 CROWNED & SEATED
            </div>
          )}
        </div>
      </div>

      <div className="z-10 bg-cream/90 px-6 py-2.5 rounded-2xl border border-sand shadow-inner text-xs sm:text-sm font-serif font-semibold text-royal-brown">
        {step === 'walking'
          ? 'The Sovereign walks through the grand hall toward the golden throne...'
          : 'The Sovereign has taken the throne. Revealing the royal court scores...'}
      </div>
    </div>
  );
};
