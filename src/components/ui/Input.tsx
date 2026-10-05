import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-royal-brown tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 pointer-events-none text-royal-muted">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full py-2.5 bg-white border rounded-xl text-royal-brown text-sm placeholder:text-royal-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30 ${
            icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-sand focus:border-gold'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
