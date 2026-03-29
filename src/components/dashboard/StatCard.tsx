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
    <div className={cn("rounded-[36px] p-10 flex flex-col justify-between min-h-[240px] relative overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-default border border-transparent shadow-xl", themes[variant], className)}>
      {/* Decorative Glow */}
      <div className={cn("absolute -top-12 -right-12 w-48 h-48 blur-[60px] rounded-full mix-blend-overlay opacity-20 pointer-events-none", isDarkBase ? "bg-white" : "bg-black")} />
      
      <div className="flex justify-between items-start relative z-10 gap-4">
        <div className={cn("w-16 h-16 rounded-[22px] shrink-0 flex items-center justify-center shadow-lg", isDarkBase ? "bg-white/10" : "bg-surface-low group-hover:bg-primary group-hover:text-white transition-colors")}>
          <Icon size={32} className={cn("transition-colors", isDarkBase ? "text-white" : "text-[#454557]/40 group-hover:text-white")} />
        </div>
        <div className="text-right min-w-0">
          <p className={cn("text-[10px] font-black uppercase tracking-[0.3em] mb-3 truncate", isDarkBase ? "text-white/60" : "text-[#454557]/40")}>{label}</p>
          <div className="flex items-baseline justify-end gap-3 flex-wrap">
             <h3 className="text-4xl xl:text-5xl font-bold tracking-tight leading-none text-[#303030] dark:text-white">{value}</h3>
             {trend && <span className={cn("text-[9px] font-black mb-1 uppercase tracking-[0.1em] px-2 py-0.5 rounded-full", isDarkBase ? "bg-white/10 text-[var(--secondary)]" : "bg-primary/5 text-primary")}>{trend}</span>}
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
