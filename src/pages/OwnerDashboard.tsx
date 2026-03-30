import { TrendingUp, Globe, ArrowRight, Workflow, Building, Download, ShieldCheck, Users, Plus } from 'lucide-react';
import { useOwnerMetrics } from '../lib/api';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useState } from 'react';
const BarChart = () => {
  const bars = [30, 45, 38, 55, 48, 62, 58, 75, 100];
  return (
    <div className="flex items-end gap-3 h-32 mt-12 w-full max-w-lg mb-4">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-none transition-all duration-700 hover:scale-105"
          style={{
            height: `${h}%`,
            background: i === bars.length - 1
              ? 'var(--primary)'
              : `rgba(3,0,169,${0.08 + i * 0.05})`,
          }}
        />
      ))}
    </div>
  );
};

export const OwnerDashboard = () => {
  const { data: metrics, isLoading, error } = useOwnerMetrics();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', owner: 'Viktor Novák' });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-none animate-spin" />
    </div>
  );

  if (error) return (
    <div className="p-8 bg-red-50 text-[var(--error)] rounded-none border border-red-100 flex items-center gap-4">
      <div className="w-10 h-10 rounded-none bg-[var(--error)]/10 flex items-center justify-center">
        <TrendingUp size={20} />
      </div>
      <div>
        <h3 className="font-bold text-lg mb-1">Telemetry Interrupted</h3>
        <p className="text-sm">Unable to sync financial metrics. Please ensure secure connection.</p>
      </div>
    </div>
  );

  const flow = [
    { icon: <Building size={20} />, title: 'New Corporate Contract Signed', sub: 'ESET Digital Hub • Annual Plan • €24,000', time: '2 HOURS AGO', highlight: true },
    { icon: <Workflow size={20} />, title: 'Senior Lector Onboarded', sub: 'Dr. Peter Kovac • Košice Branch • English Specialization', time: '5 HOURS AGO' },
    { icon: <Globe size={20} />, title: 'Branch Expansion Finalized', sub: 'Vienna Office Lease • Opening scheduled for Sep 12', time: 'YESTERDAY, 14:20' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
      {/* Editorial Header */}
      <div className="border-b border-[#454557]/10 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1.5 bg-[#454557]/5 text-[#454557] text-[10px] font-bold uppercase tracking-[0.2em] rounded-none">
              Encrypted Session
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/40">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="display-lg text-[#303030]">
            Owner <span className="italic font-normal text-primary">Command</span>
          </h1>
          <p className="text-[#454557] text-xl font-medium mt-6 leading-relaxed max-w-xl mix-blend-multiply">
            Platform-wide financial and operational intelligence synchronized across all {metrics.totalHubs} institutional branches.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={<Download size={18} />}>
            Export Ledger
          </Button>
          <Button variant="secondary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
            Add Institutional Node
          </Button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Institutional Node"
        footer={(
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Discard</Button>
            <Button variant="primary" onClick={() => {
              console.log("Saving Node:", formData);
              alert("Node Creation Protocol Initiated in Backend Sync (Mock)");
              setIsModalOpen(false);
            }}>Deploy Node</Button>
          </>
        )}
      >
        <div className="space-y-8">
          <div className="bg-surface-low p-8 rounded-none mb-4">
             <p className="text-sm font-medium text-[#454557] italic leading-relaxed">
               Deploying a new institutional node initiates a secure ledger entry for the academy and provisionings its database shard.
             </p>
          </div>
          <Input 
            label="Academy Name" 
            placeholder="e.g. Talkin Academy Vienna" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Geographic Location" 
            placeholder="e.g. Steinergasse 12, Wien, Austria" 
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
          <Input 
            label="Designated Platform Owner" 
            value={formData.owner}
            readOnly
          />
        </div>
      </Modal>

      {/* Primary Tonal Layers: The 60/40 Split Design */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Deep Tonal Section (60%) */}
        <div className="xl:col-span-8 bg-surface-low rounded-none p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[80px] rounded-none translate-x-1/3 -translate-y-1/3 transition-all duration-1000 group-hover:bg-primary/10" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-none bg-primary animate-pulse" />
                <Badge variant="primary" size="sm">Live Revenue Stream</Badge>
              </div>
              
              <div className="flex items-end gap-6 mb-4">
                <h2 className="text-7xl font-bold tracking-tighter text-[#303030] leading-none">{metrics.revenue}</h2>
                <Badge variant="secondary" size="md" className="mb-2">
                  <TrendingUp size={16} />
                  <span className="ml-2">{metrics.growth} Delta</span>
                </Badge>
              </div>
              <p className="text-[#454557] text-sm font-medium">Monthly Recurring Revenue (MRR) consolidated globally.</p>
            </div>
            
            <BarChart />
          </div>
        </div>

        {/* High-Contrast KPI Stack (40%) */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          <StatCard 
            label="Total Enrollment" 
            value={metrics?.students || '2.4k'} 
            trend="+12% VS LAST Q"
            description="Institutional growth across primary and secondary nodes."
            icon={Users} 
            variant="dark" 
          />
          <StatCard 
            label="Global Hubs" 
            value={metrics?.totalHubs || 0} 
            trend="STABLE PERFORMANCE"
            description="Secured and active territorial branches in the EU."
            icon={Globe} 
            variant="secondary" 
          />
        </div>

      </div>

      {/* Metrics Row - Using primitives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
            label="System Health" 
            value="99.9%" 
            trend="IDEAL STATE"
            description="Real-time latency and database response metrics."
            icon={ShieldCheck} 
            variant="light" 
          />
          <StatCard 
            label="LTV Index" 
            value={metrics?.ltv || '€4.2k'} 
            trend="+8.5% YoY"
            description="Average lifetime value per student enrollment."
            icon={TrendingUp} 
            variant="light" 
          />
          <StatCard 
            label="Active Lectors" 
            value="48" 
            trend="CAPACITY AT 84%"
            description="Human capital deployment across all hubs."
            icon={Workflow} 
            variant="light" 
          />
          <StatCard 
            label="Pending Invoices" 
            value="12" 
            trend="LOW RISK"
            description="Institutional billing cycles for corporate nodes."
            icon={Building} 
            variant="light" 
          />
      </div>

      {/* Global Hub Asymmetry */}
      <div className="pt-12">
        <div className="flex items-end justify-between mb-10 border-b border-[#454557]/10 pb-6">
          <h2 className="serif text-4xl font-bold text-[#303030] tracking-tight">Active <span className="italic font-normal text-primary">Branches</span></h2>
          <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-primary-container transition-colors items-center gap-2 hidden md:flex">
            Complete Ledger <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.hubs.map((hub: any, index: number) => (
            <div key={hub.id} className="group cursor-pointer">
              <div className="rounded-none bg-surface-low p-8 h-full transition-all duration-500 group-hover:bg-surface-high group-hover:shadow-[0_20px_40px_rgba(27,28,26,0.06)] flex flex-col">
                <div className="w-12 h-12 rounded-none bg-white flex items-center justify-center text-primary shadow-sm space-y-0 mb-8 border border-white/50">
                  <span className="font-serif italic text-xl">{index + 1}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-[#303030] mb-6">{hub.city}</h3>
                
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-baseline border-b border-[#454557]/5 pb-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#454557]/60">EBITDA Status</span>
                    <span className="text-primary font-bold text-lg">{hub.monthlyRev}</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-[#454557]/5 pb-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#454557]/60">Student Body</span>
                    <span className="text-[#303030] font-bold">{hub.students} Enrolled</span>
                  </div>
                  <div className="flex justify-between items-baseline pb-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#454557]/60">Lector Count</span>
                    <span className="text-[#303030] font-bold">{hub.lectors} Active</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory & Intelligence Stream (Glass / Solid Combos) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-12">
        <div className="xl:col-span-4 bg-primary rounded-none p-10 flex flex-col justify-between text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 blur-[60px] rounded-none translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <h3 className="font-serif text-3xl font-bold italic mb-6">Sys-Advisory</h3>
            <p className="text-white/80 text-lg leading-relaxed font-medium">
              Institutional momentum across the network of {metrics.totalHubs} locations is trending {metrics.growth} above baseline targets. 
            </p>
          </div>
          <button className="bg-white text-primary px-6 py-4 rounded-none text-xs font-bold uppercase tracking-[0.2em] mt-8 hover:bg-surface-low transition-colors w-max">
            Decide Action
          </button>
        </div>

        <div className="xl:col-span-8 bg-surface-low rounded-none p-10 border border-[#454557]/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-[#303030]">Operational Stream</h3>
            <div className="px-3 py-1 bg-white rounded-none text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm border border-[#454557]/5">Live</div>
          </div>
          <div className="space-y-2">
            {flow.map((item, idx) => (
              <div key={idx} className={`p-6 rounded-none flex items-start gap-6 transition-all duration-300 ${item.highlight ? 'bg-white shadow-[0_10px_30px_rgba(27,28,26,0.04)] ring-1 ring-[#454557]/5' : 'hover:bg-white/60'}`}>
                <div className={`w-12 h-12 rounded-none flex items-center justify-center shrink-0 ${item.highlight ? 'bg-primary/10 text-primary' : 'bg-[#e4e2de] text-[#454557]'}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#303030] text-[15px]">{item.title}</p>
                  <p className="text-[#454557] text-sm mt-1">{item.sub}</p>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#454557]/40 shrink-0 mt-1">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
