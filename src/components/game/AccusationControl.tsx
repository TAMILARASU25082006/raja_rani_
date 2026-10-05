'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AvatarSvg } from '@/components/svg/AvatarSvg';
import { Crosshair, AlertTriangle, Lock, ShieldAlert, Check, X, User } from 'lucide-react';

export const AccusationControl: React.FC = () => {
  const {
    roomState,
    myPrivateRole,
    selectedSuspectSeat,
    submitAccusation,
  } = useGame();
  const { t } = useLanguage();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [lastSelectedSeat, setLastSelectedSeat] = useState<number | null>(null);

  if (!roomState || roomState.phase !== 'ACCUSATION') return null;

  const isMePolice = myPrivateRole?.name === 'Police';
  const selectedSeat =
    selectedSuspectSeat !== null && selectedSuspectSeat !== undefined
      ? roomState.seats[selectedSuspectSeat]
      : null;

  // Whenever the Police selects a new player, automatically open the lock confirmation modal
  useEffect(() => {
    if (
      isMePolice &&
      selectedSuspectSeat !== null &&
      selectedSuspectSeat !== undefined &&
      selectedSuspectSeat !== lastSelectedSeat
    ) {
      setLastSelectedSeat(selectedSuspectSeat);
      setIsConfirmModalOpen(true);
    }
  }, [isMePolice, selectedSuspectSeat, lastSelectedSeat]);

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

  const handleConfirmLock = () => {
    if (selectedSeat) {
      setIsConfirmModalOpen(false);
      submitAccusation(selectedSeat.seatIndex);
    }
  };

  const handleCancelLock = () => {
    setIsConfirmModalOpen(false);
  };

  const promptText = selectedSeat
    ? t.lockSuspectPrompt.replace('{name}', selectedSeat.nickname)
    : '';

  return (
    <>
      <div className="bg-gradient-to-r from-coral-reef/20 via-cream to-coral-reef/20 rounded-2xl border-2 border-coral-deep p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-coral-deep font-serif font-black text-lg sm:text-xl justify-center">
          <Crosshair className="w-6 h-6 animate-spin" />
          <span>{t.policeSelectPrompt}</span>
        </div>

        {selectedSeat ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-coral-reef/40">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-coral-reef/20 rounded-full flex items-center justify-center border border-coral-reef/40 flex-shrink-0">
                <AvatarSvg index={selectedSeat.seatIndex} size="sm" />
              </div>
              <div>
                <div className="text-xs text-royal-muted font-semibold">Selected Suspect:</div>
                <div className="font-serif font-black text-lg text-royal-brown">
                  #{selectedSeat.seatIndex + 1} - {selectedSeat.nickname}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsConfirmModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-coral-deep hover:bg-coral-hover text-cream font-bold px-5"
            >
              <Lock className="w-4 h-4" />
              <span>Lock In {selectedSeat.nickname}</span>
            </Button>
          </div>
        ) : (
          <div className="text-center text-xs text-coral-deep font-bold bg-coral-reef/15 p-2.5 rounded-xl border border-coral-reef/30 flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Tap on any player's chair above to mark them as your suspect.</span>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedSeat && (
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={handleCancelLock}
          title={`🔒 ${t.lockSuspectTitle}`}
          maxWidth="md"
        >
          <div className="space-y-5 text-center sm:text-left">
            {/* Suspect Showcase */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-coral-reef/10 border-2 border-coral-deep/30 rounded-2xl p-4">
              <div className="w-16 h-16 bg-cream rounded-2xl border border-sand flex items-center justify-center shadow-md flex-shrink-0">
                <AvatarSvg index={selectedSeat.seatIndex} size="lg" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-mono font-bold text-coral-deep uppercase tracking-wider">
                  Accusing Seat #{selectedSeat.seatIndex + 1}
                </div>
                <div className="font-serif font-black text-2xl text-royal-brown">
                  {selectedSeat.nickname}
                </div>
                <div className="text-xs text-royal-muted">
                  Identified as the suspected Thief
                </div>
              </div>
            </div>

            {/* Core Question */}
            <div className="bg-white border border-sand rounded-xl p-4 text-center space-y-2">
              <div className="font-serif font-bold text-lg text-royal-brown">
                {promptText}
              </div>
              <p className="text-xs text-royal-muted max-w-sm mx-auto">
                {t.lockSuspectDesc}
              </p>
            </div>

            {/* Consequences */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{t.lockSuccessReward}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-900 bg-amber-50 border border-amber-200 p-2.5 rounded-xl font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{t.lockFailurePenalty}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={handleCancelLock}
                className="text-royal-muted hover:text-royal-brown border-sand"
              >
                <X className="w-4 h-4 mr-1.5" />
                {t.cancelLock}
              </Button>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleConfirmLock}
                className="bg-coral-deep hover:bg-coral-hover text-cream font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {t.yesLockPlayer}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
