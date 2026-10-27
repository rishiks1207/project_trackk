import React, { useState } from 'react';
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
  UserPlus,
  Menu,
  X
} from 'lucide-react';
import { UserRole, UserAccount } from '../types';

interface FluxSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentRole: UserRole;
  conflictCount: number;
  proposalsCount: number;
  noticesCount?: number;
  thesesCount?: number;
  onOpenSubmitModal: () => void;
  onOpenGuideMessageModal?: () => void;
}

export const FluxSidebar: React.FC<FluxSidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  conflictCount,
  proposalsCount,
  noticesCount = 2,
  thesesCount = 6,
  onOpenSubmitModal,
  onOpenGuideMessageModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabSelect = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-[#18191E] text-white px-4 py-3 flex items-center justify-between border-b border-white/10 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4F938] to-[#C6B5FD] flex items-center justify-center p-1.5 shadow-xs">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-950 fill-current">
              <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" />
            </svg>
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
              DBIT <span className="text-[#D4F938]">ProjectTrack</span>
            </span>
            <span className="text-[9px] text-slate-400 block font-semibold -mt-0.5 tracking-wider uppercase">
              {currentRole.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentRole === 'student' && (
            <button
              onClick={onOpenSubmitModal}
              className="px-2.5 py-1 rounded-full bg-[#D4F938] text-slate-950 text-[11px] font-black tracking-tight"
            >
              + Proposal
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#D4F938]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-[#18191E] text-white p-5 lg:p-6 flex-col justify-between shrink-0 border-r border-white/10 md:min-h-screen">
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
                <span className="text-[10px] text-slate-500 font-mono">{thesesCount}</span>
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
                <span className="text-[10px] text-slate-500 font-mono">{thesesCount}</span>
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
                <span className="text-[10px] text-slate-500 font-mono">{thesesCount}</span>
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

              {/* My Project Proposals */}
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
                  <span>My Project Proposals</span>
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
                  {noticesCount}
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
                <span className="text-[10px] text-slate-500 font-mono">{thesesCount}</span>
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

      {/* Mobile Navigation Drawer Modal */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative z-10 w-4/5 max-w-sm bg-[#18191E] text-white p-5 flex flex-col justify-between h-full shadow-2xl border-r border-white/10 overflow-y-auto">
            <div>
              {/* Header with Close */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4F938] to-[#C6B5FD] flex items-center justify-center p-1.5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-950 fill-current">
                      <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1 font-sans">
                      DBIT <span className="text-[#D4F938]">Track</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      {currentRole} Controller
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Options */}
              <nav className="space-y-1.5">
                {currentRole === 'admin' && (
                  <>
                    <button
                      onClick={() => handleTabSelect('admin')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'admin' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <UserCog className="w-4 h-4" />
                        <span>Accounts &amp; Database</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#D4F938] text-slate-950">SQL</span>
                    </button>
                    <button
                      onClick={() => handleTabSelect('proposals')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'proposals' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4" />
                        <span>Proposals Overview</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{proposalsCount}</span>
                    </button>
                    <button
                      onClick={() => handleTabSelect('repository')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'repository' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Database className="w-4 h-4" />
                        <span>Project Archives</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{thesesCount}</span>
                    </button>
                  </>
                )}

                {currentRole === 'guide' && (
                  <>
                    <button
                      onClick={() => handleTabSelect('dashboard')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'dashboard' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Cohort Overview</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleTabSelect('proposals')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'proposals' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4" />
                        <span>Assigned Proposals</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#D4F938] text-slate-950">{proposalsCount}</span>
                    </button>
                    <button
                      onClick={() => handleTabSelect('stages')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'stages' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <GitBranch className="w-4 h-4" />
                        <span>Visual Stage Gates</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">7 Gates</span>
                    </button>
                    <button
                      onClick={() => handleTabSelect('notices')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'notices' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Students Text</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#D4F938] text-slate-950">Active</span>
                    </button>
                    <button
                      onClick={() => handleTabSelect('repository')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'repository' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Database className="w-4 h-4" />
                        <span>Project Archives</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{thesesCount}</span>
                    </button>
                  </>
                )}

                {currentRole === 'coordinator' && (
                  <>
                    <button
                      onClick={() => handleTabSelect('dashboard')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'dashboard' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Cohort Overview</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleTabSelect('proposals')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'proposals' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4" />
                        <span>Cohort Proposals</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#D4F938] text-slate-950">{proposalsCount}</span>
                    </button>
                    <button
                      onClick={() => handleTabSelect('stages')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'stages' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <GitBranch className="w-4 h-4" />
                        <span>Visual Stage Gates</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">7 Gates</span>
                    </button>
                    <button
                      onClick={() => handleTabSelect('conflicts')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'conflicts' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Scale className="w-4 h-4" />
                        <span>Topic Arbitration</span>
                      </div>
                      {conflictCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#D4F938] text-slate-950">{conflictCount}</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleTabSelect('repository')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'repository' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Database className="w-4 h-4" />
                        <span>Project Archives</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{thesesCount}</span>
                    </button>
                  </>
                )}

                {currentRole === 'student' && (
                  <>
                    <button
                      onClick={() => handleTabSelect('dashboard')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'dashboard' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleTabSelect('proposals')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'proposals' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4" />
                        <span>My Project Proposals</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#D4F938] text-slate-950">{proposalsCount}</span>
                    </button>
                    <button
                      onClick={() => handleTabSelect('gantt')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'gantt' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4" />
                        <span>Project Gantt Chart</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">14 Wks</span>
                    </button>
                    <button
                      onClick={() => handleTabSelect('stages')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'stages' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <GitBranch className="w-4 h-4" />
                        <span>Stage Gates &amp; Git</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">7 Gates</span>
                    </button>
                    <button
                      onClick={() => handleTabSelect('conflicts')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'conflicts' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Scale className="w-4 h-4" />
                        <span>Pitch Defense</span>
                      </div>
                      {conflictCount > 0 && (
                        <span className="bg-[#D4F938] text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">Active</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleTabSelect('notices')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'notices' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>Guide Notices</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">{noticesCount}</span>
                    </button>
                    <button
                      onClick={() => handleTabSelect('repository')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === 'repository' ? 'bg-white text-slate-950 font-bold' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Database className="w-4 h-4" />
                        <span>Thesis Archive</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{thesesCount}</span>
                    </button>
                  </>
                )}
              </nav>
            </div>

            {/* Mobile Bottom Action in Drawer */}
            <div className="pt-4 border-t border-white/10 mt-6">
              {currentRole === 'student' && (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onOpenSubmitModal(); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4F938] text-slate-950 text-xs font-black text-center shadow-xs cursor-pointer"
                >
                  Submit Proposal
                </button>
              )}
              {currentRole === 'guide' && onOpenGuideMessageModal && (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onOpenGuideMessageModal(); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4F938] text-slate-950 text-xs font-black text-center shadow-xs cursor-pointer"
                >
                  Send Student Text
                </button>
              )}
              {currentRole === 'coordinator' && (
                <button
                  onClick={() => handleTabSelect('conflicts')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4F938] text-slate-950 text-xs font-black text-center shadow-xs cursor-pointer"
                >
                  Arbitrate Conflicts
                </button>
              )}
              {currentRole === 'admin' && (
                <button
                  onClick={() => handleTabSelect('admin')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4F938] text-slate-950 text-xs font-black text-center shadow-xs cursor-pointer"
                >
                  Manage Accounts
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Navigation Thumb Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#18191E]/95 backdrop-blur-md border-t border-white/10 px-1.5 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
        {currentRole === 'student' && (
          <>
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Home</span>
            </button>
            <button
              onClick={() => onTabChange('proposals')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'proposals' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Project</span>
              {proposalsCount > 0 && (
                <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-[#D4F938]" />
              )}
            </button>
            <button
              onClick={() => onTabChange('stages')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'stages' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Gates</span>
            </button>
            <button
              onClick={() => onTabChange('conflicts')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'conflicts' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Pitch</span>
              {conflictCount > 0 && (
                <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-red-400 animate-ping" />
              )}
            </button>
            <button
              onClick={() => onTabChange('notices')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'notices' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Notices</span>
            </button>
          </>
        )}

        {currentRole === 'guide' && (
          <>
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Cohort</span>
            </button>
            <button
              onClick={() => onTabChange('proposals')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'proposals' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Proposals</span>
              {proposalsCount > 0 && (
                <span className="absolute top-0.5 right-2 text-[9px] font-black px-1 rounded-full bg-[#D4F938] text-black">
                  {proposalsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('stages')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'stages' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Gates</span>
            </button>
            <button
              onClick={() => onTabChange('notices')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'notices' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Send Text</span>
            </button>
            <button
              onClick={() => onTabChange('repository')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'repository' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Archive</span>
            </button>
          </>
        )}

        {currentRole === 'coordinator' && (
          <>
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Cohort</span>
            </button>
            <button
              onClick={() => onTabChange('proposals')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'proposals' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Proposals</span>
              {proposalsCount > 0 && (
                <span className="absolute top-0.5 right-2 text-[9px] font-black px-1 rounded-full bg-[#D4F938] text-black">
                  {proposalsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('stages')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'stages' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Gates</span>
            </button>
            <button
              onClick={() => onTabChange('conflicts')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'conflicts' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Arbitrate</span>
              {conflictCount > 0 && (
                <span className="absolute top-0.5 right-2 text-[9px] font-black px-1 rounded-full bg-[#D4F938] text-black">
                  {conflictCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('repository')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'repository' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Archive</span>
            </button>
          </>
        )}

        {currentRole === 'admin' && (
          <>
            <button
              onClick={() => onTabChange('admin')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'admin' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCog className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Accounts</span>
            </button>
            <button
              onClick={() => onTabChange('proposals')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'proposals' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Proposals</span>
              {proposalsCount > 0 && (
                <span className="absolute top-0.5 right-2 text-[9px] font-black px-1 rounded-full bg-[#D4F938] text-black">
                  {proposalsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('repository')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'repository' ? 'text-[#D4F938] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">Archive</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
};
