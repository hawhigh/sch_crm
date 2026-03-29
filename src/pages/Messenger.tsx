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
import { useAuth } from '../hooks/useAuth';

export const Messenger = () => {
  const { user } = useAuth();
  const { data: contacts = [], isLoading: contactsLoading } = useConversations();
  const [selectedContact, setSelectedContact] = useState<any>(null);
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
    <div className="h-[calc(100vh-180px)] overflow-hidden flex flex-col xl:flex-row gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Contact List Sidebar */}
      <div className="w-full xl:w-[450px] bg-white rounded-[40px] flex flex-col h-full shadow-sm border border-[#454557]/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
         
         <div className="p-10 pb-8 space-y-10 relative z-10">
            <div className="flex items-center justify-between border-b border-[#454557]/5 pb-6">
               <h3 className="serif text-4xl font-bold text-[#303030]">Communication <span className="italic font-normal text-primary">Hub</span></h3>
               <button className="w-12 h-12 rounded-[16px] bg-[#303030] flex items-center justify-center text-[var(--secondary)] hover:bg-primary transition-all shadow-md group">
                  <Zap size={24} className="group-hover:scale-110 transition-transform" />
               </button>
            </div>
            <div className="relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#454557]/40 group-focus-within:text-primary transition-colors" size={20} />
               <input 
                  type="text" 
                  placeholder="Search interactions..." 
                  className="bg-surface-low border-none rounded-[20px] py-4 pl-14 pr-6 text-sm font-bold text-[#303030] placeholder:text-[#454557]/40 placeholder:uppercase placeholder:tracking-[0.1em] w-full focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-inner"
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-4 custom-scrollbar relative z-10">
            {contacts.map((contact: any) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={cn(
                  "w-full flex items-center gap-6 p-6 rounded-[24px] transition-all duration-300 group relative border",
                  selectedContact?.id === contact.id 
                    ? "bg-[#303030] border-[#303030] shadow-xl text-white outline-none" 
                    : "hover:bg-surface-low border-transparent text-[#303030] hover:border-[#454557]/5 bg-transparent"
                )}
              >
                <div className="relative shrink-0">
                   <div className={cn(
                     "w-14 h-14 rounded-[16px] flex items-center justify-center overflow-hidden transition-all shadow-sm",
                     selectedContact?.id === contact.id ? "bg-white/10" : "bg-[#e4e2de]"
                   )}>
                      <User size={24} className={cn(selectedContact?.id === contact.id ? "text-white" : "text-[#454557]/40 group-hover:text-[#303030]")} />
                   </div>
                   {contact.status === 'Online' && (
                     <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--secondary)] border-[3px] border-white shadow-lg" />
                   )}
                </div>
                
                <div className="flex-1 text-left min-w-0">
                   <div className="flex items-center justify-between mb-2">
                      <h4 className={cn("text-base font-bold truncate pr-3", selectedContact?.id === contact.id ? "text-white" : "text-[#303030] group-hover:text-primary transition-colors")}>
                        {contact.name}
                      </h4>
                      <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em] shrink-0", selectedContact?.id === contact.id ? "text-[var(--secondary)]" : "text-[#454557]/40")}>
                        {contact.time}
                      </span>
                   </div>
                   <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em] mb-2", selectedContact?.id === contact.id ? "text-[var(--secondary)]/80" : "text-[#454557]/60")}>
                    {contact.role}
                   </p>
                   <p className={cn("text-sm line-clamp-1 font-medium", selectedContact?.id === contact.id ? "text-white/80" : "text-[#454557]/80")}>
                    {contact.lastMessage}
                   </p>
                </div>

                {contact.unread > 0 && (
                  <div className="w-6 h-6 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center shadow-md animate-pulse shrink-0">
                     {contact.unread}
                  </div>
                )}
              </button>
            ))}
         </div>
      </div>

      {/* Dynamic Chat Canvas */}
      <div className="flex-1 bg-surface-low rounded-[40px] relative flex flex-col h-full overflow-hidden shadow-inner border border-[#454557]/5">
         {/* Background Glow */}
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--secondary)]/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
         
         {/* Chat Header */}
         <div className="px-12 py-8 border-b border-[#454557]/5 flex justify-between items-center bg-white/50 backdrop-blur-md relative z-10 shadow-sm min-h-[120px]">
            {selectedContact ? (
              <>
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[20px] bg-primary flex items-center justify-center text-white shadow-md">
                     <MessageSquare size={24} />
                   </div>
                   <div>
                      <h4 className="serif text-3xl font-bold text-[#303030] mb-2">{selectedContact.name}</h4>
                      <div className="flex items-center gap-3">
                         <div className={cn("w-2 h-2 rounded-full", selectedContact.status === 'Online' ? 'bg-[var(--secondary)] shadow-[0_0_8px_var(--secondary)]' : 'bg-[#e4e2de]')} />
                         <p className="text-[10px] text-[#454557]/60 font-bold uppercase tracking-[0.2em]">{selectedContact.status} Curator</p>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-4 bg-white p-2 rounded-[24px] shadow-sm border border-[#454557]/5">
                   <button className="p-4 rounded-[16px] hover:bg-[#303030] transition-all text-[#454557]/60 hover:text-[var(--secondary)] shadow-sm">
                      <Phone size={20} />
                   </button>
                   <button className="p-4 rounded-[16px] hover:bg-[#303030] transition-all text-[#454557]/60 hover:text-[var(--secondary)] shadow-sm">
                      <Video size={20} />
                   </button>
                   <div className="w-px h-8 bg-[#454557]/10 mx-2" />
                   <button className="p-4 rounded-[16px] hover:bg-surface-low transition-all text-[#454557]/40 shadow-sm">
                      <MoreVertical size={20} />
                   </button>
                   <button className="p-4 rounded-[16px] hover:bg-surface-low transition-all text-[#454557]/40 shadow-sm">
                      <Info size={20} />
                   </button>
                </div>
              </>
            ) : (
              <div className="w-full flex items-center justify-center text-[#454557]/30 text-xs font-bold uppercase tracking-[0.2em]">Select a contact to begin curation</div>
            )}
         </div>

         {/* Messenger Content */}
         <div className="flex-1 overflow-y-auto p-12 space-y-10 relative z-10 custom-scrollbar">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary/20" size={32} />
              </div>
            ) : messages.length > 0 ? messages.map((m: any) => (
              <div 
                key={m.id} 
                className={cn(
                  "flex items-end gap-5 max-w-[75%] group",
                  m.senderId === user?.id ? "ml-auto flex-row-reverse" : ""
                )}
              >
                 <div className={cn(
                   "w-12 h-12 rounded-[16px] flex-shrink-0 flex items-center justify-center shadow-sm",
                   m.senderId === user?.id ? "bg-primary text-white" : "bg-white text-[#454557]/40"
                 )}>
                    <User size={20} />
                 </div>
                 <div className={cn(
                   "p-8 rounded-[32px] border shadow-sm transition-shadow",
                   m.senderId === user?.id 
                    ? "bg-[#303030] text-white border-transparent rounded-br-[12px]" 
                    : "bg-white text-[#303030] border-[#454557]/5 rounded-bl-[12px]"
                 )}>
                    <p className="text-lg leading-relaxed font-medium">
                      {m.content}
                    </p>
                    <div className={cn(
                      "flex items-center gap-3 mt-5 text-[10px] font-bold uppercase tracking-[0.2em]",
                      m.senderId === user?.id ? "justify-end text-[var(--secondary)]" : "text-[#454557]/40"
                    )}>
                       <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       {m.senderId === user?.id && <CheckCheck size={16} />}
                    </div>
                 </div>
              </div>
            )) : selectedContact && (
              <div className="flex flex-col items-center justify-center h-full opacity-20 filter grayscale grayscale-0">
                <MessageSquare size={48} className="mb-4" />
                <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Institutional Feed Empty</p>
              </div>
            )}
         </div>

         {/* Message Input Stage */}
         <div className={cn(
           "p-10 bg-white border-t border-[#454557]/5 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]",
           !selectedContact && "opacity-50 pointer-events-none"
         )}>
            <div className="relative group max-w-5xl mx-auto">
               <input 
                  type="text" 
                  placeholder="Curate your message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-surface-low border border-[#454557]/5 rounded-[24px] py-6 pl-8 pr-48 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-base font-bold shadow-inner placeholder:text-[#454557]/40 placeholder:uppercase placeholder:tracking-[0.1em] text-[#303030]"
               />
               <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                  <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white hover:bg-surface-low transition-all text-[#454557]/60 hover:text-[#303030] shadow-sm">
                     <Paperclip size={20} />
                  </button>
                  <button 
                    onClick={handleSend}
                    className="px-8 py-4 rounded-[16px] bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:opacity-90 transition-opacity shadow-md"
                  >
                     <span>Send</span>
                     <Send size={18} />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
