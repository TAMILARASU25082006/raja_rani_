import React from 'react';
import { PublicSeatInfo } from '../../types/game';
import { ChairSvg } from '../svg/ChairSvg';
import { AvatarSvg } from '../svg/AvatarSvg';
import { Crown, CheckCircle2, CircleDashed, WifiOff, ShieldCheck, Crosshair } from 'lucide-react';

interface ChairItemProps {
  seat: PublicSeatInfo | null;
  seatIndex: number;
  isCurrentUser: boolean;
  isSelectableForAccusation?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const ChairItem: React.FC<ChairItemProps> = ({
  seat,
  seatIndex,
  isCurrentUser,
  isSelectableForAccusation = false,
  isSelected = false,
  onSelect,
}) => {
  const isOccupied = seat !== null;

  return (
    <div
      onClick={isSelectableForAccusation && onSelect ? onSelect : undefined}
      className={`relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-200 select-none ${
        isSelected
          ? 'bg-coral-reef/20 border-coral-deep ring-4 ring-coral-deep/30 shadow-lg scale-105'
          : isSelectableForAccusation
          ? 'bg-cream hover:bg-cream-soft border-gold/60 hover:border-coral-deep cursor-pointer hover:scale-102 shadow-md'
          : isOccupied
          ? isCurrentUser
            ? 'bg-gold/10 border-gold/50 shadow-sm'
            : 'bg-cream border-sand/80 shadow-xs'
          : 'bg-beige/40 border-dashed border-sand/60 opacity-60'
      }`}
    >
      <div className="absolute top-1.5 left-2 text-[10px] font-mono font-bold text-royal-muted/70">
        #{seatIndex + 1}
      </div>

      {isSelectableForAccusation && (
        <div
          className={`absolute top-1.5 right-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
            isSelected
              ? 'bg-coral-deep text-cream'
              : 'bg-gold/20 text-gold-dark border border-gold/40'
          }`}
        >
          <Crosshair className="w-3 h-3" />
          <span>{isSelected ? 'Suspect' : 'Accuse'}</span>
        </div>
      )}

      <div className="relative my-1 flex items-center justify-center">
        <ChairSvg
          className="w-16 h-18 drop-shadow-sm"
          isOccupied={isOccupied}
          isReady={seat?.isReady}
          isSelected={isSelected}
        />

        {isOccupied && (
          <div className="absolute top-1 flex flex-col items-center">
            <AvatarSvg index={seatIndex} size="md" className="shadow-sm ring-2 ring-cream" />
          </div>
        )}
      </div>

      <div className="w-full text-center mt-1">
        {isOccupied ? (
          <>
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-royal-brown truncate max-w-[120px] mx-auto">
              {seat.isOwner && (
                <span title="Room Owner" aria-label="Room Owner" className="inline-flex items-center flex-shrink-0">
                  <Crown className="w-3.5 h-3.5 text-gold-dark" />
                </span>
              )}
              <span className="truncate">{seat.nickname}</span>
              {isCurrentUser && (
                <span className="text-[10px] text-coral-deep font-semibold flex-shrink-0">(You)</span>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-1">
              {!seat.isConnected ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                  <WifiOff className="w-3 h-3" /> Reconnecting
                </span>
              ) : seat.isReady ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-royal-muted bg-beige px-1.5 py-0.5 rounded">
                  <CircleDashed className="w-3 h-3 animate-spin" /> Waiting
                </span>
              )}

              {seat.isPoliceRevealed && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-coral-deep bg-coral-reef/20 px-1.5 py-0.5 rounded border border-coral-reef/40">
                  <ShieldCheck className="w-3 h-3" /> Police
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="text-[11px] font-medium text-royal-muted/60 italic py-2">
            Empty Throne
          </div>
        )}
      </div>
    </div>
  );
};
