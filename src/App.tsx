import React from 'react';
import { useAuth } from './context/AuthContext';
import { useGame } from './context/GameContext';
import { Navbar } from './components/common/Navbar';
import { AuthScreen } from './components/auth/AuthScreen';
import { LobbyHomeScreen } from './components/lobby/LobbyHomeScreen';
import { CastleLobby } from './components/lobby/CastleLobby';
import { GameArena } from './components/game/GameArena';
import { CastleEntranceAnim } from './components/lobby/CastleEntranceAnim';
import { AlertCircle, X } from 'lucide-react';

export const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { roomState, errorMessage, clearErrorMessage, showCastleEntrance } = useGame();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold border-t-coral-deep rounded-full animate-spin" />
        <h2 className="font-serif font-black text-xl text-royal-brown tracking-widest animate-pulse">
          OPENING PALACE GATES...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige text-royal-brown flex flex-col font-sans">
      {/* Animated Castle Gate Entrance Transition */}
      {showCastleEntrance && <CastleEntranceAnim />}

      {/* Navigation Header */}
      <Navbar />

      {/* Global Error Banner */}
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

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {!user ? (
          <AuthScreen />
        ) : !roomState ? (
          <LobbyHomeScreen />
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
          <span className="text-[11px] font-sans">Crafted with Pure SVG & Web Audio • 5 to 30 Players</span>
        </div>
      </footer>
    </div>
  );
};
