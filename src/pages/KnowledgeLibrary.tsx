/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { 
  Library, 
  Search, 
  Filter, 
  BookOpen, 
  GraduationCap, 
  ArrowUpRight, 
  Bookmark,
  Sparkles,
  Download,
  Share2,
  Lock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLibrary } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const grades = Array.from({ length: 9 }, (_, i) => i + 1);
const subjects = ['English', 'Grammar', 'Conversation', 'Business', 'Phonics', 'Ethics'];

export const KnowledgeLibrary = () => {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: libraryItems = [], isLoading, error } = useLibrary();

  const filteredItems = libraryItems.filter((item: any) => {
    if (selectedGrade && item.grade !== selectedGrade) return false;
    if (selectedSubject && item.subject.toLowerCase() !== selectedSubject.toLowerCase()) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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
        <h3 className="serif text-3xl font-bold text-[#303030] mb-3">Library Error</h3>
        <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#454557]/60 leading-relaxed">Failed to establish a secure link to the institutional archive.</p>
      </div>
      <Button variant="outline" onClick={() => window.location.reload()}>Retry Archive</Button>
    </div>
  );

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-[1400px] mx-auto p-8">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-primary/10 pb-12 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="max-w-2xl">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 rounded-none bg-[#303030] flex items-center justify-center text-[var(--secondary)] shadow-2xl border border-white/10">
              <Library size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.4em] mb-1">Global Curation</span>
              <span className="text-[#454557]/40 text-[9px] font-bold uppercase tracking-[0.2em]">Institutional Archive v2.4</span>
            </div>
          </div>
          <h1 className="display-lg text-[#303030] mb-8 tracking-tight leading-[0.9]">
            Knowledge <span className="italic font-normal text-primary">Exhibitions</span>
          </h1>
          <p className="text-[#454557] text-xl font-medium leading-relaxed max-w-xl">
            Access the institutional archive from grades <span className="text-primary font-bold">1 to 9</span>. Curated for linguistic excellence and pedagogical growth.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/60 backdrop-blur-xl p-3 rounded-none shadow-2xl border border-white/40 transition-all focus-within:bg-white focus-within:shadow-primary/10">
          <div className="relative group flex-1 min-w-[320px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#454557]/30 group-focus-within:text-primary transition-all" size={20} />
            <input 
              type="text" 
              placeholder="Search concepts, grades, or types..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none rounded-none py-5 pl-16 pr-8 text-sm font-bold text-[#303030] placeholder:text-[#454557]/30 placeholder:uppercase placeholder:tracking-[0.2em] focus:outline-none transition-all"
            />
          </div>
          <Button className="px-10 py-8 bg-[#303030] text-white rounded-none text-[10px] font-bold uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:bg-primary transition-all flex gap-3">
            <Filter size={18} />
            REFINE ARCHIVE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60 border-b border-[#454557]/5 pb-6 flex items-center gap-3">
              <GraduationCap size={16} className="text-primary opacity-40" />
              Educational Grade
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {grades.map(grade => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(selectedGrade === grade ? null : grade)}
                  className={cn(
                    "py-5 rounded-none text-xs font-bold transition-all duration-300 border",
                    selectedGrade === grade 
                      ? "bg-primary text-white border-primary shadow-xl scale-[1.05]" 
                      : "bg-surface-low border-transparent hover:border-[#454557]/15 text-[#454557]/80 hover:bg-white"
                  )}
                >
                  G{grade}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60 border-b border-[#454557]/5 pb-6 flex items-center gap-3">
              <BookOpen size={16} className="text-primary opacity-40" />
              Core Subjects
            </h3>
            <div className="flex flex-wrap gap-3">
              {subjects.map(subject => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
                  className={cn(
                    "px-7 py-4 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border",
                    selectedSubject === subject 
                      ? "bg-[#303030] text-white border-[#303030] shadow-xl" 
                      : "bg-surface-low border-transparent hover:border-[#454557]/15 text-[#454557]/80 hover:bg-white"
                  )}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#303030] rounded-none p-10 space-y-8 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--secondary)]/10 blur-[50px] rounded-none pointer-events-none" />
             <div className="w-16 h-16 rounded-none bg-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg relative z-10">
                <Sparkles className="text-[var(--secondary)]" size={28} />
             </div>
             <div className="relative z-10">
               <p className="serif text-2xl font-bold text-white mb-3">Curator Insights</p>
               <p className="text-[11px] text-white/50 leading-relaxed uppercase tracking-[0.15em] font-medium">
                  Institutional owners recommend aligning G4 English with <span className="text-[var(--secondary)]">'The Grammar Matrix'</span> framework this semester.
               </p>
             </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="lg:col-span-3 space-y-10">
           <div className="flex items-end justify-between border-b border-[#454557]/5 pb-8">
              <h2 className="serif text-4xl font-bold text-[#303030]">Curated <span className="italic font-normal text-primary">Exhibitions</span></h2>
              <Badge variant="outline" className="text-[10px] tracking-[0.2em] px-5 py-2.5">{filteredItems.length} Resources Available</Badge>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredItems.map((item: any) => (
                <div key={item.id} className="bg-white group hover:-translate-y-2 transition-all duration-500 border border-[#454557]/10 hover:border-[#454557]/20 shadow-sm hover:shadow-2xl p-10 rounded-none flex flex-col justify-between min-h-[320px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[30px] rounded-none translate-x-1/2 -translate-y-1/2 transition-all group-hover:bg-primary/10" />
                  
                  <div className="flex items-start justify-between mb-10 relative z-10">
                    <div className={cn(
                      "w-16 h-16 rounded-none flex items-center justify-center transition-all duration-500 shadow-sm",
                      item.premium ? "bg-[var(--secondary)] text-[#303030] rotate-6" : "bg-surface-low text-[#303030] group-hover:bg-primary group-hover:text-white group-hover:rotate-6"
                    )}>
                      {item.premium ? <Lock size={28} /> : <BookOpen size={28} />}
                    </div>
                    <button className="text-[#454557]/20 hover:text-primary transition-all p-2 rounded-none hover:bg-surface-low">
                      <Bookmark size={26} fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100" />
                    </button>
                  </div>
                  
                  <div className="space-y-8 relative z-10">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <Badge variant="outline" className="text-[9px] font-bold tracking-[0.2em] border-[#454557]/10">Grade {item.grade}</Badge>
                        <Badge className="bg-[var(--secondary)]/20 text-[#5a6400] text-[9px] font-bold tracking-[0.2em]">{item.subject}</Badge>
                      </div>
                      <h4 className="serif text-2xl font-bold group-hover:text-primary transition-colors leading-tight text-[#303030]">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-[#454557]/10 group-hover:border-[#454557]/20 transition-colors">
                      <div className="flex gap-3">
                        <button className="w-11 h-11 rounded-none bg-surface-low flex items-center justify-center text-[#454557]/60 hover:bg-primary hover:text-white transition-all shadow-sm">
                          <Download size={18} />
                        </button>
                        <button className="w-11 h-11 rounded-none bg-surface-low flex items-center justify-center text-[#454557]/60 hover:bg-[var(--secondary)] hover:text-[#303030] transition-all shadow-sm">
                          <Share2 size={18} />
                        </button>
                      </div>
                      <Button variant="outline" size="sm" className="w-11 h-11 rounded-none p-0 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                         <ArrowUpRight size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
           </div>

           {filteredItems.length === 0 && (
             <div className="min-h-[450px] flex flex-col items-center justify-center text-center space-y-8 bg-surface-low rounded-none shadow-inner p-16 border border-white">
                <div className="w-28 h-28 rounded-none bg-white flex items-center justify-center mb-4 shadow-xl border border-[#454557]/5 rotate-3">
                  <Library className="text-[#454557]/10" size={56} />
                </div>
                <div>
                   <h3 className="serif text-4xl font-bold text-[#303030] mb-4">No exhibitions found</h3>
                   <p className="text-sm text-[#454557]/50 max-w-sm uppercase tracking-[0.15em] font-bold leading-loose">Adjust your curated metrics to find institutional knowledge resources stored in the archive.</p>
                </div>
                <Button 
                   onClick={() => { setSelectedGrade(null); setSelectedSubject(null); }}
                   className="px-10 py-7 text-[10px] tracking-[0.3em] mt-6"
                >
                  RESET CURATION
                </Button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
