import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'dark' | 'light';
  trend?: string;
  className?: string;
}

export const StatCard = ({
  label,
  value,
  description,
  icon: Icon,
  variant = 'light',
  trend,
  className
}: StatCardProps) => {
  const themes = {
    primary: "bg-primary text-white",
    secondary: "bg-[var(--secondary)] text-[#303030]",
    dark: "bg-[#303030] text-white",
    light: "bg-white text-[#303030] border border-[#454557]/5 shadow-sm hover:shadow-xl group hover:border-[#454557]/10"
  };

  const isDarkBase = variant === 'primary' || variant === 'dark';

  return (
    <div className={cn("rounded-[32px] p-8 flex flex-col justify-between min-h-[260px] relative overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-default", themes[variant], className)}>
      {/* Decorative Glow */}
      <div className={cn("absolute -top-12 -right-12 w-48 h-48 blur-[60px] rounded-full mix-blend-overlay opacity-20 pointer-events-none", isDarkBase ? "bg-white" : "bg-black")} />
      
      <div className="flex justify-between items-start relative z-10">
        <div className={cn("w-14 h-14 rounded-[16px] flex items-center justify-center shadow-md", isDarkBase ? "bg-white/10" : "bg-surface-low group-hover:bg-primary group-hover:text-white transition-colors")}>
          <Icon size={28} className={cn("transition-colors", isDarkBase ? "text-white" : "text-[#454557]/40 group-hover:text-white")} />
        </div>
        <div className="text-right">
          <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em] mb-2", isDarkBase ? "text-white/60" : "text-[#454557]/40")}>{label}</p>
          <div className="flex items-end justify-end gap-3">
             <h3 className="text-5xl font-bold tracking-tighter">{value}</h3>
             {trend && <span className={cn("text-[10px] font-bold mb-1.5 uppercase tracking-[0.1em]", isDarkBase ? "text-[var(--secondary)]" : "text-primary")}>{trend}</span>}
          </div>
        </div>
      </div>
      
      <div className="relative z-10 pt-8">
        <div className={cn("h-px w-full mb-6", isDarkBase ? "bg-white/10" : "bg-[#454557]/5")} />
        <p className={cn("text-sm font-bold uppercase tracking-[0.1em] leading-relaxed", isDarkBase ? "text-white/70" : "text-[#454557]/60")}>
          {description}
        </p>
      </div>
    </div>
  );
};
