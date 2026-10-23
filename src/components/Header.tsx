import React from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  GitBranch, 
  Scale, 
  Database, 
  BarChart3, 
  Presentation,
  PlusCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSubmitModal: () => void;
  onOpenPresentation: () => void;
  conflictCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenSubmitModal,
  onOpenPresentation,
  conflictCount
}) => {
  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-xs">
      {/* Top Institute Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide uppercase text-blue-200">
              The Bombay Salesian Society’s • Don Bosco Institute of Technology, Kurla (W)
            </span>
            <span className="hidden md:inline text-zinc-400">|</span>
            <span className="hidden md:inline text-zinc-200">
              Department of Computer Engineering • SE Mini Project-I (AY 2026–27)
            </span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300">
            <span className="bg-blue-800/80 px-2 py-0.5 rounded text-[11px] font-mono border border-blue-700/60">
              Track 7 • Group 05
            </span>
            <button
              onClick={onOpenPresentation}
              className="inline-flex items-center gap-1.5 bg-indigo-700/80 hover:bg-indigo-600 text-white px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Review 1 Slides (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">
            PT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                DBIT <span className="text-blue-600">ProjectTrack</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                SBERT + TF-IDF (0.75)
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Centralized Project Proposal & Stage-Gate Progress Tracking Portal
            </p>
          </div>
        </div>

        {/* Role Switcher & Primary Action */}
        <div className="flex items-center gap-3">
          {/* Role selector */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200 text-xs">
            <span className="text-zinc-500 font-medium px-2 hidden sm:inline">Role:</span>
            <button
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                currentRole === 'student'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Student</span>
            </button>
            <button
              onClick={() => onRoleChange('guide')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                currentRole === 'guide'
                  ? 'bg-white text-purple-700 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Faculty Guide</span>
            </button>
            <button
              onClick={() => onRoleChange('coordinator')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                currentRole === 'coordinator'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Coordinator</span>
            </button>
          </div>

          {/* New Proposal Button */}
          <button
            onClick={onOpenSubmitModal}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Proposal</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto no-scrollbar border-t border-zinc-100 text-xs font-medium">
        <button
          onClick={() => onTabChange('proposals')}
          className={`flex items-center gap-2 py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'proposals'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Active Proposals & Screening</span>
        </button>

        <button
          onClick={() => onTabChange('stages')}
          className={`flex items-center gap-2 py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'stages'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Visual Stage-Gate & GitHub Sync</span>
        </button>

        <button
          onClick={() => onTabChange('conflicts')}
          className={`flex items-center gap-2 py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'conflicts'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Pitch Defense & Conflict Queue</span>
          {conflictCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {conflictCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('repository')}
          className={`flex items-center gap-2 py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'repository'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Historical Archive (Past Projects)</span>
        </button>

        <button
          onClick={() => onTabChange('analytics')}
          className={`flex items-center gap-2 py-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Survey Data & 14-Week Gantt</span>
        </button>
      </div>
    </header>
  );
};
