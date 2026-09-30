import { safeStorage } from '../services/storage';
import React, { createContext, useContext, useState } from 'react';
import { soundFx } from '../services/soundEffects';

interface SoundContextType {
  isMuted: boolean;
  reducedMotion: boolean;
  toggleMute: () => void;
  toggleReducedMotion: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return safeStorage.get('raja_rani_muted') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return safeStorage.get('raja_rani_reduced_motion') === 'true';
  });

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      soundFx.isMuted = next;
      safeStorage.set('raja_rani_muted', String(next));
      return next;
    });
  };

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => {
      const next = !prev;
      safeStorage.set('raja_rani_reduced_motion', String(next));
      return next;
    });
  };

  return (
    <SoundContext.Provider value={{ isMuted, reducedMotion, toggleMute, toggleReducedMotion }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
