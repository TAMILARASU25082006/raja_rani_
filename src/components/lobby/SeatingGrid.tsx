import React from 'react';
import { PublicSeatInfo } from '../../types/game';
import { ChairItem } from './ChairItem';

interface SeatingGridProps {
  seats: (PublicSeatInfo | null)[];
  currentUserId: string;
  isAccusationPhase?: boolean;
  policeUserId?: string;
  selectedSuspectSeat?: number | null;
  onSelectSuspect?: (seatIndex: number) => void;
}

export const SeatingGrid: React.FC<SeatingGridProps> = ({
  seats,
  currentUserId,
  isAccusationPhase = false,
  policeUserId = '',
  selectedSuspectSeat = null,
  onSelectSuspect,
}) => {
  const isCurrentPolice = isAccusationPhase && currentUserId === policeUserId;

  return (
    <div className="w-full bg-cream-soft rounded-2xl border border-sand p-4 sm:p-6 shadow-inner">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 max-h-[520px] overflow-y-auto pr-1">
        {seats.map((seat, idx) => {
          const isCurrentUser = seat !== null && seat.userId === currentUserId;
          const isSelectable =
            isCurrentPolice && seat !== null && !isCurrentUser && seat.isConnected;

          return (
            <ChairItem
              key={idx}
              seat={seat}
              seatIndex={idx}
              isCurrentUser={isCurrentUser}
              isSelectableForAccusation={isSelectable}
              isSelected={selectedSuspectSeat === idx}
              onSelect={() => onSelectSuspect && onSelectSuspect(idx)}
            />
          );
        })}
      </div>
    </div>
  );
};
