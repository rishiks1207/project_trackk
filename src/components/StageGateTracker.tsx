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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(false);
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
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase tracking-wider">
                UML 2.5 StageGateTracking Composite
              </span>
              <span className="text-xs text-zinc-500">
                Project ID: <strong className="text-zinc-900 font-mono">{proposal.projectId || 'DBIT-SE-2026-T7-G05'}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mt-1">
              Visual Stage-Gate Milestone Progression
            </h2>
            <p className="text-xs text-zinc-500">
              Structured gates: Topic Approval &rarr; Stage 1 Design (Exp 1-4) &rarr; Stage 2 Dev (Exp 5-6) &rarr; Stage 3 Testing (Exp 7)
            </p>
          </div>

          {/* Progress ring or bar */}
          <div className="flex items-center gap-4 bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-200">
            <div>
              <div className="flex items-center justify-between gap-6 text-xs">
                <span className="text-zinc-600 font-medium">Completion Rate</span>
                <span className="font-bold text-zinc-900 font-mono">{progressPercent}%</span>
              </div>
              <div className="w-40 bg-zinc-200 rounded-full h-2 mt-1.5 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="border-l border-zinc-200 pl-4 text-xs font-mono">
              <span className="text-zinc-500 block text-[10px]">Verified Gates</span>
              <span className="font-bold text-zinc-900">{approvedCount} / {totalCount}</span>
            </div>
          </div>
        </div>

        {/* Horizontal Stage Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-6 pt-5 border-t border-zinc-100">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800">Gate 0: Topic</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">Passed NLP SBERT screen</p>
            <span className="text-[10px] font-mono text-emerald-900 block mt-1">Topic Locked</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800">Stage 1: Design</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">Exp 1-4 UML models &amp; Survey</p>
            <span className="text-[10px] font-mono text-emerald-900 block mt-1">Review 1 Passed ★</span>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-300 ring-2 ring-blue-500/20">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-900">Stage 2: Dev</span>
              <Clock className="w-4 h-4 text-blue-600 animate-spin" />
            </div>
            <p className="text-[11px] text-blue-800 mt-1">Exp 5 SBERT &amp; GitHub Sync</p>
            <span className="text-[10px] font-mono text-blue-700 block mt-1 font-bold">Active Sprint</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-600">Stage 3: Testing</span>
              <Clock className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Exp 7 Integration &amp; Review 2</p>
            <span className="text-[10px] font-mono text-zinc-500 block mt-1">Due W12–W14</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Milestones List + Selected Milestone Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Milestone Cards List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
              14-Week DBIT SE Project Milestones
            </h3>
            <span className="text-xs text-zinc-500">
              Select milestone to view or sign-off
            </span>
          </div>

          {proposal.stageGates.map((m) => {
            const isSelected = selectedMilestone?.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMilestone(m)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-1 ring-blue-500'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {m.status === 'approved' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : m.status === 'submitted' ? (
                      <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    ) : m.status === 'in_progress' ? (
                      <div className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-zinc-300 shrink-0" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">
                        {m.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono bg-zinc-100 px-1.5 py-0.2 rounded text-[10px]">
                          {m.weekRange}
                        </span>
                        <span>Due: {m.dueDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      m.status === 'approved' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : m.status === 'submitted'
                          ? 'bg-amber-100 text-amber-800'
                          : m.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {m.status === 'approved' ? 'Signed Off' : m.status === 'submitted' ? 'Submitted (Awaiting Guide)' : m.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Guide signoff stamp snippet if approved */}
                {m.guideApprovedBy && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center gap-2 text-[11px] text-emerald-700">
                    <Stamp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Digitally Signed by: <strong>{m.guideApprovedBy}</strong> on {m.guideApprovedDate ? new Date(m.guideApprovedDate).toLocaleDateString() : 'Verified'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Col: Selected Milestone Details & Digital Sign-off */}
        <div className="space-y-4">
          {selectedMilestone ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs text-xs space-y-4">
              <div className="border-b border-zinc-100 pb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 uppercase font-semibold">
                  Gate Details
                </span>
                <h4 className="text-sm font-bold text-zinc-900 mt-1">
                  {selectedMilestone.title}
                </h4>
                <div className="flex items-center gap-3 text-zinc-500 text-[11px] mt-1">
                  <span>Schedule: <strong>{selectedMilestone.weekRange}</strong></span>
                  <span>Target Date: <strong>{selectedMilestone.dueDate}</strong></span>
                </div>
              </div>

              {/* Current submission status */}
              <div>
                <span className="block font-semibold text-zinc-700 mb-1">
                  Submission Status
                </span>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Status:</span>
                    <strong className="uppercase text-[11px] text-zinc-800">{selectedMilestone.status}</strong>
                  </div>

                  {selectedMilestone.submissionLink && (
                    <div className="flex items-center justify-between truncate">
                      <span className="text-zinc-500 shrink-0 mr-2">Link:</span>
                      <a
                        href={selectedMilestone.submissionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-mono text-[11px] truncate flex items-center gap-1"
                      >
                        <span className="truncate">{selectedMilestone.submissionLink}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}

                  {selectedMilestone.submissionNotes && (
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Notes:</span>
                      <p className="text-zinc-700 text-[11px] italic mt-0.5">
                        &ldquo;{selectedMilestone.submissionNotes}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Student Submit / Edit Deliverable Action */}
              <div className="pt-2 border-t border-zinc-100 space-y-3">
                <span className="font-semibold text-zinc-800 block">
                  Deliverable Submission
                </span>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-zinc-600 mb-1">
                      Deliverable URL / GitHub Link
                    </label>
                    <input
                      type="text"
                      value={deliverableUrl}
                      onChange={e => setDeliverableUrl(e.target.value)}
                      placeholder={selectedMilestone.submissionLink || 'https://github.com/... or Google Drive URL'}
                      className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-600 mb-1">
                      Deliverable Notes / Verification Details
                    </label>
                    <textarea
                      rows={2}
                      value={submissionNotes}
                      onChange={e => setSubmissionNotes(e.target.value)}
                      placeholder="Add summary of milestone completion or link GitHub commit SHA..."
                      className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitDeliverable}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload &amp; Submit Deliverable</span>
                  </button>
                </div>
              </div>

              {/* Faculty Guide / Coordinator Sign-Off Controls */}
              {(currentRole === 'guide' || currentRole === 'coordinator') && (
                <div className="pt-3 border-t border-zinc-200 bg-purple-50/60 p-3 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-1.5 text-purple-900 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span>Faculty Gate Sign-Off (Role: {currentRole})</span>
                  </div>
                  <p className="text-[11px] text-purple-700 mb-3">
                    Sign off on deliverable or request technical revisions.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleFacultySignOff(selectedMilestone.id, true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <Stamp className="w-3.5 h-3.5" />
                      <span>Approve &amp; Sign</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFacultySignOff(selectedMilestone.id, false)}
                      className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors"
                    >
                      Request Revision
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl text-center text-xs text-zinc-400">
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
