import React, { useState, useEffect } from 'react';
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
  Send, 
  Edit3, 
  X, 
  Check, 
  Filter, 
  Search, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight,
  GitBranch,
  Users
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
  onSubmitPitchDefense: (
    proposalId: string, 
    pitchText: string, 
    keyDifferentiator?: string, 
    targetStack?: string
  ) => void;
}

export const ConflictResolutionDashboard: React.FC<ConflictResolutionDashboardProps> = ({
  proposals,
  currentRole,
  onArbitrateConflict,
  onSubmitPitchDefense
}) => {
  // Navigation mode: 'list' (topic arbitrations list) or 'defense' (pitch defense details)
  const [viewMode, setViewMode] = useState<'list' | 'defense'>('list');

  // Find clashing proposals or flagged conflicts
  const flaggedProposals = proposals.filter(
    p => p.status === 'flagged_conflict' || p.status === 'coordinator_arbitration' || p.similarityData?.isConflict
  );

  // Selected proposal ID for inspection & arbitration
  const [selectedProposalId, setSelectedProposalId] = useState<string>(() => {
    return flaggedProposals[0]?.id || proposals[0]?.id || '';
  });

  const [filterView, setFilterView] = useState<'all' | 'conflicts' | 'submitted' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [arbitrationRemarks, setArbitrationRemarks] = useState(
    'Group 05 provides full SBERT contextual embeddings and visual stage-gate tracking aligned with DBIT curriculum. Group 12 is advised to pivot to administrative exam room allocation to avoid duplicate effort.'
  );

  // Student pitch inputs for submission & editing (STUDENT ROLE ONLY)
  const [isEditingPitch, setIsEditingPitch] = useState(false);
  const [pitchInputText, setPitchInputText] = useState('');
  const [keyDiffInput, setKeyDiffInput] = useState('');
  const [targetStackInput, setTargetStackInput] = useState('');

  // Find the active proposal
  const activeProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0];

  // Conflicting proposal if active proposal has conflict
  const conflictingProposal = activeProposal?.conflictWithId
    ? proposals.find(p => p.id === activeProposal.conflictWithId)
    : (activeProposal?.similarityData?.isConflict
      ? proposals.find(p => p.id !== activeProposal?.id)
      : undefined);

  // Update inputs whenever activeProposal changes
  useEffect(() => {
    if (activeProposal) {
      setPitchInputText(activeProposal.pitchDefense?.content || '');
      setKeyDiffInput(activeProposal.pitchDefense?.keyDifferentiator || '');
      setTargetStackInput(activeProposal.pitchDefense?.targetStack || activeProposal.techStack.join(', '));
      setIsEditingPitch(false);
    }
  }, [activeProposal?.id]);

  // If no proposals in database
  if (!activeProposal) {
    return (
      <div className="bg-white rounded-[28px] border border-slate-200/80 p-8 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#D4F938] text-black flex items-center justify-center mx-auto font-bold text-lg">
          ✓
        </div>
        <h3 className="text-base font-bold text-[#18191E]">No Proposals Submitted Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Student engineering proposals will appear here once submitted.
        </p>
      </div>
    );
  }

  const hasSubmittedPitch = Boolean(activeProposal.pitchDefense && activeProposal.pitchDefense.content.trim().length > 0);
  const simScore = activeProposal?.similarityData?.overallScore || 0.84;
  const sbertScore = activeProposal?.similarityData?.sbertScore || 0.88;
  const tfidfScore = activeProposal?.similarityData?.tfidfScore || 0.78;

  // Student saving their pitch (STUDENTS ONLY)
  const handleSavePitch = () => {
    if (!pitchInputText.trim() || currentRole !== 'student') return;
    onSubmitPitchDefense(
      activeProposal.id,
      pitchInputText.trim(),
      keyDiffInput.trim() || 'Contextual Embeddings & Stage-Gate Flow',
      targetStackInput.trim() || activeProposal.techStack.join(', ')
    );
    setIsEditingPitch(false);
  };

  // Filter proposals for list view
  const filteredList = proposals.filter(p => {
    const isConflict = p.status === 'flagged_conflict' || p.status === 'coordinator_arbitration' || p.similarityData?.isConflict;
    const hasPitch = Boolean(p.pitchDefense && p.pitchDefense.content.trim().length > 0);
    const isResolved = p.status === 'approved' || p.lockedTopic;

    if (filterView === 'conflicts' && !isConflict) return false;
    if (filterView === 'submitted' && !hasPitch) return false;
    if (filterView === 'resolved' && !isResolved) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTrack = `track ${p.trackNo}`.includes(q);
      const matchGroup = `group ${p.groupNo}`.includes(q);
      const matchGuide = (p.guideName || '').toLowerCase().includes(q);
      return matchTitle || matchTrack || matchGroup || matchGuide;
    }

    return true;
  });

  // =========================================================================
  // VIEW 1: TOPIC ARBITRATIONS LIST VIEW (DEFAULT)
  // =========================================================================
  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-[#18191E] text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4F938]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-[#D4F938] text-black font-extrabold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  {currentRole === 'coordinator' ? 'Coordinator Topic Arbitration Queue' : 'Topic Arbitration & Pitch Defenses'}
                </span>
                {flaggedProposals.length > 0 && (
                  <span className="text-xs text-white/90 font-bold flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>{flaggedProposals.length} Semantic Clash Detected</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
                Topic Arbitration &amp; Conflict Defense Directory
              </h2>
              <p className="text-xs text-white/70 max-w-xl mt-1">
                Select any topic clash or proposal below to inspect the side-by-side novelty matrix, review student 200-word pitch defenses, and execute coordinator arbitration decisions.
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="bg-white/10 border border-white/15 px-3.5 py-2 rounded-2xl text-center">
                <span className="text-[10px] text-white/60 uppercase font-bold block">Total Topics</span>
                <span className="text-base font-black text-white">{proposals.length}</span>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 px-3.5 py-2 rounded-2xl text-center">
                <span className="text-[10px] text-red-300 uppercase font-bold block">Clashes (Sim &ge; 75%)</span>
                <span className="text-base font-black text-red-400">{flaggedProposals.length}</span>
              </div>
              <div className="bg-[#D4F938]/20 border border-[#D4F938]/30 px-3.5 py-2 rounded-2xl text-center">
                <span className="text-[10px] text-[#D4F938] uppercase font-bold block">Pitches Ready</span>
                <span className="text-base font-black text-[#D4F938]">
                  {proposals.filter(p => p.pitchDefense?.content).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            <button
              onClick={() => setFilterView('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterView === 'all'
                  ? 'bg-[#18191E] text-[#D4F938] shadow-xs'
                  : 'bg-[#F4F5F8] text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Topics ({proposals.length})
            </button>
            <button
              onClick={() => setFilterView('conflicts')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterView === 'conflicts'
                  ? 'bg-[#18191E] text-[#D4F938] shadow-xs'
                  : 'bg-[#F4F5F8] text-slate-700 hover:bg-slate-200'
              }`}
            >
              Flagged Conflicts ({flaggedProposals.length})
            </button>
            <button
              onClick={() => setFilterView('submitted')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterView === 'submitted'
                  ? 'bg-[#18191E] text-[#D4F938] shadow-xs'
                  : 'bg-[#F4F5F8] text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pitches Submitted ({proposals.filter(p => p.pitchDefense?.content).length})
            </button>
            <button
              onClick={() => setFilterView('resolved')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterView === 'resolved'
                  ? 'bg-[#18191E] text-[#D4F938] shadow-xs'
                  : 'bg-[#F4F5F8] text-slate-700 hover:bg-slate-200'
              }`}
            >
              Resolved ({proposals.filter(p => p.status === 'approved' || p.lockedTopic).length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by topic, group, or track..."
              className="w-full bg-[#F4F5F8] pl-10 pr-4 py-2 text-xs rounded-full border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938] font-medium"
            />
          </div>
        </div>

        {/* Topic Arbitration Cards List */}
        <div className="space-y-3.5">
          {filteredList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700">No topic arbitrations match the selected filter.</p>
              <p className="text-xs text-slate-400">Try changing the filter or search criteria above.</p>
            </div>
          ) : (
            filteredList.map((prop) => {
              const otherProp = prop.conflictWithId 
                ? proposals.find(p => p.id === prop.conflictWithId)
                : (prop.similarityData?.isConflict ? proposals.find(p => p.id !== prop.id) : undefined);
              
              const isClash = prop.status === 'flagged_conflict' || prop.status === 'coordinator_arbitration' || prop.similarityData?.isConflict;
              const hasPitch = Boolean(prop.pitchDefense && prop.pitchDefense.content.trim().length > 0);
              const otherHasPitch = Boolean(otherProp?.pitchDefense && otherProp.pitchDefense.content.trim().length > 0);
              const isLocked = prop.lockedTopic || prop.status === 'approved';

              return (
                <div 
                  key={prop.id}
                  onClick={() => {
                    setSelectedProposalId(prop.id);
                    setViewMode('defense');
                  }}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Topic Title & Details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#18191E] text-[#D4F938]">
                          Group {String(prop.groupNo).padStart(2, '0')} (Track {prop.trackNo})
                        </span>
                        
                        {otherProp && (
                          <>
                            <span className="text-[11px] font-bold text-slate-400">vs</span>
                            <span className="font-mono text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#C6B5FD] text-black">
                              Group {String(otherProp.groupNo).padStart(2, '0')} (Track {otherProp.trackNo})
                            </span>
                          </>
                        )}

                        <span className="text-xs text-slate-500 font-medium">
                          • {prop.domain} • {prop.cohort}
                        </span>

                        {isClash ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span>Semantic Clash Detected</span>
                          </span>
                        ) : isLocked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Topic Approved &amp; Awarded</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            <Clock className="w-3 h-3" />
                            <span>Standard Proposal</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {prop.title}
                      </h3>

                      {otherProp && (
                        <p className="text-xs text-slate-500">
                          <strong className="text-slate-700">Clashing with:</strong> {otherProp.title}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <span>Guide: <strong className="text-slate-800">{prop.guideName}</strong></span>
                        {otherProp && (
                          <span>Opposing Guide: <strong className="text-slate-800">{otherProp.guideName}</strong></span>
                        )}
                      </div>
                    </div>

                    {/* Right: Scores, Pitch Status & CTA Button */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      
                      {/* Metric Badges */}
                      <div className="flex items-center gap-2">
                        {prop.similarityData && (
                          <div className="flex items-center gap-2 bg-[#F4F5F8] px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block uppercase">SBERT</span>
                              <span className={`font-mono font-bold ${(prop.similarityData.sbertScore || 0) >= 0.75 ? 'text-red-600 font-black' : 'text-slate-800'}`}>
                                {Math.round((prop.similarityData.sbertScore || 0) * 100)}%
                              </span>
                            </div>
                            <div className="h-5 w-px bg-slate-300" />
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block uppercase">Lexical</span>
                              <span className="font-mono font-bold text-slate-800">
                                {Math.round((prop.similarityData.tfidfScore || 0) * 100)}%
                              </span>
                            </div>
                          </div>
                        )}

                        <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                          hasPitch
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {hasPitch ? '✓ Pitch Submitted' : '⏳ Awaiting Pitch'}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProposalId(prop.id);
                          setViewMode('defense');
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18191E] group-hover:bg-black text-[#D4F938] text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <span>{currentRole === 'coordinator' ? 'Review Pitch & Arbitrate' : 'Open Pitch Defense'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>

                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DETAILED PITCH DEFENSE & ARBITRATION MATRIX
  // =========================================================================
  return (
    <div className="space-y-6">
      
      {/* Top Navigation & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4F5F8] hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors border border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Arbitrations List</span>
          </button>
          
          <div className="h-4 w-px bg-slate-300 hidden sm:block" />

          <div className="text-xs font-semibold text-slate-600">
            Arbitration: <span className="text-slate-900 font-bold">Group {activeProposal.groupNo}</span>
            {conflictingProposal && (
              <span> vs <span className="text-slate-900 font-bold">Group {conflictingProposal.groupNo}</span></span>
            )}
          </div>
        </div>

        {/* Quick Proposal Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 shrink-0">Switch Topic:</label>
          <select
            value={activeProposal.id}
            onChange={(e) => setSelectedProposalId(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold bg-[#F4F5F8] border border-slate-200 rounded-full focus:bg-white focus:outline-hidden text-slate-800 cursor-pointer"
          >
            {proposals.map(p => (
              <option key={p.id} value={p.id}>
                Group {p.groupNo} (Track {p.trackNo}): {p.title.substring(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Pitch Defense Matrix Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Metric Header Banner */}
        <div className="p-6 bg-[#18191E] text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F938] text-black flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Semantic Overlap &amp; Topic Clash Matrix</h3>
              <p className="text-xs text-white/70">{activeProposal.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider">Overall Sim</span>
                <span className="font-mono font-black text-sm text-red-400">
                  {Math.round(simScore * 100)}%
                </span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider">SBERT Dense</span>
                <span className="font-mono font-black text-sm text-[#D4F938]">
                  {Math.round(sbertScore * 100)}%
                </span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider">TF-IDF Lexical</span>
                <span className="font-mono font-black text-sm text-[#C6B5FD]">
                  {Math.round(tfidfScore * 100)}%
                </span>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
              Potential Overlap Detected
            </span>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* ================= COLUMN A: PROPOSAL A ================= */}
          <div className="p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938] font-black uppercase">
                Proposal A: Group {String(activeProposal.groupNo).padStart(2, '0')} (Track {activeProposal.trackNo})
              </span>
              <span className="text-xs font-semibold text-slate-500">{activeProposal.cohort}</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-[#18191E]">
                {activeProposal.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Guide: <strong className="text-black">{activeProposal.guideName}</strong> • Lead: {activeProposal.teamMembers[0]?.name || 'Student Lead'}
              </p>
            </div>

            {/* Abstract */}
            <div className="bg-[#F4F5F8] p-4 rounded-2xl border border-slate-200 text-xs">
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
                  <span key={idx} className="bg-[#F4F5F8] text-black text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 200-Word Pitch Defense Artifact */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-[#F4F5F8]/50 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#18191E]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#18191E]" />
                  <span>200-Word Novelty Pitch Defense</span>
                </span>
                {hasSubmittedPitch ? (
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Submitted Artifact
                  </span>
                ) : (
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                    Pending
                  </span>
                )}
              </div>

              {hasSubmittedPitch ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-800 font-medium leading-relaxed italic bg-white p-3.5 rounded-xl border border-slate-200">
                    &ldquo;{activeProposal.pitchDefense?.content}&rdquo;
                  </p>

                  {activeProposal.pitchDefense?.keyDifferentiator && (
                    <div className="text-xs bg-white p-3 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block font-black uppercase text-[10px] text-slate-400 mb-0.5">
                        Key Differentiator:
                      </strong>
                      <span className="text-slate-700">{activeProposal.pitchDefense.keyDifferentiator}</span>
                    </div>
                  )}

                  {activeProposal.pitchDefense?.targetStack && (
                    <div className="text-xs bg-white p-3 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block font-black uppercase text-[10px] text-slate-400 mb-0.5">
                        Target Technical Implementation:
                      </strong>
                      <span className="text-slate-700">{activeProposal.pitchDefense.targetStack}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Submitted: {activeProposal.pitchDefense?.submittedAt ? new Date(activeProposal.pitchDefense.submittedAt).toLocaleDateString() : 'Active'}
                    </span>

                    {/* ONLY STUDENTS CAN EDIT THEIR PITCH. COORDINATORS CANNOT EDIT PITCHES! */}
                    {currentRole === 'student' && !isEditingPitch && (
                      <button
                        type="button"
                        onClick={() => setIsEditingPitch(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#18191E] hover:bg-black text-[#D4F938] text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Pitch</span>
                      </button>
                    )}

                    {currentRole !== 'student' && (
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-full">
                        Read-Only Student Submission
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                  <p className="text-xs text-slate-400 italic">No pitch defense submitted yet.</p>
                  <p className="text-[11px] text-slate-500">
                    {currentRole === 'student' 
                      ? 'Submit your 200-word justification below to defend your topic novelty.'
                      : 'Awaiting student pitch defense submission for this topic.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ================= COLUMN B: CONFLICTING PROPOSAL ================= */}
          {conflictingProposal ? (
            <div className="p-6 sm:p-7 space-y-4 bg-[#F4F5F8]/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#C6B5FD] text-black font-black uppercase">
                  Proposal B: Group {String(conflictingProposal.groupNo).padStart(2, '0')} (Track {conflictingProposal.trackNo})
                </span>
                <span className="text-xs font-semibold text-slate-500">{conflictingProposal.cohort}</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#18191E]">
                  {conflictingProposal.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Guide: <strong className="text-black">{conflictingProposal.guideName}</strong> • Lead: {conflictingProposal.teamMembers[0]?.name || 'Student Lead'}
                </p>
              </div>

              {/* Abstract */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs">
                <span className="font-bold text-[#18191E] block mb-1 uppercase text-[10px] tracking-wider">Abstract:</span>
                <p className="text-slate-700 leading-relaxed">
                  {conflictingProposal.abstract}
                </p>
              </div>

              {/* Tech Stack */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
                  Proposed Tech Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {conflictingProposal.techStack.map((t, idx) => (
                    <span key={idx} className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pitch Defense */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#18191E]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#18191E]" />
                    <span>200-Word Novelty Pitch Defense</span>
                  </span>
                  {conflictingProposal.pitchDefense?.content ? (
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Submitted Artifact
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      Pending
                    </span>
                  )}
                </div>

                {conflictingProposal.pitchDefense?.content ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-800 font-medium leading-relaxed italic bg-[#F4F5F8] p-3.5 rounded-xl border border-slate-200">
                      &ldquo;{conflictingProposal.pitchDefense.content}&rdquo;
                    </p>

                    {conflictingProposal.pitchDefense.keyDifferentiator && (
                      <div className="text-xs bg-[#F4F5F8] p-3 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block font-black uppercase text-[10px] text-slate-400 mb-0.5">
                          Key Differentiator:
                        </strong>
                        <span className="text-slate-700">{conflictingProposal.pitchDefense.keyDifferentiator}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Submitted: {conflictingProposal.pitchDefense.submittedAt ? new Date(conflictingProposal.pitchDefense.submittedAt).toLocaleDateString() : 'Active'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-full">
                        Read-Only Student Submission
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#F4F5F8] rounded-xl border border-slate-200 text-center space-y-1">
                    <p className="text-xs text-slate-400 italic">No pitch defense submitted yet by Group {conflictingProposal.groupNo}.</p>
                    <p className="text-[11px] text-slate-500">
                      Coordinator will arbitrate based on initial submitted project documentation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-7 flex flex-col items-center justify-center text-center space-y-3 bg-[#F4F5F8]/30">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                ✓
              </div>
              <h4 className="text-base font-bold text-slate-800">No Opposing Clashing Proposal</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                This project does not conflict with any concurrent cohort submissions. Review the student pitch defense above.
              </p>
            </div>
          )}
        </div>

        {/* ================= STUDENT PITCH EDITING FORM (STUDENT ROLE ONLY) ================= */}
        {currentRole === 'student' && isEditingPitch && hasSubmittedPitch && (
          <div className="p-6 bg-amber-50/60 border-t border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-700" />
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                  Edit 200-Word Pitch Defense (Group {activeProposal.groupNo})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingPitch(false)}
                className="text-xs text-slate-500 hover:text-black flex items-center gap-1 font-bold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={pitchInputText}
              onChange={e => setPitchInputText(e.target.value)}
              placeholder="Refine your pitch defense statement (~200 words)..."
              className="w-full px-4 py-3 text-xs border border-amber-300 rounded-2xl bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Key Differentiator
                </label>
                <input
                  type="text"
                  value={keyDiffInput}
                  onChange={e => setKeyDiffInput(e.target.value)}
                  placeholder="e.g. SBERT dense embeddings & real-time Stage Gate"
                  className="w-full px-3.5 py-2 text-xs border border-amber-300 rounded-full bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Target Tech Stack
                </label>
                <input
                  type="text"
                  value={targetStackInput}
                  onChange={e => setTargetStackInput(e.target.value)}
                  placeholder="e.g. React 19, FastAPI, PostgreSQL"
                  className="w-full px-3.5 py-2 text-xs border border-amber-300 rounded-full bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingPitch(false)}
                className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Discard Changes
              </button>
              <button
                type="button"
                onClick={handleSavePitch}
                className="bg-[#18191E] hover:bg-black text-[#D4F938] font-black text-xs px-5 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Update Pitch Defense</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STUDENT INITIAL SUBMISSION FORM (STUDENT ROLE ONLY, WHEN NO PITCH) ================= */}
        {currentRole === 'student' && !hasSubmittedPitch && (
          <div className="p-6 bg-white border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black" />
              <h4 className="text-xs font-extrabold text-[#18191E] uppercase tracking-wider">
                Submit Your 200-Word Pitch Defense (Group {activeProposal.groupNo})
              </h4>
            </div>
            <textarea
              rows={3}
              value={pitchInputText}
              onChange={e => setPitchInputText(e.target.value)}
              placeholder="State what makes your implementation unique: specific datasets, novel deep learning architectures, unique university integrations, or real-time performance..."
              className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl bg-[#F4F5F8] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Key Differentiator
                </label>
                <input
                  type="text"
                  value={keyDiffInput}
                  onChange={e => setKeyDiffInput(e.target.value)}
                  placeholder="e.g. SBERT embeddings + DBIT Stage Gate Workflow"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-full bg-[#F4F5F8] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Target Tech Stack
                </label>
                <input
                  type="text"
                  value={targetStackInput}
                  onChange={e => setTargetStackInput(e.target.value)}
                  placeholder="e.g. React 19, FastAPI, Cloud SQL"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-full bg-[#F4F5F8] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleSavePitch}
                disabled={!pitchInputText.trim()}
                className="bg-[#D4F938] hover:bg-[#c2e72f] text-black font-extrabold text-xs px-5 py-2.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Pitch Defense for Coordinator Arbitration</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= COORDINATOR ARBITRATION & DECISION CONSOLE ================= */}
        {(currentRole === 'coordinator' || currentRole === 'admin') && (
          <div className="p-6 sm:p-7 bg-[#18191E] text-white border-t border-slate-200">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Project Coordinator Topic Award &amp; Arbitration Decisions
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

                {conflictingProposal && (
                  <>
                    <button
                      type="button"
                      onClick={() => onArbitrateConflict(
                        activeProposal.id, 
                        conflictingProposal.id, 
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
                        conflictingProposal.id, 
                        'request_revision_b', 
                        arbitrationRemarks
                      )}
                      className="inline-flex items-center gap-2 bg-[#C6B5FD] hover:bg-[#b8a4fc] text-black text-xs font-extrabold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 text-black" />
                      <span>Request Scope Pivot for Proposal B</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
