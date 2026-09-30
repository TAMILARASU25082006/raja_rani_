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
  const { createRoom, isSocketConnected } = useGame();

  const [capacity, setCapacity] = useState<number>(10);
  const [chatEnabled, setChatEnabled] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  React.useEffect(() => {
    if (!isOpen) {
      setIsCreating(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) return;
    setIsCreating(true);
    createRoom(capacity, chatEnabled);
    setTimeout(() => {
      setIsCreating(false);
      onClose();
    }, 600);
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

        {!isSocketConnected && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping flex-shrink-0" />
            <span>Connecting to palace game server. Your room will open as soon as connection is ready.</span>
          </div>
        )}

        <Button type="submit" variant="primary" fullWidth size="lg" disabled={isCreating}>
          {isCreating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
              Opening Castle Gates...
            </span>
          ) : (
            'Create & Open Castle Gates'
          )}
        </Button>
      </form>
    </Modal>
  );
};
