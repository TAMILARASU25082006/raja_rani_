import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';
import { Crosshair, AlertTriangle } from 'lucide-react';

export const AccusationControl: React.FC = () => {
  const {
    roomState,
    myPrivateRole,
    selectedSuspectSeat,
    submitAccusation,
  } = useGame();
  const { t } = useLanguage();

  if (!roomState || roomState.phase !== 'ACCUSATION') return null;

  const isMePolice = myPrivateRole?.name === 'Police';
  const selectedSeat =
    selectedSuspectSeat !== null && selectedSuspectSeat !== undefined
      ? roomState.seats[selectedSuspectSeat]
      : null;

  if (!isMePolice) {
    return (
      <div className="bg-cream rounded-2xl border border-sand p-4 text-center space-y-1.5 shadow-sm">
        <div className="font-serif font-bold text-base text-royal-brown">
          ⚖️ The Police is evaluating suspects...
        </div>
        <div className="text-xs text-royal-muted">
          Remain calm and await the sovereign verdict.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-coral-reef/20 via-cream to-coral-reef/20 rounded-2xl border-2 border-coral-deep p-4 sm:p-5 shadow-xl space-y-3 animate-pulse">
      <div className="flex items-center gap-2 text-coral-deep font-serif font-black text-lg sm:text-xl justify-center">
        <Crosshair className="w-6 h-6 animate-spin" />
        <span>{t.policeSelectPrompt}</span>
      </div>

      {selectedSeat ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-coral-reef/40">
          <div className="text-center sm:text-left">
            <div className="text-xs text-royal-muted font-semibold">Selected Suspect:</div>
            <div className="font-serif font-black text-lg text-royal-brown">
              #{selectedSeat.seatIndex + 1} - {selectedSeat.nickname}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => submitAccusation(selectedSeat.seatIndex)}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <Crosshair className="w-5 h-5" />
            <span>{t.confirmAccusation}</span>
          </Button>
        </div>
      ) : (
        <div className="text-center text-xs text-coral-deep font-bold bg-coral-reef/15 p-2.5 rounded-xl border border-coral-reef/30 flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>Tap on any player's chair above to mark them as your suspect.</span>
        </div>
      )}
    </div>
  );
};
