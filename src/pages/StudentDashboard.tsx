import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Globe,
  Zap,
  MessageCircle,
  Award,
  Book
} from 'lucide-react';
import { useStudentSchedule, useStudentProgress, useStudentMaterials } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const HomeworkItem = ({ title, due, status }: { title: string, due: string, status: 'completed' | 'pending' }) => (
  <div className={cn(
    "flex items-center gap-4 p-4 rounded-none transition-all border border-transparent",
    status === 'completed' ? "bg-white/50 opacity-60" : "bg-white hover:border-primary/5 hover:shadow-sm group"
  )}>
    <div className={cn(
      "w-10 h-10 rounded-none flex items-center justify-center transition-colors",
      status === 'completed' ? "bg-[var(--secondary)]/20 text-[#5a6400]" : "bg-surface-low text-[#454557]/40 group-hover:bg-primary group-hover:text-white"
    )}>
      {status === 'completed' ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
    </div>
    <div className="flex-1 min-w-0">
      <p className={cn("text-sm font-bold text-[#303030] truncate", status === 'completed' && "line-through")}>{title}</p>
      <p className="text-[10px] font-bold text-[#454557]/40 uppercase tracking-widest">{due}</p>
    </div>
    {status === 'pending' && <Button variant="ghost" size="sm" className="w-8 h-8 p-0" icon={<ArrowRight size={14} />} />}
  </div>
);

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { data: schedule, isLoading: scheduleLoading } = useStudentSchedule();
  const { data: progress, isLoading: progressLoading } = useStudentProgress();
  const { data: materials, isLoading: materialsLoading } = useStudentMaterials();

  const isLoading = scheduleLoading || progressLoading || materialsLoading;

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  const firstName = user?.name.split(' ')[0];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      
      {/* Institutional Focus Hero */}
      <section className="relative overflow-hidden rounded-none bg-primary text-white p-16 min-h-[460px] flex flex-col justify-between shadow-2xl">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[100px] rounded-none translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--secondary)]/10 blur-[80px] rounded-none -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        <div className="relative z-10">
          <Badge variant="secondary" className="mb-8">Curricular Focus</Badge>
          <h1 className="display-lg text-white mb-6">
            Refining the <span className="italic font-normal text-[var(--secondary)]">Linguistic</span> Edge
          </h1>
          <p className="text-white/70 text-xl font-medium leading-relaxed max-w-xl mb-12">
            Welcome back, <span className="text-white font-black">{firstName}</span>. You are currently navigating <span className="text-[var(--secondary)] font-bold">{schedule?.student?.class.name}</span> patterns.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-4">
          <Button variant="secondary" size="lg" icon={<Calendar size={18} />}>Full Timetable</Button>
          <Button variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10" icon={<Book size={18} />}>Access Syllabus</Button>
        </div>
      </section>

      {/* Hero Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Active Streak" value="14 Days" description="Consistent institutional engagement." icon={Zap} variant="secondary" />
        <StatCard label="Current Level" value="B2+" description="Advanced syntactical competency." icon={GraduationCap} variant="dark" />
        <StatCard label="Modules Secured" value={progress?.reduce((acc: any, p: any) => acc + p.completedLessons, 0) || 0} description="Verified curriculum completion." icon={CheckCircle2} variant="primary" />
        <StatCard label="Knowledge Credits" value="1,240" description="Cumulative learning recognition." icon={Award} variant="light" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Left Column: Progress & Materials (60%) */}
        <div className="xl:col-span-8 space-y-16">
          
          <section>
            <div className="flex items-center justify-between border-b border-[#454557]/10 pb-8 mb-10">
              <h3 className="serif text-3xl font-bold text-[#303030] italic">Learning <span className="not-italic">Trajectory</span></h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {progress?.map((p: any) => (
                <div key={p.subject} className="bg-surface-low p-10 rounded-none flex flex-col justify-between group hover:bg-white transition-all duration-500 shadow-sm border border-transparent hover:border-[#454557]/5">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/40 mb-3">{p.subject}</p>
                      <h4 className="font-bold text-2xl text-[#303030] tracking-tight">{p.courseTitle}</h4>
                    </div>
                    <Badge variant="primary" size="md" className="rounded-none">{p.percentComplete}%</Badge>
                  </div>
                  <div>
                    <div className="w-full h-2.5 bg-[#e4e2de] rounded-none overflow-hidden mb-5">
                      <div className="h-full bg-primary rounded-none transition-all duration-[2000ms] ease-out w-0" style={{ width: `${p.percentComplete}%` }} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/40 text-right">{p.completedLessons} / {p.targetLessons} Units Analyzed</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between border-b border-[#454557]/10 pb-8 mb-10">
              <h3 className="serif text-3xl font-bold text-[#303030]">Shared Knowledge</h3>
              <Button variant="ghost" size="sm">Browse Archive</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {materials?.length > 0 ? materials.map((m: any) => (
                <div key={m.id} className="bg-surface-low p-8 rounded-none group cursor-pointer hover:bg-white transition-all duration-500 border border-transparent hover:border-[#454557]/5">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-14 h-14 rounded-none bg-white flex items-center justify-center text-[#303030] group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                      <BookOpen size={24} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xl text-[#303030] mb-2 truncate group-hover:text-primary transition-colors">{m.title}</h4>
                      <Badge variant="secondary" size="sm">{m.type}</Badge>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-[#454557]/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#454557]/40 uppercase tracking-widest">{m.curriculum.lesson.course.subject.name}</span>
                    <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-none" icon={<ArrowRight size={18} />} />
                  </div>
                </div>
              )) : (
                <div className="col-span-2 p-20 flex flex-col items-center text-center bg-surface-low rounded-none border border-dashed border-[#454557]/20">
                  <div className="w-20 h-20 bg-white rounded-none flex items-center justify-center mb-6 text-[#454557]/10 shadow-sm">
                    <BookOpen size={40} />
                  </div>
                  <p className="text-sm font-bold text-[#454557]/40 uppercase tracking-widest leading-relaxed">Awaiting incoming curricular manifests.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Timetable & Homework (40%) */}
        <aside className="xl:col-span-4 space-y-12">
          
          <section className="bg-surface-low rounded-none p-10 shadow-sm border border-[#454557]/5">
            <h3 className="serif text-3xl font-bold text-[#303030] mb-10 italic">Daily <span className="not-italic">Homework</span></h3>
            <div className="space-y-4">
              <HomeworkItem title="Grammar Unit 4: Syntax" due="Due 5:00 PM Today" status="pending" />
              <HomeworkItem title="Speaking Mastery Practice" due="Due Tomorrow" status="pending" />
              <HomeworkItem title="Vocabulary Quiz 12" due="Completed" status="completed" />
              <HomeworkItem title="Institutional Review" due="Completed" status="completed" />
            </div>
          </section>

          <section className="bg-[#303030] p-12 rounded-none text-white relative overflow-hidden group shadow-xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-none translate-x-1/3 -translate-y-1/3 group-hover:scale-150 transition-transform duration-1000" />
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--secondary)]/10 blur-[60px] rounded-none -translate-x-1/4 translate-y-1/4" />
             
             <div className="relative z-10 flex flex-col items-center text-center">
               <div className="w-16 h-16 rounded-none bg-white/10 flex items-center justify-center mb-8 border border-white/10 backdrop-blur-md">
                 <Globe size={32} className="text-[var(--secondary)]" />
               </div>
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--secondary)] mb-4">Topological Stream</p>
               <h3 className="serif text-4xl font-bold mb-6 italic leading-tight">Expand the <br />horizon.</h3>
               <p className="text-white/60 text-sm font-medium leading-relaxed mb-10">
                 Access the global Knowledge Stream to review institutional schemas.
               </p>
               <Button variant="secondary" className="w-full h-16 rounded-none" icon={<ArrowRight size={18} />}>
                 Enter Stream
               </Button>
             </div>
          </section>

          <div className="bg-white p-8 rounded-none border border-[#454557]/10 flex items-center gap-6 shadow-sm">
            <div className="w-16 h-16 rounded-none overflow-hidden border-2 border-primary/20 bg-surface-low grow-0 shrink-0">
              <img src={`https://ui-avatars.com/api/?name=Lector+Active&background=0300a9&color=fff`} alt="Lector" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#303030] mb-1">Contact Lector</p>
              <p className="text-[10px] font-bold text-[#454557]/40 uppercase tracking-widest mb-3">Elena Novakova</p>
              <Button variant="ghost" size="sm" className="h-9 px-4 text-primary" icon={<MessageCircle size={14} />}>Message</Button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};
