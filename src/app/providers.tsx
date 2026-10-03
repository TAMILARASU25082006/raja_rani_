'use client';

import React from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LanguageProvider } from '../context/LanguageContext';
import { SoundProvider } from '../context/SoundContext';
import { AuthProvider } from '../context/AuthContext';
import { GameProvider } from '../context/GameContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <SoundProvider>
          <AuthProvider>
            <GameProvider>
              {children}
            </GameProvider>
          </AuthProvider>
        </SoundProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
