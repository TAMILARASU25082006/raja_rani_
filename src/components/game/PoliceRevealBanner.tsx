import React from 'react';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Crosshair, AlertCircle } from 'lucide-react';

export const PoliceRevealBanner: React.FC = () => {
  const { roomState, myPrivateRole } = useGame();
  const { t } = useLanguage();

  if (!roomState) return null;

  const policeSeatIndex = roomState.policePlayerSeat;
  const policeSeat = policeSeatIndex !== undefined && policeSeatIndex !== null
    ? roomState.seats[policeSeatIndex]
    : null;

  const isMePolice = myPrivateRole?.name === 'Police';

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-r from-coral-reef/25 via-cream to-coral-reef/25 rounded-2xl border-2 border-coral-deep p-4 sm:p-6 shadow-xl text-center space-y-3 animate-fade-in">
      {policeSeat ? (
        <>
          <div className="inline-flex items-center gap-2 bg-coral-deep text-cream px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>The Royal Enforcer Has Been Summoned</span>
          </div>

          <h2 className="font-serif font-black text-2xl sm:text-3xl text-royal-brown tracking-wide">
            👮 <span className="text-coral-deep">{policeSeat.nickname}</span> is the Police!
          </h2>

          <div className="p-3 bg-cream-soft rounded-xl border border-sand text-sm font-serif font-bold text-coral-deep flex items-center justify-center gap-2">
            <Crosshair className="w-5 h-5 text-coral-deep animate-pulse" />
            <span>{t.policeCall}</span>
          </div>

          {isMePolice && (
            <div className="text-xs font-bold text-coral-deep bg-coral-reef/15 p-2.5 rounded-xl border border-coral-reef/30 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>{t.youArePolice}</span>
            </div>
          )}
        </>
      ) : (
        <div className="py-4 text-royal-brown font-serif font-bold text-lg animate-pulse">
          ⚔️ The Royal Court searches for the Enforcer of Justice...
        </div>
      )}
    </div>
  );
};
