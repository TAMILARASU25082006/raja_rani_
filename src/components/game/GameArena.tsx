import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MatchHeader } from './MatchHeader';
import { PrivateRoleCard } from './PrivateRoleCard';
import { PoliceRevealBanner } from './PoliceRevealBanner';
import { AccusationControl } from './AccusationControl';
import { TargetedEffectOverlay } from './TargetedEffectOverlay';
import { KingThroneAnim } from './KingThroneAnim';
import { ResultsScoreboard } from './ResultsScoreboard';
import { SeatingGrid } from '../lobby/SeatingGrid';
import { PlayerListView } from '../lobby/PlayerListView';
import { RoomChat } from '../lobby/RoomChat';
import { LayoutGrid, List, Shield } from 'lucide-react';

export const GameArena: React.FC = () => {
  const {
    roomState,
    myPrivateRole,
    selectedSuspectSeat,
    setSelectedSuspectSeat,
  } = useGame();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showRoleDrawer, setShowRoleDrawer] = useState<boolean>(true);

  if (!roomState) return null;

  const currentPhase = roomState.phase;
  const policeUserId =
    roomState.policePlayerSeat !== undefined && roomState.policePlayerSeat !== null
      ? roomState.seats[roomState.policePlayerSeat]?.userId
      : '';

  if (currentPhase === 'THRONE') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <MatchHeader />
        <KingThroneAnim />
      </div>
    );
  }

  if (currentPhase === 'RESULTS') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <ResultsScoreboard />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <TargetedEffectOverlay />
      <MatchHeader />

      {currentPhase === 'POLICE_REVEAL' && <PoliceRevealBanner />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-serif font-bold text-lg text-royal-brown flex items-center gap-2">
              <span>Palace Assembly</span>
              {currentPhase === 'ACCUSATION' && (
                <span className="text-xs font-sans font-bold text-coral-deep bg-coral-reef/20 px-2 py-0.5 rounded-full">
                  Accusation Active
                </span>
              )}
            </h3>

            <div className="bg-beige/60 p-1 rounded-xl border border-sand flex items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  viewMode === 'grid'
                    ? 'bg-cream text-coral-deep shadow-xs'
                    : 'text-royal-muted hover:text-royal-brown'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  viewMode === 'list'
                    ? 'bg-cream text-coral-deep shadow-xs'
                    : 'text-royal-muted hover:text-royal-brown'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <SeatingGrid
              seats={roomState.seats}
              currentUserId={user?.id || ''}
              isAccusationPhase={currentPhase === 'ACCUSATION'}
              policeUserId={policeUserId}
              selectedSuspectSeat={selectedSuspectSeat}
              onSelectSuspect={(seatIdx) => setSelectedSuspectSeat(seatIdx)}
            />
          ) : (
            <PlayerListView
              seats={roomState.seats}
              currentUserId={user?.id || ''}
              isAccusationPhase={currentPhase === 'ACCUSATION'}
              policeUserId={policeUserId}
              selectedSuspectSeat={selectedSuspectSeat}
              onSelectSuspect={(seatIdx) => setSelectedSuspectSeat(seatIdx)}
            />
          )}

          {currentPhase === 'ACCUSATION' && <AccusationControl />}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-serif font-bold text-sm text-royal-brown flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-gold-dark" />
                <span>{t.yourRole}</span>
              </h3>

              <button
                onClick={() => setShowRoleDrawer(!showRoleDrawer)}
                className="text-xs font-semibold text-coral-deep hover:underline"
              >
                {showRoleDrawer ? 'Hide Card' : 'View Card'}
              </button>
            </div>

            {showRoleDrawer && <PrivateRoleCard role={myPrivateRole} />}
          </div>

          <div className="space-y-2">
            <h3 className="font-serif font-bold text-sm text-royal-brown px-1">
              {t.roomChat}
            </h3>
            <RoomChat />
          </div>
        </div>
      </div>
    </div>
  );
};
