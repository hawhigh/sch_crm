import { 
  FileText, 
  MessageCircle, 
  Calendar,
  Zap,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Download,
  Star,
  Loader2,
  AlertCircle,
  Video,
  Headphones
} from 'lucide-react';
import { useParentDashboard, useUpdates } from '../lib/api';
import { cn } from '../lib/utils';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const PerformanceChart = () => {
  const bars = [60, 45, 75, 88, 65, 50, 80];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="bg-surface-low p-8 rounded-none shadow-sm">
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#454557]/60 font-bold mb-2">Performance Index</p>
          <h3 className="text-5xl font-black text-primary tracking-tighter">88%</h3>
        </div>
        <div className="text-right">
          <span className="text-[#5a6400] font-bold flex items-center gap-1.5 bg-[var(--secondary)]/20 px-3 py-1.5 rounded-none text-sm">
            <TrendingUp size={16} /> +4%
          </span>
          <p className="text-[10px] text-[#454557]/40 uppercase font-bold mt-2 tracking-widest">vs Last Month</p>
        </div>
      </div>
      
      <div className="h-48 w-full flex items-end gap-3 px-2">
        {bars.map((h, i) => (
          <div 
            key={i} 
            className={cn(
              "flex-1 rounded-none transition-all duration-700 hover:opacity-80 cursor-pointer relative group",
              i === 3 ? "bg-primary" : "bg-[#e4e2de]"
            )}
            style={{ height: `${h}%` }}
          >
            {i === 3 && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#303030] text-white text-[10px] px-3 py-1.5 rounded-none font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20">
                Peak Performance
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6 text-[10px] font-bold text-[#454557]/40 uppercase tracking-[0.2em] px-2 font-black">
        {days.map(d => <span key={d}>{d}</span>)}
      </div>
    </div>
  );
};

export const ParentDashboard = () => {
  const { data, isLoading, error } = useParentDashboard();
  const { data: pulseItems = [] } = useUpdates('PULSE');

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

  const lectorPulses = pulseItems.map((p: any) => ({
    name: p.author.name,
    time: 'Recent',
    msg: p.content,
    type: p.tag === 'Positive' ? 'zap' : 'check'
  }));

  const studentFirstName = data.student.name.split(' ')[0];

  return (
    <div className="space-y-16 animate-fade-up">
      
      {/* Editorial Title & Quick Actions */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-[#454557]/10 pb-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="secondary" size="md">Institutional Progress</Badge>
            <span className="text-[10px] font-bold text-[#454557]/40 uppercase tracking-[0.2em]">Student Node: {data.student.studentId}</span>
          </div>
          <h1 className="display-lg text-[#303030]">
            {studentFirstName}'s English <span className="italic font-normal text-primary">Odyssey</span>
          </h1>
          <p className="text-[#454557] text-xl leading-relaxed font-medium mt-6">
            Establishing the temporal and spatial schemas for <span className="text-[#303030] font-black">{studentFirstName}'s</span> learning trajectory within the <span className="text-primary font-black">{data.student.className}</span> cluster.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" icon={<Calendar size={18} />}>Institutional Calendar</Button>
          <Button variant="primary" icon={<MessageCircle size={18} />}>Communicate with Lector</Button>
        </div>
      </header>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-up stagger-1">
        <StatCard label="Current Lesson" value={data.stats.currentLesson} description={`Slot ${data.stats.currentLesson} of ${data.stats.totalLessons} total.`} icon={Clock} variant="light" className="card" />
        <StatCard label="Energy Index" value="88%" description="Aggregated student engagement metrics." icon={Zap} variant="dark" className="card shadow-2xl electric-glow" />
        <StatCard label="Subject Mastery" value={data.stats.mastery} description="Verified competency in level proficiency." icon={Star} variant="primary" className="card" />
        <StatCard label="Attendance" value={data.stats.attendance} description="Consistent presence in live sessions." icon={CheckCircle2} variant="secondary" className="card shadow-xl" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 pt-6 animate-fade-up stagger-2">
        
        {/* Left Column: Analytics & Content Archive (60%) */}
        <section className="xl:col-span-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PerformanceChart />
            
            <div className="bg-[#303030] p-12 rounded-none text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl electric-glow">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/30 blur-[100px] rounded-none translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10">
                <Badge variant="secondary" size="sm" className="mb-8">Curator Insight</Badge>
                <h4 className="serif text-3xl font-bold tracking-tight leading-relaxed text-white/90 italic">
                  "{studentFirstName} is developing a sharp eye for <span className="text-[var(--secondary)]">editorial structure</span>. Exceptional mastery of syntax detected."
                </h4>
              </div>
              
              <div className="relative z-10 pt-10 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">Status Report</p>
                  <p className="text-xl font-bold text-[var(--secondary)]">B2+ PROFICIENCY</p>
                </div>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" icon={<ArrowRight size={18} />}>Detailed Metrics</Button>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-[#454557]/10 pb-8">
              <h3 className="serif text-4xl font-bold text-[#303030] italic">Content <span className="not-italic">Archive Flow</span></h3>
              <Button variant="ghost" size="sm" icon={<FileText size={18} />}>Browse Institutional Repository</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {data.recentMaterials.map((item: any, i: number) => (
                  <div key={item.title + i} className="bg-surface-low p-10 rounded-none group hover:bg-white border border-transparent hover:border-[#454557]/5 transition-all duration-700 cursor-pointer flex flex-col justify-between min-h-[280px] shadow-sm hover:shadow-2xl hover:-translate-y-1">
                     <div className="flex items-center justify-between mb-10">
                       <div className="w-16 h-16 rounded-none bg-white flex items-center justify-center text-[#303030] group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                         {item.type.includes('Video') ? <Video size={32} /> : item.type.includes('Audio') ? <Headphones size={32} /> : <FileText size={32} />}
                       </div>
                       <Badge variant="light" size="xs">{item.date}</Badge>
                     </div>
  
                     <div>
                       <h4 className="text-2xl font-bold text-[#303030] mb-3 group-hover:text-primary transition-colors leading-tight">{item.title}</h4>
                       <p className="text-[10px] font-black text-[#454557]/40 uppercase tracking-[0.2em] mb-10">{item.type} • {item.size || '1.0 MB'}</p>
  
                       <div className="flex items-center gap-4">
                         <Button variant="outline" className="flex-1 h-14 rounded-none text-[10px] font-black" size="sm">PREVIEW</Button>
                         <Button variant="secondary" className="w-14 h-14 p-0 rounded-none shadow-sm transform group-hover:scale-110" size="sm" icon={<Download size={20} />} />
                       </div>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        </section>

        {/* Right Column: Lector Pulses & Milestones (40%) */}
        <aside className="xl:col-span-4 space-y-12">
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-[#454557]/10 pb-8">
              <h3 className="serif text-4xl font-bold text-[#303030] italic">Lector <span className="not-italic">Pulses</span></h3>
              <Badge variant="primary">LIVE STREAM</Badge>
            </div>
            
            <div className="bg-surface-low rounded-none p-8 space-y-4 shadow-sm relative overflow-hidden min-h-[600px]">
               <div className="absolute inset-0 bg-white/20 backdrop-blur-2xl pointer-events-none" />
               <div className="relative z-10 space-y-4">
                 {lectorPulses.map((pulse: any, i: number) => (
                    <div key={pulse.name + i} className="bg-white p-8 rounded-none border border-primary/5 space-y-6 hover:shadow-2xl transition-all duration-700 hover:-translate-y-1 group">
                       <div className="flex items-center gap-5">
                         <div className={cn(
                           "w-14 h-14 rounded-none flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                           pulse.type === 'zap' ? "bg-primary text-white" : "bg-[var(--secondary)] text-[#303030]"
                         )}>
                           {pulse.type === 'zap' ? <Zap size={24} /> : <CheckCircle2 size={24} />}
                         </div>
                         <div>
                           <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[#303030] mb-1">{pulse.name}</p>
                           <p className="text-[10px] font-bold text-[#454557]/20 uppercase tracking-widest">{pulse.time}</p>
                         </div>
                       </div>
                       <p className="text-base font-medium text-[#454557] italic leading-relaxed decoration-primary/10">
                         "{pulse.msg}"
                       </p>
                    </div>
                 ))}
                 {lectorPulses.length === 0 && (
                    <div className="p-16 text-center border border-dashed border-[#454557]/10 rounded-none flex flex-col items-center justify-center">
                       <p className="text-[10px] font-black text-[#454557]/30 uppercase tracking-[0.3em]">Temporal Silence</p>
                    </div>
                 )}
               </div>
            </div>
          </div>

          <div className="bg-primary p-12 rounded-none text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-700 shadow-xl electric-glow">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-none translate-x-1/4 -translate-y-1/4 group-hover:scale-150 duration-1000" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--secondary)]/10 blur-[60px] rounded-none translate-x-[-20%] translate-y-[20%]" />
            
            <div className="flex items-center gap-6 mb-12 relative z-10">
              <div className="w-20 h-20 rounded-none bg-white text-primary flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-700">
                <Star size={44} fill="currentColor" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Institutional Reward</p>
                <h4 className="text-3xl font-black text-white tracking-tight leading-none mb-4 italic">Grammar <br/>Architect</h4>
                <Badge variant="secondary" size="xs">RARE PROTOCOL</Badge>
              </div>
            </div>
            
            <p className="text-xl font-medium text-white/70 leading-relaxed mb-16 relative z-10 italic">
              "Exceptional mastery of institutional syntax and complex logical structures."
            </p>
            
            <Button variant="secondary" className="w-full h-18 rounded-none font-black uppercase tracking-[0.2em] shadow-xl transform active:scale-95" icon={<ArrowRight size={20} />}>
              Acknowledge Evolution
            </Button>
          </div>
        </aside>

      </div>
    </div>
  );
};
