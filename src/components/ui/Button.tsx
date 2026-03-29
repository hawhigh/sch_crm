import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = ({
  className,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-container shadow-lg shadow-primary/10",
    secondary: "bg-[var(--secondary)] text-[#303030] hover:bg-[#c0d400] shadow-sm",
    outline: "bg-white border border-[#454557]/10 text-[#303030] hover:bg-surface-low hover:border-primary/20",
    ghost: "bg-transparent text-[#454557]/60 hover:text-[#303030] hover:bg-surface-low",
    dark: "bg-[#303030] text-white hover:bg-[#1b1c1a] shadow-md",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] rounded-[10px]",
    md: "px-6 py-3 text-[10px] rounded-[14px]",
    lg: "px-8 py-4 text-xs rounded-[16px]",
    xl: "px-10 py-5 text-sm rounded-[24px]",
  };

  return (
    <button
      className={cn(
        "font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};
