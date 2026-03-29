import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Input = ({
  label,
  error,
  icon,
  className,
  ...props
}: InputProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-surface-low border border-[#454557]/5 rounded-[20px] py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white outline-none transition-all font-medium text-sm text-[#303030] placeholder:text-[#454557]/30 placeholder:uppercase placeholder:font-bold placeholder:tracking-[0.1em]",
            icon && "pl-14",
            error && "border-error focus:ring-error/10",
          )}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-error ml-1 animate-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
};
