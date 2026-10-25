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
  GitBranch
} from 'lucide-react';
import { ProjectProposal, StageGateMilestone, UserRole, GitHubSyncData } from '../types';
import { GitHubSyncPanel } from './GitHubSyncPanel';

interface StageGateTrackerProps {
  proposal: ProjectProposal;
  currentRole: UserRole;
  onUpdateMilestone: (milestoneId: string, updates: Partial<StageGateMilestone>) => void;
  onUpdateGitHubData: (data: GitHubSyncData) => void;
  onAdvanceProposalState?: () => void;
}

export const StageGateTracker: React.FC<StageGateTrackerProps> = ({
  proposal,
  currentRole,
  onUpdateMilestone,
  onUpdateGitHubData
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<StageGateMilestone | null>(
    proposal.stageGates.find(m => m.status === 'in_progress' || m.status === 'submitted') || proposal.stageGates[0] || null
  );

  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  // Stats
  const approvedCount = proposal.stageGates.filter(m => m.status === 'approved').length;
  const totalCount = proposal.stageGates.length;
  const progressPercent = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

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
  };

  const handleFacultySignOff = (milestoneId: string, approve: boolean) => {
    const approverName = currentRole === 'coordinator' ? proposal.coordinatorName : proposal.guideName;
    
    if (approve) {
      onUpdateMilestone(milestoneId, {
        status: 'approved',
        guideApprovedBy: approverName,
        guideApprovedDate: new Date().toISOString()
      });
    } else {
      onUpdateMilestone(milestoneId, {
        status: 'revision',
        submissionNotes: 'Revision requested by ' + approverName
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Progress Overview Card */}
      <div className="bg-[#18191E] text-white rounded-[28px] p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4F938]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-[#D4F938] text-black font-extrabold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                UML 2.5 Stage-Gate Tracking
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

        {/* Horizontal 4-Stage Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Gate 0: Topic</span>
              <span className="w-5 h-5 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold">
                ✓
              </span>
            </div>
            <p className="text-[11px] text-white/70 mt-1">Passed NLP SBERT screen</p>
            <span className="text-[10px] font-mono text-[#D4F938] block mt-1 font-bold">Topic Locked</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Stage 1: Design</span>
              <span className="w-5 h-5 rounded-full bg-[#C6B5FD] text-black flex items-center justify-center font-bold">
                ★
              </span>
            </div>
            <p className="text-[11px] text-white/70 mt-1">Exp 1-4 UML models &amp; Survey</p>
            <span className="text-[10px] font-mono text-[#C6B5FD] block mt-1 font-bold">Review 1 Passed</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-[#D4F938] text-[#18191E] shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#18191E]">Stage 2: Dev</span>
              <span className="w-5 h-5 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold text-xs animate-spin">
                ⚙
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">Exp 5 SBERT &amp; GitHub Sync</p>
            <span className="text-[10px] font-mono text-black font-extrabold block mt-1 bg-[#D4F938] px-2 py-0.5 rounded-full w-max">
              Active Sprint
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white/60">Stage 3: Testing</span>
              <span className="w-5 h-5 rounded-full border border-white/20 text-white/40 flex items-center justify-center text-xs">
                3
              </span>
            </div>
            <p className="text-[11px] text-white/50 mt-1">Exp 7 Integration &amp; Review 2</p>
            <span className="text-[10px] font-mono text-white/40 block mt-1">Due W12–W14</span>
          </div>
        </div>
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

              {/* Student Submit / Edit Deliverable Action */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="font-bold text-[#18191E] block uppercase text-[10px] tracking-wider">
                  Deliverable Submission
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

              {/* Faculty Guide / Coordinator Sign-Off Controls */}
              {(currentRole === 'guide' || currentRole === 'coordinator') && (
                <div className="pt-3 border-t border-slate-200 bg-[#18191E] text-white p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#D4F938]" />
                    <span>Faculty Gate Sign-Off (Role: {currentRole})</span>
                  </div>
                  <p className="text-[11px] text-white/70">
                    Sign off on deliverable or request technical revisions.
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleFacultySignOff(selectedMilestone.id, true)}
                      className="bg-[#D4F938] hover:bg-[#c2e72f] text-black font-extrabold py-2 px-3 rounded-full text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Stamp className="w-3.5 h-3.5" />
                      <span>Approve &amp; Sign</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFacultySignOff(selectedMilestone.id, false)}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-3 rounded-full text-xs transition-colors cursor-pointer"
                    >
                      Request Revision
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
