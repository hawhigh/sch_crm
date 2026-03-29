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
    <div className="bg-surface-low p-8 rounded-[40px] shadow-sm">
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#454557]/60 font-bold mb-2">Performance Index</p>
          <h3 className="text-5xl font-black text-primary tracking-tighter">88%</h3>
        </div>
        <div className="text-right">
          <span className="text-[#5a6400] font-bold flex items-center gap-1.5 bg-[var(--secondary)]/20 px-3 py-1.5 rounded-lg text-sm">
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
              "flex-1 rounded-t-xl transition-all duration-700 hover:opacity-80 cursor-pointer relative group",
              i === 3 ? "bg-primary" : "bg-[#e4e2de]"
            )}
            style={{ height: `${h}%` }}
          >
            {i === 3 && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#303030] text-white text-[10px] px-3 py-1.5 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20">
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

  const lectorPulses = pulseItems.map((p: any) => ({
    name: p.author.name,
    time: 'Recent',
    msg: p.content,
    type: p.tag === 'Positive' ? 'zap' : 'check'
  }));

  const studentFirstName = data.student.name.split(' ')[0];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
      
      {/* Editorial Title & Quick Actions */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-[#454557]/10 pb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="secondary" size="md">Institutional Progress</Badge>
            <span className="text-[10px] font-bold text-[#454557]/40 uppercase tracking-[0.2em]">Student ID: {data.student.studentId}</span>
          </div>
          <h1 className="display-lg text-[#303030]">
            {studentFirstName}'s English <span className="italic font-normal text-primary">Odyssey</span>
          </h1>
          <p className="text-[#454557] text-xl leading-relaxed font-medium max-w-xl mt-4">
            Welcome back. <span className="font-bold text-[#303030]">{studentFirstName}</span> is currently navigating knowledge in <span className="text-primary font-bold uppercase tracking-widest">{data.student.className}</span>.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" icon={<Calendar size={18} />}>View Schedule</Button>
          <Button variant="primary" icon={<MessageCircle size={18} />}>Contact Lector</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Current Lesson" value={data.stats.currentLesson} description={`Slot ${data.stats.currentLesson} of ${data.stats.totalLessons} total progress.`} icon={Clock} variant="light" />
        <StatCard label="Energy Index" value="88%" description="Average student engagement across recent modules." icon={Zap} variant="dark" />
        <StatCard label="Subject Mastery" value={data.stats.mastery} description="Verified competency in current level proficiency targets." icon={Star} variant="primary" />
        <StatCard label="Attendance" value={data.stats.attendance} description="Consistent presence in live institutional sessions." icon={CheckCircle2} variant="secondary" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 pt-6">
        
        {/* Left Col: Analytics & Materials (60%) */}
        <section className="xl:col-span-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PerformanceChart />
            
            <div className="bg-[#303030] p-10 rounded-[40px] text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10">
                <Badge variant="secondary" className="mb-6">System Insight</Badge>
                <h4 className="serif text-2xl font-bold tracking-tight leading-relaxed text-white/90 italic">
                  "{studentFirstName} is developing a sharp eye for editorial structure. Exceptional progress detected in syntax analysis."
                </h4>
              </div>
              
              <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Latest Eval</p>
                  <p className="text-sm font-bold text-[var(--secondary)]">B2+ Proficiency</p>
                </div>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" icon={<ArrowRight size={16} />}>Detailed Report</Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#454557]/10 pb-6">
              <h3 className="serif text-3xl font-bold text-[#303030] italic">Curated <span className="not-italic">Learning Flow</span></h3>
              <Button variant="ghost" size="sm">Browse Archive</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {data.recentMaterials.map((item: any, i: number) => (
                  <div key={i} className="bg-surface-low p-8 rounded-[40px] group hover:bg-white border border-transparent hover:border-[#454557]/5 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[240px]">
                     <div className="flex items-center justify-between mb-8">
                       <div className="w-14 h-14 rounded-[18px] bg-white flex items-center justify-center text-[#303030] group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                         {item.type.includes('Video') ? <Video size={24} /> : item.type.includes('Audio') ? <Headphones size={24} /> : <FileText size={24} />}
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/30">{item.date}</span>
                     </div>
  
                     <div>
                       <h4 className="text-xl font-bold text-[#303030] mb-2 group-hover:text-primary transition-colors">{item.title}</h4>
                       <p className="text-xs font-bold text-[#454557]/40 uppercase tracking-widest mb-8">{item.type} • {item.size || '1.0 MB'}</p>
  
                       <div className="flex items-center gap-3">
                         <Button variant="outline" className="flex-1 h-12 text-[10px]" size="sm">Preview</Button>
                         <Button variant="secondary" className="w-12 h-12 p-0 rounded-xl" size="sm" icon={<Download size={18} />} />
                       </div>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        </section>

        {/* Right Col: Teacher Pulses & Achievements (40%) */}
        <aside className="xl:col-span-4 space-y-10">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#454557]/10 pb-6">
              <h3 className="serif text-3xl font-bold text-[#303030] italic">Lector <span className="not-italic">Pulses</span></h3>
              <Badge variant="dark">Live</Badge>
            </div>
            
            <div className="bg-surface-low rounded-[40px] p-8 space-y-6 shadow-sm">
               {lectorPulses.map((pulse: any, i: number) => (
                 <div key={i} className="bg-white p-6 rounded-[32px] border border-[#454557]/5 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        pulse.type === 'zap' ? "bg-primary/10 text-primary" : "bg-[var(--secondary)]/20 text-[#5a6400]"
                      )}>
                        {pulse.type === 'zap' ? <Zap size={20} /> : <CheckCircle2 size={20} />}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#303030]">{pulse.name}</p>
                        <p className="text-[10px] font-bold text-[#454557]/40 uppercase tracking-widest">{pulse.time}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-[#454557] italic leading-relaxed">
                      "{pulse.msg}"
                    </p>
                 </div>
               ))}
               {lectorPulses.length === 0 && (
                 <div className="p-10 text-center border border-dashed border-[#454557]/10 rounded-[32px]">
                   <p className="text-[10px] font-bold text-[#454557]/40 uppercase tracking-widest">No Recent Pulses</p>
                 </div>
               )}
            </div>
          </div>

          <div className="bg-primary p-12 rounded-[40px] text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-700 shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4 group-hover:scale-150 duration-1000" />
            
            <div className="flex items-center gap-6 mb-10 relative z-10">
              <div className="w-16 h-16 rounded-[22px] bg-white text-primary flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                <Star size={34} fill="currentColor" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-white tracking-tight leading-none mb-2">Grammar Architect</h4>
                <Badge variant="secondary">Achievement Unlocked</Badge>
              </div>
            </div>
            
            <p className="text-lg font-medium text-white/80 leading-relaxed mb-12 relative z-10 italic">
              "Exceptional mastery of institutional structure and syntax."
            </p>
            
            <Button variant="secondary" className="w-full h-16 rounded-[24px]" icon={<ArrowRight size={18} />}>
              Acknowledge Progress
            </Button>
          </div>
        </aside>

      </div>
    </div>
  );
};
