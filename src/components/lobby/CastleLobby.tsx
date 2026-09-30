import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { PublicSeatInfo } from '../../types/game';
import { SeatingGrid } from './SeatingGrid';
import { PlayerListView } from './PlayerListView';
import { RoomChat } from './RoomChat';
import { Button } from '../common/Button';
import {
  Copy,
  Check,
  LayoutGrid,
  List,
  Play,
  CheckCircle2,
  CircleDashed,
  LogOut,
  Users,
  ShieldCheck,
  Crown,
} from 'lucide-react';

export const CastleLobby: React.FC = () => {
  const { roomState, isOwner, mySeatIndex, toggleReady, startMatch, leaveRoom } = useGame();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!roomState) return null;

  const connectedPlayers = roomState.seats.filter((s): s is PublicSeatInfo => s !== null && s.isConnected);
  const totalPlayersCount = connectedPlayers.length;
  const mySeat = mySeatIndex !== -1 ? roomState.seats[mySeatIndex] : null;
  const isMyReady = mySeat?.isReady ?? false;

  const handleShare = async () => {
    const url = `${window.location.origin}?join=${roomState.roomCode}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Join Raja Rani Royal Match!',
          text: `Enter the Palace! Join my Raja Rani game with room code: ${roomState.roomCode}`,
          url,
        });
        return;
      } catch {}
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="bg-cream rounded-2xl border-2 border-sand p-4 sm:p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-beige/80 border border-sand px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-royal-muted">
              {t.roomCode}:
            </span>
            <span className="font-mono font-black text-xl sm:text-2xl text-royal-brown tracking-widest">
              {roomState.roomCode}
            </span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gold-dark" />}
            <span>{copied ? t.linkCopied : 'Share / Copy Link'}</span>
          </Button>

          <div className="flex items-center gap-1.5 text-xs font-bold text-royal-brown bg-gold/15 px-3 py-2 rounded-xl border border-gold/30">
            <Users className="w-4 h-4 text-gold-dark" />
            <span>
              {totalPlayersCount} / {roomState.maxCapacity} {t.playersCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="bg-beige/60 p-1 rounded-xl border border-sand flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'grid'
                  ? 'bg-cream text-coral-deep shadow-xs'
                  : 'text-royal-muted hover:text-royal-brown'
              }`}
              title={t.seatingView}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">{t.seatingView}</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'list'
                  ? 'bg-cream text-coral-deep shadow-xs'
                  : 'text-royal-muted hover:text-royal-brown'
              }`}
              title={t.listView}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">{t.listView}</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={leaveRoom}
            className="flex items-center gap-1 text-red-700 hover:bg-red-50 border-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t.leaveRoom}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-serif font-bold text-lg text-royal-brown flex items-center gap-2">
              <span>{t.phase_LOBBY}</span>
              <span className="text-xs font-sans font-normal text-royal-muted">
                ({totalPlayersCount >= 5 ? 'Ready to battle' : 'Minimum 5 players required'})
              </span>
            </h3>

            {isOwner && (
              <span className="text-xs font-bold text-gold-dark flex items-center gap-1 bg-gold/15 px-2.5 py-1 rounded-lg border border-gold/30">
                <span title="Room Owner" aria-label="Room Owner" className="inline-flex items-center">
                  <Crown className="w-3.5 h-3.5" />
                </span>
                <span>Room Sovereign</span>
              </span>
            )}
          </div>

          {viewMode === 'grid' ? (
            <SeatingGrid seats={roomState.seats} currentUserId={user?.id || ''} />
          ) : (
            <PlayerListView seats={roomState.seats} currentUserId={user?.id || ''} />
          )}

          <div className="bg-cream rounded-2xl border-2 border-sand p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              variant={isMyReady ? 'secondary' : 'primary'}
              size="lg"
              onClick={toggleReady}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              {isMyReady ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{t.markNotReady}</span>
                </>
              ) : (
                <>
                  <CircleDashed className="w-5 h-5" />
                  <span>{t.markReady}</span>
                </>
              )}
            </Button>

            {isOwner ? (
              <div className="w-full sm:w-auto flex flex-col sm:items-end">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={startMatch}
                  disabled={!roomState.canStart}
                  className="w-full sm:w-auto flex items-center gap-2 shadow-lg"
                >
                  <Play className="w-5 h-5 fill-cream" />
                  <span>{t.startMatch}</span>
                </Button>

                {!roomState.canStart && (
                  <span className="text-[11px] text-coral-deep font-semibold mt-1">
                    {totalPlayersCount < 5 ? t.needMinPlayers : t.waitingForReady}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-royal-muted font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-dark" />
                <span>Waiting for Room Owner to initiate the match...</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-royal-brown px-1">
            {t.roomChat}
          </h3>
          <RoomChat />
        </div>
      </div>
    </div>
  );
};
