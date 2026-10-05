'use client';

import React, { useState } from 'react';
import { useGame } from '@/hooks/useGame';
import { useLanguage } from '@/hooks/useLanguage';
import { PublicSeatInfo } from '@/types/game';
import { SeatingGrid } from './SeatingGrid';
import { PlayerListView } from './PlayerListView';
import { RoomChat } from './RoomChat';
import { Button } from '@/components/ui/Button';
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
  const { roomState, isOwner, mySeatIndex, toggleReady, startMatch, leaveRoom, user } = useGame();
  const { t } = useLanguage();

  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [publicTunnelUrl, setPublicTunnelUrl] = useState<string>('');

  React.useEffect(() => {
    fetch('/api/public-tunnel')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.url) {
          setPublicTunnelUrl(data.url);
        }
      })
      .catch(() => {});
  }, []);

  if (!roomState) return null;

  const connectedPlayers = roomState.seats.filter(
    (s): s is PublicSeatInfo => s !== null && s.isConnected
  );
  const totalPlayersCount = connectedPlayers.length;
  const mySeat = mySeatIndex !== -1 ? roomState.seats[mySeatIndex] : null;
  const isMyReady = mySeat?.isReady ?? false;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const isLocalHost = origin.includes('localhost') || origin.includes('127.0.0.1');
  const effectiveBaseUrl = isLocalHost && publicTunnelUrl ? publicTunnelUrl : origin;
  const shareUrl = effectiveBaseUrl ? `${effectiveBaseUrl}/room/${roomState.roomCode}` : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl);
    } else {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    if (!shareUrl) return;
    const msg = `👑 Join my Raja Rani game!\nTap this single link to enter my room directly and play with me:\n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Join Raja Rani Royal Match!',
          text: `Enter the Palace! Join my Raja Rani game directly with this link:`,
          url: shareUrl,
        });
        return;
      } catch {}
    }
    handleCopyLink();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Prominent Single Direct Link Card for Friends */}
      <div className="bg-gradient-to-r from-amber-500/10 via-gold/20 to-amber-500/10 border-2 border-gold/50 rounded-3xl p-5 sm:p-6 shadow-xl space-y-3.5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gold/25 border border-gold/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-lg sm:text-xl text-royal-brown">
                  Single Link for Your Friends
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Instant Join
                </span>
              </div>
              <p className="text-xs sm:text-sm text-royal-muted">
                Give this single link to your friends anywhere. When they click it on their phone or laptop, they will directly enter this room with you!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="bg-beige/90 border border-sand px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-royal-muted">
                Room Code:
              </span>
              <span className="font-mono font-black text-base text-royal-brown tracking-wider">
                {roomState.roomCode}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full bg-white border-2 border-gold/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-royal-brown select-all font-bold shadow-inner focus:outline-none focus:border-gold"
            />
          </div>

          <Button
            variant="gold"
            size="md"
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 font-bold px-4 py-2.5 shadow-md flex-shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Single Link'}</span>
          </Button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex-shrink-0 cursor-pointer"
          >
            <span className="text-base leading-none">📱</span>
            <span>Send on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Secondary Bar with Capacity, Seating View Toggle & Leave Room */}
      <div className="bg-cream rounded-2xl border-2 border-sand p-3.5 sm:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-royal-brown bg-gold/15 px-3 py-1.5 rounded-xl border border-gold/30">
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

      {/* Main Grid: On phones, seating cards in 2 cols and chat below; On desktop, side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-serif font-bold text-lg text-royal-brown flex items-center gap-2">
              <span>{t.phase_LOBBY}</span>
              <span className="text-xs font-sans font-normal text-royal-muted">
                ({totalPlayersCount >= 3 ? 'Ready to battle' : 'Minimum 3 players required'})
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
            <SeatingGrid seats={roomState.seats} currentUserId={user?.userId || ''} />
          ) : (
            <PlayerListView seats={roomState.seats} currentUserId={user?.userId || ''} />
          )}

          {/* Action Bar */}
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
                    {totalPlayersCount < 3 ? t.needMinPlayers : t.waitingForReady}
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
