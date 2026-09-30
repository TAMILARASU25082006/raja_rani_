import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { RoomCreationModal } from './RoomCreationModal';
import { JoinRoomModal } from './JoinRoomModal';
import { CastleSvg } from '../svg/CastleSvg';
import { CrownSvg } from '../svg/CrownSvg';
import { Button } from '../common/Button';
import { PlusCircle, LogIn, BookOpen, Sparkles, Shield, Trophy } from 'lucide-react';

export const LobbyHomeScreen: React.FC = () => {
  const { user, pendingInviteCode, setPendingInviteCode } = useAuth();
  const { t } = useLanguage();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (pendingInviteCode) {
      setIsJoinOpen(true);
    }
  }, [pendingInviteCode]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-cream rounded-3xl border-2 border-sand p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-gold/15 text-gold-dark px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-gold/30">
            <Sparkles className="w-4 h-4" />
            <span>Grand Royal Multiplayer (5 to 30 Players)</span>
          </div>

          <h2 className="font-serif font-black text-3xl sm:text-5xl text-royal-brown tracking-wide leading-tight">
            Welcome to the Palace, <span className="text-coral-deep">{user?.nickname}</span>!
          </h2>

          <p className="text-sm sm:text-base text-royal-muted leading-relaxed font-medium">
            Step into the royal courts of ancient empires. Draw secret characters, deceive rival courtiers, and test your deduction skills in matches up to 5 minutes!
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t.createRoom}</span>
            </Button>

            <Button
              variant="gold"
              size="lg"
              onClick={() => setIsJoinOpen(true)}
              className="flex items-center gap-2 shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              <span>{t.joinRoom}</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowRules(!showRules)}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-gold-dark" />
              <span>Royal Rules</span>
            </Button>
          </div>
        </div>

        <div className="w-full md:w-5/12 max-w-sm flex justify-center z-10">
          <CastleSvg className="w-full h-auto drop-shadow-xl" />
        </div>
      </div>

      {showRules && (
        <div className="bg-cream rounded-2xl border-2 border-sand p-6 shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 font-serif font-black text-xl text-royal-brown">
            <Trophy className="w-6 h-6 text-gold-dark" />
            <span>The Rules of Raja Rani</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-beige/60 rounded-xl border border-sand space-y-2">
              <div className="font-bold text-royal-brown flex items-center gap-1.5">
                <CrownSvg size="sm" />
                <span>1. The Royal Hierarchy</span>
              </div>
              <p className="text-royal-muted leading-relaxed">
                King (10,000 pts), Queen (9,000 pts), and Minister (8,500 pts) reign supreme with fixed points. Up to 30 custom royal roles expand with player capacity!
              </p>
            </div>

            <div className="p-4 bg-beige/60 rounded-xl border border-sand space-y-2">
              <div className="font-bold text-coral-deep flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>2. Police vs. Thief</span>
              </div>
              <p className="text-royal-muted leading-relaxed">
                The Police is summoned to catch the Thief during the Accusation phase. Correct guess grants Police +1,000 pts. An escape grants the Thief +1,000 pts!
              </p>
            </div>

            <div className="p-4 bg-beige/60 rounded-xl border border-sand space-y-2">
              <div className="font-bold text-gold-dark flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>3. 5-Minute Match Limit</span>
              </div>
              <p className="text-royal-muted leading-relaxed">
                Server controls strict deadlines. After accusations resolve, the King ascends the grand throne in an animated finale before the court scoreboard is revealed!
              </p>
            </div>
          </div>
        </div>
      )}

      <RoomCreationModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <JoinRoomModal
        isOpen={isJoinOpen}
        onClose={() => {
          setIsJoinOpen(false);
          setPendingInviteCode(null);
        }}
        initialCode={pendingInviteCode || ''}
      />
    </div>
  );
};
