'use client';

import React, { useState } from 'react';
import { RoleInfo } from '@/types/game';
import { useLanguage } from '@/hooks/useLanguage';
import { RoleIcon } from '../svg/RoleIcons';
import { CrownSvg } from '../svg/CrownSvg';
import { Sparkles, Shield, Award } from 'lucide-react';

interface PrivateRoleCardProps {
  role: RoleInfo | null;
}

export const PrivateRoleCard: React.FC<PrivateRoleCardProps> = ({ role }) => {
  const { language, t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(true);

  if (!role) {
    return (
      <div className="bg-cream rounded-2xl border-2 border-sand p-6 text-center text-royal-muted animate-pulse">
        <Sparkles className="w-8 h-8 text-gold mx-auto mb-2" />
        <p className="text-sm font-semibold">Deciphering royal decree from the King...</p>
      </div>
    );
  }

  const displayName = language === 'ta' ? role.tamilName : role.name;
  const displayDesc = language === 'ta' ? role.tamilDescription : role.description;

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer perspective w-full max-w-sm"
      >
        <div
          className={`relative w-full min-h-[320px] rounded-3xl border-4 transition-all duration-500 transform shadow-2xl p-6 flex flex-col justify-between select-none ${
            role.hasCrown
              ? 'bg-gradient-to-b from-cream via-cream-soft to-gold/20 border-gold shadow-gold/30'
              : role.name === 'Police'
              ? 'bg-gradient-to-b from-cream via-cream-soft to-coral-reef/20 border-coral-deep shadow-coral-deep/20'
              : role.name === 'Thief'
              ? 'bg-gradient-to-b from-cream via-cream-soft to-royal-brown/10 border-sand-dark'
              : 'bg-cream border-sand shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {role.hasCrown && <CrownSvg size="sm" />}
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-royal-muted">
                Role #{role.id}
              </span>
            </div>

            <div className="bg-gold/20 px-3 py-1 rounded-xl border border-gold/40 flex items-center gap-1 font-serif font-black text-sm text-royal-brown">
              <Award className="w-4 h-4 text-gold-dark" />
              <span>{role.points.toLocaleString()} {t.fixedPoints}</span>
            </div>
          </div>

          <div className="text-center my-4">
            <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center bg-cream-soft rounded-2xl border-2 border-sand shadow-inner">
              <RoleIcon roleId={role.id} className="w-16 h-16" />
            </div>

            <h3 className="font-serif font-black text-2xl sm:text-3xl text-royal-brown tracking-wide">
              {displayName}
            </h3>

            {language === 'ta' && (
              <div className="text-xs font-bold text-royal-muted mt-0.5">
                {role.name}
              </div>
            )}
          </div>

          <div className="bg-beige/60 p-3 rounded-xl border border-sand text-center">
            <p className="text-xs text-royal-brown leading-relaxed font-medium">
              {displayDesc}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-royal-muted/70 mt-2">
            <Shield className="w-3 h-3 text-gold-dark" />
            <span>Encrypted & visible only on your screen</span>
          </div>
        </div>
      </div>
    </div>
  );
};
