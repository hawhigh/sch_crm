import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, BookOpen, Sparkles } from 'lucide-react';
import { useModalStore } from '../../hooks/useModal';
import { useAuth } from '../../hooks/useAuth';

export const GlobalModal = () => {
  const { isOpen, type, closeModal, data } = useModalStore();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-[#303030]/80 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-2xl bg-white rounded-[56px] shadow-2xl overflow-hidden border border-[#454557]/10"
        >
           {/* Background Glow */}
           <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
           
           {/* Header */}
           <header className="px-12 py-10 border-b border-[#454557]/5 flex justify-between items-center bg-surface-low/30 relative z-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[24px] bg-[#303030] flex items-center justify-center text-[var(--secondary)] shadow-xl rotate-3">
                    {type === 'SCHEDULE_TASK' && <Calendar size={32} />}
                    {type === 'CREATE_CURRICULUM' && <BookOpen size={32} />}
                    {type === 'VIEW_INSIGHT' && <Sparkles size={32} />}
                 </div>
                 <div>
                    <h3 className="serif text-3xl font-bold text-[#303030] italic">
                       {type === 'SCHEDULE_TASK' ? 'New Temporal Task' : 
                        type === 'CREATE_CURRICULUM' ? 'Archive Curriculum' : 
                        'Curated Insight'}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">Institutional Protocol Activated</p>
                 </div>
              </div>
              <button 
                onClick={closeModal}
                className="w-12 h-12 rounded-full hover:bg-[#303030] hover:text-white transition-all text-[#454557]/40 flex items-center justify-center shadow-sm"
              >
                 <X size={24} />
              </button>
           </header>

           {/* Dynamic Content */}
           <main className="p-12 space-y-10 relative z-10">
              {type === 'SCHEDULE_TASK' && (
                <div className="space-y-8 animate-fade-up">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#454557]/60 ml-4">Task Objective</label>
                      <input type="text" placeholder="e.g. Oral Mastery Workshop Grade 9..." className="w-full bg-surface-low border-none rounded-[28px] py-6 px-10 text-lg font-bold shadow-inner placeholder:text-[#454557]/20 focus:ring-4 focus:ring-primary/5 transition-all text-[#303030]" />
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#454557]/60 ml-4">Date Hub</label>
                          <input type="date" className="w-full bg-surface-low border-none rounded-[24px] py-5 px-8 font-bold text-[#303030] shadow-sm" />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#454557]/60 ml-4">Temporal Node (Time)</label>
                          <input type="time" className="w-full bg-surface-low border-none rounded-[24px] py-5 px-8 font-bold text-[#303030] shadow-sm" />
                       </div>
                   </div>
                   <div className="pt-8 border-t border-[#454557]/5">
                      <button className="w-full py-6 bg-[#303030] text-[var(--secondary)] rounded-[28px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 group">
                        Confirm Institutional Schedule
                      </button>
                   </div>
                </div>
              )}

              {type === 'CREATE_CURRICULUM' && (
                <div className="space-y-8 animate-fade-up">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#454557]/60 ml-4">Lesson Context</label>
                      <p className="text-xl font-bold text-primary pl-4">{data?.title || 'General Curriculum Archiving'}</p>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#454557]/60 ml-4">The core Document (Markdown)</label>
                      <textarea rows={6} placeholder="Curate the grammar matrix, phonics targets, and oral flow..." className="w-full bg-surface-low border-none rounded-[36px] p-10 text-lg font-medium shadow-inner placeholder:text-[#454557]/20 focus:ring-4 focus:ring-primary/5 transition-all text-[#303030]" />
                   </div>
                   <div className="pt-8 border-t border-[#454557]/5">
                      <button className="w-full py-6 bg-primary text-white rounded-[28px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:opacity-90 transition-all active:scale-95">
                         Archive & Publish for Parents
                      </button>
                   </div>
                </div>
              )}

              {type === 'VIEW_INSIGHT' && (
                <div className="space-y-8 animate-fade-up text-center">
                   <div className="w-24 h-24 rounded-full bg-[var(--secondary)]/20 mx-auto flex items-center justify-center text-[#5a6400] mb-8 animate-pulse text-4xl font-bold">88%</div>
                   <h4 className="text-2xl font-bold text-[#303030] leading-tight">Class Completion Mastery</h4>
                   <p className="text-[#454557]/60 leading-relaxed max-w-sm mx-auto font-medium">This class is performing high above the institutional average for Grade 4 Grammar Mastery.</p>
                   <div className="pt-10 border-t border-[#454557]/5">
                      <button onClick={closeModal} className="w-full py-6 bg-surface-low text-[#303030] rounded-[28px] font-black text-xs uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all shadow-sm">
                         Archive Pulses
                      </button>
                   </div>
                </div>
              )}
           </main>
           
           {/* Modal Footer */}
           <footer className="px-12 py-8 bg-surface-low/10 border-t border-[#454557]/5 flex justify-center relative z-10">
              <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[#454557]/20">Talkin.sk Institutional OS v2.4 • Secure Session: {user?.role}</p>
           </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Reusable Modal component for inline usage (e.g. OwnerDashboard)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, footer, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#303030]/80 backdrop-blur-xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-2xl bg-white rounded-[56px] shadow-2xl overflow-hidden border border-[#454557]/10"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <header className="px-12 py-10 border-b border-[#454557]/5 flex justify-between items-center bg-surface-low/30 relative z-10">
            <h3 className="serif text-3xl font-bold text-[#303030] italic">{title}</h3>
            <button onClick={onClose} className="w-12 h-12 rounded-full hover:bg-[#303030] hover:text-white transition-all text-[#454557]/40 flex items-center justify-center">
              <X size={24} />
            </button>
          </header>
          <main className="p-12 relative z-10">{children}</main>
          {footer && (
            <footer className="px-12 py-8 border-t border-[#454557]/5 flex justify-end gap-4 relative z-10">
              {footer}
            </footer>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
