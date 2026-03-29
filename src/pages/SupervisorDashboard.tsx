import { ArrowRight, Loader2, TrendingUp, Users, AlertCircle, CheckCircle2, Activity, MessageSquare, Plus } from 'lucide-react';
import { useSupervisorDashboard, useUpdates } from '../lib/api';
import { cn } from '../lib/utils';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const ProgressBar = ({ value, theme }: { value: number; theme: 'primary' | 'secondary' | 'dark' }) => {
  const themes = {
    primary: "bg-primary",
    secondary: "bg-[var(--secondary)]",
    dark: "bg-[#303030]"
  };
  return (
    <div className="h-1.5 bg-[#e4e2de] rounded-full mt-3 overflow-hidden">
      <div className={cn("h-full rounded-full transition-all duration-1000", themes[theme])} style={{ width: `${value}%` }} />
    </div>
  );
};

export const SupervisorDashboard = () => {
  const { data, isLoading, error } = useSupervisorDashboard();
  const { data: insightsItems = [] } = useUpdates('INSIGHT');

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (error) return (
    <div className="p-10 bg-surface-low text-primary rounded-[40px] flex items-center gap-6 border border-primary/10">
      <div className="w-16 h-16 bg-white rounded-[24px] shadow-sm flex items-center justify-center text-primary">
        <AlertCircle size={32} />
      </div>
      <div>
        <h3 className="serif text-2xl font-bold text-[#303030]">Neural Sync Failure</h3>
        <p className="text-sm text-[#454557]/80 font-medium">Unable to establish connection with the institutional ledger.</p>
        <Button variant="ghost" className="mt-4" onClick={() => window.location.reload()}>Retry Ledger Sync</Button>
      </div>
    </div>
  );

  const insights = insightsItems.map((u: any) => ({
    name: u.author.name,
    time: 'Live', // In a real app, calculate time ago
    msg: u.content,
    tag: u.tag,
    variant: u.variant || 'secondary'
  }));

  const stalledClasses = data.healthIndices.filter((h: any) => h.status === 'STALLED');

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
      {/* Editorial Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" size="md">Institutional Monitor</Badge>
            <span className="text-[#454557]/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="display-lg text-[#303030]">
            Supervisor <span className="italic font-normal text-primary">Intelligence</span>
          </h1>
          <p className="text-xl text-[#454557] font-medium leading-relaxed max-w-2xl mt-4">
            Critical overview of institutional class health, lector performance, and active participation metrics.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" icon={<Activity size={18} />}>Full Analytics</Button>
          <Button variant="secondary" icon={<Plus size={18} />}>New Report</Button>
        </div>
      </div>

      {/* Hero Stats (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <StatCard 
            label="Active Classes Managed" 
            value={data.totalClasses} 
            description="Tracking 12% growth index relative to the previous academic term."
            icon={TrendingUp} 
            variant="primary" 
          />
        </div>
        <div className="lg:col-span-4">
          <StatCard 
            label="Enrolled Students" 
            value={data.totalStudents} 
            description="Institutional student nodes across all schools."
            icon={Users} 
            variant="light" 
          />
        </div>
      </div>

      {/* Class Health Alerts + Right Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-6">
        
        {/* Alerts & Metrics (60%) */}
        <div className="xl:col-span-8 space-y-10">
          
          <div className="flex items-center justify-between border-b border-[#454557]/10 pb-6">
            <h2 className="serif text-3xl font-bold flex items-center gap-3 italic text-[#303030]">
               Health <span className="not-italic">Monitoring</span>
            </h2>
            <Button variant="ghost" size="sm">View All Alerts</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stalledClasses.length > 0 ? stalledClasses.map((a: any) => (
              <div key={a.id} className="bg-surface-low rounded-[32px] p-8 flex flex-col justify-between hover:bg-white border border-transparent hover:border-[#454557]/5 transition-all duration-500 group">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 bg-white text-primary rounded-[18px] shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <AlertCircle size={28} />
                  </div>
                  <Badge variant="primary">Stalled Node</Badge>
                </div>
                <div>
                  <h3 className="font-bold text-2xl mb-1 text-[#303030] group-hover:text-primary transition-colors">{a.name}</h3>
                  <p className="text-[#454557]/60 text-sm font-medium">{a.school}</p>
                </div>
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#454557]/5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/40">{a.studentCount} Nodes Affected</span>
                  <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#303030] hover:bg-primary hover:text-white transition-all shadow-sm border border-[#454557]/5">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="md:col-span-2 p-16 flex flex-col items-center justify-center text-center bg-surface-low rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--secondary)]/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mb-8 shadow-sm">
                  <CheckCircle2 className="text-[#5a6400]" size={48} />
                </div>
                <h3 className="serif text-3xl font-bold text-[#303030]">System Nominal</h3>
                <p className="text-[#454557] font-medium leading-relaxed max-w-sm mt-4 text-lg">All class nodes are currently tracking accurately against institutional progression targets.</p>
              </div>
            )}
          </div>

          {/* Performance Index */}
          <div className="bg-[#303030] text-white rounded-[40px] p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <h3 className="serif text-3xl font-bold mb-12 text-white flex items-center gap-4 italic relative z-10">
               <Activity size={28} className="text-[var(--secondary)] not-italic" /> 
               Performance <span className="not-italic">Index</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 relative z-10">
              <div className="space-y-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Curriculum Tracking</p>
                <p className="text-5xl font-bold tracking-tight text-white leading-none">
                  {Math.round(data.healthIndices.reduce((acc: number, h: any) => acc + h.completionRate, 0) / data.healthIndices.length || 0)}%
                </p>
                <ProgressBar value={88.4} theme="primary" />
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Avg. Satisfaction</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-bold tracking-tight text-[var(--secondary)] leading-none">4.8</p>
                  <p className="text-xl text-white/40 font-medium">/ 5.0</p>
                </div>
                <ProgressBar value={96} theme="secondary" />
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Lector Retention</p>
                <p className="text-5xl font-bold tracking-tight text-white leading-none">94.2%</p>
                <ProgressBar value={94.2} theme="dark" />
              </div>
            </div>
          </div>
        </div>

        {/* Lector Insights Feed Stack (40%) */}
        <div className="xl:col-span-4 space-y-8">
          <div className="flex items-center justify-between border-b border-[#454557]/10 pb-6">
            <h2 className="serif text-3xl font-bold text-[#303030] italic">Insights</h2>
            <Badge variant="dark">Real Time</Badge>
          </div>
          
          <div className="bg-surface-low rounded-[40px] p-8 space-y-6 flex flex-col min-h-[600px] shadow-sm">
            <div className="flex-1 space-y-6">
              {insights.map((ins: any, i: number) => (
                <div key={i} className="flex gap-4 p-6 rounded-[28px] bg-white group hover:shadow-md transition-all duration-300 border border-transparent hover:border-[#454557]/5">
                  <div className="w-14 h-14 rounded-[20px] bg-surface-low text-[#303030] font-black flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    {ins.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-bold text-[#303030] text-lg">{ins.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/30">{ins.time}</span>
                    </div>
                    <p className="text-sm text-[#454557] font-medium leading-relaxed line-clamp-2 mb-4 italic">"{ins.msg}"</p>
                    <Badge variant={ins.variant}>{ins.tag}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" icon={<MessageSquare size={18} />} className="w-full h-16 rounded-[24px]">
              Open Activity Log
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
