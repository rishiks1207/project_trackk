import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  GitBranch, 
  Scale, 
  Database, 
  Presentation,
  PlusCircle,
  LogOut,
  Users,
  UserCog,
  Calendar,
  MessageSquare,
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';
import { UserRole, UserAccount } from '../types';

interface HeaderProps {
  currentUser: UserAccount | null;
  onLogout: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSubmitModal: () => void;
  onOpenPresentation: () => void;
  onOpenGuideMessageModal?: () => void;
  conflictCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenSubmitModal,
  onOpenPresentation,
  onOpenGuideMessageModal,
  conflictCount
}) => {
  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-white/60">
      {/* Top Institutional Header Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white px-4 py-1.5 text-xs border-b border-indigo-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wider uppercase text-blue-200 text-[11px]">
              Don Bosco Institute of Technology • Mumbai
            </span>
            <span className="hidden md:inline text-indigo-400/60">·</span>
            <span className="hidden md:inline text-slate-300 text-[11px]">
              Department of Computer Engineering • SE Mini Project-I (AY 2026–27)
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono text-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Track 7 · Group 05</span>
            </div>

            <button
              onClick={onOpenPresentation}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/25 hover:bg-indigo-500/40 text-indigo-200 hover:text-white border border-indigo-400/30 text-[11px] font-medium transition-all backdrop-blur-md"
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-300" />
              <span>PPT Presentation Reviews</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & System Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-blue-500/25 border border-white/30 transition-transform duration-300 group-hover:scale-105">
              PT
            </div>
            <div className="absolute -inset-0.5 bg-blue-500 rounded-2xl blur-xs opacity-30 -z-10 group-hover:opacity-50 transition-opacity" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                DBIT <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ProjectTrack</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-800 border border-blue-500/20 backdrop-blur-xs">
                <Cpu className="w-2.5 h-2.5 text-blue-600" />
                <span>Similarity Check</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 tracking-tight hidden sm:block">
              Centralized Project Proposal &amp; Stage-Gate Progress Tracking Portal
            </p>
          </div>
        </div>

        {/* Center / Right: Glass Controller Dock & Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Frosted Glass Segmented Role Switcher Dock */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/5 backdrop-blur-md border border-slate-900/10 text-xs shadow-inner">
            <button
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentRole === 'student'
                  ? 'bg-white text-blue-700 shadow-sm shadow-blue-900/10 border border-white/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <GraduationCap className={`w-3.5 h-3.5 ${currentRole === 'student' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Student</span>
            </button>

            <button
              onClick={() => onRoleChange('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentRole === 'guide'
                  ? 'bg-white text-purple-700 shadow-sm shadow-purple-900/10 border border-white/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 ${currentRole === 'guide' ? 'text-purple-600' : 'text-slate-400'}`} />
              <span>Guide</span>
            </button>

            <button
              onClick={() => onRoleChange('coordinator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentRole === 'coordinator'
                  ? 'bg-white text-emerald-700 shadow-sm shadow-emerald-900/10 border border-white/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${currentRole === 'coordinator' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Coordinator</span>
            </button>

            <button
              onClick={() => onRoleChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentRole === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm shadow-slate-900/10 border border-white/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <UserCog className={`w-3.5 h-3.5 ${currentRole === 'admin' ? 'text-slate-900' : 'text-slate-400'}`} />
              <span>Admin</span>
            </button>
          </div>

          {/* Contextual Action Button based on Role */}
          {currentRole === 'student' && (
            <button
              onClick={onOpenSubmitModal}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-blue-500/20 border border-blue-400/30 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit Proposal</span>
            </button>
          )}

          {currentRole === 'guide' && onOpenGuideMessageModal && (
            <button
              onClick={onOpenGuideMessageModal}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-purple-500/20 border border-purple-400/30 transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Student Text</span>
            </button>
          )}

          {currentRole === 'admin' && (
            <button
              onClick={() => onTabChange('admin')}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-slate-900/20 border border-white/20 transition-all hover:scale-[1.02]"
            >
              <Users className="w-3.5 h-3.5 text-blue-300" />
              <span>Account Manager</span>
            </button>
          )}

          {/* Sign Out Button */}
          {currentUser && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-red-600 bg-white/70 hover:bg-red-50/80 border border-slate-200/80 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all shadow-xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Role-Specific Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto no-scrollbar border-t border-slate-200/60 text-xs font-medium">
        {/* ADMIN TABS */}
        {currentRole === 'admin' && (
          <nav className="flex items-center gap-1 py-1">
            <button
              onClick={() => onTabChange('admin')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-blue-600/10 text-blue-900 font-bold border border-blue-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>User Accounts &amp; Security</span>
            </button>

            <button
              onClick={() => onTabChange('proposals')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'proposals'
                  ? 'bg-blue-600/10 text-blue-900 font-bold border border-blue-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>System Proposals Overview</span>
            </button>

            <button
              onClick={() => onTabChange('repository')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'repository'
                  ? 'bg-blue-600/10 text-blue-900 font-bold border border-blue-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Historical Project Archive</span>
            </button>
          </nav>
        )}

        {/* GUIDE TABS */}
        {currentRole === 'guide' && (
          <nav className="flex items-center gap-1 py-1">
            <button
              onClick={() => onTabChange('proposals')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'proposals'
                  ? 'bg-purple-600/10 text-purple-900 font-bold border border-purple-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Assigned Review Queue</span>
            </button>

            <button
              onClick={() => onTabChange('stages')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'stages'
                  ? 'bg-purple-600/10 text-purple-900 font-bold border border-purple-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-purple-600" />
              <span>Visual Stage-Gate &amp; GitHub Sync</span>
            </button>

            <button
              onClick={() => onTabChange('notices')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'notices'
                  ? 'bg-purple-600/10 text-purple-900 font-bold border border-purple-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
              <span>Send Student Text &amp; Notices</span>
            </button>

            <button
              onClick={() => onTabChange('repository')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'repository'
                  ? 'bg-purple-600/10 text-purple-900 font-bold border border-purple-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-purple-600" />
              <span>Historical Project Archive</span>
            </button>
          </nav>
        )}

        {/* COORDINATOR TABS */}
        {currentRole === 'coordinator' && (
          <nav className="flex items-center gap-1 py-1">
            <button
              onClick={() => onTabChange('proposals')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'proposals'
                  ? 'bg-emerald-600/10 text-emerald-900 font-bold border border-emerald-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cohort Proposals &amp; Allocation</span>
            </button>

            <button
              onClick={() => onTabChange('stages')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'stages'
                  ? 'bg-emerald-600/10 text-emerald-900 font-bold border border-emerald-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
              <span>Visual Stage-Gate &amp; GitHub Sync</span>
            </button>

            <button
              onClick={() => onTabChange('conflicts')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'conflicts'
                  ? 'bg-emerald-600/10 text-emerald-900 font-bold border border-emerald-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span>Topic Arbitration Queue</span>
              {conflictCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                  {conflictCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('repository')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'repository'
                  ? 'bg-emerald-600/10 text-emerald-900 font-bold border border-emerald-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Historical Project Archive</span>
            </button>
          </nav>
        )}

        {/* STUDENT TABS */}
        {currentRole === 'student' && (
          <nav className="flex items-center gap-1 py-1">
            <button
              onClick={() => onTabChange('proposals')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'proposals'
                  ? 'bg-blue-600/10 text-blue-900 font-bold border border-blue-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>My Project Proposals</span>
            </button>

            <button
              onClick={() => onTabChange('gantt')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'gantt'
                  ? 'bg-blue-600/10 text-blue-900 font-bold border border-blue-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Project Gantt Chart (14 Wks)</span>
            </button>

            <button
              onClick={() => onTabChange('stages')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'stages'
                  ? 'bg-blue-600/10 text-blue-900 font-bold border border-blue-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-blue-600" />
              <span>Stage-Gate &amp; GitHub Sync</span>
            </button>

            <button
              onClick={() => onTabChange('conflicts')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'conflicts'
                  ? 'bg-blue-600/10 text-blue-900 font-bold border border-blue-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              <span>Pitch Defense</span>
              {conflictCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                  {conflictCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('notices')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'notices'
                  ? 'bg-blue-600/10 text-blue-900 font-bold border border-blue-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Guide Notices &amp; Texts</span>
            </button>

            <button
              onClick={() => onTabChange('repository')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === 'repository'
                  ? 'bg-blue-600/10 text-blue-900 font-bold border border-blue-500/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Historical Project Archive</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
