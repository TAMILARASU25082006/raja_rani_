'use client';

import React from 'react';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { SoundProvider } from '@/providers/SoundProvider';
import { GameProvider } from '@/providers/GameProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <SoundProvider>
          <GameProvider>
            {children}
          </GameProvider>
        </SoundProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
