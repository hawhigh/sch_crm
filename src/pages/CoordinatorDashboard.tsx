import { 
  Loader2, 
  AlertCircle, 
  Users, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Clock,
  Layout,
  Radio,
  ArrowRight
} from 'lucide-react';
import { useCoordinatorDashboard } from '../lib/api';
import { cn } from '../lib/utils';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const LoadBar = ({ fillPct }: { fillPct: number }) => (
  <div className="flex gap-1.5 h-6">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className={cn(
          "w-4 rounded-none shadow-sm transition-all duration-700",
          i < Math.round(fillPct / 25) ? "bg-primary" : "bg-[#e4e2de]"
        )}
      />
    ))}
  </div>
);

export const CoordinatorDashboard = () => {
  const { data, isLoading, error } = useCoordinatorDashboard();

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (error) return (
    <div className="p-10 bg-surface-low text-primary rounded-none flex items-center gap-6 border border-primary/10">
      <div className="w-16 h-16 bg-white rounded-none shadow-sm flex items-center justify-center text-primary">
        <AlertCircle size={32} />
      </div>
      <div>
        <h3 className="serif text-2xl font-bold text-[#303030]">Operational Sync Failure</h3>
        <p className="text-sm text-[#454557]/80 font-medium">Unable to synchronize with the institutional coordinator node.</p>
        <Button variant="ghost" className="mt-4" onClick={() => window.location.reload()}>Retry Sync</Button>
      </div>
    </div>
  );

  const rooms = [
    { name: 'Studio A', cap: 4, type: 'Audio Lab', slots: [{ time: '09:00–11:00', label: 'IELTS Prep', variant: 'primary', sub: 'Lector: Sarah J.' }, { time: '11:00–13:00', label: 'Podcasting 101', variant: 'secondary', sub: 'Online: Remote' }] },
    { name: 'Lab 04', cap: 12, type: 'Workstations', slots: [{ time: '10:00–13:00', label: 'Group Workshop: Slavic Phonetics', variant: 'dark', sub: 'Coord: J. Kovac' }] },
    { name: 'Booth 01', cap: 1, type: 'Soundproof', slots: [{ time: '09:00–13:00', label: 'AVAILABLE BLOCK', variant: 'light', sub: '' }] },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
      
      {/* Editorial Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#454557]/10 pb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="primary" size="md">Coordinator Node</Badge>
            <span className="text-[10px] font-bold text-[#454557]/40 uppercase tracking-[0.2em]">Institutional Matrix</span>
          </div>
          <h1 className="display-lg text-[#303030]">
            Operational <span className="italic font-normal text-primary">Topology</span>
          </h1>
          <p className="text-[#454557] text-xl leading-relaxed font-medium mt-6">
            Establishing the temporal and spatial schemas for the <span className="text-[#303030] font-black">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span> cycle.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" icon={<Clock size={18} />}>Institutional Roster</Button>
          <Button variant="primary" icon={<Layout size={18} />}>Allocation View</Button>
        </div>
      </header>

      {/* Hero Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Active Slots" value={data.occupiedSlots} description="Total rooms currently allocated by system matches." icon={Clock} variant="light" />
        <StatCard label="Load Balance" value={`${Math.round((data.occupiedSlots / 24) * 100)}%`} description="System-wide institutional resource utilization." icon={Zap} variant="dark" />
        <StatCard label="Pending Nodes" value={data.pendingRequests.length} description="Unresolved lector-student topological matches." icon={Users} variant="secondary" />
        <StatCard label="Network Sync" value="99.9%" description="Unified ledger synchronization across all portals." icon={CheckCircle} variant="primary" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 pt-6">
        
        {/* Left Column: Requests & Staff (40%) */}
        <aside className="xl:col-span-4 space-y-12">
          
          <section className="bg-surface-low rounded-none p-10 border border-[#454557]/5 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="serif text-3xl font-bold text-[#303030] italic">Pending <span className="not-italic">Matches</span></h3>
              <Badge variant="primary">{data.pendingRequests.length}</Badge>
            </div>
            
            <div className="space-y-4">
              {data.pendingRequests.length > 0 ? data.pendingRequests.map((p: any) => (
                <div key={p.id} className="bg-white rounded-none p-8 border border-[#454557]/5 group hover:border-primary/10 hover:shadow-xl transition-all duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <Badge variant={p.urgency === 'URGENT' ? 'primary' : 'secondary'} size="sm">{p.urgency || 'STANDARD'}</Badge>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/30">Live Now</span>
                  </div>
                  <h4 className="font-bold text-2xl text-[#303030] tracking-tight mb-2">{p.subject}</h4>
                  <p className="text-sm font-bold text-[#454557]/60 uppercase tracking-widest mb-10">{p.studentName}</p>
                  <Button variant="primary" className="w-full h-14 rounded-none" icon={<ArrowRight size={18} />}>Initialize Match</Button>
                </div>
              )) : (
                <div className="p-20 text-center flex flex-col items-center border border-dashed border-[#454557]/20 rounded-none">
                  <CheckCircle size={40} className="text-[#5a6400]/20 mb-6" />
                  <p className="text-sm font-bold text-[#454557]/40 uppercase tracking-widest">Topology Balanced</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-[#303030] p-12 rounded-none text-white relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-none translate-x-1/3 -translate-y-1/3 group-hover:scale-150 transition-transform duration-1000" />
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--secondary)]/10 blur-[60px] rounded-none -translate-x-1/4 translate-y-1/4" />
             
             <div className="relative z-10 flex flex-col items-center text-center">
               <div className="w-16 h-16 rounded-none bg-white/10 flex items-center justify-center mb-8 border border-white/10 backdrop-blur-md">
                 <Radio size={32} className="text-[var(--secondary)]" />
               </div>
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--secondary)] mb-4">Institutional Stream</p>
               <h3 className="serif text-4xl font-bold mb-6 italic leading-tight">Network <br />Broadcast</h3>
               <p className="text-white/60 text-sm font-medium leading-relaxed mb-10">
                 Institutional locking set at <span className="text-white font-black">18:00 CET</span> across all sectors.
               </p>
               <Button variant="secondary" className="w-full h-16 rounded-none" icon={<ArrowRight size={18} />}>
                 Operational Directives
               </Button>
             </div>
          </section>
        </aside>

        {/* Center: Room Topology & Staff (80%) */}
        <section className="xl:col-span-8 space-y-12">
          
          <div className="bg-surface-low rounded-none p-10 border border-[#454557]/5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#454557]/10 pb-8 mb-10">
              <h3 className="serif text-3xl font-bold text-[#303030] italic">Room <span className="not-italic">Allocation Topology</span></h3>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-none" icon={<ChevronLeft size={20} />} />
                <Badge variant="dark" className="px-6 py-2">Operational Phase: Today</Badge>
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-none" icon={<ChevronRight size={20} />} />
              </div>
            </div>

            <div className="grid grid-cols-5 text-[10px] font-bold text-[#454557]/30 uppercase tracking-[0.2em] pl-32 pt-6 font-black">
              {['09:00', '10:00', '11:00', '12:00', '13:00'].map(t => <div key={t}>{t}</div>)}
            </div>

            <div className="space-y-6 mt-8">
              {rooms.map((room) => (
                <div key={room.name} className="flex items-center gap-8 group">
                  <div className="w-24 shrink-0 text-right">
                    <p className="font-bold text-xl text-[#303030] group-hover:text-primary transition-colors">{room.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/40">Cap: {room.cap}</p>
                  </div>
                  <div className="flex-1 bg-white/50 rounded-none overflow-hidden flex gap-3 p-3 shadow-inner border border-[#454557]/5 min-h-[96px]">
                    {room.slots.map((slot, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex-1 rounded-none p-5 flex flex-col justify-center transition-all duration-500 hover:scale-[0.98] cursor-pointer",
                          slot.variant === 'primary' ? "bg-primary text-white" : 
                          slot.variant === 'secondary' ? "bg-[var(--secondary)] text-[#303030]" : 
                          slot.variant === 'dark' ? "bg-[#303030] text-white" : "bg-white text-[#454557]/40"
                        )}
                      >
                        <p className="text-xs font-bold uppercase tracking-wider mb-1">{slot.label}</p>
                        {slot.sub && <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{slot.sub}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section>
            <div className="flex items-center justify-between border-b border-[#454557]/10 pb-8 mb-10">
              <h3 className="serif text-3xl font-bold text-[#303030] italic">Staff <span className="not-italic">Telemetry</span></h3>
              <Button variant="ghost" size="sm">Full Institutional Roster</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.staffAvailability.map((s: any) => (
                <div key={s.id} className="flex items-center gap-6 bg-surface-low p-6 rounded-none border border-transparent hover:border-[#454557]/5 hover:bg-white transition-all duration-500 shadow-sm group">
                  <div className="w-16 h-16 rounded-none bg-white flex items-center justify-center text-primary font-black overflow-hidden text-2xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300 grow-0 shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xl truncate text-[#303030] tracking-tight leading-none mb-2 group-hover:text-primary transition-colors">{s.name}</p>
                    <Badge variant="secondary" size="xs">{s.role}</Badge>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#454557]/30 mb-2 font-black">Load Index</p>
                    <LoadBar fillPct={s.loadPercent} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

      </div>
    </div>
  );
};
