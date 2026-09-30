import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';
import { useGame } from '../../context/GameContext';
import { Users, MessageSquare, ShieldCheck } from 'lucide-react';

interface RoomCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomCreationModal: React.FC<RoomCreationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { createRoom } = useGame();

  const [capacity, setCapacity] = useState<number>(10);
  const [chatEnabled, setChatEnabled] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoom(capacity, chatEnabled);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.createRoom} maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-royal-brown flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-dark" />
              <span>{t.roomCapacity} (5 - 30 Players)</span>
            </label>
            <span className="font-serif font-black text-xl text-coral-deep bg-coral-reef/15 px-3 py-0.5 rounded-lg border border-coral-reef/30">
              {capacity}
            </span>
          </div>

          <input
            type="range"
            min={5}
            max={30}
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-sand rounded-lg appearance-none cursor-pointer accent-coral-deep"
          />

          <div className="flex justify-between text-[11px] font-semibold text-royal-muted mt-1.5 px-1">
            <span>5 (Classic)</span>
            <span>15 (Grand Court)</span>
            <span>30 (Full Empire)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-beige/60 border border-sand flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-gold-dark flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-royal-brown">{t.chatSetting}</div>
              <div className="text-xs text-royal-muted">Allow players to communicate during the royal assembly</div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={chatEnabled}
            onChange={(e) => setChatEnabled(e.target.checked)}
            className="w-5 h-5 accent-coral-deep rounded cursor-pointer"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-gold/10 border border-gold/30 text-xs text-royal-brown flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-gold-dark flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            As room owner, you will be seated immediately and can start the match as soon as at least <strong>5 players</strong> join and mark themselves ready.
          </p>
        </div>

        <Button type="submit" variant="primary" fullWidth size="lg">
          Create & Open Castle Gates
        </Button>
      </form>
    </Modal>
  );
};
