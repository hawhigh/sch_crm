import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'dark' | 'light' | 'outline' | 'error';
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

export const Badge = ({
  children,
  variant = 'primary',
  className,
  size = 'xs',
}: BadgeProps) => {
  const variants = {
    primary: "bg-primary text-white",
    secondary: "bg-[var(--secondary)] text-[#303030]",
    dark: "bg-[#303030] text-white",
    light: "bg-surface-low text-[#454557]/60",
    outline: "border border-[#454557]/10 text-[#454557]/60",
    error: "bg-error text-white",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-[8px] rounded-none",
    sm: "px-3 py-1.5 text-[10px] rounded-none",
    md: "px-4 py-2 text-[10px] rounded-none",
  };

  return (
    <span
      className={cn(
        "font-bold uppercase tracking-[0.2em] inline-block",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
