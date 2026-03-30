import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  MoreVertical,
  Calendar,
  Zap,
  Star,
  Activity,
  Plus,
  Loader2
} from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { useLectorDashboard } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";

export const Dashboard = () => {
  const { data: metrics, isLoading } = useLectorDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const recentLessons = metrics?.recentLessons || [];

  return (
    <div className="space-y-16 animate-fade-up">
      {/* Editorial Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#454557]/10 pb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="primary" size="md">Curation Node</Badge>
            <span className="text-[10px] font-bold text-[#454557]/40 uppercase tracking-[0.2em]">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="display-lg text-[#303030]">
            Expert <span className="italic font-normal text-primary">Curation</span>
          </h1>
          <p className="text-[#454557] text-xl leading-relaxed font-medium mt-6">
            Establishing the temporal and spatial schemas for the <span className="text-[#303030] font-black">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span> cycle.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" icon={<Calendar size={18} />}>Institutional Roster</Button>
          <Button variant="primary" icon={<Plus size={18} />}>Initialize Session</Button>
        </div>
      </header>

      {/* Metrics Row - Bento Grid Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 animate-fade-up stagger-1">
        <StatCard 
          label="Active Students" 
          value={metrics?.activeStudents.toString() || "248"} 
          trend="+12% Delta" 
          description="Institutional student nodes"
          icon={Users}
          className="bg-white border-[#303030]/5 shadow-xl card"
        />
        <StatCard 
          label="Completion Rate" 
          value={`${metrics?.completionRate || 94}%`} 
          trend="OPTIMAL" 
          description="Curricular progression efficiency"
          icon={GraduationCap}
          className="bg-[#303030] border-none text-white shadow-2xl card"
        />
        <StatCard 
          label="Yearly Revenue" 
          value={`€${(metrics?.totalRevenue || 12450).toLocaleString()}`} 
          trend="STABLE" 
          description="Financial operational index"
          icon={TrendingUp}
          className="bg-white border-[#303030]/5 shadow-xl card"
        />
        <StatCard 
          label="Operational Load" 
          value="88%" 
          trend="+4.2% Load" 
          description="Lector capacity utilization"
          icon={Activity}
          className="bg-[#d8ef00] border-none text-[#303030] shadow-xl electric-glow card"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-up stagger-2">
        {/* Main Content: Agenda */}
        <section className="lg:col-span-8 space-y-12">
           <div className="flex items-center justify-between border-b border-[#454557]/10 pb-8">
              <h3 className="serif text-4xl font-bold text-[#303030] italic">Daily <span className="not-italic">Agenda Flow</span></h3>
              <Button variant="ghost" size="sm" icon={<ArrowUpRight size={18} />}>View Full Schedule</Button>
           </div>

           <div className="bg-surface-low rounded-none p-6 space-y-4">
              {recentLessons.map((lesson: any) => (
                <div key={lesson.id} className={cn(
                  "p-10 hover:bg-white transition-all duration-700 group flex items-center justify-between rounded-none border border-transparent hover:border-[#454557]/5 hover:shadow-2xl",
                  lesson.status === "Active" && "bg-white shadow-xl electric-glow border-primary/10"
                )}>
                   <div className="flex items-center gap-10">
                      <div className={cn(
                        "w-16 h-16 rounded-none flex items-center justify-center transition-all duration-700 shadow-sm",
                        lesson.status === "Active" ? "bg-[#303030] text-[var(--secondary)] scale-110" : "bg-white text-[#454557]/40 group-hover:bg-[#303030] group-hover:text-white"
                      )}>
                         {lesson.status === "Active" ? <Zap size={28} className="animate-pulse" /> : <Clock size={28} />}
                      </div>
                      <div>
                         <h4 className="serif text-2xl font-bold text-[#303030] group-hover:text-primary transition-colors mb-2">{lesson.title}</h4>
                         <div className="flex items-center gap-4">
                            <Badge variant={lesson.status === "Active" ? "secondary" : "dark"} size="xs">{lesson.class}</Badge>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#454557]/30">Commencing {lesson.time}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-12">
                      <div className="hidden xl:flex flex-col items-end">
                         <p className="text-2xl font-bold text-[#303030] leading-none mb-1">{lesson.students}</p>
                         <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#454557]/20">Student Nodes</p>
                      </div>
                      <Button variant="ghost" size="sm" className="w-12 h-12 rounded-none p-0 bg-white group-hover:bg-primary group-hover:text-white shadow-sm border border-[#454557]/5">
                         <ArrowUpRight size={20} />
                      </Button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Sidebar: Institutional Insights */}
        <aside className="lg:col-span-4 space-y-12">
           <div className="flex items-center justify-between border-b border-[#454557]/10 pb-8">
              <h3 className="serif text-3xl font-bold text-[#303030] italic">Real-Time <span className="not-italic">Intel</span></h3>
              <Badge variant="primary">LIVE</Badge>
           </div>
           
           <div className="space-y-8">
              <div className="bg-[#303030] rounded-none p-12 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-none pointer-events-none translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
                 <Star className="text-[var(--secondary)] mb-10" size={36} />
                 <p className="serif text-3xl font-bold mb-6 italic leading-tight">Mastery <br/>Synchronized</p>
                 <p className="text-sm text-white/50 leading-relaxed font-medium mb-10">
                    G1 Alpha has achieved <span className="text-[var(--secondary)] font-black">Phonics Level 5</span> protocol status through accelerated engagement.
                 </p>
                 <Button variant="secondary" className="w-full h-14 rounded-none" icon={<ArrowUpRight size={18} />}>Acknowledge Milestone</Button>
              </div>

              <div className="bg-surface-low rounded-none p-12 group hover:bg-white border border-transparent hover:border-[#454557]/5 transition-all duration-700 shadow-sm hover:shadow-2xl">
                 <div className="flex items-center justify-between mb-10">
                    <div className="w-16 h-16 rounded-none bg-white flex items-center justify-center text-[#303030] group-hover:bg-[#d8ef00] transition-colors shadow-sm">
                       <TrendingUp size={28} />
                    </div>
                    <Badge variant="secondary">STABLE</Badge>
                 </div>
                 <p className="serif text-2xl font-bold text-[#303030] mb-2 leading-tight">Growth Ledger</p>
                 <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#454557]/40 mb-10">Talkin Academy Center · Shard 04</p>
                 <div className="pt-8 border-t border-[#454557]/5 flex items-center justify-between">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#454557]/30 mb-1">Estimated MRR</p>
                       <p className="text-3xl font-bold text-primary">€1,450</p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-none bg-white shadow-sm" icon={<MoreVertical size={18} />} />
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};
