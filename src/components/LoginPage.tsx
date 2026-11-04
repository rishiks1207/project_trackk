import React, { useState } from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  KeyRound,
  Presentation,
  CheckCircle2
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';
import { authenticateUserWithFirestore } from '../utils/firestoreSync';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  onOpenPresentation: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onOpenPresentation
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('Please enter both institutional email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      let userData: UserAccount | null = null;

      // 1. Direct Cloud Firestore Database Authentication
      try {
        userData = await authenticateUserWithFirestore(cleanEmail, cleanPass);
      } catch (dbErr) {
        console.warn('Firestore database auth lookup notice:', dbErr);
      }

      // 2. Full-stack backend API fallback (if server is running)
      if (!userData) {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail, password: cleanPass })
          });

          const contentType = res.headers.get('content-type') || '';
          if (res.ok && contentType.includes('application/json')) {
            userData = await res.json();
          }
        } catch (networkErr) {
          // Fallback handled
        }
      }

      if (userData) {
        onLoginSuccess(userData);
      } else {
        throw new Error('Invalid institutional credentials. Please check your email or password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickLogin = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'admin') {
      setEmail('admin@dbit.in');
      setPassword('admin123');
    } else if (role === 'coordinator') {
      setEmail('coordinator@dbit.in');
      setPassword('coord123');
    } else if (role === 'guide') {
      setEmail('guide@dbit.in');
      setPassword('guide123');
    } else if (role === 'student') {
      setEmail('rishiks1207@gmail.com');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0D0E12] flex items-center justify-center font-sans antialiased text-white selection:bg-[#D4F938] selection:text-slate-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Ambient Lighting & Neon Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#D4F938]/12 via-[#C6B5FD]/08 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-[500px] h-[300px] bg-[#D4F938]/06 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Centered Main Login Container */}
      <div className="w-full max-w-xl relative z-10 flex flex-col items-center">
        
        {/* Brand Centerpiece */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          
          {/* High-Tech Glowing Stage-Gate Emblem */}
          <div className="relative mb-3.5 group">
            <div className="absolute -inset-2 rounded-2xl bg-[#D4F938] blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />
            <div className="w-14 h-14 sm:w-16 sm:h-16 relative bg-gradient-to-tr from-[#D4F938] via-[#ebff75] to-[#a6ee18] rounded-2xl flex items-center justify-center p-2.5 shadow-xl shadow-[#D4F938]/30 border border-white/50 transition-transform duration-300 group-hover:scale-105">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 drop-shadow-xs"
              >
                {/* Outer Obsidian Shield */}
                <path 
                  d="M12 2L20.5 6.9V17.1L12 22L3.5 17.1V6.9L12 2Z" 
                  fill="#0F1117" 
                />
                {/* Inner Neon Gate Channel */}
                <path 
                  d="M12 5.6L17.2 8.6V15.4L12 18.4L6.8 15.4V8.6L12 5.6Z" 
                  fill="#D4F938" 
                />
                {/* Obsidian Core Velocity Vector (Milestone Progress) */}
                <path 
                  d="M12 8L15 11.2H13.2V16H10.8V11.2H9L12 8Z" 
                  fill="#0F1117" 
                />
              </svg>
            </div>
          </div>

          {/* Centered Brand Title */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
              DBIT
            </span>
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#D4F938] font-sans drop-shadow-[0_0_20px_rgba(212,249,56,0.35)]">
              ProjectTrack
            </span>
          </div>

          {/* Subtitle & Status Badge */}
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1 tracking-wide">
            Centralized Academic Stage-Gate &amp; Project Progress Portal
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-semibold text-slate-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#D4F938] animate-pulse" />
            <span>Database Connected</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono">SE COMPS AY 2026–27</span>
          </div>
        </div>

        {/* Sculpted Dark Glass Form Card */}
        <div className="w-full bg-[#16171E]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-black/80">
          
          {/* Quick Role Presets Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#D4F938]" />
                <span>Instant Role Presets:</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Click to autofill
              </span>
            </div>

            {/* 4 Role Bento Cards in 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Student Preset */}
              <button
                type="button"
                onClick={() => fillQuickLogin('student')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  selectedRole === 'student'
                    ? 'bg-[#D4F938]/10 border-[#D4F938] shadow-md shadow-[#D4F938]/10'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4F938]/20 text-[#D4F938] flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      Student
                    </span>
                    <span className="text-[10px] text-slate-400">Rishik • Group 5</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  selectedRole === 'student' ? 'bg-[#D4F938] text-slate-950' : 'bg-white/10 text-slate-400'
                }`}>
                  Select
                </span>
              </button>

              {/* Faculty Guide Preset */}
              <button
                type="button"
                onClick={() => fillQuickLogin('guide')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  selectedRole === 'guide'
                    ? 'bg-[#C6B5FD]/15 border-[#C6B5FD] shadow-md shadow-[#C6B5FD]/10'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#C6B5FD]/20 text-[#C6B5FD] flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      Faculty Guide
                    </span>
                    <span className="text-[10px] text-slate-400">Mr. Nazareth</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  selectedRole === 'guide' ? 'bg-[#C6B5FD] text-slate-950' : 'bg-white/10 text-slate-400'
                }`}>
                  Select
                </span>
              </button>

              {/* Coordinator Preset */}
              <button
                type="button"
                onClick={() => fillQuickLogin('coordinator')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  selectedRole === 'coordinator'
                    ? 'bg-white/15 border-white shadow-md'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      Coordinator
                    </span>
                    <span className="text-[10px] text-slate-400">Prof. Meenal</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  selectedRole === 'coordinator' ? 'bg-white text-slate-950' : 'bg-white/10 text-slate-400'
                }`}>
                  Select
                </span>
              </button>

              {/* Administrator Preset */}
              <button
                type="button"
                onClick={() => fillQuickLogin('admin')}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  selectedRole === 'admin'
                    ? 'bg-[#D4F938]/10 border-[#D4F938] shadow-md shadow-[#D4F938]/10'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4F938]/20 text-[#D4F938] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">
                      Admin
                    </span>
                    <span className="text-[10px] text-slate-400">DB Control</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  selectedRole === 'admin' ? 'bg-[#D4F938] text-slate-950' : 'bg-white/10 text-slate-400'
                }`}>
                  Select
                </span>
              </button>

            </div>
          </div>

          {/* Visual Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-white/10" />
            <span className="absolute px-3 bg-[#16171E] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Or sign in with credentials
            </span>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Credentials Sign In Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 px-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setSelectedRole(null);
                  }}
                  placeholder="e.g. rishiks1207@gmail.com or admin@dbit.in"
                  className="w-full bg-black/40 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-slate-500 border border-white/10 shadow-inner focus:outline-hidden focus:border-[#D4F938] focus:ring-1 focus:ring-[#D4F938] font-medium transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 px-1">
                Access Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setSelectedRole(null);
                  }}
                  placeholder="••••••••"
                  className="w-full bg-black/40 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-slate-500 border border-white/10 shadow-inner focus:outline-hidden focus:border-[#D4F938] focus:ring-1 focus:ring-[#D4F938] font-medium transition-all"
                />
              </div>
            </div>

            {/* Glowing Neon-Lime Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#D4F938] hover:bg-[#e4ff68] disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#D4F938]/20 hover:shadow-[#D4F938]/35 transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign in to Controller'}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>

        </div>

        {/* Footer Links & University Affiliation */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <button
            type="button"
            onClick={onOpenPresentation}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#D4F938] transition-colors cursor-pointer group"
          >
            <Presentation className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#D4F938]" />
            <span>View DBIT ProjectTrack Architecture &amp; Slides</span>
          </button>
          
          <p className="text-[11px] text-slate-600 font-medium">
            Department of Computer Engineering • Don Bosco Institute of Technology, Mumbai (AY 2026–27)
          </p>
        </div>

      </div>
    </div>
  );
};
