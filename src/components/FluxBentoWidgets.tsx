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
  Presentation,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { ProjectProposal, UserRole, UserAccount } from '../types';

interface FluxBentoWidgetsProps {
  proposals: ProjectProposal[];
  currentRole: UserRole;
  currentUser?: UserAccount | null;
  onOpenSubmitModal: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const FluxBentoWidgets: React.FC<FluxBentoWidgetsProps> = ({
  proposals,
  currentRole,
  currentUser,
  onOpenSubmitModal,
  onNavigateToTab
}) => {
  const [timelinePeriod, setTimelinePeriod] = useState<'Term 2026' | 'Semester VII' | 'All Tracks'>('Term 2026');

  const approvedCount = proposals.filter(p => p.status === 'approved').length;
  const conflictCount = proposals.filter(
    p => p.status === 'flagged_conflict' || p.status === 'coordinator_arbitration'
  ).length;

  // Student's specific project based on logged-in student account
  const myProposal = currentRole === 'student'
    ? proposals.find(p => {
        if (!currentUser) return false;
        const groupMatch = Boolean(
          currentUser.groupNo !== undefined && currentUser.groupNo !== null &&
          p.groupNo !== undefined && p.groupNo !== null &&
          Number(p.groupNo) === Number(currentUser.groupNo) &&
          (!currentUser.trackNo || !p.trackNo || Number(p.trackNo) === Number(currentUser.trackNo))
        );
        const memberMatch = Boolean(
          p.teamMembers && p.teamMembers.some(m => 
            (currentUser.email && m.email && m.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
            (currentUser.name && m.name && m.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) ||
            (currentUser.rollNo && m.rollNo && String(m.rollNo).trim() === String(currentUser.rollNo).trim())
          )
        );
        return groupMatch || memberMatch;
      })
    : undefined;

  const myNovelty = myProposal?.similarityData 
    ? Math.round((1 - myProposal.similarityData.overallScore) * 100) 
    : 0;
  const mySbertScore = myProposal?.similarityData 
    ? Math.round(myProposal.similarityData.sbertScore * 100) 
    : 0;
  const myLexicalScore = myProposal?.similarityData 
    ? Math.round(myProposal.similarityData.tfidfScore * 100) 
    : 0;

  // Student's active stage gate
  const currentGate = myProposal?.stageGates?.find(g => g.status === 'in_progress') || 
                      myProposal?.stageGates?.find(g => g.status === 'pending') || 
                      myProposal?.stageGates?.[0] || 
                      null;

  const verifiedGatesCount = myProposal?.stageGates?.filter(g => g.status === 'approved').length || 0;
  const totalGatesCount = myProposal?.stageGates?.length || 7;

  // If role is Student and no proposal is submitted yet, show dedicated unsubmitted state
  if (currentRole === 'student' && !myProposal) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-8">
        {/* 1. 14-Week Stage-Gate Status (Spans 6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#18191E] flex items-center justify-center text-[#C6B5FD]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">14-Week Stage Gates</h3>
                  <span className="text-[10px] font-mono text-slate-500">Exp 1 to Exp 7</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black text-slate-300 tracking-tight font-mono">0 / 7</span>
              <span className="bg-[#C6B5FD] text-black font-extrabold text-[11px] px-2.5 py-0.5 rounded-full">
                Locked
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mb-4">
              Experiment milestones and Gantt timeline activate immediately upon proposal registration and coordinator approval.
            </p>

            <div className="p-4 bg-[#F4F5F8] rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-700">
                <span>Phase 1: Design (W1–W6)</span>
                <span className="text-[10px] text-slate-400">Awaiting Topic Submission</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-[#D4F938]" />
              </div>
              <p className="text-[11px] text-slate-500">Literature review, problem formulation, and UML diagrams.</p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Mumbai University SE Mini Project-I
          </div>
        </div>

        {/* 2. GitHub Integration (Spans 6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#18191E] flex items-center justify-center text-white">
                  <FolderGit2 className="w-4 h-4 text-[#D4F938]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">GitHub Milestone Sync</h3>
                  <span className="text-[10px] font-mono text-slate-500">Stage 2 Implementation</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xl font-black text-slate-400 tracking-tight">Not Connected</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mb-4">
              Link your repository during development to automate commit audits and guide milestone verification.
            </p>

            <div className="p-4 bg-[#F4F5F8] rounded-2xl border border-slate-200/80 text-center space-y-1.5">
              <GitBranch className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-600">Connect in Stage 2</p>
              <p className="text-[10px] text-slate-400">Enables automated commit logs for Experiment 5 &amp; 6.</p>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Version control tracking
          </div>
        </div>

        {/* 4. Action Banner */}
        <div className="lg:col-span-12 bg-[#18191E] text-white rounded-[32px] p-6 lg:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-[#D4F938]/10 blur-[90px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[10px] font-mono font-bold bg-[#D4F938] text-black px-2.5 py-0.5 rounded-full uppercase">
                Action Required
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                Welcome, {currentUser?.name || 'Student'}! Submit Your Project Proposal
              </h3>
              <p className="text-xs text-white/70">
                You haven&apos;t submitted a capstone proposal yet. Register your team members, project title, and select your Faculty Guide to begin your 14-week engineering schedule.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenSubmitModal}
              className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#c2e72f] text-black font-black text-xs px-6 py-3.5 rounded-full transition-transform hover:scale-105 shadow-md cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Project Proposal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If role is Student, render student-tailored widgets with their proposal
  if (currentRole === 'student') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-8">
        
        {/* 1. Student's Own Project Details & Mentorship Status (Spans 4 cols on lg) */}
        <div className="lg:col-span-4 bg-white rounded-[28px] p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#18191E] flex items-center justify-center text-[#D4F938]">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">Project Status &amp; Mentorship</h3>
                  <span className="text-[10px] font-mono text-slate-500">{myProposal?.projectId || (currentUser?.groupNo ? `Group ${String(currentUser.groupNo).padStart(2, '0')}` : 'Project')}</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigateToTab('proposals')}
                className="text-slate-400 hover:text-black transition-colors p-1"
                title="View Full Proposal Details"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Project Title & Domain Badge */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  myProposal?.status === 'approved' 
                    ? 'bg-[#C6B5FD] text-black' 
                    : myProposal?.status === 'flagged_conflict'
                      ? 'bg-amber-100 text-amber-950 border border-amber-300'
                      : 'bg-[#D4F938] text-black'
                }`}>
                  {myProposal?.status === 'approved' 
                    ? 'Topic Approved & Active' 
                    : myProposal?.status === 'flagged_conflict'
                      ? 'Flagged for Arbitration'
                      : 'Awaiting Coordinator Approval'}
                </span>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {myProposal?.domain || 'Computer Engineering'}
                </span>
              </div>
              <h4 className="text-base font-black text-[#18191E] leading-snug line-clamp-2">
                {myProposal?.title || 'Academic Capstone Project'}
              </h4>
            </div>

            {/* Quick Details Grid */}
            <div className="bg-[#F8F9FA] rounded-2xl p-3.5 border border-slate-200/60 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Assigned Coordinator:</span>
                <span className="font-bold text-[#18191E]">{myProposal?.coordinatorName || 'Prof. DBIT Coordinator'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Faculty Guide:</span>
                <span className="font-bold text-[#18191E]">
                  {myProposal?.status === 'approved' 
                    ? (myProposal?.guideName || 'Faculty Guide') 
                    : `${myProposal?.guideName || 'Faculty Guide'} (Pending Approval)`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Track &amp; Group:</span>
                <span className="font-mono font-bold text-slate-700">Track {myProposal?.trackNo || currentUser?.trackNo || 7} • Group {myProposal?.groupNo || currentUser?.groupNo || 1}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Team Members:</span>
                <span className="font-bold text-slate-800">{myProposal?.teamMembers?.length || 1} Students</span>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              {myProposal?.status === 'approved' ? 'Stage 1 Design open' : 'Review in progress'}
            </span>
            <button
              onClick={() => onNavigateToTab('proposals')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18191E] hover:text-black bg-[#D4F938] hover:bg-[#cbf525] px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <span>View Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
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
                  {currentGate?.title || 'Exp 1: Topic Approval & Screening'}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target Due: <strong className="text-black font-mono">{currentGate?.dueDate || 'Week 2'}</strong></span>
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
              <span 
                className={`w-2.5 h-2.5 rounded-full ${myProposal?.githubData ? 'bg-[#D4F938]' : 'bg-slate-300'} border border-black/20`} 
                title={myProposal?.githubData ? 'Connected' : 'Not Connected'} 
              />
            </div>

            {myProposal?.githubData ? (
              <>
                {/* Repo Info Card */}
                <div className="p-3.5 bg-[#F4F5F8] rounded-2xl border border-slate-200/60 my-2 space-y-1.5">
                  <div className="text-[11px] font-bold text-black truncate flex items-center justify-between">
                    <span>{myProposal.githubData.owner}/{myProposal.githubData.repo}</span>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {myProposal.githubData.defaultBranch || 'main'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Language: <strong className="text-black">{myProposal.githubData.primaryLanguage || 'TypeScript'}</strong>
                  </p>
                </div>

                {/* Recent Verified Commits */}
                <div className="space-y-2 mt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Latest Milestone Commits
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {(myProposal.githubData.latestCommits || []).slice(0, 2).map((c, i) => (
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
              </>
            ) : (
              <div className="p-4 bg-[#F4F5F8] rounded-2xl border border-slate-200/60 my-3 text-center space-y-2">
                <GitBranch className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No Repository Linked</p>
                <p className="text-[11px] text-slate-500">
                  Connect your team's GitHub repository during Stage 2 to verify code deliverables and automated commits.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
            <span className="text-slate-400 text-[11px]">Exp 5 &amp; Exp 6 Verification</span>
            <button 
              onClick={() => onNavigateToTab('stages')}
              className="font-bold text-black hover:underline inline-flex items-center gap-1 text-xs cursor-pointer"
            >
              <span>{myProposal?.githubData ? 'Sync Repo' : 'Connect Repo'}</span>
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
                  {myProposal
                    ? `Track ${myProposal.trackNo || currentUser?.trackNo || 7} Group ${String(myProposal.groupNo || currentUser?.groupNo || 1).padStart(2, '0')} progress mapped against Mumbai University SE Mini Project-I syllabus`
                    : `${currentUser?.cohort || 'SE Mini Project-I'} syllabus progression`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80 font-mono font-bold bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
                {currentUser?.cohort || 'Term 2026 • SE COMPS'}
              </span>
            </div>
          </div>

          {/* Real Project Metric Indicators with vertical colored pills */}
          <div className="relative z-10 flex flex-wrap items-center gap-6 sm:gap-10 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-8 rounded-full bg-[#D4F938]" />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                    {currentGate?.title ? currentGate.title.split(':')[0].trim() : (myProposal ? 'Exp 1' : 'Gate 0')}
                  </span>
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
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                    {verifiedGatesCount} / {totalGatesCount}
                  </span>
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
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                    {currentGate?.weekRange || currentGate?.dueDate || 'Week 2'}
                  </span>
                </div>
                <span className="text-[11px] text-white/60 uppercase tracking-wider font-semibold">
                  Next Sign-Off
                </span>
              </div>
            </div>
          </div>

          {/* Milestone Review Columns with Dynamic Active Phase */}
          <div className="relative z-10 pt-4 border-t border-white/10 space-y-3">
            {/* Bars container */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-36">
              {(myProposal?.stageGates || [
                { id: '1', title: 'Exp 1: Synopsis', weekRange: 'W1–2', status: 'in_progress' },
                { id: '2', title: 'Exp 2: Lit Review', weekRange: 'W3–4', status: 'pending' },
                { id: '3', title: 'Exp 3: UML Arch', weekRange: 'W5–6', status: 'pending' },
                { id: '4', title: 'Exp 4: Modules', weekRange: 'W7–8', status: 'pending' },
                { id: '5', title: 'Exp 5: Similarity', weekRange: 'W9–10', status: 'pending' },
                { id: '6', title: 'Exp 6: Testing', weekRange: 'W11–12', status: 'pending' },
                { id: '7', title: 'Exp 7: Defense', weekRange: 'W13–14', status: 'pending' }
              ]).map((gate, idx) => {
                const isApproved = gate.status === 'approved';
                const isInProgress = gate.status === 'in_progress';
                return (
                  <div key={idx} className="flex flex-col items-center justify-end h-full group/bar cursor-pointer" onClick={() => onNavigateToTab('gantt')}>
                    {isInProgress ? (
                      <div className="flex items-end gap-1 w-full justify-center h-full">
                        <div className="w-4 sm:w-6 h-36 rounded-full bg-[#D4F938] shadow-lg shadow-[#D4F938]/30 transition-all duration-300 group-hover/bar:scale-105" />
                        <div className="w-4 sm:w-6 h-28 rounded-full bg-[#C6B5FD] shadow-lg shadow-[#C6B5FD]/20 transition-all duration-300 group-hover/bar:scale-105" />
                      </div>
                    ) : isApproved ? (
                      <div className="w-6 sm:w-10 flex flex-col items-center justify-end h-full">
                        <div className="w-full h-32 rounded-xl bg-[#D4F938]/80 border border-[#D4F938] transition-all duration-300 group-hover/bar:bg-[#D4F938]" />
                      </div>
                    ) : (
                      <div className="w-6 sm:w-10 flex flex-col items-center justify-end h-full">
                        <div 
                          className="w-full h-20 rounded-xl bg-white/10 border border-white/10 relative overflow-hidden transition-all duration-300 group-hover/bar:bg-white/20"
                          style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.06) 5px, rgba(255,255,255,0.06) 10px)'
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Clean Labels row below bars */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center pt-2 border-t border-white/10">
              {(myProposal?.stageGates || [
                { id: '1', title: 'Exp 1: Synopsis', weekRange: 'W1–2', status: 'in_progress' },
                { id: '2', title: 'Exp 2: Lit Review', weekRange: 'W3–4', status: 'pending' },
                { id: '3', title: 'Exp 3: UML Arch', weekRange: 'W5–6', status: 'pending' },
                { id: '4', title: 'Exp 4: Modules', weekRange: 'W7–8', status: 'pending' },
                { id: '5', title: 'Exp 5: Similarity', weekRange: 'W9–10', status: 'pending' },
                { id: '6', title: 'Exp 6: Testing', weekRange: 'W11–12', status: 'pending' },
                { id: '7', title: 'Exp 7: Defense', weekRange: 'W13–14', status: 'pending' }
              ]).map((gate, idx) => {
                const isInProgress = gate.status === 'in_progress';
                return (
                  <div key={idx} className="flex flex-col items-center justify-center min-w-0 px-0.5 cursor-pointer" onClick={() => onNavigateToTab('gantt')}>
                    <span className={`text-[10px] sm:text-[11px] font-bold tracking-tight text-center truncate w-full block ${
                      isInProgress ? 'text-[#D4F938]' : 'text-slate-300'
                    }`}>
                      {gate.title.split(':')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 mt-0.5 block">{gate.weekRange || `W${idx*2 + 1}–${idx*2 + 2}`}</span>
                  </div>
                );
              })}
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
              <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">Similarity Index</h3>
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
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">topic match</span>
            </div>

            <div className="absolute right-4 sm:right-8 top-10 w-28 h-28 rounded-full bg-[#18191E] flex flex-col items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
              <span className="text-lg font-black tracking-tight font-mono text-white">144</span>
              <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">text match</span>
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
              <h3 className="font-extrabold text-[#18191E] text-sm tracking-tight">Cohort Originality Rate</h3>
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
              Topic Cleared
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

        <div className="relative z-10 pt-4 border-t border-white/10 space-y-3">
          {/* Bars container */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-36">
            {[
              { height: 'h-20', isHighlight: false },
              { height: 'h-24', isHighlight: false },
              { height: 'h-16', isHighlight: false },
              { height: 'h-36', isHighlight: true },
              { height: 'h-24', isHighlight: false },
              { height: 'h-28', isHighlight: false },
              { height: 'h-24', isHighlight: false }
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center justify-end h-full group/bar cursor-pointer" onClick={() => onNavigateToTab('gantt')}>
                {col.isHighlight ? (
                  <div className="flex items-end gap-1 w-full justify-center h-full">
                    <div className="w-4 sm:w-6 h-36 rounded-full bg-[#D4F938] shadow-lg shadow-[#D4F938]/30 transition-all duration-300 group-hover/bar:scale-105" />
                    <div className="w-4 sm:w-6 h-28 rounded-full bg-[#C6B5FD] shadow-lg shadow-[#C6B5FD]/20 transition-all duration-300 group-hover/bar:scale-105" />
                  </div>
                ) : (
                  <div className="w-6 sm:w-10 flex flex-col items-center justify-end h-full">
                    <div 
                      className={`w-full ${col.height} rounded-xl bg-white/10 border border-white/10 relative overflow-hidden transition-all duration-300 group-hover/bar:bg-white/20`}
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.06) 5px, rgba(255,255,255,0.06) 10px)'
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Clean Labels row below bars */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center pt-2 border-t border-white/10">
            {[
              { phase: 'Exp 1: Synopsis', week: 'W1–2', isHighlight: false },
              { phase: 'Exp 2: Lit Review', week: 'W3–4', isHighlight: false },
              { phase: 'Exp 3: Survey', week: 'W5–6', isHighlight: false },
              { phase: 'Exp 4: Arch ↗', week: 'W7–8', isHighlight: true },
              { phase: 'Exp 5: Similarity', week: 'W9–10', isHighlight: false },
              { phase: 'Exp 6: Testing', week: 'W11–12', isHighlight: false },
              { phase: 'Exp 7: Defense', week: 'W13–14', isHighlight: false }
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center cursor-pointer" onClick={() => onNavigateToTab('gantt')}>
                <span className={`text-[10px] sm:text-[11px] font-bold tracking-tight text-center line-clamp-1 ${
                  col.isHighlight ? 'text-[#D4F938]' : 'text-slate-300'
                }`}>
                  {col.phase}
                </span>
                <span className="text-[9px] font-mono text-slate-400 mt-0.5">{col.week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
