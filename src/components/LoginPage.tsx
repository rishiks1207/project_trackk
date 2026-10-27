import React, { useState } from 'react';
import { 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Presentation,
  Database,
  Cpu,
  Fingerprint,
  Rocket
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
    <div className="min-h-screen w-full bg-[#18191E] flex items-center justify-center font-sans antialiased text-slate-900 selection:bg-[#D4F938] selection:text-slate-950 p-4 sm:p-6 lg:p-8">
      
      {/* Centered Login Card Container (Clean, no outer pale-green frame) */}
      <div className="w-full max-w-5xl bg-[#18191E] rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-white/10">
        
        {/* Left Dark Rail / Brand & Role Showcase */}
        <div className="w-full lg:w-5/12 bg-[#18191E] text-white p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Brand Logo with 4-Petal Spark in Neon-Lime */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4F938] to-[#C6B5FD] flex items-center justify-center p-2 shadow-md shadow-[#D4F938]/20">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-950 fill-current">
                  <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
                  DBIT <span className="text-[#D4F938]">ProjectTrack</span>
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold tracking-wider uppercase">
                  Centralized Proposal &amp; Stage-Gate Portal
                </span>
              </div>
            </div>

            {/* Intro Copy */}
            <div className="space-y-2 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                Academic Project Governance with AI Novelty Verification
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sentence-BERT duplicate screening across 500+ past theses, 14-week individual Gantt schedules, and role-authoritative controllers.
              </p>
            </div>

            {/* 4 Role Controller Quick Badges */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-white/10 text-[#D4F938] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Admin Authority</span>
                  <span className="text-[11px] text-slate-400">Account management &amp; Cloud SQL PostgreSQL relations.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-white/10 text-[#C6B5FD] flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Faculty Guide Authority</span>
                  <span className="text-[11px] text-slate-400">Milestone sign-off stamps &amp; direct student text notices.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Coordinator Authority</span>
                  <span className="text-[11px] text-slate-400">Topic arbitration queue &amp; pitch defense evaluation.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors">
                <div className="w-7 h-7 rounded-xl bg-white/10 text-[#D4F938] flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs block">Student Controller</span>
                  <span className="text-[11px] text-slate-400">Submit proposals, pick DB team members &amp; track Gantt chart.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card: The signature Neon-Lime Card */}
          <div className="mt-8 bg-[#D4F938] rounded-3xl p-5 text-slate-950 relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-slate-950 text-[#D4F938] flex items-center justify-center shadow-xs">
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-950 leading-tight">Milestone Progression</h4>
                <span className="text-[10px] text-slate-800 font-bold">14-Week Capstone Workflow</span>
              </div>
            </div>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              Track 14-week Gantt milestones, upload Review 1 &amp; 2 PPT decks, and coordinate stage gate sign-offs directly with faculty guides.
            </p>
          </div>
        </div>

        {/* Right Main Porcelain Sign-in Card */}
        <div className="flex-1 bg-[#F4F5F8] p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Institutional Access Gate
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Sign in to ProjectTrack
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Select a quick role preset or enter your institutional credentials.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-[11px] font-bold border border-slate-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Cloud SQL Live</span>
              </div>
            </div>

            {/* Quick Autofill Role Presets in Crisp White Bento Pills */}
            <div className="mb-6 bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#18191E]" />
                  <span>Instant Role Presets (Click to autofill):</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">One-click sign in</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillQuickLogin('student')}
                  className="p-3 rounded-2xl bg-[#F4F5F8] hover:bg-white text-slate-900 border border-slate-200/60 font-bold text-left transition-all hover:border-[#D4F938] hover:shadow-xs flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4F938]" />
                    <span>Student (Rishik)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Group 5</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickLogin('guide')}
                  className="p-3 rounded-2xl bg-[#F4F5F8] hover:bg-white text-slate-900 border border-slate-200/60 font-bold text-left transition-all hover:border-[#C6B5FD] hover:shadow-xs flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C6B5FD]" />
                    <span>Guide (Nazareth)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Faculty</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickLogin('coordinator')}
                  className="p-3 rounded-2xl bg-[#F4F5F8] hover:bg-white text-slate-900 border border-slate-200/60 font-bold text-left transition-all hover:border-slate-400 hover:shadow-xs flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#18191E]" />
                    <span>Coordinator</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Arbitration</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickLogin('admin')}
                  className="p-3 rounded-2xl bg-[#F4F5F8] hover:bg-white text-slate-900 border border-slate-200/60 font-bold text-left transition-all hover:border-[#D4F938] hover:shadow-xs flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4F938]" />
                    <span>Admin</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">DB Control</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. rishiks1207@gmail.com or admin@dbit.in"
                    className="w-full bg-white rounded-full pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200/80 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#D4F938] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Access Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white rounded-full pl-11 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200/80 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#D4F938] font-medium"
                  />
                </div>
              </div>

              {/* Submit Pill Button (Solid Charcoal-Black with High Contrast) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#18191E] hover:bg-black disabled:opacity-50 text-white font-extrabold text-xs shadow-lg transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLoading ? 'Verifying with PostgreSQL...' : 'Sign in to Controller'}</span>
                <ArrowRight className="w-4 h-4 text-[#D4F938]" />
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-200/70 text-[11px] text-slate-400 text-center font-medium mt-6">
            Department of Computer Engineering • Don Bosco Institute of Technology, Mumbai (AY 2026–27)
          </div>
        </div>

      </div>
    </div>
  );
};
