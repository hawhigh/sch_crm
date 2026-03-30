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
    <div className="h-1.5 bg-[#e4e2de] rounded-none mt-3 overflow-hidden">
      <div className={cn("h-full rounded-none transition-all duration-1000", themes[theme])} style={{ width: `${value}%` }} />
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
    <div className="p-10 bg-surface-low text-primary rounded-none flex items-center gap-6 border border-primary/10 animate-fade-up">
      <div className="w-16 h-16 bg-white rounded-none shadow-sm flex items-center justify-center text-primary">
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
    time: 'Live', 
    msg: u.content,
    tag: u.tag,
    variant: u.variant || 'secondary'
  }));

  const stalledClasses = data.healthIndices.filter((h: any) => h.status === 'STALLED');

  return (
    <div className="space-y-16 animate-fade-up">
      {/* Editorial Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-[#454557]/10 pb-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="secondary" size="md">Institutional Supervisor</Badge>
            <span className="text-[#454557]/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="display-lg text-[#303030]">
            Operational <span className="italic font-normal text-primary">Intelligence</span>
          </h1>
          <p className="text-xl text-[#454557] font-medium leading-relaxed mt-6">
            Establishing a high-fidelity overview of institutional <span className="text-primary font-black">class health</span>, lector performance metrics, and active participation ledgers.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" icon={<Activity size={18} />}>Full Analytics</Button>
          <Button variant="secondary" icon={<Plus size={18} />}>New Report</Button>
        </div>
      </header>

      {/* Hero Stats - Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-up stagger-1">
        <div className="lg:col-span-8">
          <StatCard 
            label="Active Classes Managed" 
            value={data.totalClasses} 
            description="Tracking 12% growth index relative to the previous academic term."
            icon={TrendingUp} 
            variant="primary" 
            className="card"
          />
        </div>
        <div className="lg:col-span-4">
          <StatCard 
            label="Enrolled Students" 
            value={data.totalStudents} 
            description="Institutional student nodes across all schools."
            icon={Users} 
            variant="light" 
            className="card"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 animate-fade-up stagger-2">
        {/* Alerts & Health Index (60%) */}
        <section className="xl:col-span-8 space-y-12">
          
          <div className="flex items-center justify-between border-b border-[#454557]/10 pb-8">
            <h2 className="serif text-4xl font-bold italic text-[#303030]">
               Temporal <span className="not-italic">Health Status</span>
            </h2>
            <Button variant="ghost" size="sm" icon={<ArrowRight size={18} />}>View All Critical Nodes</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stalledClasses.length > 0 ? stalledClasses.map((a: any) => (
              <div key={a.id} className="bg-surface-low rounded-none p-10 flex flex-col justify-between hover:bg-white border border-transparent hover:border-[#454557]/5 transition-all duration-700 hover:shadow-2xl group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[40px] rounded-none pointer-events-none" />
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="w-16 h-16 bg-white text-error rounded-none shadow-sm flex items-center justify-center group-hover:bg-error group-hover:text-white transition-colors">
                    <AlertCircle size={32} />
                  </div>
                  <Badge variant="error" size="sm">CRITICAL NODE</Badge>
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-2xl mb-2 text-[#303030] group-hover:text-primary transition-colors">{a.name}</h3>
                  <p className="text-[#454557]/60 font-medium uppercase text-[10px] tracking-[0.2em]">{a.school}</p>
                </div>
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#454557]/5 relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#454557]/20">{a.studentCount} Nodes At Risk</span>
                  <Button variant="ghost" size="sm" className="w-12 h-12 p-0 rounded-none bg-white shadow-sm border border-[#454557]/5" icon={<ArrowRight size={18} />} />
                </div>
              </div>
            )) : (
              <div className="md:col-span-2 p-24 flex flex-col items-center justify-center text-center bg-surface-low rounded-none relative overflow-hidden border border-transparent hover:border-[#454557]/5 transition-all duration-700">
                <div className="absolute inset-0 bg-primary/5 opacity-50" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--secondary)]/10 blur-[100px] rounded-none pointer-events-none" />
                <div className="w-24 h-24 bg-white rounded-none flex items-center justify-center mb-10 shadow-xl relative z-10 animate-pulse">
                  <CheckCircle2 className="text-[#5a6400]" size={48} />
                </div>
                <h3 className="serif text-4xl font-bold text-[#303030] relative z-10">Nodes Synchronized</h3>
                <p className="text-[#454557] font-medium leading-relaxed max-w-sm mt-6 text-xl relative z-10">Institutional health is currently <span className="text-primary font-black">optimal</span> across all managed portals.</p>
              </div>
            )}
          </div>

          {/* Institutional Performance Index */}
          <div className="bg-[#303030] text-white rounded-none p-12 relative overflow-hidden shadow-2xl electric-glow">
            <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-primary/30 blur-[120px] rounded-none translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <header className="flex items-center justify-between mb-16 relative z-10">
              <h3 className="serif text-3xl font-bold text-white flex items-center gap-5 italic focus:outline-none">
                 <Activity size={32} className="text-[var(--secondary)] not-italic" /> 
                 Institutional <span className="not-italic">Performance Quotient</span>
              </h3>
              <Badge variant="secondary">Aggregate v.2.5</Badge>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 relative z-10">
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Curricular Delta</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-6xl font-bold tracking-tighter text-white leading-none">
                    {Math.round(data.healthIndices.reduce((acc: number, h: any) => acc + h.completionRate, 0) / data.healthIndices.length || 0)}%
                  </p>
                  <span className="text-[var(--secondary)] text-sm font-bold">↑ 2.4%</span>
                </div>
                <ProgressBar value={88.4} theme="primary" />
              </div>
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Engagement Mastery</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-6xl font-bold tracking-tighter text-[var(--secondary)] leading-none">4.8</p>
                  <p className="text-xl text-white/30 font-serif italic">/ 5.0</p>
                </div>
                <ProgressBar value={96} theme="secondary" />
              </div>
              <div className="space-y-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Staffing Capacity</p>
                <p className="text-6xl font-bold tracking-tighter text-white leading-none">94.2%</p>
                <ProgressBar value={94.2} theme="dark" />
              </div>
            </div>
          </div>
        </section>

        {/* Lector Insights Feed Stack (40%) */}
        <aside className="xl:col-span-4 space-y-12">
          <header className="flex items-center justify-between border-b border-[#454557]/10 pb-8">
            <h2 className="serif text-4xl font-bold text-[#303030] italic">Curator <span className="not-italic">Intel</span></h2>
            <Badge variant="primary" className="animate-pulse">STREAMING</Badge>
          </header>
          
          <div className="bg-surface-low rounded-none p-8 space-y-4 flex flex-col min-h-[700px] shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl pointer-events-none" />
            <div className="flex-1 space-y-4 relative z-10">
              {insights.map((ins: any, i: number) => (
                <div key={ins.name + i} className="p-8 rounded-none bg-white group hover:shadow-2xl transition-all duration-700 border border-transparent hover:border-primary/5 hover:-translate-y-1">
                  <div className="flex gap-5">
                    <div className="w-16 h-16 rounded-none bg-[#303030] text-[var(--secondary)] font-black flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xl">
                      {ins.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-bold text-[#303030] text-xl group-hover:text-primary transition-colors">{ins.name}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#454557]/20">{ins.time}</span>
                      </div>
                      <p className="text-sm text-[#454557] font-medium leading-relaxed mb-6 italic opacity-80 decoration-primary/20">"{ins.msg}"</p>
                      <div className="flex items-center gap-3">
                        <Badge variant={ins.variant} size="xs">{ins.tag}</Badge>
                        <span className="w-1.5 h-1.5 rounded-none bg-primary/20" />
                        <span className="text-[8px] font-black text-[#454557]/30 uppercase tracking-[0.1em]">Lector ID: {ins.name.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-8 pt-4 relative z-10">
              <Button variant="outline" icon={<MessageSquare size={18} />} className="w-full h-18 rounded-none bg-white border-none shadow-sm text-[#303030] hover:bg-[#303030] hover:text-white transition-all">
                Open Full Activity Ledger
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
