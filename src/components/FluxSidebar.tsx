import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  GitBranch, 
  Scale, 
  Database, 
  MessageSquare, 
  UserCog, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap,
  Users,
  Send,
  UserPlus
} from 'lucide-react';
import { UserRole, UserAccount } from '../types';

interface FluxSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentRole: UserRole;
  conflictCount: number;
  proposalsCount: number;
  onOpenSubmitModal: () => void;
  onOpenGuideMessageModal?: () => void;
}

export const FluxSidebar: React.FC<FluxSidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  conflictCount,
  proposalsCount,
  onOpenSubmitModal,
  onOpenGuideMessageModal
}) => {
  return (
    <aside className="w-full md:w-64 lg:w-72 bg-[#18191E] text-white p-5 lg:p-6 flex flex-col justify-between shrink-0 border-r border-white/10 md:min-h-screen">
      <div>
        {/* Brand Logo with Neon-Lime Geometric Spark */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4F938] to-[#C6B5FD] flex items-center justify-center p-2 shadow-md shadow-[#D4F938]/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-950 fill-current">
              <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
              DBIT <span className="text-[#D4F938]">ProjectTrack</span>
            </span>
            <span className="text-[10px] text-slate-400 block font-medium -mt-1 tracking-wider uppercase">
              {currentRole.toUpperCase()} CONTROLLER
            </span>
          </div>
        </div>

        {/* Role-Specific Navigation Menu */}
        <nav className="space-y-1.5">
          
          {/* ================= ADMIN INTERACTABLES ================= */}
          {currentRole === 'admin' && (
            <>
              {/* Database & Accounts Control */}
              <button
                onClick={() => onTabChange('admin')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCog className={`w-4 h-4 ${activeTab === 'admin' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Accounts &amp; Database</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'admin' ? 'bg-[#D4F938] text-slate-950' : 'bg-white/10 text-slate-300'
                }`}>
                  PostgreSQL
                </span>
              </button>

              {/* Proposals Overview */}
              <button
                onClick={() => onTabChange('proposals')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'proposals'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-4 h-4 ${activeTab === 'proposals' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Proposals Overview</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {proposalsCount}
                </span>
              </button>

              {/* Project Archives */}
              <button
                onClick={() => onTabChange('repository')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'repository'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className={`w-4 h-4 ${activeTab === 'repository' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Project Archives</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">500+</span>
              </button>
            </>
          )}

          {/* ================= GUIDE INTERACTABLES ================= */}
          {currentRole === 'guide' && (
            <>
              {/* Overview */}
              <button
                onClick={() => onTabChange('dashboard')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Cohort Overview</span>
                </div>
              </button>

              {/* Active Proposals / Review Queue */}
              <button
                onClick={() => onTabChange('proposals')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'proposals'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-4 h-4 ${activeTab === 'proposals' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Assigned Proposals</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#D4F938] text-slate-950">
                  {proposalsCount}
                </span>
              </button>

              {/* Visual Stage Gate & GitHub Sync */}
              <button
                onClick={() => onTabChange('stages')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'stages'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GitBranch className={`w-4 h-4 ${activeTab === 'stages' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Visual Stage Gates</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">7 Gates</span>
              </button>

              {/* Special Guide Capability: Sending Students Text & Notices */}
              <button
                onClick={() => onTabChange('notices')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'notices'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className={`w-4 h-4 ${activeTab === 'notices' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Send Students Text</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4F938] text-slate-950">
                  Guide Action
                </span>
              </button>

              {/* Project Archives */}
              <button
                onClick={() => onTabChange('repository')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'repository'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className={`w-4 h-4 ${activeTab === 'repository' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Project Archives</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">500+</span>
              </button>
            </>
          )}

          {/* ================= COORDINATOR INTERACTABLES ================= */}
          {currentRole === 'coordinator' && (
            <>
              {/* Overview */}
              <button
                onClick={() => onTabChange('dashboard')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Cohort Overview</span>
                </div>
              </button>

              {/* Active Proposals & Topic Allocation */}
              <button
                onClick={() => onTabChange('proposals')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'proposals'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-4 h-4 ${activeTab === 'proposals' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Cohort Proposals</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#D4F938] text-slate-950">
                  {proposalsCount}
                </span>
              </button>

              {/* Visual Stage Gate & GitHub Sync */}
              <button
                onClick={() => onTabChange('stages')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'stages'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GitBranch className={`w-4 h-4 ${activeTab === 'stages' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Visual Stage Gates</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">7 Gates</span>
              </button>

              {/* Topic Arbitration Queue (Coordinator's Special Power) */}
              <button
                onClick={() => onTabChange('conflicts')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'conflicts'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Scale className={`w-4 h-4 ${activeTab === 'conflicts' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Topic Arbitration</span>
                </div>
                {conflictCount > 0 && (
                  <span className="bg-[#D4F938] text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {conflictCount}
                  </span>
                )}
              </button>

              {/* Project Archives */}
              <button
                onClick={() => onTabChange('repository')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'repository'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className={`w-4 h-4 ${activeTab === 'repository' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Project Archives</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">500+</span>
              </button>
            </>
          )}

          {/* ================= STUDENT INTERACTABLES ================= */}
          {currentRole === 'student' && (
            <>
              {/* Dashboard */}
              <button
                onClick={() => onTabChange('dashboard')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Dashboard</span>
                </div>
              </button>

              {/* My Project & SBERT Submissions */}
              <button
                onClick={() => onTabChange('proposals')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'proposals'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-4 h-4 ${activeTab === 'proposals' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>My Project &amp; SBERT</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#D4F938] text-slate-950">
                  {proposalsCount}
                </span>
              </button>

              {/* Individual 14-Week Gantt Timeline */}
              <button
                onClick={() => onTabChange('gantt')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'gantt'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className={`w-4 h-4 ${activeTab === 'gantt' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Project Gantt Chart</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono font-medium">14 Wks</span>
              </button>

              {/* Visual Stage Gate & GitHub Sync */}
              <button
                onClick={() => onTabChange('stages')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'stages'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GitBranch className={`w-4 h-4 ${activeTab === 'stages' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Stage Gates &amp; Git</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">7 Gates</span>
              </button>

              {/* Pitch Defense Options */}
              <button
                onClick={() => onTabChange('conflicts')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'conflicts'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Scale className={`w-4 h-4 ${activeTab === 'conflicts' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Pitch Defense</span>
                </div>
                {conflictCount > 0 && (
                  <span className="bg-[#D4F938] text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    Active
                  </span>
                )}
              </button>

              {/* Guide Notices & Texts */}
              <button
                onClick={() => onTabChange('notices')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'notices'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className={`w-4 h-4 ${activeTab === 'notices' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Guide Notices</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  1
                </span>
              </button>

              {/* Project Archives */}
              <button
                onClick={() => onTabChange('repository')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'repository'
                    ? 'bg-white text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className={`w-4 h-4 ${activeTab === 'repository' ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>Thesis Archive</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">500+</span>
              </button>
            </>
          )}

        </nav>
      </div>

      {/* Role-Specific Action Card in the Neon-Lime Theme */}
      <div className="mt-8 bg-[#D4F938] rounded-3xl p-5 text-slate-950 relative overflow-hidden shadow-lg group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-black/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="w-9 h-9 rounded-2xl bg-slate-950 text-[#D4F938] flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform duration-200">
            {currentRole === 'admin' ? (
              <UserCog className="w-5 h-5" />
            ) : currentRole === 'guide' ? (
              <MessageSquare className="w-5 h-5" />
            ) : currentRole === 'coordinator' ? (
              <Scale className="w-5 h-5" />
            ) : (
              <PlusCircle className="w-5 h-5" />
            )}
          </div>

          <h4 className="text-base font-extrabold tracking-tight text-slate-950 leading-snug">
            {currentRole === 'admin' && 'Cloud SQL Control'}
            {currentRole === 'guide' && 'Guide Text Notice'}
            {currentRole === 'coordinator' && 'Conflict Arbitration'}
            {currentRole === 'student' && 'Submit Proposal'}
          </h4>
          
          <p className="text-xs text-slate-800 font-medium mt-1 leading-relaxed">
            {currentRole === 'admin' && 'Provision accounts & manage project relations.'}
            {currentRole === 'guide' && 'Broadcast instant advisories to student groups.'}
            {currentRole === 'coordinator' && 'Review pitch defenses and award topic scopes.'}
            {currentRole === 'student' && 'Cross-check novelty against 500+ DBIT theses.'}
          </p>

          {currentRole === 'student' && (
            <button
              onClick={onOpenSubmitModal}
              className="w-full mt-4 py-2.5 px-4 rounded-full bg-slate-950 text-white hover:bg-neutral-900 text-xs font-bold text-center block shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              Submit Proposal
            </button>
          )}

          {currentRole === 'guide' && onOpenGuideMessageModal && (
            <button
              onClick={onOpenGuideMessageModal}
              className="w-full mt-4 py-2.5 px-4 rounded-full bg-slate-950 text-white hover:bg-neutral-900 text-xs font-bold text-center block shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              Send Student Text
            </button>
          )}

          {currentRole === 'coordinator' && (
            <button
              onClick={() => onTabChange('conflicts')}
              className="w-full mt-4 py-2.5 px-4 rounded-full bg-slate-950 text-white hover:bg-neutral-900 text-xs font-bold text-center block shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              Arbitrate Conflicts
            </button>
          )}

          {currentRole === 'admin' && (
            <button
              onClick={() => onTabChange('admin')}
              className="w-full mt-4 py-2.5 px-4 rounded-full bg-slate-950 text-white hover:bg-neutral-900 text-xs font-bold text-center block shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              Manage Accounts
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
