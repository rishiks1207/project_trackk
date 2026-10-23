import React, { useState } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MessageSquare,
  ArrowRight,
  Send
} from 'lucide-react';
import { ProjectProposal, UserRole } from '../types';

interface ConflictResolutionDashboardProps {
  proposals: ProjectProposal[];
  currentRole: UserRole;
  onArbitrateConflict: (
    teamAId: string, 
    teamBId: string, 
    decision: 'award_a' | 'award_b' | 'approve_both_split_scope' | 'request_revision_b',
    remarks: string
  ) => void;
  onSubmitPitchDefense: (proposalId: string, pitchText: string) => void;
}

export const ConflictResolutionDashboard: React.FC<ConflictResolutionDashboardProps> = ({
  proposals,
  currentRole,
  onArbitrateConflict,
  onSubmitPitchDefense
}) => {
  // Find clashing proposals or flagged conflicts
  const flaggedProposals = proposals.filter(
    p => p.status === 'flagged_conflict' || p.status === 'coordinator_arbitration' || p.similarityData?.isConflict
  );

  const [activeConflictIndex, setActiveConflictIndex] = useState(0);
  const [arbitrationRemarks, setArbitrationRemarks] = useState(
    'Group 05 provides full SBERT contextual embeddings and visual stage-gate tracking aligned with DBIT curriculum. Group 12 is advised to pivot to administrative exam room allocation to avoid duplicate effort.'
  );
  const [studentPitchInput, setStudentPitchInput] = useState('');

  const activeProposal = flaggedProposals[activeConflictIndex] || flaggedProposals[0];
  const conflictingProposal = activeProposal?.conflictWithId
    ? proposals.find(p => p.id === activeProposal.conflictWithId)
    : proposals.find(p => p.id !== activeProposal?.id);

  if (flaggedProposals.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-zinc-900">Zero Unresolved Topic Conflicts</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          All submitted proposals are currently unique (Similarity &lt; 0.75 threshold) or have been arbitrated by the Project Coordinator.
        </p>
      </div>
    );
  }

  const simScore = activeProposal?.similarityData?.overallScore || 0.84;
  const sbertScore = activeProposal?.similarityData?.sbertScore || 0.88;
  const tfidfScore = activeProposal?.similarityData?.tfidfScore || 0.78;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase tracking-wider">
                UC-10: Arbitrate Topic Clash
              </span>
              <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Threshold: Cosine Sim &ge; 0.75</span>
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mt-1">
              Expert-in-the-Loop Conflict Queue &amp; Side-by-Side Pitch Defense
            </h2>
            <p className="text-xs text-zinc-500">
              Merit-based side-by-side pitch defense evaluation preventing unfair first-come first-serve allocation (Slide 4, 8, 10)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500">Active Conflict:</span>
            <span className="font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-300 font-mono">
              {activeConflictIndex + 1} of {flaggedProposals.length}
            </span>
          </div>
        </div>
      </div>

      {/* Clashing Proposal Selector Tabs */}
      {flaggedProposals.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar text-xs">
          {flaggedProposals.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveConflictIndex(idx)}
              className={`px-3.5 py-2 rounded-xl border text-left transition-all ${
                activeConflictIndex === idx
                  ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="text-[10px] opacity-80">Track {p.trackNo} • Group {p.groupNo}</div>
              <div className="truncate max-w-[200px] font-bold">{p.title}</div>
            </button>
          ))}
        </div>
      )}

      {/* Side-by-Side Pitch Defense & Scope Matrix */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        {/* Metric Bar */}
        <div className="bg-zinc-900 text-white p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="text-zinc-200 font-semibold">Semantic Overlap Detection Matrix</span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-zinc-400 text-[10px] block">Overall Sim</span>
              <span className="text-red-400 font-bold text-sm">{(simScore * 100).toFixed(1)}%</span>
            </div>
            <div className="h-6 w-px bg-zinc-700" />
            <div>
              <span className="text-zinc-400 text-[10px] block">SBERT Dense</span>
              <span className="text-blue-400 font-bold">{(sbertScore * 100).toFixed(1)}%</span>
            </div>
            <div className="h-6 w-px bg-zinc-700" />
            <div>
              <span className="text-zinc-400 text-[10px] block">TF-IDF Lexical</span>
              <span className="text-emerald-400 font-bold">{(tfidfScore * 100).toFixed(1)}%</span>
            </div>
            <div className="h-6 w-px bg-zinc-700" />
            <div className="bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800 text-[10px]">
              Clash Exceeds 75%
            </div>
          </div>
        </div>

        {/* Side-by-side Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
          {/* Column A: Team 1 (e.g. Group 5) */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">
                Proposal A: Group {activeProposal.groupNo} (Track {activeProposal.trackNo})
              </span>
              <span className="text-xs font-semibold text-zinc-500">{activeProposal.cohort}</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-900">
                {activeProposal.title}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Guide: <strong className="text-zinc-700">{activeProposal.guideName}</strong> • Lead: {activeProposal.teamMembers[0]?.name}
              </p>
            </div>

            {/* Abstract */}
            <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 text-xs">
              <span className="font-semibold text-zinc-700 block mb-1">Abstract:</span>
              <p className="text-zinc-600 line-clamp-4 leading-relaxed">
                {activeProposal.abstract}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <span className="text-[11px] font-semibold text-zinc-500 block mb-1.5 uppercase">
                Proposed Tech Stack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeProposal.techStack.map((t, idx) => (
                  <span key={idx} className="bg-zinc-100 text-zinc-800 text-[11px] px-2 py-0.5 rounded border border-zinc-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 200-Word Pitch Defense */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>200-Word Pitch Defense</span>
                </span>
                <span className="text-[10px] text-blue-700 font-mono">
                  {activeProposal.pitchDefense ? 'Submitted' : 'Pending Submission'}
                </span>
              </div>

              {activeProposal.pitchDefense ? (
                <p className="text-xs text-zinc-700 leading-relaxed italic bg-white p-3 rounded-lg border border-blue-100">
                  &ldquo;{activeProposal.pitchDefense.content}&rdquo;
                </p>
              ) : (
                <div className="text-xs text-zinc-400 italic">No pitch defense submitted yet.</div>
              )}

              {activeProposal.pitchDefense?.keyDifferentiator && (
                <div className="text-[11px] text-blue-800">
                  <strong>Key Differentiator:</strong> {activeProposal.pitchDefense.keyDifferentiator}
                </div>
              )}
            </div>
          </div>

          {/* Column B: Team 2 (e.g. Group 12 or conflicting proposal) */}
          <div className="p-6 space-y-4 bg-zinc-50/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                Proposal B: {conflictingProposal ? `Group ${conflictingProposal.groupNo} (Track ${conflictingProposal.trackNo})` : 'Clashing Proposal'}
              </span>
              <span className="text-xs font-semibold text-zinc-500">{conflictingProposal?.cohort || 'DBIT Cohort'}</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-zinc-900">
                {conflictingProposal?.title || 'Alternative Duplicate Topic Submission'}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Guide: <strong className="text-zinc-700">{conflictingProposal?.guideName || 'Ms. Harleen Kaur Plaha'}</strong> • Lead: {conflictingProposal?.teamMembers[0]?.name || 'Student Lead'}
              </p>
            </div>

            {/* Abstract */}
            <div className="bg-white p-3.5 rounded-xl border border-zinc-200 text-xs">
              <span className="font-semibold text-zinc-700 block mb-1">Abstract:</span>
              <p className="text-zinc-600 line-clamp-4 leading-relaxed">
                {conflictingProposal?.abstract || 'Automated platform for college student project title and abstract submission scanning duplicate titles using sentence embeddings.'}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <span className="text-[11px] font-semibold text-zinc-500 block mb-1.5 uppercase">
                Proposed Tech Stack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(conflictingProposal?.techStack || ['Python', 'Flask', 'MySQL']).map((t, idx) => (
                  <span key={idx} className="bg-white text-zinc-800 text-[11px] px-2 py-0.5 rounded border border-zinc-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 200-Word Pitch Defense */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>200-Word Pitch Defense</span>
                </span>
                <span className="text-[10px] text-amber-700 font-mono">
                  {conflictingProposal?.pitchDefense ? 'Submitted' : 'Pending Submission'}
                </span>
              </div>

              {conflictingProposal?.pitchDefense ? (
                <p className="text-xs text-zinc-700 leading-relaxed italic bg-white p-3 rounded-lg border border-amber-100">
                  &ldquo;{conflictingProposal.pitchDefense.content}&rdquo;
                </p>
              ) : (
                <div className="text-xs text-zinc-400 italic">No pitch defense submitted yet.</div>
              )}

              {conflictingProposal?.pitchDefense?.keyDifferentiator && (
                <div className="text-[11px] text-amber-800">
                  <strong>Key Differentiator:</strong> {conflictingProposal.pitchDefense.keyDifferentiator}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Arbitration Verdict Box for Coordinator / Guide */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-200">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
              Faculty Coordinator Arbitration Actions (Prof. Meenal Kulkarni / Mr. Nazareth Remedios)
            </h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Written Arbitration Remarks &amp; Audit Trail
              </label>
              <textarea
                rows={2}
                value={arbitrationRemarks}
                onChange={e => setArbitrationRemarks(e.target.value)}
                placeholder="Log justification for topic award, scope differentiation, or revision instructions..."
                className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onArbitrateConflict(
                  activeProposal.id, 
                  conflictingProposal?.id || '', 
                  'award_a', 
                  arbitrationRemarks
                )}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Award Topic to Proposal A (Group {activeProposal.groupNo})</span>
              </button>

              <button
                type="button"
                onClick={() => onArbitrateConflict(
                  activeProposal.id, 
                  conflictingProposal?.id || '', 
                  'approve_both_split_scope', 
                  arbitrationRemarks
                )}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-2xs"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Approve Both with Distinct Partitioned Scopes</span>
              </button>

              <button
                type="button"
                onClick={() => onArbitrateConflict(
                  activeProposal.id, 
                  conflictingProposal?.id || '', 
                  'request_revision_b', 
                  arbitrationRemarks
                )}
                className="inline-flex items-center gap-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <XCircle className="w-3.5 h-3.5 text-zinc-600" />
                <span>Request Scope Pivot for Proposal B</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
