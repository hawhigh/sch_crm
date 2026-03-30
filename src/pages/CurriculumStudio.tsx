import { useState } from 'react';
import { Search, Plus, Filter, FileText, PlayCircle, Headphones, UploadCloud, Share2, FileUp, Save, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

const curriculumSequence = [
  { id: '01', title: 'Lexical Warmup: News Jargon', description: 'Focus on headline puns and idioms.', type: 'LEAD' },
  { id: '02', title: 'Active Listening: Podcast Analysis', description: 'Case study: \'The Daily\' narrative arc.', tag: 'MULTIMEDIA', type: 'LISTEN' },
  { id: '03', title: 'Production: Editorial Pitching', description: 'Students craft a 150-word lead paragraph.', type: 'WRITE' },
];

import { useLibrary } from '../lib/api';

export const CurriculumStudio = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: libraryResources, isLoading } = useLibrary();

  const filteredResources = libraryResources?.filter((r: any) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || 
                       (activeTab === 'PDFs' && r.type === 'PDF') ||
                       (activeTab === 'Videos' && r.type === 'VIDEO') ||
                       (activeTab === 'Audio' && r.type === 'AUDIO');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden animate-in fade-in duration-700 bg-white">
      {/* Editorial Content Grid */}
      <div className="flex-1 flex overflow-hidden p-12 gap-12 h-full relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        
        {/* Left Column: Lesson Objectives & Structure (60%) */}
        <section className="flex-[3] flex flex-col gap-10 overflow-y-auto pr-6 scroll-smooth custom-scrollbar">
          <div className="flex items-end justify-between border-b border-[#454557]/10 pb-8">
            <div>
              <Badge variant="secondary" size="md" className="mb-4">Institutional Flow</Badge>
              <h2 className="display-lg text-[#303030] max-w-2xl leading-none">
                Curriculum <span className="italic font-normal text-primary">Flow</span>
              </h2>
              <p className="text-[10px] font-bold text-[#454557]/40 uppercase tracking-[0.3em] mt-4">B2 English: Editorial Narrative Techniques</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" icon={<Save size={18} />}>Save Draft</Button>
              <Button variant="primary" icon={<FileUp size={18} />}>Finalize Lesson</Button>
            </div>
          </div>

          <div className="bg-surface-low p-12 rounded-none flex flex-col gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[80px] rounded-none translate-x-1/2 -translate-y-1/3 pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60 mb-3">Target Proficiency</label>
                <p className="text-2xl font-bold text-[#303030] leading-none mb-2">Advanced B2</p>
                <p className="text-sm text-[#454557]/80 font-medium">(Upper Intermediate)</p>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60 mb-3">Duration</label>
                <p className="text-2xl font-bold text-[#303030] leading-none mb-2">90 Minutes</p>
                <p className="text-sm text-[#454557]/80 font-medium">2 Slots Allocated</p>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60 mb-3">Primary Objective</label>
                <p className="text-2xl font-bold text-primary leading-none mb-2">Syntax Analysis</p>
                <p className="text-sm text-[#454557]/80 font-medium">Applied Journalism Track</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60">Curriculum Sequence</label>
              
              <div className="space-y-4">
                {curriculumSequence.map((step) => (
                  <div 
                    key={step.id} 
                    className="bg-white p-6 rounded-none flex items-center gap-8 group hover:bg-[#303030] transition-colors cursor-pointer shadow-sm relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--secondary)]/10 blur-[20px] rounded-none translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <span className="text-5xl font-bold tracking-tighter text-[#e4e2de] group-hover:text-[var(--secondary)] transition-colors duration-500 relative z-10">
                      {step.id}
                    </span>
                    <div className="flex-1 relative z-10">
                      <h4 className="font-bold text-[#303030] text-xl group-hover:text-white transition-colors mb-1">{step.title}</h4>
                      <p className="text-sm text-[#454557]/80 font-medium group-hover:text-white/60 transition-colors">{step.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-6 relative z-10">
                      {step.tag && <Badge variant="secondary" size="md">{step.tag}</Badge>}
                      <GripVertical className="text-[#454557]/20 group-hover:text-white/40 transition-colors" size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60">Lecturer Delivery Notes</label>
            <div className="bg-[#303030] p-10 rounded-none italic text-white/90 leading-relaxed text-xl relative group overflow-hidden flex gap-6 items-start">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-none pointer-events-none" />
              <div className="w-1.5 h-16 bg-[var(--secondary)] rounded-none shrink-0 mt-1 shadow-[0_0_15px_rgba(216,239,0,0.5)]" />
              <p className="relative z-10 font-bold serif font-medium">
                "Ensure students focus on the emotional weight of adjectives rather than just literal meaning. Use the provided New York Times clipping as the primary reference point."
              </p>
            </div>
          </div>
        </section>

        {/* Right Column: Knowledge Library Resource Picker (40%) */}
        <aside className="flex-[2] bg-surface-low rounded-none p-10 flex flex-col gap-8 overflow-hidden relative">
          
          <div className="flex items-center justify-between border-b border-[#454557]/10 pb-6">
            <h3 className="serif text-3xl font-bold text-[#303030]">Knowledge <span className="italic font-normal">Library</span></h3>
            <button className="w-12 h-12 hover:bg-white rounded-none transition-all flex items-center justify-center text-[#303030] shadow-sm bg-white border border-[#454557]/5">
              <Filter size={20} />
            </button>
          </div>
          
          <Input 
            placeholder="Search institutional resources..." 
            icon={<Search className="text-[#454557]/40" size={20} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex gap-3 flex-wrap">
            {['All', 'PDFs', 'Videos', 'Audio'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-none transition-all",
                  activeTab === tab 
                    ? "bg-[#303030] text-white shadow-md" 
                    : "bg-white text-[#454557]/80 hover:bg-[#e4e2de] shadow-sm border border-[#454557]/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth custom-scrollbar mt-4">
            {isLoading ? (
              <div className="text-center py-12 text-[#454557]/60 font-bold uppercase tracking-widest text-[10px] animate-pulse">Loading Archive...</div>
            ) : filteredResources?.map((resource: any) => (
              <div 
                key={resource.id} 
                className="bg-white rounded-none p-6 flex flex-col gap-6 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-[#454557]/5"
              >
                <div className="flex items-start gap-5">
                  <div className={cn(
                    "w-14 h-16 flex items-center justify-center rounded-none shrink-0",
                    resource.type === 'PDF' ? "bg-primary text-white" : 
                    resource.type === 'VIDEO' ? "bg-[var(--secondary)] text-[#303030]" : "bg-[#303030] text-white"
                  )}>
                    {resource.type === 'PDF' ? <FileText size={28} /> : 
                     resource.type === 'VIDEO' ? <PlayCircle size={28} /> : <Headphones size={28} />}
                  </div>
                  <div className="flex-1 mt-1">
                    <h5 className="font-bold text-base text-[#303030] group-hover:text-primary transition-colors leading-tight mb-2">{resource.title}</h5>
                    <p className="text-[10px] text-[#454557]/50 uppercase font-bold tracking-[0.2em]">
                      {resource.url ? 'Available Content' : 'Pending Upload'}
                    </p>
                  </div>
                  <button className="w-10 h-10 bg-surface-low rounded-none flex items-center justify-center text-[#303030] hover:bg-primary hover:text-white transition-all hover:scale-[1.05]">
                    <Plus size={20} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between border-t border-[#454557]/5 pt-5">
                  <span className="text-[10px] font-bold text-[#454557]/60 flex items-center gap-2 uppercase tracking-[0.2em] group-hover:text-[#303030] transition-colors">
                    <Share2 size={14} />
                    Share with Parent
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={resource.type !== 'VIDEO'} />
                    <div className="w-12 h-6 bg-[#e4e2de] rounded-none peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:after:bg-[var(--secondary)] shadow-inner"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-[#303030] rounded-none p-10 text-center hover:-translate-y-2 transition-transform duration-500 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors pointer-events-none mix-blend-overlay" />
            <UploadCloud className="mx-auto text-[var(--secondary)] group-hover:scale-125 transition-transform duration-700 relative z-10 drop-shadow-lg" size={48} />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mt-6 relative z-10">Upload Custom Asset</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
