'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import { useLanguage } from '@/hooks/useLanguage';
import { Navbar } from '@/components/common/Navbar';
import { CastleSvg } from '@/components/svg/CastleSvg';
import { CrownSvg } from '@/components/svg/CrownSvg';
import { PatrollingSoldiers } from '@/components/auth/PatrollingSoldiers';
import { RoomCreationModal } from '@/components/lobby/RoomCreationModal';
import { JoinRoomModal } from '@/components/lobby/JoinRoomModal';
import { CastleEntranceAnim } from '@/components/lobby/CastleEntranceAnim';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  PlusCircle,
  LogIn,
  BookOpen,
  User,
  Shield,
  Trophy,
  AlertCircle,
  X,
  Edit2,
  Check,
} from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const joinParam = searchParams.get('join') || '';

  const {
    nickname,
    setNickname,
    errorMessage,
    clearErrorMessage,
    showCastleEntrance,
  } = useGame();
  const { t } = useLanguage();

  const [inputNick, setInputNick] = useState(nickname || '');
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [initialJoinCode, setInitialJoinCode] = useState(joinParam);
  const [showRules, setShowRules] = useState(false);
  const [nickError, setNickError] = useState<string | null>(null);

  // Sync state if user's stored nickname loads
  useEffect(() => {
    if (nickname && !inputNick) {
      setInputNick(nickname);
    }
  }, [nickname, inputNick]);

  // Handle ?join=XXXXXX invite parameter
  useEffect(() => {
    if (joinParam) {
      setInitialJoinCode(joinParam.toUpperCase().trim());
      setIsJoinOpen(true);
    }
  }, [joinParam]);

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNick.trim()) {
      setNickError('Please enter a royal nickname.');
      return;
    }
    setNickError(null);
    setNickname(inputNick.trim());
    setIsEditingNick(false);
  };

  const handleOpenCreate = () => {
    if (!nickname.trim()) {
      if (!inputNick.trim()) {
        setNickError('Please enter a royal nickname to proceed.');
        return;
      }
      setNickname(inputNick.trim());
    }
    setIsCreateOpen(true);
  };

  const handleOpenJoin = () => {
    if (!nickname.trim()) {
      if (!inputNick.trim()) {
        setNickError('Please enter a royal nickname to proceed.');
        return;
      }
      setNickname(inputNick.trim());
    }
    setIsJoinOpen(true);
  };

  const hasNick = Boolean(nickname && nickname.trim());

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

      <main className="flex-1 pb-16">
        <div className="relative flex flex-col items-center justify-center px-4 pt-6 pb-12 overflow-hidden bg-gradient-to-b from-beige via-beige-light to-sand/40">
          {/* Castle Artwork & Patrolling Soldiers */}
          <div className="w-full max-w-4xl mx-auto mb-2 opacity-95 transition-opacity">
            <CastleSvg className="w-full max-h-[260px] object-contain drop-shadow-lg" />
          </div>

          <div className="-mt-14 sm:-mt-18 w-full max-w-2xl z-0 mb-4">
            <PatrollingSoldiers />
          </div>

          <div className="w-full max-w-2xl z-10 space-y-6">
            {/* Nickname & Action Card */}
            <div className="bg-cream/95 backdrop-blur-md rounded-3xl border-2 border-sand p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-gold/15 text-gold-dark px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-gold/30">
                  <CrownSvg size="sm" />
                  <span>Grand Royal Multiplayer (3 - 30 Players)</span>
                </div>

                <h2 className="font-serif font-black text-2xl sm:text-4xl text-royal-brown tracking-wide">
                  {hasNick ? (
                    <span>
                      Welcome, <span className="text-coral-deep">{nickname}</span>!
                    </span>
                  ) : (
                    <span>Enter the Royal Palace</span>
                  )}
                </h2>

                <p className="text-xs sm:text-sm text-royal-muted max-w-md mx-auto">
                  {hasNick
                    ? 'Your royal identity is recognized. Create or enter a castle room to play.'
                    : 'Choose your player nickname to enter the royal assembly. No registration required!'}
                </p>
              </div>

              {/* Nickname Input Form */}
              {(!hasNick || isEditingNick) ? (
                <form onSubmit={handleSaveNickname} className="space-y-4 max-w-md mx-auto">
                  <div>
                    <label className="block text-xs font-bold text-royal-brown mb-1.5">
                      {t.nickname}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-royal-muted" />
                      <input
                        type="text"
                        value={inputNick}
                        onChange={(e) => {
                          setInputNick(e.target.value);
                          if (nickError) setNickError(null);
                        }}
                        placeholder="e.g. Commander Vikram, Queen Meera"
                        maxLength={20}
                        required
                        autoFocus
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand rounded-xl text-royal-brown text-sm font-semibold focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                      />
                    </div>
                    {nickError && (
                      <p className="text-xs text-red-600 mt-1 font-medium">{nickError}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button type="submit" variant="primary" fullWidth size="md">
                      <Check className="w-4 h-4 mr-1.5" />
                      Save Royal Nickname
                    </Button>
                    {hasNick && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={() => setIsEditingNick(false)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs font-medium text-royal-muted">
                  <span>Playing as: <strong>{nickname}</strong></span>
                  <button
                    onClick={() => {
                      setInputNick(nickname);
                      setIsEditingNick(true);
                    }}
                    className="p-1 hover:text-coral-deep rounded hover:bg-beige transition-colors flex items-center gap-1 text-[11px] underline"
                    title="Change royal name"
                  >
                    <Edit2 className="w-3 h-3" />
                    Change
                  </button>
                </div>
              )}

              {/* Action Buttons: Create Room, Join Room, View Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleOpenCreate}
                  className="flex items-center justify-center gap-2 shadow-lg"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>{t.createRoom}</span>
                </Button>

                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleOpenJoin}
                  className="flex items-center justify-center gap-2 shadow-lg"
                >
                  <LogIn className="w-5 h-5" />
                  <span>{t.joinRoom}</span>
                </Button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowRules(!showRules)}
                  className="text-xs font-bold text-gold-dark hover:text-royal-brown inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{showRules ? 'Hide Royal Game Rules' : 'View Royal Game Rules & Character Roles'}</span>
                </button>
              </div>
            </div>

            {/* Collapsible Game Rules & Role Hierarchy */}
            {showRules && (
              <div className="bg-cream rounded-3xl border-2 border-sand p-6 shadow-xl space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 font-serif font-black text-xl text-royal-brown">
                  <Trophy className="w-6 h-6 text-gold-dark" />
                  <span>The Rules of Raja Rani</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div className="p-4 bg-beige/60 rounded-2xl border border-sand space-y-2">
                    <div className="font-bold text-royal-brown flex items-center gap-1.5">
                      <CrownSvg size="sm" />
                      <span>1. Royal Hierarchy</span>
                    </div>
                    <p className="text-royal-muted leading-relaxed">
                      King (10,000 pts), Queen (9,000 pts), and Minister (8,500 pts) reign with fixed points. As player count scales up to 30, additional royal court characters enter the fray!
                    </p>
                  </div>

                  <div className="p-4 bg-beige/60 rounded-2xl border border-sand space-y-2">
                    <div className="font-bold text-coral-deep flex items-center gap-1.5">
                      <Shield className="w-4 h-4" />
                      <span>2. Police vs. Thief</span>
                    </div>
                    <p className="text-royal-muted leading-relaxed">
                      Police is publicly summoned to arrest the Thief during Accusation. A correct guess awards Police +1,000 pts (Thief gets 0). A wrong guess or timeout awards Thief +1,000 pts (Police gets 0)!
                    </p>
                  </div>

                  <div className="p-4 bg-beige/60 rounded-2xl border border-sand space-y-2">
                    <div className="font-bold text-gold-dark flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>3. Authoritative 5-Min Limit</span>
                    </div>
                    <p className="text-royal-muted leading-relaxed">
                      Strict synchronized deadlines keep matches crisp (under 5 minutes). Includes targeted visual effects, the King's grand throne walk, and a live court scoreboard.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <RoomCreationModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <JoinRoomModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        initialCode={initialJoinCode}
      />

      {/* Royal Footer */}
      <footer className="w-full bg-cream border-t border-sand py-4 text-center text-xs text-royal-muted font-serif">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>👑 Raja Rani Royal Multiplayer Deduction Game</span>
          <span className="text-[11px] font-sans">Pure SVG Artwork & Web Audio • 3 to 30 Players</span>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-beige flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-coral-deep rounded-full animate-spin" />
          <h2 className="font-serif font-black text-xl text-royal-brown tracking-widest animate-pulse">
            OPENING PALACE GATES...
          </h2>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
