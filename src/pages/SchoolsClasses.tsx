/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  School, 
  Users, 
  ChevronRight, 
  MapPin, 
  MoreVertical,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Layout,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useSchools } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/dashboard/StatCard';

export const SchoolsClasses = () => {
  const { data: schoolsData = [], isLoading, error } = useSchools();
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  useEffect(() => {
    if (schoolsData.length > 0 && !selectedSchool) {
      setSelectedSchool(schoolsData[0]);
    }
  }, [schoolsData, selectedSchool]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (error) return (
    <div className="p-12 bg-white rounded-none shadow-sm border border-[#454557]/5 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-20 space-y-6">
      <div className="w-20 h-20 rounded-none bg-red-50 flex items-center justify-center text-[var(--error)] shadow-sm">
        <AlertCircle size={40} />
      </div>
      <div>
        <h3 className="serif text-3xl font-bold text-[#303030] mb-3">Sync Error</h3>
        <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#454557]/60 leading-relaxed">Failed to establish a secure link to the institutional school registry.</p>
      </div>
      <Button variant="outline" onClick={() => window.location.reload()}>Retry Link</Button>
    </div>
  );

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1400px] mx-auto p-8">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#454557]/5 pb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-none bg-[#303030] flex items-center justify-center text-[var(--secondary)] shadow-lg shadow-[#303030]/10">
              <GraduationCap size={24} />
            </div>
            <span className="text-[#454557]/60 text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Management Matrix</span>
          </div>
          <h1 className="display-lg text-[#303030] mb-6 tracking-tight">
            Hub <span className="italic font-normal text-primary">Architecture</span>
          </h1>
          <p className="text-[#454557] text-xl font-medium leading-relaxed max-w-xl mb-4">
            Managing the educational footprint. Overseeing <span className="text-primary font-bold uppercase tracking-widest text-sm">{schoolsData.length} active nodes</span> and their respective student circles and class clusters.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2.5 rounded-none shadow-sm border border-[#454557]/10 backdrop-blur-sm">
          <Button variant="outline" size="sm" className="w-14 h-14 rounded-none p-0">
            <Filter size={20} />
          </Button>
          <div className="w-px h-8 bg-[#454557]/10 mx-1" />
          <Button className="px-8 py-7 rounded-none text-[10px] tracking-[0.2em]">
            <Plus size={18} className="mr-2" />
            ENROLL NEW SCHOOL
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Col: School List */}
        <div className="lg:col-span-4 space-y-10 overflow-y-auto max-h-[calc(100vh-280px)] pr-4 custom-scrollbar">
           <div className="flex items-center justify-between px-2 border-b border-[#454557]/5 pb-6 sticky top-0 bg-surface-base z-20">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60">Active Institutional Hubs</h3>
              <ArrowUpRight size={16} className="text-primary opacity-40" />
           </div>

           <div className="space-y-6">
              {schoolsData.map((school: any) => (
                <button
                  key={school.id}
                  onClick={() => setSelectedSchool(school)}
                  className={cn(
                    "w-full text-left p-10 rounded-none transition-all duration-500 relative overflow-hidden group border",
                    selectedSchool?.id === school.id 
                      ? "bg-[#303030] border-[#303030] shadow-2xl text-white transform -translate-y-2 outline-none scale-[1.02]" 
                      : "bg-surface-low border-transparent hover:bg-white hover:border-[#454557]/15 text-[#303030]"
                  )}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-8">
                       <div className={cn(
                         "w-16 h-16 rounded-none flex items-center justify-center transition-all duration-500 shadow-sm",
                         selectedSchool?.id === school.id ? "bg-white text-[#303030] rotate-6" : "bg-white text-[#454557]/40 group-hover:text-primary group-hover:rotate-6"
                       )}>
                          <School size={28} />
                       </div>
                       <div>
                          <h4 className={cn("serif text-2xl font-bold mb-2", selectedSchool?.id === school.id ? "" : "group-hover:text-primary transition-colors")}>{school.name}</h4>
                          <div className="flex items-center gap-3">
                             <MapPin size={14} className={cn(selectedSchool?.id === school.id ? "text-[var(--secondary)]" : "text-[#454557]/40")} />
                             <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", selectedSchool?.id === school.id ? "text-white/60" : "text-[#454557]/60")}>{school.address}</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className={cn(
                    "grid grid-cols-3 gap-6 mt-10 pt-8 border-t relative z-10 transition-colors duration-500",
                    selectedSchool?.id === school.id ? "border-white/10" : "border-[#454557]/10"
                  )}>
                    <div>
                       <p className={cn("text-[9px] font-bold uppercase tracking-[0.2em] mb-2 opacity-60", selectedSchool?.id === school.id ? "text-white" : "text-[#303030]")}>Classes</p>
                       <p className="text-2xl font-bold tracking-tight">{school.classesCount}</p>
                    </div>
                    <div>
                       <p className={cn("text-[9px] font-bold uppercase tracking-[0.2em] mb-2 opacity-60", selectedSchool?.id === school.id ? "text-white" : "text-[#303030]")}>Students</p>
                       <p className="text-2xl font-bold tracking-tight">{school.studentsCount}</p>
                    </div>
                    <div>
                       <p className={cn("text-[9px] font-bold uppercase tracking-[0.2em] mb-2 opacity-60", selectedSchool?.id === school.id ? "text-white" : "text-[#303030]")}>Mastery</p>
                       <p className={cn("text-2xl font-bold tracking-tight", selectedSchool?.id === school.id ? "text-[var(--secondary)]" : "text-primary")}>{school.performance}%</p>
                    </div>
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Right Col: Class & Student Explorer */}
        <div className="lg:col-span-8 space-y-12">
           {selectedSchool && (
             <div className="bg-surface-low rounded-none p-20 relative overflow-hidden shadow-inner border border-white">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-none translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                
                <div className="relative z-10 space-y-16">
                  <div className="flex items-center justify-between border-b border-[#454557]/10 pb-12">
                     <div className="flex items-start gap-10">
                        <div className="w-20 h-20 rounded-none bg-white flex items-center justify-center shadow-xl group-hover:bg-primary transition-all rotate-3 border border-[#454557]/5">
                           <Layout className="text-primary" size={32} />
                        </div>
                        <div>
                           <h2 className="serif text-5xl font-bold text-[#303030] tracking-tight">{selectedSchool.name} <br /><span className="italic font-normal text-primary text-4xl">Architecture</span></h2>
                           <div className="flex items-center gap-3 mt-6">
                              <Badge variant="outline" className="text-[9px] font-bold tracking-[0.2em]">Institutional Hub</Badge>
                              <Badge className="bg-[var(--secondary)] text-[#303030] text-[9px] font-bold tracking-[0.2em]">Active Hub</Badge>
                           </div>
                        </div>
                     </div>
                     <Button variant="ghost" size="sm" className="w-14 h-14 rounded-none bg-white shadow-sm p-0">
                        <MoreVertical size={24} className="text-[#303030]" />
                     </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <StatCard 
                       label="Academic Density" 
                       value={selectedSchool.classesCount.toString()} 
                       trend="+2 core pods" 
                       description="Cluster volume"
                       icon={TrendingUp}
                       className="border-none shadow-sm hover:translate-y-0"
                     />
                     <StatCard 
                       label="Institutional Reach" 
                       value={selectedSchool.studentsCount.toString()} 
                       trend="+14% YoY" 
                       description="Growth metrics"
                       icon={Users}
                       className="border-none shadow-xl hover:translate-y-0"
                     />
                  </div>

                  <div className="space-y-10">
                     <div className="flex items-center justify-between px-2">
                        <h3 className="serif text-3xl font-bold text-[#303030]">Curated <span className="italic text-primary font-normal">Class Structures</span></h3>
                        <Button className="px-6 py-4 text-[9px] tracking-[0.3em]">
                           <Plus size={16} className="mr-3" />
                           CREATE CLASS
                        </Button>
                     </div>
                     
                     <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {selectedSchool.classes.map((cls: any) => (
                          <div key={cls.id} className="flex flex-col p-10 rounded-none bg-white hover:bg-white/60 transition-all border border-[#454557]/10 group shadow-md hover:shadow-2xl cursor-pointer relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[30px] rounded-none translate-x-1/2 -translate-y-1/2" />
                             
                             <div className="flex items-center gap-6 mb-8 relative z-10">
                                <div className="w-16 h-16 rounded-none bg-surface-low flex items-center justify-center text-[#303030] group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                                   <Users size={28} />
                                </div>
                                <div>
                                   <p className="text-2xl font-bold text-[#303030] group-hover:text-primary transition-colors leading-tight">{cls.name}</p>
                                   <div className="flex items-center gap-2 mt-3">
                                      <div className="w-1.5 h-1.5 rounded-none bg-[var(--secondary)] animate-pulse" />
                                      <span className="text-[10px] text-[#454557]/60 font-bold uppercase tracking-[0.2em]">Curator: {cls.lector}</span>
                                   </div>
                                </div>
                             </div>

                             <div className="flex items-center justify-between pt-6 border-t border-[#454557]/10 relative z-10">
                                <div>
                                   <p className="text-3xl font-bold text-[#303030] group-hover:text-primary transition-colors tracking-tighter">{cls.students}</p>
                                   <p className="text-[9px] text-[#454557]/40 uppercase font-bold tracking-[0.2em] mt-1">Pupils Enrolled</p>
                                </div>
                                <Button variant="outline" size="sm" className="w-12 h-12 rounded-none p-0">
                                   <ChevronRight size={20} />
                                </Button>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
             </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 pb-20">
              <div className="bg-white rounded-none p-12 space-y-10 group cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all border border-[#454557]/10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--secondary)]/10 blur-[40px] rounded-none translate-x-1/2 -translate-y-1/2" />
                 <div className="w-20 h-20 rounded-none bg-[var(--secondary)] text-[#303030] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg relative z-10">
                    <Users size={32} />
                 </div>
                 <div className="relative z-10">
                    <h4 className="serif text-3xl font-bold text-[#303030] mb-4">Master Register</h4>
                    <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#454557]/60 leading-relaxed">System-wide access to student portfolios and <br /><span className="text-[#303030]">historical growth logs</span>.</p>
                 </div>
              </div>
              
              <div className="bg-[#303030] rounded-none p-12 space-y-10 group cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all border border-white/10 relative overflow-hidden text-white">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[40px] rounded-none translate-x-1/2 -translate-y-1/2" />
                 <div className="w-20 h-20 rounded-none bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg relative z-10">
                    <TrendingUp size={32} />
                 </div>
                 <div className="relative z-10">
                    <h4 className="serif text-3xl font-bold text-white mb-4">Structural Trends</h4>
                    <p className="text-sm font-bold uppercase tracking-[0.1em] text-white/50 leading-relaxed">Cross-hub performance benchmarks and <br /><span className="text-primary italic font-normal">analytical capacity</span>.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
