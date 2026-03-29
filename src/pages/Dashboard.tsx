/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Activity
} from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { useLectorDashboard } from "../lib/api";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

export const Dashboard = () => {
  const { data: metrics, isLoading } = useLectorDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#0300a9]/10 border-t-[#0300a9] rounded-full animate-spin" />
      </div>
    );
  }

  const recentLessons = metrics?.recentLessons || [];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Metrics Row - Bento Grid Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
        <StatCard 
          label="Active Students" 
          value={metrics?.activeStudents.toString() || "248"} 
          trend="+12% this month" 
          description="Institutional growth"
          icon={Users}
          className="bg-white border-[#303030]/5 shadow-xl hover:-translate-y-2 transition-all duration-500"
        />
        <StatCard 
          label="Completion Rate" 
          value={`${metrics?.completionRate || 94}%`} 
          trend="+2.4% avg" 
          description="Curriculum efficiency"
          icon={GraduationCap}
          className="bg-[#303030] border-none text-white shadow-2xl hover:-translate-y-2 transition-all duration-500"
        />
        <StatCard 
          label="Total Revenue" 
          value={`€${(metrics?.totalRevenue || 12450).toLocaleString()}`} 
          trend="+8% QoQ" 
          description="Financial performance"
          icon={TrendingUp}
          className="bg-white border-[#303030]/5 shadow-xl hover:-translate-y-2 transition-all duration-500"
        />
        <StatCard 
          label="Lector Capacity" 
          value="88%" 
          trend="Optimal utility" 
          description="Staffing bandwidth"
          icon={Activity}
          className="bg-[#d8ef00] border-none text-[#303030] shadow-xl hover:-translate-y-2 transition-all duration-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content: Agenda */}
        <div className="lg:col-span-8 space-y-10">
           <div className="flex items-center justify-between px-2">
              <h3 className="serif text-4xl font-bold text-[#303030]">Daily <span className="italic text-[#0300a9] font-normal">Agenda</span></h3>
              <div className="flex items-center gap-4">
                 <Button variant="outline" size="sm" className="rounded-full bg-white border-[#303030]/10 px-6 py-4">
                    <Calendar size={16} className="mr-2" /> View Calendar
                 </Button>
              </div>
           </div>

           <div className="bg-white rounded-[44px] border border-[#303030]/5 shadow-sm overflow-hidden p-2">
              <div className="divide-y divide-[#303030]/5">
                 {recentLessons.map((lesson: any) => (
                   <div key={lesson.id} className="p-10 hover:bg-[#f5f3ef] transition-all duration-500 group flex items-center justify-between rounded-[40px]">
                      <div className="flex items-center gap-10">
                         <div className={cn(
                           "w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-500 shadow-md",
                           lesson.status === "Active" ? "bg-[#d8ef00] text-[#303030] animate-pulse" : "bg-white text-[#454557]/40 group-hover:bg-[#0300a9] group-hover:text-white"
                         )}>
                            {lesson.status === "Active" ? <Zap size={28} /> : <Clock size={28} />}
                         </div>
                         <div>
                            <h4 className="serif text-2xl font-bold text-[#303030] group-hover:text-[#0300a9] transition-colors">{lesson.title}</h4>
                            <div className="flex items-center gap-3 mt-3">
                               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#454557]/40">{lesson.class}</span>
                               <span className="w-1 h-1 rounded-full bg-[#303030]/10" />
                               <span className="text-[10px] font-bold text-[#454557]/60 tracking-wider">Starting {lesson.time}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-10">
                         <div className="hidden xl:flex flex-col items-end">
                            <p className="text-xl font-bold text-[#303030]">{lesson.students}</p>
                            <p className="text-[9px] uppercase font-black tracking-[0.2em] text-[#454557]/30">Students</p>
                         </div>
                         <Button variant="outline" size="sm" className="w-12 h-12 rounded-[16px] p-0 border-[#303030]/10 group-hover:border-[#0300a9]/20 group-hover:text-[#0300a9]">
                            <ArrowUpRight size={20} />
                         </Button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar: Institutional Insights */}
        <div className="lg:col-span-4 space-y-10">
           <div className="px-2 pb-2 border-b border-[#303030]/5">
              <h3 className="serif text-2xl font-bold text-[#303030]">Quick <span className="italic text-[#0300a9] font-normal">Insights</span></h3>
           </div>
           
           <div className="space-y-6">
              <div className="bg-[#0300a9] rounded-[44px] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-[50px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
                 <Star className="text-[#d8ef00] mb-8" size={32} />
                 <p className="serif text-2xl font-bold mb-4 leading-tight">Mastery Update</p>
                 <p className="text-[11px] text-white/50 leading-relaxed uppercase tracking-[0.15em] font-medium">
                    G1 Alpha has reached <span className="text-[#d8ef00] font-black">Level 5 Phonics</span> milestone 4 days early. Institutional excellence achieved.
                 </p>
              </div>

              <div className="bg-white rounded-[44px] p-10 border border-[#303030]/5 shadow-sm group hover:shadow-xl transition-all duration-500">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-[20px] bg-[#f5f3ef] flex items-center justify-center text-[#303030] group-hover:bg-[#d8ef00] transition-colors">
                       <TrendingUp size={24} />
                    </div>
                    <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                       <MoreVertical size={20} className="text-[#454557]/40" />
                    </Button>
                 </div>
                 <p className="serif text-xl font-bold text-[#303030] mb-2 leading-tight">New Enrollment</p>
                 <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#454557]/40">Talkin Academy Center · Pod 4</p>
                 <div className="mt-8 pt-8 border-t border-[#303030]/5 flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#0300a9]">€1,450</span>
                    <Badge className="bg-[#f5f3ef] text-[#454557] font-black tracking-widest text-[9px]">PENDING</Badge>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest", className)}>
    {children}
  </span>
);
