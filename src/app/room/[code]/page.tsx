'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import { useLanguage } from '@/hooks/useLanguage';
import { Navbar } from '@/components/common/Navbar';
import { CastleLobby } from '@/components/lobby/CastleLobby';
import { GameArena } from '@/components/game/GameArena';
import { CastleEntranceAnim } from '@/components/lobby/CastleEntranceAnim';
import { Button } from '@/components/ui/Button';
import { CrownSvg } from '@/components/svg/CrownSvg';
import { AlertCircle, X, User, Sparkles, ArrowLeft } from 'lucide-react';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCodeParam = typeof params.code === 'string' ? params.code.toUpperCase().trim() : '';

  const {
    roomState,
    nickname,
    setNickname,
    joinRoom,
    leaveRoom,
    errorMessage,
    clearErrorMessage,
    showCastleEntrance,
    isSocketConnected,
  } = useGame();
  const { t } = useLanguage();

  const [inputNick, setInputNick] = useState(nickname || '');
  const [hasPromptedNick, setHasPromptedNick] = useState(false);
  const hasAttemptedJoinRef = React.useRef(false);
  const isLeavingPageRef = React.useRef(false);

  // Sync nickname
  useEffect(() => {
    if (nickname && !inputNick) {
      setInputNick(nickname);
    }
  }, [nickname, inputNick]);

  // Attempt to join room when socket is connected and user has nickname
  useEffect(() => {
    if (!roomCodeParam || !isSocketConnected || isLeavingPageRef.current) return;

    if (nickname && nickname.trim()) {
      // Auto-join once if not already in this room
      if (!hasAttemptedJoinRef.current && (!roomState || roomState.roomCode !== roomCodeParam)) {
        hasAttemptedJoinRef.current = true;
        joinRoom(roomCodeParam);
      }
    } else {
      setHasPromptedNick(true);
    }
  }, [roomCodeParam, isSocketConnected, nickname, joinRoom]);

  const handleExitRoom = () => {
    isLeavingPageRef.current = true;
    hasAttemptedJoinRef.current = false;
    leaveRoom();
  };

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNick.trim()) return;
    setNickname(inputNick.trim());
    setHasPromptedNick(false);
    hasAttemptedJoinRef.current = true;
    joinRoom(roomCodeParam);
  };

  // If user does not have a nickname yet, show entry card before entering room
  if (!nickname && hasPromptedNick) {
    return (
      <div className="min-h-screen bg-beige text-royal-brown flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-cream/95 backdrop-blur-md rounded-3xl border-2 border-sand p-6 sm:p-8 shadow-2xl space-y-6 animate-scale-up">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gold/15 border border-gold/30 rounded-2xl flex items-center justify-center mx-auto">
                <CrownSvg size="sm" />
              </div>
              <h2 className="font-serif font-black text-2xl text-royal-brown">
                Entering Castle Room #{roomCodeParam}
              </h2>
              <p className="text-xs text-royal-muted">
                Declare your royal player name to take your seat in the royal hall.
              </p>
            </div>

            <form onSubmit={handleNicknameSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-royal-brown mb-1.5">
                  {t.nickname}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-royal-muted" />
                  <input
                    type="text"
                    value={inputNick}
                    onChange={(e) => setInputNick(e.target.value)}
                    placeholder="e.g. Prince Arjun, Knight Shiva"
                    maxLength={20}
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand rounded-xl text-royal-brown text-sm font-semibold focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Take My Royal Seat
              </Button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleExitRoom}
                  className="text-xs text-royal-muted hover:text-royal-brown inline-flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Palace Gates
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige text-royal-brown flex flex-col font-sans">
      {showCastleEntrance && <CastleEntranceAnim />}
      <Navbar />

      {errorMessage && (
        <div className="max-w-4xl mx-auto mt-4 px-4 w-full">
          <div className="bg-red-100 border-2 border-red-400 text-red-900 px-4 py-3 rounded-2xl shadow-md flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={clearErrorMessage}
              className="p-1 rounded-lg hover:bg-red-200 text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 pb-12">
        {!roomState || roomState.roomCode !== roomCodeParam ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 p-4">
            <div className="w-12 h-12 border-4 border-gold border-t-coral-deep rounded-full animate-spin" />
            <h2 className="font-serif font-black text-xl text-royal-brown tracking-widest animate-pulse">
              OPENING CASTLE HALL #{roomCodeParam}...
            </h2>
            <p className="text-xs text-royal-muted">Connecting to sovereign match server...</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExitRoom}
              className="mt-4"
            >
              Cancel & Return Home
            </Button>
          </div>
        ) : roomState.phase === 'LOBBY' ? (
          <CastleLobby />
        ) : (
          <GameArena />
        )}
      </main>

      {/* Royal Footer */}
      <footer className="w-full bg-cream border-t border-sand py-4 text-center text-xs text-royal-muted font-serif">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>👑 Raja Rani Royal Multiplayer Deduction Game</span>
          <span className="text-[11px] font-sans">Room Code: {roomCodeParam}</span>
        </div>
      </footer>
    </div>
  );
}
