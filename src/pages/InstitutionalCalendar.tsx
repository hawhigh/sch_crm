/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  BookOpen,
  Sparkles,
  Filter,
  LayoutGrid,
  List,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useCalendar } from '../lib/api';
import { useModalStore } from '../hooks/useModal';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8:00 to 17:00

export const InstitutionalCalendar = () => {
  const { openModal } = useModalStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { data: calendarEvents = [], isLoading, error } = useCalendar();
  
  return (
    <div className="space-y-16 animate-fade-up max-w-[1500px] mx-auto p-12">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-[#454557]/5 pb-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-none bg-[#303030] flex items-center justify-center text-[var(--secondary)] shadow-2xl rotate-3">
              <CalendarIcon size={28} />
            </div>
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Temporal Orchestration</span>
          </div>
          <h1 className="display-lg text-[#303030] mb-8 leading-none">
            Institutional <span className="italic font-normal text-primary">Ledger</span>
          </h1>
          <p className="text-[#454557]/80 text-2xl font-medium leading-relaxed max-w-2xl mb-4 italic">
            Syncing educational cycles across <span className="text-[#303030] font-black not-italic border-b-2 border-primary/20">12 CLASSES</span> and <span className="text-[#303030] font-black not-italic border-b-2 border-[var(--secondary)]/20">8 CURATORS</span>. Unified view of lessons, tasks, and exhibitions.
          </p>
        </div>
        
        <div className="flex items-center gap-5 bg-white p-2.5 rounded-none shadow-2xl border border-white/40 backdrop-blur-md">
          <button 
            onClick={() => setView('grid')}
            className={cn("p-5 rounded-none transition-all", view === 'grid' ? "bg-[#303030] text-white shadow-2xl" : "text-[#454557]/30 hover:text-primary hover:bg-surface-low")}
          >
            <LayoutGrid size={28} />
          </button>
          <button 
            onClick={() => setView('list')}
            className={cn("p-5 rounded-none transition-all", view === 'list' ? "bg-[#303030] text-white shadow-2xl" : "text-[#454557]/30 hover:text-primary hover:bg-surface-low")}
          >
            <List size={28} />
          </button>
          <div className="w-px h-10 bg-[#303030]/5 mx-3" />
          <button 
            onClick={() => openModal('SCHEDULE_TASK')}
            className="px-10 py-5 bg-primary text-white rounded-none font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 hover:opacity-90 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
          >
            <Plus size={22} />
            <span>Schedule TASK</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Main Calendar Engine */}
        <div className="xl:col-span-9 space-y-8">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-8">
                 <h2 className="serif text-4xl font-bold text-[#303030]">October <span className="italic font-normal text-[var(--secondary)] text-[#5a6400]">2026</span></h2>
                 <div className="flex items-center gap-3">
                    <button className="w-12 h-12 flex items-center justify-center rounded-none bg-white hover:bg-primary hover:text-white transition-all shadow-sm text-[#303030]">
                       <ChevronLeft size={24} />
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-none bg-white hover:bg-primary hover:text-white transition-all shadow-sm text-[#303030]">
                       <ChevronRight size={24} />
                    </button>
                 </div>
              </div>
              
              <div className="flex gap-3 bg-white p-1.5 rounded-none shadow-sm">
                 {['Day', 'Week', 'Month'].map(t => (
                   <button key={t} className={cn(
                     "px-8 py-3 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] transition-all",
                     t === 'Week' ? "bg-primary text-white shadow-md" : "bg-transparent text-[#454557]/60 hover:text-[#303030] hover:bg-surface-low"
                   )}>
                     {t}
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-surface-low rounded-none p-12 relative overflow-hidden shadow-inner">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[80px] rounded-none translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              
              <div className="relative z-10">
                 {/* Week Headers */}
                 <div className="grid grid-cols-8 gap-6 mb-10">
                    <div className="border-b border-[#454557]/5" /> {/* Time column padding */}
                    {days.map(day => (
                      <div key={day} className="text-center pb-4 border-b border-[#454557]/10">
                         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60 mb-2">{day}</p>
                         <p className="serif text-2xl font-bold text-[#303030]">12</p>
                      </div>
                    ))}
                 </div>

                 {/* Calendar Grid */}
                 <div className="space-y-6">
                    {hours.map(hour => (
                      <div key={hour} className="grid grid-cols-8 gap-6 min-h-[120px] border-b border-[#454557]/5 pb-6 group">
                         <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/40 pt-2 group-hover:text-primary transition-colors">
                            {hour}:00
                         </div>
                         
                         {/* Realistic Event Placement (Simulated) */}
                         {[1, 2, 3, 4, 5, 6, 7].map(d => (
                             <div key={d} className="relative group/cell">
                                {calendarEvents
                                  .filter((e: any) => e.hour === hour && (e.day === d || (e.day === 0 && d === 7)))
                                  .map((event: any) => (
                                    <div key={event.id} className={cn(
                                       "absolute inset-0 z-20 p-4 rounded-none text-white shadow-lg hover:scale-105 transition-all cursor-pointer group-hover/cell:z-30 flex flex-col justify-between border border-[#454557]/20",
                                       event.color === 'primary' ? "bg-[#303030]" : "bg-primary"
                                    )}>
                                       <div>
                                         <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em] mb-2", event.color === 'primary' ? "text-[var(--secondary)]" : "text-[var(--secondary)]")}>{event.type}</p>
                                         <p className="text-sm font-bold leading-tight">{event.title}</p>
                                       </div>
                                       <div className="space-y-1.5 mt-4 text-[#e4e2de]">
                                         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em]">
                                            <Clock size={12} className="text-[#454557]" />
                                            <span>{event.time.split(' - ')[0]} Start</span>
                                         </div>
                                         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em]">
                                            <MapPin size={12} className="text-[#454557]" />
                                            <span className="truncate">{event.location || 'Talkin Hub'}</span>
                                         </div>
                                       </div>
                                    </div>
                                  ))}
                                {/* Empty Slot Hover State */}
                                <div className="absolute inset-0 m-1 rounded-none border-2 border-dashed border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100 cursor-pointer pointer-events-none group-hover/cell:pointer-events-auto" />
                             </div>
                         ))}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Temporal Sidebar (Agenda & Analytics) */}
        <div className="xl:col-span-3 space-y-12">
           <div className="space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60 border-b border-[#454557]/5 pb-4">Upcoming Events</h3>
            <div className="space-y-6">
               {isLoading && (
                 <div className="flex items-center justify-center py-16">
                   <Loader2 className="animate-spin text-primary" size={40} />
                 </div>
               )}
               {error && (
                 <div className="flex items-center gap-4 p-6 bg-error-container/20 text-error rounded-none">
                   <AlertCircle size={24} />
                   <p className="text-sm font-bold">Failed to sync institutional schedule.</p>
                 </div>
               )}
               {!isLoading && calendarEvents.map((event: any) => (
                 <div key={event.id} className="bg-white p-8 rounded-none shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-[#454557]/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[20px] rounded-none translate-x-1/2 -translate-y-1/2" />
                      
                      <div className="flex items-start justify-between mb-6 relative z-10">
                         <div className={cn(
                           "px-4 py-2 rounded-none text-[10px] font-bold uppercase tracking-[0.2em]",
                           event.color === 'primary' ? "bg-primary text-white" : "bg-[var(--secondary)]/20 text-[#5a6400]"
                         )}>
                            {event.type}
                         </div>
                         <div className="w-10 h-10 rounded-none bg-surface-low flex items-center justify-center text-[#454557]/40 group-hover:bg-primary group-hover:text-white transition-colors">
                           <Sparkles size={16} />
                         </div>
                      </div>
                      <h4 className="font-bold text-xl text-[#303030] mb-6 leading-tight relative z-10">{event.title}</h4>
                      <div className="space-y-3 relative z-10">
                         <div className="flex items-center gap-4 text-[10px] text-[#454557]/80 font-bold uppercase tracking-[0.2em]">
                            <Clock size={14} className="text-primary" />
                            <span>{event.time}</span>
                         </div>
                         <div className="flex items-center gap-4 text-[10px] text-[#454557]/80 font-bold uppercase tracking-[0.2em]">
                            <User size={14} className="text-primary" />
                            <span>{event.lector}</span>
                         </div>
                      </div>
                   </div>
                 ))}
                 
                 {!isLoading && calendarEvents.length === 0 && (
                   <div className="bg-white p-10 rounded-none text-center shadow-sm">
                     <div className="w-16 h-16 bg-surface-low rounded-none mx-auto flex items-center justify-center mb-4 text-[#454557]/30">
                       <CalendarIcon size={24} />
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60">Schedule Clear</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-[#0300a9] text-white rounded-none p-10 space-y-8 relative overflow-hidden group hover:shadow-2xl transition-shadow">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[60px] rounded-none translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              
              <div className="flex items-center gap-6 relative z-10">
                 <div className="w-16 h-16 rounded-none bg-white flex items-center justify-center text-[#0300a9] shadow-lg">
                    <Filter size={28} />
                 </div>
                 <div>
                    <h4 className="serif text-2xl font-bold">Global Filter</h4>
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-[0.2em] mt-2">Focus Curation</p>
                 </div>
              </div>

              <div className="space-y-4 relative z-10">
                 <button className="flex items-center justify-between w-full px-6 py-5 rounded-none bg-white/10 hover:bg-white/20 transition-all text-[#e4e2de] text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                    <span>Target Schools</span>
                    <ChevronRight size={16} />
                 </button>
                 <button className="flex items-center justify-between w-full px-6 py-5 rounded-none bg-white/10 hover:bg-white/20 transition-all text-[#e4e2de] text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                    <span>Lector Groups</span>
                    <ChevronRight size={16} />
                 </button>
              </div>
              
              <div className="pt-8 border-t border-white/10 relative z-10 mt-8">
                 <div className="flex items-center gap-4 mb-4">
                    <BookOpen size={20} className="text-[var(--secondary)]" />
                    <p className="text-sm font-bold uppercase tracking-[0.1em]">Institutional Pulse</p>
                 </div>
                 <p className="text-[11px] text-white/80 leading-relaxed uppercase tracking-[0.15em] font-medium">
                    Schedule density is at <span className="text-[var(--secondary)] font-bold">88% Capacity</span> for October. Recommend staging Grade 9 exams after the 15th.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
