import React from 'react';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';
import { PublicSeatInfo } from '../../types/game';
import { Button } from '../common/Button';
import { RoleIcon } from '../svg/RoleIcons';
import { CrownSvg } from '../svg/CrownSvg';
import { AvatarSvg } from '../svg/AvatarSvg';
import { Trophy, ShieldCheck, ShieldAlert, RotateCcw, LogOut, Award } from 'lucide-react';

export const ResultsScoreboard: React.FC = () => {
  const { roomState, isOwner, playAgain, leaveRoom } = useGame();
  const { language, t } = useLanguage();

  if (!roomState) return null;

  const accusationResult = roomState.accusationResult;

  const rankedPlayers = roomState.seats
    .filter((s): s is PublicSeatInfo => s !== null && s.revealedRole !== undefined)
    .sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));

  const kingPlayer = rankedPlayers.find((p) => p.revealedRole?.name === 'King');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-gold/20 via-cream to-gold/20 rounded-3xl border-4 border-gold p-6 text-center shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-gold text-cream px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md">
          <Trophy className="w-4 h-4 text-cream" />
          <span>{t.royalWinner}</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <CrownSvg size="md" />
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-royal-brown tracking-wide">
            👑 {kingPlayer ? kingPlayer.nickname : 'The King'}
          </h2>
          <CrownSvg size="md" />
        </div>

        <div className="font-serif font-bold text-lg text-gold-dark">
          Highest Royal Authority • 10,000 Points
        </div>
      </div>

      {accusationResult && (
        <div
          className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 ${
            accusationResult.isCorrect
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-red-50 border-red-400 text-red-950'
          }`}
        >
          <div className="flex items-center gap-3">
            {accusationResult.isCorrect ? (
              <div className="p-2.5 bg-emerald-200 text-emerald-900 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
            ) : (
              <div className="p-2.5 bg-red-200 text-red-900 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
            )}
            <div>
              <h4 className="font-serif font-bold text-base sm:text-lg">
                {accusationResult.isCorrect ? t.policeSuccess : t.policeFail}
              </h4>
              <p className="text-xs opacity-90">
                {accusationResult.isCorrect
                  ? `Police ${accusationResult.policeNickname} accurately arrested Thief ${accusationResult.thiefNickname} (+1,000 pts)!`
                  : accusationResult.isTimeout
                  ? `Police timed out! Thief ${accusationResult.thiefNickname} escaped into the shadows (+1,000 pts)!`
                  : `Police accused ${accusationResult.targetNickname}, but Thief ${accusationResult.thiefNickname} escaped (+1,000 pts)!`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-cream rounded-2xl border-2 border-sand overflow-hidden shadow-lg">
        <div className="px-6 py-4 bg-cream-soft border-b border-sand flex items-center justify-between">
          <h3 className="font-serif font-black text-lg text-royal-brown flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-dark" />
            <span>{t.phase_RESULTS}</span>
          </h3>
          <span className="text-xs font-bold text-royal-muted">
            {rankedPlayers.length} Court Members
          </span>
        </div>

        <div className="divide-y divide-sand/50 max-h-[420px] overflow-y-auto">
          {rankedPlayers.map((player, rank) => {
            if (!player.revealedRole) return null;
            const roleName =
              language === 'ta' ? player.revealedRole.tamilName : player.revealedRole.name;

            return (
              <div
                key={player.seatIndex}
                className="px-4 sm:px-6 py-3 flex items-center justify-between hover:bg-beige/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono font-black text-sm text-royal-muted w-6">
                    #{rank + 1}
                  </div>

                  <AvatarSvg index={player.seatIndex} size="sm" />

                  <div>
                    <div className="font-bold text-sm text-royal-brown flex items-center gap-1.5">
                      <span>{player.nickname}</span>
                      {player.revealedRole.hasCrown && <CrownSvg size="sm" className="inline w-4 h-4" />}
                    </div>
                    <div className="text-xs text-royal-muted flex items-center gap-1">
                      <RoleIcon roleId={player.revealedRole.id} className="w-4 h-4" />
                      <span>{roleName}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-black text-base sm:text-lg text-coral-deep">
                    {player.finalScore?.toLocaleString()} pts
                  </div>
                  <div className="text-[10px] text-royal-muted font-bold">
                    Chair #{player.seatIndex + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {isOwner ? (
          <Button
            variant="gold"
            size="lg"
            onClick={playAgain}
            className="flex items-center gap-2 shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t.playAgain}</span>
          </Button>
        ) : (
          <div className="text-xs text-royal-muted font-bold py-2">
            Waiting for Sovereign to start next round...
          </div>
        )}

        <Button
          variant="outline"
          size="lg"
          onClick={leaveRoom}
          className="flex items-center gap-2 text-red-700 hover:bg-red-50 border-red-300"
        >
          <LogOut className="w-5 h-5" />
          <span>{t.leaveRoom}</span>
        </Button>
      </div>
    </div>
  );
};
