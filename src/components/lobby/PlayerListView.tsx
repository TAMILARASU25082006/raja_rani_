import React from 'react';
import { PublicSeatInfo } from '../../types/game';
import { AvatarSvg } from '../svg/AvatarSvg';
import { Crown, CheckCircle2, CircleDashed, WifiOff, ShieldCheck, Crosshair } from 'lucide-react';

interface PlayerListViewProps {
  seats: (PublicSeatInfo | null)[];
  currentUserId: string;
  isAccusationPhase?: boolean;
  policeUserId?: string;
  selectedSuspectSeat?: number | null;
  onSelectSuspect?: (seatIndex: number) => void;
}

export const PlayerListView: React.FC<PlayerListViewProps> = ({
  seats,
  currentUserId,
  isAccusationPhase = false,
  policeUserId = '',
  selectedSuspectSeat = null,
  onSelectSuspect,
}) => {
  const isCurrentPolice = isAccusationPhase && currentUserId === policeUserId;
  const occupiedSeats = seats
    .map((seat, index) => ({ seat, index }))
    .filter((item): item is { seat: PublicSeatInfo; index: number } => item.seat !== null);

  return (
    <div className="w-full bg-cream-soft rounded-2xl border border-sand p-3 sm:p-4 shadow-inner max-h-[520px] overflow-y-auto">
      <div className="space-y-2">
        {occupiedSeats.map(({ seat, index }) => {
          const isCurrentUser = seat.userId === currentUserId;
          const isSelectable = isCurrentPolice && !isCurrentUser && seat.isConnected;
          const isSelected = selectedSuspectSeat === index;

          return (
            <div
              key={index}
              onClick={isSelectable && onSelectSuspect ? () => onSelectSuspect(index) : undefined}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-coral-reef/20 border-coral-deep ring-2 ring-coral-deep/30 shadow-md'
                  : isSelectable
                  ? 'bg-cream hover:bg-white border-gold cursor-pointer'
                  : 'bg-cream border-sand'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <AvatarSvg index={index} size="sm" />
                  <span className="absolute -bottom-1 -right-1 bg-royal-brown text-cream text-[9px] font-mono px-1 rounded">
                    #{index + 1}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-royal-brown">
                    {seat.isOwner && (
                      <span title="Room Owner" aria-label="Room Owner" className="inline-flex items-center flex-shrink-0">
                        <Crown className="w-3.5 h-3.5 text-gold-dark" />
                      </span>
                    )}
                    <span>{seat.nickname}</span>
                    {isCurrentUser && <span className="text-xs text-coral-deep font-semibold">(You)</span>}
                  </div>
                  {seat.isPoliceRevealed && (
                    <div className="text-[11px] font-bold text-coral-deep flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Police
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!seat.isConnected ? (
                  <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    <WifiOff className="w-3.5 h-3.5" /> Reconnecting
                  </span>
                ) : seat.isReady ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-royal-muted bg-beige px-2 py-0.5 rounded">
                    <CircleDashed className="w-3.5 h-3.5 animate-spin" /> Waiting
                  </span>
                )}

                {isSelectable && (
                  <button
                    type="button"
                    className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1 ${
                      isSelected
                        ? 'bg-coral-deep text-cream'
                        : 'bg-gold/20 text-gold-dark border border-gold/40'
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>{isSelected ? 'Suspect Selected' : 'Accuse'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
