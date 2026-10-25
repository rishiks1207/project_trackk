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
      <div className="bg-white rounded-[28px] border border-slate-200/80 p-8 text-center space-y-3 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#D4F938] text-black flex items-center justify-center mx-auto font-bold text-lg">
          ✓
        </div>
        <h3 className="text-base font-bold text-[#18191E]">Zero Unresolved Topic Conflicts</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
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
      <div className="bg-[#18191E] text-white rounded-[28px] p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4F938]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-[#D4F938] text-black font-extrabold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                UC-10: Arbitrate Topic Clash
              </span>
              <span className="text-xs text-white/80 font-bold flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Threshold: Cosine Sim &ge; 0.75</span>
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
              Coordinator Topic Arbitration &amp; Pitch Defense Matrix
            </h2>
            <p className="text-xs text-white/70 max-w-xl mt-1">
              Merit-based side-by-side pitch defense evaluation preventing unfair first-come first-serve allocation (Slide 4, 8, 10)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white/10 px-3.5 py-2 rounded-full border border-white/15">
            <span className="text-white/60">Active Conflict:</span>
            <span className="font-extrabold text-[#D4F938] font-mono">
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
              className={`px-4 py-2.5 rounded-full transition-all cursor-pointer font-bold ${
                activeConflictIndex === idx
                  ? 'bg-[#18191E] text-[#D4F938] shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>Track {p.trackNo} • Group {p.groupNo}</span>
              <span className="ml-2 font-normal opacity-80 truncate max-w-[150px] inline-block align-bottom">{p.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Side-by-Side Pitch Defense & Scope Matrix */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Metric Bar (Obsidian Charcoal Frame) */}
        <div className="bg-[#18191E] text-white p-5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 text-[#D4F938] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-white font-extrabold text-sm">Semantic Overlap Detection Matrix</span>
          </div>

          <div className="flex items-center gap-5">
            <div>
              <span className="text-white/50 text-[10px] block uppercase tracking-wider">Overall Sim</span>
              <span className="text-red-400 font-black text-base font-mono">{(simScore * 100).toFixed(1)}%</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <span className="text-white/50 text-[10px] block uppercase tracking-wider">SBERT Dense</span>
              <span className="text-[#D4F938] font-black text-base font-mono">{(sbertScore * 100).toFixed(1)}%</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <span className="text-white/50 text-[10px] block uppercase tracking-wider">TF-IDF Lexical</span>
              <span className="text-[#C6B5FD] font-black text-base font-mono">{(tfidfScore * 100).toFixed(1)}%</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full border border-red-500/30 text-[10px] font-bold">
              Clash Exceeds 75% Threshold
            </div>
          </div>
        </div>

        {/* Side-by-side Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Column A: Team 1 (e.g. Group 5) */}
          <div className="p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938] font-black uppercase">
                Proposal A: Group {activeProposal.groupNo} (Track {activeProposal.trackNo})
              </span>
              <span className="text-xs font-semibold text-slate-500">{activeProposal.cohort}</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-[#18191E]">
                {activeProposal.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Guide: <strong className="text-black">{activeProposal.guideName}</strong> • Lead: {activeProposal.teamMembers[0]?.name}
              </p>
            </div>

            {/* Abstract */}
            <div className="bg-[#F4F5F8] p-4 rounded-2xl border border-slate-100 text-xs">
              <span className="font-bold text-[#18191E] block mb-1 uppercase text-[10px] tracking-wider">Abstract:</span>
              <p className="text-slate-700 leading-relaxed">
                {activeProposal.abstract}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                Proposed Tech Stack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeProposal.techStack.map((t, idx) => (
                  <span key={idx} className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 200-Word Pitch Defense */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-[#F4F5F8] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#18191E]">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-black" />
                  <span>200-Word Pitch Defense</span>
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#D4F938] text-black font-extrabold">
                  {activeProposal.pitchDefense ? 'Submitted' : 'Pending'}
                </span>
              </div>

              {activeProposal.pitchDefense ? (
                <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3.5 rounded-xl border border-slate-200">
                  &ldquo;{activeProposal.pitchDefense.content}&rdquo;
                </p>
              ) : (
                <div className="text-xs text-slate-400 italic">No pitch defense submitted yet.</div>
              )}

              {activeProposal.pitchDefense?.keyDifferentiator && (
                <div className="text-xs text-slate-800">
                  <strong>Key Differentiator:</strong> {activeProposal.pitchDefense.keyDifferentiator}
                </div>
              )}
            </div>
          </div>

          {/* Column B: Team 2 (e.g. Group 12 or conflicting proposal) */}
          <div className="p-6 sm:p-7 space-y-4 bg-[#F4F5F8]/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#C6B5FD] text-black font-black uppercase">
                Proposal B: {conflictingProposal ? `Group ${conflictingProposal.groupNo} (Track ${conflictingProposal.trackNo})` : 'Clashing Proposal'}
              </span>
              <span className="text-xs font-semibold text-slate-500">{conflictingProposal?.cohort || 'DBIT Cohort'}</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-[#18191E]">
                {conflictingProposal?.title || 'Alternative Duplicate Topic Submission'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Guide: <strong className="text-black">{conflictingProposal?.guideName || 'Ms. Harleen Kaur Plaha'}</strong> • Lead: {conflictingProposal?.teamMembers[0]?.name || 'Student Lead'}
              </p>
            </div>

            {/* Abstract */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs">
              <span className="font-bold text-[#18191E] block mb-1 uppercase text-[10px] tracking-wider">Abstract:</span>
              <p className="text-slate-700 leading-relaxed">
                {conflictingProposal?.abstract || 'Automated platform for college student project title and abstract submission scanning duplicate titles using sentence embeddings.'}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                Proposed Tech Stack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(conflictingProposal?.techStack || ['Python', 'Flask', 'MySQL']).map((t, idx) => (
                  <span key={idx} className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 200-Word Pitch Defense */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#18191E]">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-black" />
                  <span>200-Word Pitch Defense</span>
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                  {conflictingProposal?.pitchDefense ? 'Submitted' : 'Pending'}
                </span>
              </div>

              {conflictingProposal?.pitchDefense ? (
                <p className="text-xs text-slate-700 leading-relaxed italic bg-[#F4F5F8] p-3.5 rounded-xl border border-slate-200">
                  &ldquo;{conflictingProposal.pitchDefense.content}&rdquo;
                </p>
              ) : (
                <div className="text-xs text-slate-400 italic">No pitch defense submitted yet.</div>
              )}

              {conflictingProposal?.pitchDefense?.keyDifferentiator && (
                <div className="text-xs text-slate-800">
                  <strong>Key Differentiator:</strong> {conflictingProposal.pitchDefense.keyDifferentiator}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Student Pitch Defense Submission Form (if student role) */}
        {currentRole === 'student' && (
          <div className="p-6 bg-white border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black" />
              <h4 className="text-xs font-extrabold text-[#18191E] uppercase tracking-wider">
                Submit Your 200-Word Pitch Defense (Group {activeProposal.groupNo})
              </h4>
            </div>
            <textarea
              rows={3}
              value={studentPitchInput}
              onChange={e => setStudentPitchInput(e.target.value)}
              placeholder="State what makes your implementation unique: specific datasets, novel deep learning architectures, unique university integrations, or real-time performance..."
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-2xl bg-[#F4F5F8] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (studentPitchInput.trim()) {
                    onSubmitPitchDefense(activeProposal.id, studentPitchInput.trim());
                    setStudentPitchInput('');
                  }
                }}
                className="bg-[#D4F938] hover:bg-[#c2e72f] text-black font-extrabold text-xs px-5 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Pitch Defense for Coordinator Arbitration</span>
              </button>
            </div>
          </div>
        )}

        {/* Arbitration Verdict Box for Coordinator / Guide */}
        {(currentRole === 'coordinator' || currentRole === 'admin') && (
          <div className="p-6 sm:p-7 bg-[#18191E] text-white border-t border-slate-200">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Project Coordinator Topic Award Actions
              </h4>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Written Coordinator Arbitration Verdict &amp; Audit Trail
                </label>
                <textarea
                  rows={2}
                  value={arbitrationRemarks}
                  onChange={e => setArbitrationRemarks(e.target.value)}
                  placeholder="Log justification for topic award, scope differentiation, or revision instructions..."
                  className="w-full px-4 py-2.5 text-xs border border-white/20 rounded-2xl bg-white/10 text-white placeholder-white/40 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
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
                  className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#c2e72f] text-black text-xs font-black px-5 py-2.5 rounded-full transition-colors shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
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
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-2.5 rounded-full border border-white/20 transition-colors cursor-pointer"
                >
                  <Scale className="w-4 h-4" />
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
                  className="inline-flex items-center gap-2 bg-[#C6B5FD] hover:bg-[#b8a4fc] text-black text-xs font-extrabold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-black" />
                  <span>Request Scope Pivot for Proposal B</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
