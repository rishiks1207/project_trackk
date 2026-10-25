import React, { useState } from 'react';
import { 
  Cpu, 
  Scale, 
  Activity, 
  GitBranch, 
  MoreVertical, 
  ArrowUpRight, 
  TrendingUp,
  Percent,
  Layers,
  ChevronDown,
  Sparkles,
  Database,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Clock,
  UserCheck,
  Send,
  Upload,
  Calendar,
  MessageSquare,
  Presentation
} from 'lucide-react';
import { ProjectProposal, UserRole } from '../types';

interface FluxBentoWidgetsProps {
  proposals: ProjectProposal[];
  currentRole: UserRole;
  onOpenSubmitModal: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const FluxBentoWidgets: React.FC<FluxBentoWidgetsProps> = ({
  proposals,
  currentRole,
  onOpenSubmitModal,
  onNavigateToTab
}) => {
  const [timelinePeriod, setTimelinePeriod] = useState<'Term 2026' | 'Semester VII' | 'All Tracks'>('Term 2026');

  const approvedCount = proposals.filter(p => p.status === 'approved').length;
  const conflictCount = proposals.filter(
    p => p.status === 'flagged_conflict' || p.status === 'coordinator_arbitration'
  ).length;

  // Student's specific project (Group 5 by default, or first proposal)
  const myProposal = proposals.find(p => p.groupNo === 5) || proposals[0];
  const myNovelty = myProposal?.similarityData 
    ? Math.round((1 - myProposal.similarityData.overallScore) * 100) 
    : 92;
  const mySbertScore = myProposal?.similarityData 
    ? Math.round(myProposal.similarityData.sbertScore * 100) 
    : 18;
  const myLexicalScore = myProposal?.similarityData 
    ? Math.round(myProposal.similarityData.tfidfScore * 100) 
    : 12;

  // Student's active stage gate
  const currentGate = myProposal?.stageGates?.find(g => g.status === 'in_progress') || 
                      myProposal?.stageGates?.[2] || 
                      { title: 'Exp 3: System Architecture & UML Modeling', weekRange: 'Weeks 5-6', dueDate: 'Feb 21, 2026' };

  const verifiedGatesCount = myProposal?.stageGates?.filter(g => g.status === 'approved').length || 4;
  const totalGatesCount = myProposal?.stageGates?.length || 7;

  // If role is Student, render student-tailored widgets (removing administrative noise like conflict arbitration queue & cohort aggregates)
  if (currentRole === 'student') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-8">
        
        {/* 1. Student's Own Project Novelty & SBERT Semantic Index (Spans 4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#18191E] flex items-center justify-center text-[#D4F938]">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">My Project SBERT Novelty</h3>
                  <span className="text-[10px] font-mono text-slate-500">{myProposal?.projectId || 'Group 05'}</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigateToTab('proposals')}
                className="text-slate-400 hover:text-black transition-colors p-1"
                title="View Full SBERT Analysis"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Metric & Neon-Lime Badge */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl lg:text-4xl font-black text-[#18191E] tracking-tight font-mono tabular-nums">
                {myNovelty}%
              </span>
              <span className="bg-[#D4F938] text-black font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs">
                Clean Novelty
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-1 mb-4">
              Screened against 500+ DBIT engineering theses
            </p>

            {/* Signature Intersecting Circular Bubbles (Lavender, Charcoal, and Neon Lime) */}
            <div className="relative h-44 w-full flex items-center justify-center my-1">
              {/* Soft Lilac Bubble: SBERT dense vectors */}
              <div className="absolute left-4 sm:left-6 top-2 w-28 h-28 rounded-full bg-[#C6B5FD] flex flex-col items-center justify-center text-black shadow-xs transition-transform duration-300 group-hover:scale-105">
                <span className="text-lg font-black tracking-tight font-mono">{mySbertScore}%</span>
                <span className="text-[9px] font-bold uppercase tracking-wider">sbert</span>
              </div>

              {/* Dark Obsidian Bubble: TF-IDF lexical n-grams */}
              <div className="absolute right-4 sm:right-6 top-8 w-24 h-24 rounded-full bg-[#18191E] flex flex-col items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                <span className="text-base font-black tracking-tight font-mono text-white">{myLexicalScore}%</span>
                <span className="text-[9px] font-medium text-slate-300 uppercase tracking-wider">lexical</span>
              </div>

              {/* Neon Lime Bubble: Verified unique topics */}
              <div className="absolute bottom-1 w-24 h-24 rounded-full bg-[#D4F938] flex flex-col items-center justify-center text-black shadow-md z-10 transition-transform duration-300 group-hover:scale-110">
                <span className="text-lg font-black tracking-tight font-mono">{myNovelty}%</span>
                <span className="text-[9px] font-extrabold text-black uppercase tracking-wider">unique</span>
              </div>
            </div>
          </div>

          {/* SBERT Clearance Info Bar */}
          <div className="space-y-2 pt-3 border-t border-slate-100 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Topic Conflict Threshold:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                &lt; 75% Cutoff (Clear)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Assigned Guide:</span>
              <span className="font-bold text-[#18191E]">{myProposal?.guideName || 'Mr. Nazareth Remedios'}</span>
            </div>
          </div>
        </div>

        {/* 2. Middle Column: Active Sprint & Next Deliverable (Spans 4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Card A: Active Milestone & Due Date */}
          <div className="bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-between group hover:shadow-md transition-shadow duration-300">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#18191E] flex items-center justify-center text-[#D4F938]">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">Active Milestone</h3>
                    <span className="text-[10px] text-slate-400 font-mono">Week 5 of 14</span>
                  </div>
                </div>
                <span className="bg-[#D4F938] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  Active Sprint
                </span>
              </div>

              <div className="my-3">
                <h4 className="text-base font-black text-[#18191E] leading-snug">
                  {currentGate.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target Due: <strong className="text-black font-mono">{currentGate.dueDate}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Schedule Progress:</span>
              <button 
                onClick={() => onNavigateToTab('stages')}
                className="inline-flex items-center gap-1.5 bg-[#18191E] hover:bg-black text-[#D4F938] font-black px-4 py-1.5 rounded-full transition-all cursor-pointer text-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Deliverable</span>
              </button>
            </div>
          </div>

          {/* Card B: Verified Gates Progress Dial */}
          <div className="bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-between group hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">Stage-Gate Clearance</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-[#C6B5FD] text-black px-2.5 py-0.5 rounded-full">
                Review 1 Passed
              </span>
            </div>

            <div className="my-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl lg:text-4xl font-black text-[#18191E] tracking-tight font-mono tabular-nums">
                  {verifiedGatesCount} / {totalGatesCount}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  experiments
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Completion</span>
                <span className="text-sm font-black text-black font-mono">
                  {Math.round((verifiedGatesCount / totalGatesCount) * 100)}%
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
              <div 
                className="bg-[#D4F938] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round((verifiedGatesCount / totalGatesCount) * 100)}%` }}
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Next Checkpoint: Intermediate Code Demo</span>
              <button 
                onClick={() => onNavigateToTab('gantt')}
                className="font-bold text-black hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Timeline</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. GitHub VCS Continuous Progression Card (Spans 4 cols on lg, replacing administrative aggregate) */}
        <div className="lg:col-span-4 bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between group hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#18191E] flex items-center justify-center text-white">
                  <FolderGit2 className="w-4 h-4 text-[#D4F938]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">GitHub Continuous VCS</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Stage 2 Audit Trail</span>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4F938] border border-black/20" title="Connected" />
            </div>

            {/* Repo Info Card */}
            <div className="p-3.5 bg-[#F4F5F8] rounded-2xl border border-slate-200/60 my-2 space-y-1.5">
              <div className="text-[11px] font-bold text-black truncate flex items-center justify-between">
                <span>{myProposal?.githubData?.owner || 'rishiks1207'}/{myProposal?.githubData?.repo || 'dbit-project-track'}</span>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {myProposal?.githubData?.defaultBranch || 'main'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Language: <strong className="text-black">{myProposal?.githubData?.primaryLanguage || 'TypeScript'}</strong>
              </p>
            </div>

            {/* Recent Verified Commits */}
            <div className="space-y-2 mt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Latest Milestone Commits
              </span>
              <div className="space-y-1.5 text-xs">
                {(myProposal?.githubData?.latestCommits || [
                  { sha: 'e736a46', message: 'feat: add SBERT cosine similarity engine', author: 'Rishik', date: '2026-02-14' },
                  { sha: '98d021c', message: 'docs: finalize UML sequence diagrams', author: 'Apoorvadeep', date: '2026-02-12' }
                ]).slice(0, 2).map((c, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="truncate pr-1">
                      <p className="font-bold text-[#18191E] truncate text-[11px]">{c.message}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{c.sha} • {c.author}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C6B5FD] text-black shrink-0">
                      Linked
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
            <span className="text-slate-400 text-[11px]">Exp 5 &amp; Exp 6 Verification</span>
            <button 
              onClick={() => onNavigateToTab('stages')}
              className="font-bold text-black hover:underline inline-flex items-center gap-1 text-xs cursor-pointer"
            >
              <span>Sync Repo</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4. Signature Dark Hero Bento Card: 14-Week Academic Review Milestones */}
        <div className="lg:col-span-12 bg-[#18191E] text-white rounded-[32px] p-6 lg:p-7 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#D4F938]/10 blur-[90px] pointer-events-none -z-0" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-[#D4F938]">
                <Database className="w-4 h-4 fill-[#D4F938]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Academic Review Milestones &amp; 14-Week Gate Progression
                </h3>
                <p className="text-xs text-white/60">
                  Track 7 Group 05 progress mapped against Mumbai University SE Mini Project-I syllabus
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80 font-mono font-bold bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
                Term 2026 • SE COMPS
              </span>
            </div>
          </div>

          {/* Real Project Metric Indicators with vertical colored pills */}
          <div className="relative z-10 flex flex-wrap items-center gap-6 sm:gap-10 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 rounded-full bg-[#D4F938]" />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">Exp 3</span>
                </div>
                <span className="text-[11px] text-white/60 uppercase tracking-wider font-semibold">
                  Current Sprint
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 rounded-full bg-[#C6B5FD]" />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">4 / 7</span>
                </div>
                <span className="text-[11px] text-white/60 uppercase tracking-wider font-semibold">
                  Signed Deliverables
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 rounded-full bg-white/30" />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">Week 6</span>
                </div>
                <span className="text-[11px] text-white/60 uppercase tracking-wider font-semibold">
                  Next Sign-Off
                </span>
              </div>
            </div>
          </div>

          {/* Milestone Review Columns with Highlighted Active Phase */}
          <div className="relative z-10 pt-4 border-t border-white/10">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pb-2">
              {[
                { phase: 'Exp 1: Synopsis', height: 'h-24', isHighlight: false, week: 'W1–2', status: 'Approved' },
                { phase: 'Exp 2: Lit Review', height: 'h-32', isHighlight: false, week: 'W3–4', status: 'Approved' },
                { phase: 'Exp 3: UML Arch', height: 'h-44', isHighlight: true, week: 'W5–6', status: 'Active Sprint' },
                { phase: 'Exp 4: Module Specs', height: 'h-28', isHighlight: false, week: 'W7–8', status: 'Pending' },
                { phase: 'Exp 5: SBERT Core', height: 'h-24', isHighlight: false, week: 'W9–10', status: 'Pending' },
                { phase: 'Exp 6: Test Suite', height: 'h-32', isHighlight: false, week: 'W11–12', status: 'Pending' },
                { phase: 'Exp 7: Final Defense', height: 'h-36', isHighlight: false, week: 'W13–14', status: 'Pending' }
              ].map((col, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2.5 group/bar cursor-pointer" onClick={() => onNavigateToTab('gantt')}>
                  {col.isHighlight ? (
                    <div className="flex items-end gap-1.5 w-full justify-center">
                      <div className="w-5 sm:w-7 h-44 rounded-full bg-[#D4F938] shadow-lg shadow-[#D4F938]/30 transition-all duration-300 group-hover/bar:scale-105" />
                      <div className="w-5 sm:w-7 h-36 rounded-full bg-[#C6B5FD] shadow-lg shadow-[#C6B5FD]/20 transition-all duration-300 group-hover/bar:scale-105" />
                    </div>
                  ) : (
                    <div className="w-8 sm:w-11 flex flex-col items-center">
                      <div 
                        className={`w-full ${col.height} rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden transition-all duration-300 group-hover/bar:bg-white/10`}
                        style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.06) 5px, rgba(255,255,255,0.06) 10px)'
                        }}
                      />
                    </div>
                  )}
                  
                  <span className={`text-[11px] font-bold tracking-wide text-center truncate max-w-[85px] ${
                    col.isHighlight ? 'text-[#D4F938]' : 'text-slate-400'
                  }`}>
                    {col.phase}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">{col.week}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Fallback for Faculty / Admin: Department-level statistics
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-8">
      {/* 1. SBERT Vector Embeddings & Corpus Distribution Card (Spans 4 cols on lg) */}
      <div className="lg:col-span-4 bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
                <Cpu className="w-4 h-4 text-slate-800" />
              </div>
              <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">SBERT Semantic Index</h3>
            </div>
            <button 
              onClick={() => onNavigateToTab('repository')}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              title="View Archive"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl lg:text-4xl font-black text-[#18191E] tracking-tight font-mono tabular-nums">
              528
            </span>
            <span className="bg-[#D4F938] text-black font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs">
              +14 New
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium -mt-3 mb-6">
            Indexed theses &amp; active SE proposal vectors
          </p>

          <div className="relative h-48 w-full flex items-center justify-center my-2">
            <div className="absolute left-4 sm:left-8 top-4 w-32 h-32 rounded-full bg-[#C6B5FD] flex flex-col items-center justify-center text-slate-900 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <span className="text-xl font-black tracking-tight font-mono">384</span>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">sbert</span>
            </div>

            <div className="absolute right-4 sm:right-8 top-10 w-28 h-28 rounded-full bg-[#18191E] flex flex-col items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
              <span className="text-lg font-black tracking-tight font-mono text-white">144</span>
              <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">lexical</span>
            </div>

            <div className="absolute bottom-1 w-24 h-24 rounded-full bg-[#D4F938] flex flex-col items-center justify-center text-black shadow-md z-10 transition-transform duration-300 group-hover:scale-110">
              <span className="text-base font-black tracking-tight font-mono">92%</span>
              <span className="text-[9px] font-extrabold text-black uppercase tracking-wider">unique</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100 mt-2">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 font-mono">
                <span className="text-sm">45</span>
                <span className="text-[11px] text-slate-400">%</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                <span>AI &amp; Neural Nets</span>
                <span className="w-2 h-2 rounded-full bg-[#C6B5FD]" />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#C6B5FD] h-2 rounded-full w-[45%]" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 font-mono">
                <span className="text-sm">30</span>
                <span className="text-[11px] text-slate-400">%</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                <span>Cloud &amp; DevOps</span>
                <span className="w-2 h-2 rounded-full bg-[#18191E]" />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#18191E] h-2 rounded-full w-[30%]" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 font-mono">
                <span className="text-sm">25</span>
                <span className="text-[11px] text-slate-400">%</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                <span>Cyber &amp; IoT</span>
                <span className="w-2 h-2 rounded-full bg-[#D4F938]" />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#D4F938] h-2 rounded-full w-[25%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Column: Dual Metric Cards (Spans 4 cols on lg) */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <div className="bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-between group hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
                <Scale className="w-4 h-4 text-slate-800" />
              </div>
              <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">Conflict Threshold</h3>
            </div>
            <button 
              onClick={() => onNavigateToTab('conflicts')}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="Inspect Conflicts"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="my-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
                75
              </span>
              <span className="text-xs font-semibold text-slate-400">
                % cutoff
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 block">Queue</span>
              <span className={`text-xs font-bold font-mono ${conflictCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {conflictCount > 0 ? `${conflictCount} In Arbitration` : '0 Clashes'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>200-Word Pitch Defense active</span>
            <button 
              onClick={() => onNavigateToTab('conflicts')}
              className="font-bold text-slate-900 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>Arbitrate</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex-1 flex flex-col justify-between group hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
                <GitBranch className="w-4 h-4 text-slate-800" />
              </div>
              <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">Stage-Gate Velocity</h3>
            </div>
            <button 
              onClick={() => onNavigateToTab('stages')}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="Inspect Stage Gates"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="my-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
                5,8
              </span>
              <span className="text-xs font-semibold text-slate-400">
                / 7 milestones
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 block">Schedule</span>
              <span className="text-xs font-bold text-slate-800 font-mono">14 Wks Term</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Next: Review 2 Prototype Demo</span>
            <button 
              onClick={() => onNavigateToTab('gantt')}
              className="font-bold text-slate-900 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>Gantt Chart</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Novelty Distribution & Matrix Card (Spans 4 cols on lg) */}
      <div className="lg:col-span-4 bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between group hover:shadow-md transition-shadow duration-300">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
                <Percent className="w-4 h-4 text-slate-800" />
              </div>
              <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">Cohort Novelty Rate</h3>
            </div>
            <button 
              onClick={() => onNavigateToTab('repository')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
              82
            </span>
            <span className="text-lg font-bold text-slate-400">%</span>
            <span className="bg-[#D4F938] text-black font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs ml-1">
              Passed SBERT
            </span>
          </div>

          <div className="h-44 w-full flex items-end justify-between px-2 pt-2 pb-1">
            {[
              { count: 3, label: 'Track 1' },
              { count: 4, label: 'Track 2' },
              { count: 5, label: 'Track 3' },
              { count: 4, label: 'Track 4' },
              { count: 2, label: 'Track 5' },
              { count: 6, label: 'Track 6' },
              { count: 5, label: 'Track 7' },
              { count: 6, label: 'Track 8' },
              { count: 4, label: 'Track 9' }
            ].map((col, cIdx) => (
              <div key={cIdx} className="flex flex-col-reverse items-center gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((dIdx) => {
                  const isActive = dIdx < col.count;
                  return (
                    <span 
                      key={dIdx}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#C6B5FD] shadow-xs hover:scale-125' 
                          : 'bg-slate-100'
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>500+ DBIT Theses cross-referenced</span>
          <span className="font-bold text-slate-800">Clean Clearance</span>
        </div>
      </div>

      {/* 4. Signature Dark Hero Bento Card: 14-Week Academic Review Milestones */}
      <div className="lg:col-span-12 bg-[#18191E] text-white rounded-[32px] p-6 lg:p-7 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#D4F938]/10 blur-[90px] pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
              <Database className="w-4 h-4 fill-white/80" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Academic Review Milestones &amp; Gate Clearance
              </h3>
              <p className="text-xs text-white/60">
                14-week progress tracking across SE Mini Project evaluation stages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-slate-200 border border-white/10 backdrop-blur-md cursor-pointer transition-colors">
              <span>{timelinePeriod}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-6 sm:gap-10 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 rounded-full bg-[#D4F938]" />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">85</span>
                <span className="text-xs text-slate-400 font-semibold">%</span>
              </div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Gate Clearance
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 rounded-full bg-[#C6B5FD]" />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">24h</span>
              </div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Guide SLA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 rounded-full bg-white/30" />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  {approvedCount} / {proposals.length}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Approved Topics
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-4 border-t border-white/10">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 pb-2">
            {[
              { phase: 'Exp 1: Synopsis', height: 'h-24', isHighlight: false, week: 'W1–2' },
              { phase: 'Exp 2: Lit Review', height: 'h-32', isHighlight: false, week: 'W3–4' },
              { phase: 'Exp 3: Survey', height: 'h-20', isHighlight: false, week: 'W5–6' },
              { phase: 'Exp 4: Arch ↗', height: 'h-44', isHighlight: true, week: 'W7–8' },
              { phase: 'Exp 5: SBERT Core', height: 'h-28', isHighlight: false, week: 'W9–10' },
              { phase: 'Exp 6: Testing', height: 'h-36', isHighlight: false, week: 'W11–12' },
              { phase: 'Exp 7: Final Defense', height: 'h-32', isHighlight: false, week: 'W13–14' }
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 group/bar">
                {col.isHighlight ? (
                  <div className="flex items-end gap-1.5 w-full justify-center">
                    <div className="w-5 sm:w-7 h-44 rounded-full bg-[#D4F938] shadow-lg shadow-[#D4F938]/30 transition-all duration-300 group-hover/bar:scale-105" />
                    <div className="w-5 sm:w-7 h-36 rounded-full bg-[#C6B5FD] shadow-lg shadow-[#C6B5FD]/20 transition-all duration-300 group-hover/bar:scale-105" />
                  </div>
                ) : (
                  <div className="w-8 sm:w-11 flex flex-col items-center">
                    <div 
                      className={`w-full ${col.height} rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden transition-all duration-300 group-hover/bar:bg-white/10`}
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.06) 5px, rgba(255,255,255,0.06) 10px)'
                      }}
                    />
                  </div>
                )}
                
                <span className={`text-[11px] font-semibold tracking-wide text-center truncate max-w-[85px] ${
                  col.isHighlight ? 'text-[#D4F938] font-bold' : 'text-slate-400'
                }`}>
                  {col.phase}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
