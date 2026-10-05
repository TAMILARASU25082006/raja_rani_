'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundFx } from '../services/soundEffects';
import { clientStorage } from '../lib/client/storage';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  playClick: () => void;
  playFanfare: () => void;
  playGunshot: () => void;
  playGrenade: () => void;
  playCardFlip: () => void;
  playTick: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const savedMuted = clientStorage.getIsMuted();
    const savedMotion = clientStorage.getReducedMotion();
    setIsMuted(savedMuted);
    setReducedMotion(savedMotion);
    soundFx.isMuted = savedMuted;
  }, []);

  const toggleMute = () => {
    const nextVal = !isMuted;
    setIsMuted(nextVal);
    soundFx.isMuted = nextVal;
    clientStorage.setIsMuted(nextVal);
  };

  const toggleReducedMotion = () => {
    const nextVal = !reducedMotion;
    setReducedMotion(nextVal);
    clientStorage.setReducedMotion(nextVal);
  };

  const playClick = () => soundFx.playClick();
  const playFanfare = () => soundFx.playFanfare();
  const playGunshot = () => soundFx.playGunshot();
  const playGrenade = () => soundFx.playGrenade();
  const playCardFlip = () => soundFx.playCardFlip();
  const playTick = () => soundFx.playTick();

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        reducedMotion,
        toggleReducedMotion,
        playClick,
        playFanfare,
        playGunshot,
        playGrenade,
        playCardFlip,
        playTick,
      }}
    >
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
