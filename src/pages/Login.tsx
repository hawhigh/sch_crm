import { useState } from 'react';
import { ArrowRight, Lock, User, Sparkles, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-surface flex selection:bg-primary selection:text-white">
      {/* 60% Left Section - Editorial Showcase */}
      <div className="hidden lg:flex flex-col flex-1 p-20 relative overflow-hidden bg-surface justify-between">
        {/* Abstract Geometry */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[var(--secondary)]/5 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="display-lg serif tracking-tight text-[#303030] max-w-2xl mb-8">
            The <span className="text-primary italic font-normal">Kinetic</span> <br />
            Curator
          </h1>
          <div className="h-[2px] w-24 bg-primary mb-8" />
          <p className="text-[#454557] text-xl font-medium max-w-lg leading-relaxed mix-blend-multiply">
            Orchestrating growth through fluid intelligence and architectural design. 
            Welcome to the new standard of institutional management.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-[#454557]/10 pt-8 mt-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60">Talkin.sk CRM System</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#454557]/60">V. 2.0_2026</p>
        </div>
      </div>

      {/* 40% Right Section - Authentication Panel */}
      <div className="w-full lg:w-[600px] bg-surface-low shadow-[-20px_0_40px_rgba(27,28,26,0.03)] flex flex-col items-center justify-center p-8 sm:p-16 relative z-10">
        
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
          
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="serif text-2xl font-bold text-[#1b1c1a] leading-none">Authentication</h2>
              <p className="text-[#454557] text-xs font-medium mt-1">Institutional Access Required</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#454557]/40 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-white focus:border-primary/40 rounded-xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-0 transition-all placeholder:text-[#454557]/40 shadow-sm"
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#454557]/40 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-white focus:border-primary/40 rounded-xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-0 transition-all placeholder:text-[#454557]/40 shadow-sm"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-[var(--error)] rounded-xl text-xs animate-in slide-in-from-top-2 duration-300 border border-red-100">
                <AlertCircle size={16} className="text-[var(--error)] flex-shrink-0" />
                <p className="font-bold">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full py-4 text-xs mt-4 flex items-center justify-center gap-3 tracking-[0.2em]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Unlock Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-[#454557]/10 flex flex-col gap-4">
            <button className="text-[10px] font-bold uppercase tracking-widest text-[#454557]/60 hover:text-primary transition-colors text-left w-max">
              Request Temporary Access
            </button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-container transition-colors text-left w-max">
              Contact Systems Administrator
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
