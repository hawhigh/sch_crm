/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { 
  GraduationCap, 
  LogOut,
  Bell,
  HelpCircle,
  Search,
  Calendar,
  Library,
  MessageSquare,
  School,
  LayoutDashboard,
  ChefHat
} from "lucide-react";
import { cn } from "../../lib/utils";

type AppRole = 'owner' | 'coordinator' | 'supervisor' | 'lector' | 'parent' | 'student';

interface ShellProps {
  children: React.ReactNode;
  role: AppRole;
  onLogout: () => void;
}

export const Shell = ({ children, role, onLogout }: ShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Insights Meta", path: "/", roles: ['owner', 'coordinator', 'supervisor', 'lector', 'parent', 'student'] },
    { icon: GraduationCap, label: "Curriculum Flow", path: "/lessons", roles: ['owner', 'lector', 'coordinator'] },
    { icon: Calendar, label: "Institutional Schedule", path: "/calendar", roles: ['owner', 'coordinator', 'supervisor', 'lector', 'parent', 'student'] },
    { icon: Library, label: "Knowledge Archive", path: "/library", roles: ['owner', 'coordinator', 'supervisor', 'lector', 'parent', 'student'] },
    { icon: School, label: "Hub Architecture", path: "/schools", roles: ['owner', 'coordinator', 'supervisor'] },
    { icon: MessageSquare, label: "Communication Hub", path: "/messages", roles: ['owner', 'coordinator', 'supervisor', 'lector', 'parent', 'student'] },
  ];

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const getProfileName = (role: string) => {
    const profiles: Record<string, string> = {
      'lector': 'Viktor Lector',
      'parent': 'Leo Parent',
      'owner': 'Viktor Novák',
      'coordinator': 'Jana Kováčová',
      'supervisor': 'Marek Šimko',
      'student': 'Leo Odyssey'
    };
    return profiles[role] || 'Talkin Curator';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
       'lector': 'Expert Lector',
       'parent': 'Parent Curator',
       'owner': 'Platform Owner',
       'coordinator': 'Coordinator',
       'supervisor': 'Supervisor',
       'student': 'Student'
    };
    return labels[role] || 'Institutional Role';
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex overflow-hidden font-inter selection:bg-primary/10">
      {/* Sidebar - Talkin Institutional Style - FIXED WIDTH AND BACKGROUND */}
      <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#f5f3ef] flex flex-col py-10 z-50 border-r border-[#303030]/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#303030]/5 to-transparent" />
        
        {/* Header Identity */}
        <div className="px-10 mb-14">
          <div className="flex items-center gap-5 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-14 h-14 bg-[#0300a9] rounded-[20px] flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="serif text-2xl font-black text-[#303030] tracking-tight leading-none">Talkin.sk</h1>
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#0300a9] mt-2 opacity-60">Elite CRM Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-3">
          {navItems.filter(item => item.roles.includes(role)).map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-5 px-6 py-4 rounded-[18px] transition-all duration-500 group relative overflow-hidden",
                isActive 
                  ? "bg-[#303030] text-white shadow-2xl shadow-[#303030]/20 transform -translate-y-0.5" 
                  : "text-[#454557]/60 hover:text-[#303030] hover:bg-white/60 hover:translate-x-1"
              )}
            >
              <item.icon 
                size={22} 
                className={cn(
                  "transition-all duration-500",
                  location.pathname === item.path ? "text-[#d8ef00] scale-110" : "group-hover:text-[#0300a9]"
                )} 
              />
              <span className={cn(
                "text-[11px] font-bold tracking-[0.2em] uppercase",
                location.pathname === item.path ? "text-white" : ""
              )}>
                {item.label}
              </span>
              
              {location.pathname === item.path && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#d8ef00] mr-4 shadow-[0_0_10px_#d8ef00]" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Institutional Tools Section */}
        <div className="px-10 mb-8 mt-10">
           <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#454557]/40 mb-6">Analytic Tools</p>
           <div className="flex items-center gap-4 text-[#454557]/40">
              <button className="w-10 h-10 rounded-xl bg-white border border-[#303030]/5 flex items-center justify-center hover:bg-[#303030] hover:text-[#d8ef00] hover:scale-110 transition-all shadow-sm">
                 <ChefHat size={18} />
              </button>
              <div className="w-px h-6 bg-[#303030]/10" />
              <button className="w-10 h-10 rounded-xl bg-white border border-[#303030]/5 flex items-center justify-center hover:bg-[#303030] hover:text-[#d8ef00] hover:scale-110 transition-all shadow-sm">
                 <Search size={18} />
              </button>
           </div>
        </div>

        {/* Branding Footer */}
        <div className="px-8 mt-auto pt-8 border-t border-[#303030]/5">
           <div className="bg-[#303030] rounded-[24px] p-8 space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d8ef00]/10 blur-[40px] rounded-full pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#d8ef00]">
                    <ChefHat size={20} />
                 </div>
                 <Badge className="bg-[#d8ef00] text-[#303030] text-[8px] font-black tracking-widest">v2.4</Badge>
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] text-white/50 leading-relaxed uppercase tracking-[0.15em] font-black">
                    Institutional <br /><span className="text-[#d8ef00]">Intelligence</span> Hub
                 </p>
              </div>
           </div>
           
           <div className="mt-8 space-y-1 pb-8">
              <button 
                onClick={handleLogoutClick}
                className="flex items-center gap-4 px-6 py-4 text-[#454557]/60 hover:text-red-500 hover:bg-red-50 w-full transition-all duration-500 rounded-[18px] group"
              >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-black">Secure Exit</span>
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[280px] flex flex-col min-w-0 h-screen overflow-hidden bg-white">
        {/* Top Header */}
        <header className="bg-white flex justify-between items-center w-full px-12 py-8 shrink-0 border-b border-[#303030]/5">
          <div className="flex items-center gap-10">
            <h2 className="serif text-4xl font-bold text-[#303030] tracking-tight">
              {location.pathname === '/lessons' ? 'Curriculum Flow' : 
               location.pathname === '/schools' ? 'Hub Architecture' :
               location.pathname === '/library' ? 'Knowledge Archive' :
               location.pathname === '/messages' ? 'Communication Hub' : 
               'Insights Meta'}
            </h2>
            <div className="hidden lg:flex items-center gap-8 bg-[#f5f3ef] px-6 py-3 rounded-full border border-[#303030]/5">
              <NavLink to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#454557]/40 hover:text-[#0300a9] transition-colors">Overview</NavLink>
              <div className="w-px h-3 bg-[#454557]/20" />
              <NavLink to="/analytics" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#454557]/40 hover:text-[#0300a9] transition-colors">Performance</NavLink>
              <div className="w-px h-3 bg-[#454557]/20" />
              <NavLink to="/calendar" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#454557]/40 hover:text-[#0300a9] transition-colors">Calendar</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden xl:flex items-center gap-4 bg-[#f5f3ef] px-6 py-3 rounded-[16px] border border-[#303030]/5 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0300a9]/10 transition-all">
              <Search className="text-[#454557]/40" size={18} />
              <input 
                type="text" 
                placeholder="Institutional Search..." 
                className="bg-transparent border-none p-0 text-[11px] font-bold text-[#303030] placeholder:text-[#454557]/30 placeholder:uppercase placeholder:tracking-[0.1em] focus:ring-0 w-48"
              />
            </div>
            
            <div className="flex gap-4">
               <button className="w-12 h-12 rounded-[14px] bg-white border border-[#303030]/5 flex items-center justify-center text-[#454557]/60 hover:text-[#0300a9] hover:border-[#0300a9]/20 transition-all shadow-sm relative">
                 <Bell size={20} />
                 <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></div>
               </button>
               <button className="w-12 h-12 rounded-[14px] bg-white border border-[#303030]/5 flex items-center justify-center text-[#454557]/60 hover:text-[#0300a9] hover:border-[#0300a9]/20 transition-all shadow-sm">
                 <HelpCircle size={20} />
               </button>
            </div>
            
            <div className="flex items-center gap-5 pl-8 border-l border-[#303030]/10">
              <div className="text-right">
                <p className="text-[11px] font-black text-[#303030] uppercase tracking-wider">{getProfileName(role)}</p>
                <p className="text-[9px] uppercase font-black tracking-[0.2em] text-[#0300a9] opacity-60 mt-1">{getRoleLabel(role)}</p>
              </div>
              <div className="w-12 h-12 rounded-[16px] border-2 border-[#0300a9]/5 p-0.5 shadow-xl rotate-3">
                 <img 
                   src={`https://ui-avatars.com/api/?name=${getProfileName(role)}&background=0300a9&color=fff&bold=true&rounded=true`}
                   alt="Profile" 
                   className="w-full h-full rounded-[12px] object-cover"
                 />
              </div>
            </div>
          </div>
        </header>

        {/* Content Canvas - Padded only for standard pages, Studio handles its own spacing */}
        <div className="flex-1 overflow-y-auto bg-[#fbf9f5] custom-scrollbar">
          <div className={cn(
            "max-w-[1600px] mx-auto w-full",
            location.pathname === '/lessons' ? "h-full" : "p-12"
          )}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest", className)}>
    {children}
  </span>
);
