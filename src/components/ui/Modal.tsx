import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-royal-dark/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${maxWidthStyles[maxWidth]} bg-cream border-2 border-sand rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-scale-up`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-sand bg-cream-soft flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-royal-brown tracking-wide">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-royal-muted hover:text-royal-brown hover:bg-beige transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
};
