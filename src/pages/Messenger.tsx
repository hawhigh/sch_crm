import { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  User, 
  CheckCheck,
  Zap,
  Phone,
  Video,
  Info,
  Loader2
} from 'lucide-react';
import { useConversations, useMessages, useSendMessage } from '../lib/api';
import { cn } from '../lib/utils';
import { useSocket } from '../hooks/useSocket';
import { useModalStore } from '../hooks/useModal';
import { useAuth } from '../hooks/useAuth';

export const Messenger = () => {
  const { user } = useAuth();
  const { openModal } = useModalStore();
  const { data: contacts = [], isLoading: contactsLoading } = useConversations();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  
  // Activate institutional signal curation
  useSocket(selectedContact?.conversationId || null);

  const { data: messages = [], isLoading: messagesLoading } = useMessages(selectedContact?.id);
  const sendMessage = useSendMessage();
  const [newMessage, setNewMessage] = useState('');

  // Auto-select first contact when loaded
  if (!selectedContact && contacts.length > 0) {
    setSelectedContact(contacts[0]);
  }

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedContact) return;
    try {
      await sendMessage(selectedContact.id, newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message');
    }
  };

  if (contactsLoading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="h-[calc(100vh-180px)] overflow-hidden flex flex-col xl:flex-row gap-8 animate-fade-up">
      {/* Contact List Sidebar */}
      <div className="w-full xl:w-[480px] bg-white rounded-[48px] flex flex-col h-full shadow-2xl border border-[#454557]/5 relative overflow-hidden group/sidebar">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover/sidebar:bg-primary/10 transition-colors duration-1000" />
         
         <div className="p-12 pb-8 space-y-12 relative z-10">
            <header className="flex items-center justify-between border-b border-[#454557]/5 pb-8">
               <div>
                  <h3 className="serif text-3xl font-bold text-[#303030] italic">Curation Hub</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                     <button onClick={() => openModal('VIEW_INSIGHT')} className="text-[7px] font-black uppercase tracking-[0.2em] text-primary hover:text-[#303030] transition-colors bg-primary/5 px-2 py-1 rounded-full border border-primary/10">Institutional Insight</button>
                     <button onClick={() => openModal('CREATE_CURRICULUM', { title: selectedContact?.name })} className="text-[7px] font-black uppercase tracking-[0.2em] text-[#454557]/40 hover:text-primary transition-colors bg-[#454557]/5 px-2 py-1 rounded-full border border-[#454557]/10">Archive Curriculum</button>
                  </div>
               </div>
               <button className="w-14 h-14 rounded-[20px] bg-[#303030] flex items-center justify-center text-[var(--secondary)] hover:bg-primary transition-all shadow-xl group/zap">
                  <Zap size={28} className="group-hover/zap:scale-110 group-hover/zap:rotate-12 transition-transform" />
               </button>
            </header>
            <div className="relative group/search">
               <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#454557]/40 group-focus-within/search:text-primary transition-colors" size={24} />
               <input 
                  type="text" 
                  placeholder="Seach Institutional Ledger..." 
                  className="bg-surface-low border-none rounded-[28px] py-6 pl-18 pr-8 text-base font-bold text-[#303030] placeholder:text-[#454557]/40 placeholder:uppercase placeholder:tracking-[0.2em] w-full focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-3 custom-scrollbar relative z-10">
            {contacts.map((contact: any, i: number) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={cn(
                  "w-full flex items-center gap-6 p-8 rounded-[36px] transition-all duration-700 group relative border animate-fade-up",
                  selectedContact?.id === contact.id 
                    ? "bg-[#303030] border-transparent shadow-2xl text-white outline-none -translate-y-1" 
                    : "hover:bg-surface-low border-transparent text-[#303030] hover:border-primary/10 bg-transparent"
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative shrink-0">
                   <div className={cn(
                     "w-18 h-18 rounded-[22px] flex items-center justify-center overflow-hidden transition-all duration-700 shadow-sm",
                     selectedContact?.id === contact.id ? "bg-white/10 rotate-3" : "bg-white border border-[#454557]/5"
                   )}>
                      <User size={30} className={cn(selectedContact?.id === contact.id ? "text-white" : "text-[#454557]/20 group-hover:text-primary transition-colors")} />
                   </div>
                   {contact.status === 'Online' && (
                     <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--secondary)] border-[4px] border-white shadow-xl animate-pulse" />
                   )}
                </div>
                
                <div className="flex-1 text-left min-w-0">
                   <div className="flex items-center justify-between mb-2">
                      <h4 className={cn("text-lg font-bold truncate pr-3 leading-none", selectedContact?.id === contact.id ? "text-white" : "text-[#303030] group-hover:text-primary transition-colors")}>
                        {contact.name}
                      </h4>
                      <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] shrink-0", selectedContact?.id === contact.id ? "text-[var(--secondary)]" : "text-[#454557]/20")}>
                        {contact.time}
                      </span>
                   </div>
                   <p className={cn("text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70", selectedContact?.id === contact.id ? "text-[var(--secondary)]" : "text-primary")}>
                    {contact.role}
                   </p>
                   <p className={cn("text-sm line-clamp-1 font-medium italic opacity-60", selectedContact?.id === contact.id ? "text-white/80" : "text-[#454557]")}>
                    "{contact.lastMessage}"
                   </p>
                </div>

                {contact.unread > 0 && (
                  <div className="w-8 h-8 rounded-full bg-primary text-[10px] font-black text-white flex items-center justify-center shadow-xl animate-bounce shrink-0">
                     {contact.unread}
                  </div>
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Dynamic Chat Canvas */}
      <div className="flex-1 bg-surface-low rounded-[48px] relative flex flex-col h-full overflow-hidden shadow-2xl border border-[#454557]/5">
         {/* Background Glow */}
         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
         
         {/* Chat Header */}
         <header className="px-12 py-10 border-b border-[#454557]/5 flex justify-between items-center bg-white/40 backdrop-blur-3xl relative z-20 shadow-sm min-h-[140px]">
            {selectedContact ? (
              <>
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 rounded-[28px] bg-[#303030] flex items-center justify-center text-[var(--secondary)] shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-700">
                     <MessageSquare size={32} />
                   </div>
                   <div>
                      <h4 className="serif text-4xl font-bold text-[#303030] italic leading-none mb-4">{selectedContact.name}</h4>
                      <div className="flex items-center gap-4">
                         <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", selectedContact.status === 'Online' ? 'bg-[var(--secondary)] shadow-[0_0_12px_var(--secondary)]' : 'bg-[#e4e2de]')} />
                         <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em]">{selectedContact.status} CURATOR NODE</p>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-4 bg-white/80 p-2.5 rounded-[32px] shadow-2xl border border-white/20 backdrop-blur-md">
                   <button className="p-5 rounded-[22px] hover:bg-[#303030] transition-all text-[#454557]/40 hover:text-[var(--secondary)] shadow-sm hover:scale-110 active:scale-95">
                      <Phone size={24} />
                   </button>
                   <button className="p-5 rounded-[22px] hover:bg-[#303030] transition-all text-[#454557]/40 hover:text-[var(--secondary)] shadow-sm hover:scale-110 active:scale-95">
                      <Video size={24} />
                   </button>
                   <div className="w-px h-10 bg-[#303030]/5 mx-3" />
                   <button className="p-5 rounded-[22px] hover:bg-surface-low transition-all text-[#454557]/30 shadow-sm">
                      <MoreVertical size={24} />
                   </button>
                   <button className="p-5 rounded-[22px] hover:bg-surface-low transition-all text-[#454557]/30 shadow-sm">
                      <Info size={24} />
                   </button>
                </div>
              </>
            ) : (
              <div className="w-full flex items-center justify-center text-[#454557]/20 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Establishing Curation Link...</div>
            )}
         </header>

         {/* Messenger Content */}
         <div className="flex-1 overflow-y-auto p-12 space-y-12 relative z-10 custom-scrollbar scroll-smooth">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary/10" size={48} />
              </div>
            ) : messages.length > 0 ? messages.map((m: any, i: number) => (
              <div 
                key={m.id} 
                className={cn(
                  "flex items-end gap-6 max-w-[80%] group animate-fade-up",
                  m.senderId === user?.id ? "ml-auto flex-row-reverse" : ""
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                 <div className={cn(
                   "w-14 h-14 rounded-[20px] flex-shrink-0 flex items-center justify-center shadow-xl transition-all group-hover:scale-110",
                   m.senderId === user?.id ? "bg-[#303030] text-[var(--secondary)]" : "bg-white text-primary border border-primary/5"
                 )}>
                    <User size={24} />
                 </div>
                 <div className={cn(
                   "p-10 rounded-[44px] border shadow-2xl transition-all duration-700 relative overflow-hidden group-hover:shadow-primary/5",
                   m.senderId === user?.id 
                    ? "bg-[#303030] text-white border-transparent rounded-br-[8px] electric-glow" 
                    : "bg-white text-[#303030] border-white/20 rounded-bl-[8px]"
                 )}>
                    {m.senderId === user?.id && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[30px] rounded-full pointer-events-none" />}
                    <p className="text-xl leading-relaxed font-medium relative z-10">
                      {m.content}
                    </p>
                    <footer className={cn(
                      "flex items-center gap-4 mt-8 text-[10px] font-black uppercase tracking-[0.3em] relative z-10",
                      m.senderId === user?.id ? "justify-end text-[var(--secondary)]" : "text-[#454557]/30"
                    )}>
                       <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       {m.senderId === user?.id && <CheckCheck size={18} className="animate-pulse" />}
                    </footer>
                 </div>
              </div>
            )) : selectedContact && (
              <div className="flex flex-col items-center justify-center h-full opacity-10 filter grayscale-50">
                <div className="w-32 h-32 rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center mb-8 rotate-12">
                   <MessageSquare size={64} className="text-primary/40" />
                </div>
                <p className="text-[10px] uppercase font-black tracking-[0.5em] text-primary/40">Temporal Static Detected</p>
              </div>
            )}
         </div>

         {/* Message Input Stage */}
         <footer className={cn(
           "p-12 bg-white/80 backdrop-blur-3xl border-t border-[#454557]/5 relative z-20 shadow-[0_-20px_60px_rgba(0,0,0,0.05)]",
           !selectedContact && "opacity-30 pointer-events-none grayscale"
         )}>
            <div className="relative group/input max-w-6xl mx-auto">
               <input 
                  type="text" 
                  placeholder="Curate institutional broadcast..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-surface-low border border-[#454557]/5 rounded-[32px] py-8 pl-10 pr-64 focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all text-xl font-bold shadow-inner placeholder:text-[#454557]/30 placeholder:uppercase placeholder:tracking-[0.2em] text-[#303030]"
               />
               <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                  <button className="w-16 h-16 flex items-center justify-center rounded-full bg-white hover:bg-[#303030] transition-all text-[#454557]/40 hover:text-[var(--secondary)] shadow-xl hover:-rotate-12 transform">
                     <Paperclip size={24} />
                  </button>
                  <button 
                    onClick={handleSend}
                    className="px-12 py-5 rounded-[22px] bg-primary text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95 shadow-xl"
                  >
                     <span>Broadcast</span>
                     <Send size={22} className="rotate-[-15deg] group-hover/input:rotate-0 transition-transform" />
                  </button>
               </div>
            </div>
         </footer>
      </div>
    </div>
  );
};
