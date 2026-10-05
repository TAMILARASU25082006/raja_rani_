'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { useGame } from '@/hooks/useGame';
import { KeyRound, Sparkles } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose, initialCode = '' }) => {
  const { t } = useLanguage();
  const { joinRoom } = useGame();

  const [roomCode, setRoomCode] = useState(initialCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    joinRoom(roomCode.trim().toUpperCase());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.joinRoom} maxWidth="sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-royal-brown mb-2">
            {t.enterCode}
          </label>
          <div className="relative">
            <KeyRound className="w-5 h-5 absolute left-3.5 top-3.5 text-royal-muted" />
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. KR7X9A"
              maxLength={6}
              autoFocus
              required
              className="w-full pl-11 pr-4 py-3 bg-white border-2 border-sand rounded-xl text-center font-mono font-black text-2xl tracking-widest text-royal-brown focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
          </div>
        </div>

        <Button type="submit" variant="gold" fullWidth size="lg" disabled={roomCode.trim().length < 3}>
          <Sparkles className="w-4 h-4 mr-2" />
          Enter Castle Hall
        </Button>
      </form>
    </Modal>
  );
};
