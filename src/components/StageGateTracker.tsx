import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Stamp, 
  Upload, 
  Edit3, 
  Calendar, 
  Sparkles, 
  GitBranch,
  XCircle,
  RotateCcw,
  Layers,
  ChevronDown,
  FolderGit2
} from 'lucide-react';
import { ProjectProposal, StageGateMilestone, UserRole, GitHubSyncData } from '../types';
import { GitHubSyncPanel } from './GitHubSyncPanel';

interface StageGateTrackerProps {
  proposal: ProjectProposal;
  currentRole: UserRole;
  onUpdateMilestone: (milestoneId: string, updates: Partial<StageGateMilestone>) => void;
  onUpdateGitHubData: (data: GitHubSyncData) => void;
  onAdvanceProposalState?: () => void;
  proposals?: ProjectProposal[];
  onSelectProposal?: (proposalId: string) => void;
  onNavigateToProposals?: () => void;
}

export const StageGateTracker: React.FC<StageGateTrackerProps> = ({
  proposal,
  currentRole,
  onUpdateMilestone,
  onUpdateGitHubData,
  proposals,
  onSelectProposal,
  onNavigateToProposals
}) => {
  const gates = proposal?.stageGates || [];
  const [selectedMilestone, setSelectedMilestone] = useState<StageGateMilestone | null>(
    gates.find(m => m.status === 'in_progress' || m.status === 'submitted') || gates[0] || null
  );

  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  // Stats
  const approvedCount = gates.filter(m => m.status === 'approved').length;
  const totalCount = gates.length;
  const progressPercent = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  if (!proposal || gates.length === 0) {
    return (
      <div className="bg-white rounded-[28px] p-8 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto my-12 space-y-3">
        <p className="text-base font-black text-slate-800">No Stage Gate Milestones Available</p>
        <p className="text-xs text-slate-500">Please select or submit an active proposal with registered stage gates.</p>
        {onNavigateToProposals && (
          <button
            onClick={onNavigateToProposals}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18191E] text-[#D4F938] text-xs font-bold"
          >
            <span>Back to Proposals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  const handleLinkCommitToMilestone = (commitSha: string, commitMsg: string) => {
    if (!selectedMilestone) return;
    const commitUrl = `${proposal.githubData?.repoUrl}/commit/${commitSha}`;
    setDeliverableUrl(commitUrl);
    setSubmissionNotes(`Deliverable commit [${commitSha}]: ${commitMsg}`);
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;

    onUpdateMilestone(selectedMilestone.id, {
      status: 'submitted',
      submissionLink: deliverableUrl || selectedMilestone.submissionLink,
      submissionNotes: submissionNotes || selectedMilestone.submissionNotes,
      submissionDate: new Date().toISOString()
    });
    setDecisionFeedback('Deliverable submitted successfully for faculty review.');
    setTimeout(() => setDecisionFeedback(null), 4000);
  };

  const handleFacultyDecision = (action: 'approve' | 'revision' | 'reject') => {
    if (!selectedMilestone) return;
    const approverName = currentRole === 'coordinator' 
      ? (proposal.coordinatorName || 'Coordinator') 
      : (proposal.guideName || 'Faculty Guide');
    
    if (action === 'approve') {
      onUpdateMilestone(selectedMilestone.id, {
        status: 'approved',
        guideApprovedBy: approverName,
        guideApprovedDate: new Date().toISOString(),
        submissionNotes: revisionNotes ? `Approved notes: ${revisionNotes}` : selectedMilestone.submissionNotes
      });
      setDecisionFeedback(`Milestone approved and signed off by ${approverName}.`);
    } else if (action === 'revision') {
      onUpdateMilestone(selectedMilestone.id, {
        status: 'revision',
        submissionNotes: revisionNotes ? `Revision requested: ${revisionNotes}` : `Revisions suggested by ${approverName}`
      });
      setDecisionFeedback(`Revision request sent to student team.`);
    } else if (action === 'reject') {
      onUpdateMilestone(selectedMilestone.id, {
        status: 'rejected',
        submissionNotes: revisionNotes ? `Rejected: ${revisionNotes}` : `Deliverable rejected by ${approverName}`
      });
      setDecisionFeedback(`Milestone marked as rejected with coordinator remarks.`);
    }

    setRevisionNotes('');
    setTimeout(() => setDecisionFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Project Switcher Bar if multiple proposals */}
      {proposals && proposals.length > 0 && onSelectProposal && (
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700" />
            <span className="font-bold text-slate-500">Visual Stage Gate for:</span>
            <span className="font-extrabold text-[#18191E]">{proposal.title}</span>
            <span className="font-mono text-[11px] bg-[#18191E] text-[#D4F938] px-2 py-0.5 rounded-full font-bold">
              {proposal.projectId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold text-[11px]">Switch Project:</span>
            <select
              value={proposal.id}
              onChange={e => onSelectProposal(e.target.value)}
              className="bg-[#F4F5F8] border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938] cursor-pointer"
            >
              {proposals.map(p => (
                <option key={p.id} value={p.id}>
                  {p.projectId} - {p.title.slice(0, 32)}...
                </option>
              ))}
            </select>
            {onNavigateToProposals && (
              <button
                type="button"
                onClick={onNavigateToProposals}
                className="px-3 py-1.5 rounded-xl bg-[#18191E] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Proposals Directory
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Progress Overview Card */}
      <div className="bg-[#18191E] text-white rounded-[28px] p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4F938]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-[#D4F938] text-black font-extrabold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Stage-Gate Milestone Progression
              </span>
              <span className="text-xs text-white/60">
                Project ID: <strong className="text-white font-mono">{proposal.projectId || 'DBIT-SE-2026-T7-G05'}</strong>
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
              Visual Stage-Gate Milestone Progression
            </h2>
            <p className="text-xs text-white/70 max-w-xl mt-1">
              Structured gates: Topic Approval &rarr; Stage 1 Design (Exp 1-4) &rarr; Stage 2 Dev (Exp 5-6) &rarr; Stage 3 Testing (Exp 7)
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-4 bg-white/10 px-5 py-3 rounded-2xl border border-white/15 backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between gap-6 text-xs">
                <span className="text-white/80 font-medium">Completion Rate</span>
                <span className="font-mono font-black text-[#D4F938] text-base tabular-nums">{progressPercent}%</span>
              </div>
              <div className="w-44 bg-white/20 rounded-full h-2.5 mt-2 overflow-hidden">
                <div 
                  className="bg-[#D4F938] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="border-l border-white/20 pl-4 text-xs font-mono">
              <span className="text-white/60 block text-[10px] uppercase">Verified Gates</span>
              <span className="font-extrabold text-white text-base">{approvedCount} / {totalCount}</span>
            </div>
          </div>
        </div>

        {/* Horizontal 4-Stage Stepper - Dynamically computed from proposal status and gates */}
        {(() => {
          const isTopicApproved = proposal.status === 'approved' || gates[0]?.status === 'approved';
          const isConflict = proposal.status === 'flagged_conflict' || proposal.status === 'coordinator_arbitration';
          
          const gate0Done = isTopicApproved;
          const gate0Active = !gate0Done;

          const stage1Done = gate0Done && gates[1]?.status === 'approved';
          const stage1Active = gate0Done && !stage1Done;

          const stage2Done = stage1Done && (gates[2]?.status === 'approved' || gates[3]?.status === 'approved');
          const stage2Active = stage1Done && !stage2Done;

          const stage3Done = stage2Done && (gates[5]?.status === 'approved' || gates[6]?.status === 'approved');
          const stage3Active = stage2Done && !stage3Done;

          return (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
              {/* Gate 0 */}
              <div className={`rounded-2xl p-4 border transition-all ${
                gate0Active 
                  ? 'bg-white rounded-2xl border-2 border-[#D4F938] text-[#18191E] shadow-sm' 
                  : 'bg-white/5 border-white/10 text-white'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${gate0Active ? 'text-black font-black' : 'text-white'}`}>Gate 0: Topic</span>
                  {gate0Done ? (
                    <span className="w-5 h-5 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                  ) : isConflict ? (
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-xs">
                      !
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-xs animate-pulse">
                      ⏳
                    </span>
                  )}
                </div>
                <p className={`text-[11px] mt-1 ${gate0Active ? 'text-slate-600' : 'text-white/70'}`}>
                  {gate0Done 
                    ? 'Topic Approved & Dispatched' 
                    : isConflict 
                      ? 'Topic Conflict Flagged' 
                      : 'Awaiting Coordinator Approval'}
                </p>
                <span className={`text-[10px] font-mono block mt-1 font-bold ${
                  gate0Done 
                    ? 'text-[#D4F938]' 
                    : gate0Active 
                      ? 'bg-[#D4F938] text-black px-2 py-0.5 rounded-full w-max' 
                      : 'text-amber-400'
                }`}>
                  {gate0Done ? 'Topic Approved' : isConflict ? 'Pitch Defense Needed' : 'Under Review'}
                </span>
              </div>

              {/* Stage 1: Design */}
              <div className={`rounded-2xl p-4 border transition-all ${
                stage1Active 
                  ? 'bg-white rounded-2xl border-2 border-[#D4F938] text-[#18191E] shadow-sm' 
                  : 'bg-white/5 border-white/10 text-white'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${stage1Active ? 'text-black font-black' : gate0Done ? 'text-white' : 'text-white/40'}`}>
                    Stage 1: Design
                  </span>
                  {stage1Done ? (
                    <span className="w-5 h-5 rounded-full bg-[#C6B5FD] text-black flex items-center justify-center font-bold text-xs">
                      ★
                    </span>
                  ) : stage1Active ? (
                    <span className="w-5 h-5 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold text-xs animate-spin">
                      ⚙
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-white/20 text-white/40 flex items-center justify-center text-xs">
                      🔒
                    </span>
                  )}
                </div>
                <p className={`text-[11px] mt-1 ${stage1Active ? 'text-slate-600' : gate0Done ? 'text-white/70' : 'text-white/40'}`}>
                  {stage1Done ? 'Exp 1-4 UML Models Approved' : stage1Active ? 'Exp 1-4 Literature & UML' : 'Locked (Requires Topic Approval)'}
                </p>
                <span className={`text-[10px] font-mono block mt-1 font-bold ${
                  stage1Done ? 'text-[#C6B5FD]' : stage1Active ? 'bg-[#D4F938] text-black px-2 py-0.5 rounded-full w-max' : 'text-white/40'
                }`}>
                  {stage1Done ? 'Review 1 Passed' : stage1Active ? 'Active Sprint' : 'Locked'}
                </span>
              </div>

              {/* Stage 2: Dev */}
              <div className={`rounded-2xl p-4 border transition-all ${
                stage2Active 
                  ? 'bg-white rounded-2xl border-2 border-[#D4F938] text-[#18191E] shadow-sm' 
                  : 'bg-white/5 border-white/10 text-white'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${stage2Active ? 'text-black font-black' : stage1Done ? 'text-white' : 'text-white/40'}`}>
                    Stage 2: Dev
                  </span>
                  {stage2Done ? (
                    <span className="w-5 h-5 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                  ) : stage2Active ? (
                    <span className="w-5 h-5 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold text-xs animate-spin">
                      ⚙
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-white/20 text-white/40 flex items-center justify-center text-xs">
                      🔒
                    </span>
                  )}
                </div>
                <p className={`text-[11px] mt-1 ${stage2Active ? 'text-slate-600' : stage1Done ? 'text-white/70' : 'text-white/40'}`}>
                  {stage2Done ? 'Exp 5-6 Implementation Verified' : stage2Active ? 'Exp 5 Core & GitHub Sync' : 'Locked (Requires Stage 1)'}
                </p>
                <span className={`text-[10px] font-mono block mt-1 font-bold ${
                  stage2Done ? 'text-[#D4F938]' : stage2Active ? 'bg-[#D4F938] text-black px-2 py-0.5 rounded-full w-max' : 'text-white/40'
                }`}>
                  {stage2Done ? 'Stage 2 Passed' : stage2Active ? 'Active Sprint' : 'Locked'}
                </span>
              </div>

              {/* Stage 3: Testing */}
              <div className={`rounded-2xl p-4 border transition-all ${
                stage3Active 
                  ? 'bg-white rounded-2xl border-2 border-[#D4F938] text-[#18191E] shadow-sm' 
                  : 'bg-white/5 border-white/10 text-white'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${stage3Active ? 'text-black font-black' : stage2Done ? 'text-white' : 'text-white/40'}`}>
                    Stage 3: Testing
                  </span>
                  {stage3Done ? (
                    <span className="w-5 h-5 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold text-xs">
                      ★
                    </span>
                  ) : stage3Active ? (
                    <span className="w-5 h-5 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold text-xs animate-spin">
                      ⚙
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-white/20 text-white/40 flex items-center justify-center text-xs">
                      🔒
                    </span>
                  )}
                </div>
                <p className={`text-[11px] mt-1 ${stage3Active ? 'text-slate-600' : stage2Done ? 'text-white/70' : 'text-white/40'}`}>
                  {stage3Done ? 'Exp 7 Integration Complete' : stage3Active ? 'Exp 7 Integration & Review 2' : 'Locked (Requires Stage 2)'}
                </p>
                <span className={`text-[10px] font-mono block mt-1 font-bold ${
                  stage3Done ? 'text-[#D4F938]' : stage3Active ? 'bg-[#D4F938] text-black px-2 py-0.5 rounded-full w-max' : 'text-white/40'
                }`}>
                  {stage3Done ? 'Final Clearance' : stage3Active ? 'Active Sprint' : 'Locked'}
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Main Grid: Milestones List + Selected Milestone Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Milestone Cards List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-[#18191E] uppercase tracking-wider">
              14-Week DBIT SE Project Milestones
            </h3>
            <span className="text-xs text-slate-500">
              Select milestone to view or sign-off
            </span>
          </div>

          {proposal.stageGates.map((m) => {
            const isSelected = selectedMilestone?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMilestone(m)}
                className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'border-[#18191E] bg-white shadow-md ring-2 ring-[#D4F938]'
                    : 'bg-white border-slate-200/80 hover:border-slate-400'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {m.status === 'approved' ? (
                      <span className="w-6 h-6 rounded-full bg-[#C6B5FD] text-black flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : m.status === 'submitted' ? (
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </span>
                    ) : m.status === 'in_progress' ? (
                      <span className="w-6 h-6 rounded-full bg-[#D4F938] text-black flex items-center justify-center shrink-0 font-bold text-xs animate-pulse">
                        ▶
                      </span>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-[#18191E]">
                        {m.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono bg-[#F4F5F8] text-[#18191E] font-bold px-2 py-0.5 rounded-md text-[10px] border border-slate-200">
                          {m.weekRange}
                        </span>
                        <span>Target: {m.dueDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      m.status === 'approved' 
                        ? 'bg-[#C6B5FD] text-black'
                        : m.status === 'submitted'
                          ? 'bg-amber-100 text-amber-900'
                          : m.status === 'in_progress'
                            ? 'bg-[#D4F938] text-black'
                            : 'bg-slate-100 text-slate-600'
                    }`}>
                      {m.status === 'approved' ? 'Signed Off' : m.status === 'submitted' ? 'Awaiting Guide Sign-Off' : m.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Guide signoff stamp snippet if approved */}
                {m.guideApprovedBy && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-700">
                    <Stamp className="w-3.5 h-3.5 text-black" />
                    <span>Digitally Signed by: <strong className="text-black">{m.guideApprovedBy}</strong> on {m.guideApprovedDate ? new Date(m.guideApprovedDate).toLocaleDateString() : 'Verified'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Col: Selected Milestone Details & Digital Sign-off */}
        <div className="space-y-4">
          {selectedMilestone ? (
            <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 sm:p-6 shadow-sm text-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#D4F938] text-black uppercase font-black">
                  Gate Details
                </span>
                <h4 className="text-base font-extrabold text-[#18191E] mt-2">
                  {selectedMilestone.title}
                </h4>
                <div className="flex items-center gap-3 text-slate-500 text-xs mt-1">
                  <span>Schedule: <strong className="text-[#18191E]">{selectedMilestone.weekRange}</strong></span>
                  <span>Target Date: <strong className="text-[#18191E]">{selectedMilestone.dueDate}</strong></span>
                </div>
              </div>

              {/* Current submission status */}
              <div>
                <span className="block font-bold text-[#18191E] mb-1.5 uppercase text-[10px] tracking-wider">
                  Submission Status
                </span>
                <div className="p-3.5 bg-[#F4F5F8] rounded-2xl border border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status:</span>
                    <strong className="uppercase text-xs font-bold text-[#18191E]">{selectedMilestone.status}</strong>
                  </div>

                  {selectedMilestone.submissionLink && (
                    <div className="flex items-center justify-between truncate">
                      <span className="text-slate-500 shrink-0 mr-2">Link:</span>
                      <a
                        href={selectedMilestone.submissionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#18191E] underline font-mono text-xs truncate flex items-center gap-1 font-bold"
                      >
                        <span className="truncate">{selectedMilestone.submissionLink}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}

                  {selectedMilestone.submissionNotes && (
                    <div>
                      <span className="text-slate-500 block text-[10px]">Notes:</span>
                      <p className="text-slate-700 text-xs italic mt-0.5">
                        &ldquo;{selectedMilestone.submissionNotes}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Decision Feedback Banner */}
              {decisionFeedback && (
                <div className="p-3 bg-[#D4F938]/20 border border-[#D4F938] rounded-xl text-xs font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>{decisionFeedback}</span>
                </div>
              )}

              {/* Student ONLY: Submit / Edit Deliverable Action */}
              {currentRole === 'student' && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <span className="font-bold text-[#18191E] block uppercase text-[10px] tracking-wider">
                    Student Deliverable Submission
                  </span>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Deliverable URL / GitHub Link
                      </label>
                      <input
                        type="text"
                        value={deliverableUrl}
                        onChange={e => setDeliverableUrl(e.target.value)}
                        placeholder={selectedMilestone.submissionLink || 'https://github.com/... or Google Drive URL'}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-[#F4F5F8] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Deliverable Notes / Verification Details
                      </label>
                      <textarea
                        rows={2}
                        value={submissionNotes}
                        onChange={e => setSubmissionNotes(e.target.value)}
                        placeholder="Add summary of milestone completion or link GitHub commit SHA..."
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-[#F4F5F8] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmitDeliverable}
                      className="w-full bg-[#D4F938] hover:bg-[#c2e72f] text-black font-extrabold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload &amp; Submit Deliverable</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Faculty Guide / Coordinator Evaluation & Decision Controls (NEVER asks deliverables) */}
              {(currentRole === 'guide' || currentRole === 'coordinator') && (
                <div className="pt-3 border-t border-slate-200 bg-[#18191E] text-white p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#D4F938]" />
                      <span className="text-xs uppercase tracking-wider">
                        {currentRole === 'coordinator' ? 'Coordinator Gate Evaluation' : 'Faculty Guide Review'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                      Role: {currentRole}
                    </span>
                  </div>

                  <p className="text-[11px] text-white/70">
                    Evaluate the student submission below. You can approve the gate, suggest technical revisions, or reject deliverables.
                  </p>

                  {/* Inspection of Student Deliverables */}
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] space-y-1.5">
                    <span className="text-slate-400 font-bold uppercase text-[9px] block">Submitted Artifact:</span>
                    {selectedMilestone.submissionLink ? (
                      <a
                        href={selectedMilestone.submissionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#D4F938] hover:underline flex items-center gap-1.5 truncate font-mono font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{selectedMilestone.submissionLink}</span>
                      </a>
                    ) : (
                      <span className="text-amber-300 font-medium">Awaiting deliverable submission from student team.</span>
                    )}

                    {selectedMilestone.submissionNotes && (
                      <p className="text-slate-300 italic text-[11px] mt-1 pt-1 border-t border-white/10">
                        &ldquo;{selectedMilestone.submissionNotes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Revision / Feedback Remarks Textarea */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1">
                      Review Remarks / Revision Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={revisionNotes}
                      onChange={e => setRevisionNotes(e.target.value)}
                      placeholder="Enter feedback, required revisions, or approval remarks for the student team..."
                      className="w-full px-3 py-2 border border-white/20 rounded-xl text-xs bg-white/10 text-white placeholder:text-white/40 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                    />
                  </div>

                  {/* 3 Clear Decision Actions for Coordinator / Guide */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleFacultyDecision('approve')}
                      className="bg-[#D4F938] hover:bg-[#c2e72f] text-black font-extrabold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                      title="Approve milestone and clear stage gate"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFacultyDecision('revision')}
                      className="bg-amber-400 hover:bg-amber-300 text-black font-extrabold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                      title="Suggest technical revisions for student team"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revisions</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFacultyDecision('reject')}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                      title="Reject submitted deliverables"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-white border border-slate-200/80 rounded-[28px] text-center text-xs text-slate-400">
              Select a milestone to inspect deliverables.
            </div>
          )}
        </div>
      </div>

      {/* Embedded GitHub Sync Panel */}
      <GitHubSyncPanel
        githubData={proposal.githubData}
        onUpdateGitHubData={onUpdateGitHubData}
        onLinkCommitToMilestone={handleLinkCommitToMilestone}
      />
    </div>
  );
};
