import { useState } from 'react';
import { ArrowRight, Lock, User, Sparkles, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Login = ({ onLogin }: { onLogin?: (role: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      onLogin?.(user.role);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex selection:bg-primary selection:text-white relative overflow-hidden font-inter">
      {/* 60% Left Section - Editorial Showcase */}
      <div className="hidden lg:flex flex-col flex-1 p-24 relative overflow-hidden bg-[#fbf9f5] justify-between border-r border-[#454557]/5">
        {/* Abstract Geometry */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-none -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[var(--secondary)]/5 blur-[100px] rounded-none translate-x-1/3 translate-y-1/3 pointer-events-none" />
        
        <div className="relative z-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-none mb-12 border border-primary/10">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Institutional Shield Active</span>
          </div>
          <h1 className="display-lg serif tracking-tight text-[#303030] max-w-2xl mb-10 leading-[0.9]">
            The <span className="text-primary italic font-normal">Kinetic</span> <br />
            Curator
          </h1>
          <div className="h-[1px] w-32 bg-primary/20 mb-10" />
          <p className="text-[#454557] text-xl font-medium max-w-lg leading-relaxed mix-blend-multiply">
            Orchestrating growth through fluid intelligence and architectural design. 
            Welcome to the new standard of talkin.sk institutional management.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-[#454557]/10 pt-10 mt-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#454557]/30 font-black">Talkin.sk CRM System</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#454557]/30 font-black">V. 2.5_PRO</p>
        </div>
      </div>

      {/* 40% Right Section - Authentication Panel */}
      <div className="w-full lg:w-[650px] bg-white flex flex-col items-center justify-center p-12 sm:p-24 relative z-10 shadow-[-40px_0_80px_rgba(27,28,26,0.02)]">
        
        <div className="w-full max-w-[420px] animate-fade-up stagger-1">
          
          <div className="flex items-center gap-4 mb-16">
            <div className="w-14 h-14 rounded-none bg-[#303030] flex items-center justify-center shadow-2xl electric-glow transition-transform hover:scale-110">
              <Sparkles className="text-[var(--secondary)]" size={24} />
            </div>
            <div>
              <h2 className="serif text-3xl font-bold text-[#303030] leading-none mb-1">Authorization</h2>
              <p className="text-[#454557]/40 text-[10px] font-bold uppercase tracking-[0.2em]">Curation Node Connectivity</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#454557]/30 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="Institutional Identity"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-low border border-transparent focus:border-primary/10 rounded-none py-5 pl-14 pr-8 text-sm font-bold text-[#303030] focus:outline-none transition-all placeholder:text-[#454557]/30 placeholder:uppercase placeholder:tracking-[0.2em] shadow-sm focus:bg-white"
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#454557]/30 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="Security Key"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-low border border-transparent focus:border-primary/10 rounded-none py-5 pl-14 pr-8 text-sm font-bold text-[#303030] focus:outline-none transition-all placeholder:text-[#454557]/30 placeholder:uppercase placeholder:tracking-[0.2em] shadow-sm focus:bg-white"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-5 bg-red-50 text-red-600 rounded-none text-xs animate-in slide-in-from-top-2 duration-300 border border-red-100 font-bold">
                <AlertCircle size={18} className="flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-18 bg-[#303030] text-white rounded-none font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 transition-all hover:bg-black hover:scale-[1.02] shadow-xl electric-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-[var(--secondary)]" size={24} />
              ) : (
                <>
                  <span>Unlock Gateway</span>
                  <ArrowRight size={20} className="text-[var(--secondary)]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-20 pt-10 border-t border-[#454557]/5 flex flex-col gap-6">
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[#454557]/20 hover:text-primary transition-colors text-left w-max">
              Request Temporal Access
            </button>
            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary-container transition-colors text-left w-max">
              Contact Systems Architect
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
