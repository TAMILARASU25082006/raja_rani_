'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CrownSvg } from '../svg/CrownSvg';
import { useGame } from '@/hooks/useGame';
import { useLanguage } from '@/hooks/useLanguage';
import { useSound } from '@/hooks/useSound';
import { Volume2, VolumeX, Globe, Sparkles, Maximize, Minimize, User, Edit3, X, Check } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isSocketConnected, user, setNickname, roomState, leaveRoom } = useGame();
  const { language, setLanguage, t } = useLanguage();
  const { isMuted, toggleMute, reducedMotion, toggleReducedMotion } = useSound();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [tempNick, setTempNick] = useState(user?.nickname || '');

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleSaveNick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempNick.trim()) return;
    setNickname(tempNick.trim());
    setIsEditingNick(false);
  };

  return (
    <header className="w-full bg-cream/95 backdrop-blur-md border-b border-sand shadow-sm sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link
          href="/"
          onClick={(e) => {
            if (roomState) {
              e.preventDefault();
              leaveRoom();
            }
          }}
          className="flex items-center space-x-3 group"
        >
          <div className="bg-gold/15 p-2 rounded-xl border border-gold/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CrownSvg size="sm" />
          </div>
          <div>
            <h1 className="font-serif font-black text-lg sm:text-xl text-royal-brown tracking-wide flex items-center gap-1.5">
              <span>{t.appTitle}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold-dark font-sans font-bold border border-gold/30">
                3-30P
              </span>
              {isSocketConnected ? (
                <span
                  className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
                  title="Connected to palace game server"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 border border-amber-500/30"
                  title="Connecting to palace game server..."
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                  Connecting...
                </span>
              )}
            </h1>
          </div>
        </Link>

        {/* Global Controls & User Status */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Reduced Motion Toggle */}
          <button
            onClick={toggleReducedMotion}
            className={`p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1 ${
              reducedMotion
                ? 'bg-gold text-cream border-gold-dark'
                : 'bg-beige/60 text-royal-brown hover:bg-beige border-sand'
            }`}
            title="Toggle Reduced Motion"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">{t.reducedMotion}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-beige/60 hover:bg-beige text-royal-brown border border-sand transition-all"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-coral-deep" /> : <Volume2 className="w-4 h-4 text-gold-dark" />}
          </button>

          {/* Fullscreen Game Mode Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-beige/60 hover:bg-beige text-royal-brown border border-sand transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-gold-dark" /> : <Maximize className="w-4 h-4 text-gold-dark" />}
          </button>

          {/* Language Toggle (EN / TA) */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="px-2.5 py-1.5 rounded-xl bg-beige/60 hover:bg-beige text-royal-brown border border-sand transition-all text-xs font-bold flex items-center gap-1.5"
            title="Switch Language / மொழியை மாற்றவும்"
          >
            <Globe className="w-3.5 h-3.5 text-gold-dark" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Player Nickname Display & Edit */}
          {user?.nickname && (
            <div className="flex items-center pl-2 border-l border-sand">
              {isEditingNick ? (
                <form onSubmit={handleSaveNick} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempNick}
                    onChange={(e) => setTempNick(e.target.value)}
                    maxLength={20}
                    autoFocus
                    className="w-28 px-2 py-1 bg-white border border-gold rounded-lg text-xs font-bold text-royal-brown focus:outline-none"
                  />
                  <button type="submit" className="p-1 text-emerald-700 hover:bg-emerald-50 rounded">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingNick(false)}
                    className="p-1 text-royal-muted hover:bg-beige rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setTempNick(user.nickname);
                    setIsEditingNick(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gold/10 hover:bg-gold/20 text-royal-brown border border-gold/30 text-xs font-bold transition-all"
                  title="Click to rename your royal identity"
                >
                  <User className="w-3.5 h-3.5 text-gold-dark" />
                  <span className="truncate max-w-[100px]">{user.nickname}</span>
                  <Edit3 className="w-3 h-3 text-royal-muted" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
