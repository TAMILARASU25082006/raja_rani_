import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'coral' | 'green' | 'red' | 'sand' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    gold: 'bg-gold/15 text-gold-dark border-gold/40',
    coral: 'bg-coral-reef/20 text-coral-deep border-coral-reef/40',
    green: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    red: 'bg-red-100 text-red-800 border-red-300',
    sand: 'bg-beige/80 text-royal-brown border-sand',
    neutral: 'bg-cream text-royal-muted border-sand',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
