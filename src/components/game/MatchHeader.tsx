'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import { useLanguage } from '@/hooks/useLanguage';
import { Clock, Hourglass } from 'lucide-react';

export const MatchHeader: React.FC = () => {
  const { roomState } = useGame();
  const { t } = useLanguage();

  const [phaseTimeLeft, setPhaseTimeLeft] = useState<number>(0);
  const [matchTimeLeft, setMatchTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!roomState) return;

    const updateTimer = () => {
      const now = Date.now();
      if (roomState.phaseDeadline) {
        setPhaseTimeLeft(Math.max(0, Math.ceil((roomState.phaseDeadline - now) / 1000)));
      } else {
        setPhaseTimeLeft(roomState.phaseTimeRemaining);
      }

      if (roomState.overallMatchDeadline) {
        setMatchTimeLeft(Math.max(0, Math.ceil((roomState.overallMatchDeadline - now) / 1000)));
      } else {
        setMatchTimeLeft(roomState.overallMatchTimeRemaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);
    return () => clearInterval(interval);
  }, [roomState]);

  if (!roomState) return null;

  const phaseKey = `phase_${roomState.phase}` as keyof typeof t;
  const phaseLabel = t[phaseKey] || roomState.phase;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-cream rounded-2xl border-2 border-sand p-4 sm:p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-coral-reef/20 text-coral-deep p-2.5 rounded-xl border border-coral-reef/40">
          <Hourglass className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-royal-muted uppercase tracking-wider">
            Current Phase
          </div>
          <h2 className="font-serif font-black text-lg sm:text-xl text-royal-brown tracking-wide">
            {phaseLabel}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 bg-beige/80 px-3.5 py-1.5 rounded-xl border border-sand">
          <Clock className="w-4 h-4 text-coral-deep" />
          <div>
            <div className="text-[10px] font-bold text-royal-muted">{t.timeRemaining}</div>
            <div className="font-mono font-black text-lg text-coral-deep">
              {phaseTimeLeft}s
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gold/15 px-3.5 py-1.5 rounded-xl border border-gold/30">
          <Clock className="w-4 h-4 text-gold-dark" />
          <div>
            <div className="text-[10px] font-bold text-gold-dark">{t.matchRemaining}</div>
            <div className="font-mono font-bold text-base text-royal-brown">
              {formatTime(matchTimeLeft)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
