'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import { useLanguage } from '@/hooks/useLanguage';
import { MessageSquare, Send, ShieldAlert } from 'lucide-react';

export const RoomChat: React.FC = () => {
  const { chatMessages, sendChat, roomState, user } = useGame();
  const { t } = useLanguage();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendChat(input.trim());
    setInput('');
  };

  if (roomState && !roomState.chatEnabled) {
    return (
      <div className="bg-cream rounded-2xl border border-sand p-4 text-center text-xs text-royal-muted flex items-center justify-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-700" />
        <span>Chat has been disabled for this castle room by the owner.</span>
      </div>
    );
  }

  return (
    <div className="bg-cream rounded-2xl border border-sand shadow-sm flex flex-col h-80 overflow-hidden">
      <div className="px-4 py-2.5 bg-cream-soft border-b border-sand flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-royal-brown">
          <MessageSquare className="w-4 h-4 text-gold-dark" />
          <span>{t.roomChat}</span>
        </div>
        <span className="text-[10px] text-royal-muted">Room-Scoped</span>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
        {chatMessages.length === 0 ? (
          <div className="text-center text-royal-muted/70 italic py-8">
            Silence fills the castle hall. Break the silence!
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isMe = user && msg.senderUserId === user.userId;

            if (msg.isSystem) {
              return (
                <div
                  key={msg.id}
                  className="py-1 px-2.5 rounded-lg bg-gold/10 border border-gold/20 text-center text-[11px] font-semibold text-royal-brown italic"
                >
                  📜 {msg.text}
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] font-bold text-royal-muted mb-0.5 px-1">
                  {msg.senderNickname}
                </div>
                <div
                  className={`max-w-[85%] px-3 py-1.5 rounded-xl text-xs break-words ${
                    isMe
                      ? 'bg-coral-deep text-cream rounded-tr-none'
                      : 'bg-beige/80 text-royal-brown border border-sand rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-2.5 bg-cream-soft border-t border-sand flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.typeMessage}
          maxLength={150}
          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-sand rounded-xl text-royal-brown focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 bg-coral-deep hover:bg-coral-hover text-cream rounded-xl disabled:opacity-40 transition-colors shadow-sm"
          title={t.send}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
