import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none';

  const variantStyles = {
    primary:
      'bg-coral-deep hover:bg-coral-hover text-cream shadow-md hover:shadow-lg border border-coral-reef/30',
    secondary:
      'bg-cream hover:bg-white text-royal-brown border border-sand hover:border-gold shadow-sm',
    gold:
      'bg-gold hover:bg-gold-light text-cream font-serif tracking-wider shadow-md hover:shadow-gold/50 border border-yellow-200/40',
    outline:
      'bg-transparent hover:bg-cream/60 text-royal-brown border-2 border-sand hover:border-gold',
    danger:
      'bg-red-700 hover:bg-red-800 text-cream shadow-md border border-red-500/30',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm min-h-[36px]',
    md: 'px-5 py-2.5 text-sm sm:text-base min-h-[44px]',
    lg: 'px-6 py-3.5 text-base sm:text-lg min-h-[52px]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
