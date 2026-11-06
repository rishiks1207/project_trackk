import React, { useState } from 'react';
import { X, XCircle, AlertTriangle, Send, CheckCircle2, Lightbulb, MessageSquare } from 'lucide-react';
import { ProjectProposal } from '../types';

interface ProposalRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: ProjectProposal | null;
  onConfirmReject: (
    proposalId: string, 
    rejectionReason: string, 
    sendNoticeToStudents: boolean, 
    noticeMessage: string
  ) => void;
}

const PRESET_REASONS = [
  {
    label: 'Insufficient Engineering Depth',
    reason: 'The proposed topic lacks sufficient engineering depth or algorithm novelty for an SE/TE capstone project. It primarily consumes pre-built endpoints without custom ML/distributed architecture.',
    improvement: 'Consider designing custom edge pipelines, micro-DSP signal classifiers, or benchmarking latency against state-of-the-art models.'
  },
  {
    label: 'Unclear Scope / Out of Syllabus Boundaries',
    reason: 'The proposal scope is either too broad or ambiguous regarding deliverables and university syllabus constraints.',
    improvement: 'Refine problem framing: isolate a clear stakeholder bottleneck in DBIT labs, specify concrete evaluation datasets, and formulate testable hypotheses.'
  },
  {
    label: 'Heavily Redundant with Past Batches',
    reason: 'Substantial concept overlap with historical capstones from prior academic years without clear architectural differentiators.',
    improvement: 'Differentiate by targeting real-time constraints (e.g., RTSP multi-camera sync, LoRaWAN mesh communication) or tackling an unaddressed domain pain point.'
  }
];

export const ProposalRejectionModal: React.FC<ProposalRejectionModalProps> = ({
  isOpen,
  onClose,
  proposal,
  onConfirmReject
}) => {
  const [reason, setReason] = useState(
    'The proposed engineering topic does not meet departmental depth requirements or clear innovation criteria for SE Capstone AY 2026–27.'
  );
  const [improvementText, setImprovementText] = useState(
    'Please review the coordinator recommendations, consult with your faculty guide, and submit an alternative topic proposal or significantly restructured scope.'
  );
  const [sendNotice, setSendNotice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !proposal) return null;

  const handleApplyPreset = (preset: typeof PRESET_REASONS[0]) => {
    setReason(preset.reason);
    setImprovementText(preset.improvement);
  };

  const handleConfirm = () => {
    if (!reason.trim()) return;
    setIsSubmitting(true);
    onConfirmReject(proposal.id, reason.trim(), sendNotice, improvementText.trim());
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#18191E] rounded-[32px] p-2 sm:p-2.5 shadow-2xl border border-red-500/30 w-full max-w-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden text-xs">
        
        {/* Dark Header */}
        <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Coordinator Authority
                </span>
                <span className="text-slate-400 text-[11px] font-mono">
                  Group {String(proposal.groupNo).padStart(2, '0')} (Track {proposal.trackNo})
                </span>
              </div>
              <h2 className="text-base font-black text-white tracking-tight mt-0.5">
                Reject Project Proposal &amp; Issue Revision Guidance
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 bg-white rounded-[24px] p-5 sm:p-6 overflow-y-auto space-y-4 m-1 text-slate-800">
          
          {/* Target Proposal Banner */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                {proposal.projectId || `Group ${proposal.groupNo}`} • {proposal.cohort}
              </span>
              <span className="text-[11px] font-bold text-slate-700">
                Guide: {proposal.guideName}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
              {proposal.title}
            </h3>
            <p className="text-[11px] text-slate-500 truncate">
              Lead: {proposal.teamMembers[0]?.name || 'Student'} • {proposal.teamMembers.length} team members
            </p>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Rejection Preset Templates:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_REASONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-slate-200 text-[11px] font-bold transition-all text-slate-700 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rejection Reason Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900">
              Coordinator Evaluation Remarks &amp; Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="State clear reasons why the proposal was not accepted (technical depth, overlap, feasibility)..."
              className="w-full bg-white rounded-2xl p-3 text-xs border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-hidden font-medium text-slate-900"
            />
          </div>

          {/* Improvement Guidance Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Recommended Improvements &amp; Alternate Topic Directions for Students</span>
            </label>
            <textarea
              rows={3}
              value={improvementText}
              onChange={e => setImprovementText(e.target.value)}
              placeholder="Provide constructive actionable directions for the student group (how to pivot or improve)..."
              className="w-full bg-white rounded-2xl p-3 text-xs border border-slate-300 focus:border-[#D4F938] focus:ring-2 focus:ring-[#D4F938]/30 focus:outline-hidden font-medium text-slate-900"
            />
          </div>

          {/* Direct Notice Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-slate-700" />
              <div>
                <div className="font-bold text-xs text-slate-900">
                  Send Formal Notice to Student Group
                </div>
                <div className="text-[11px] text-slate-500">
                  Dispatches this guidance into Group {proposal.groupNo}&apos;s Notices &amp; Advisories tab
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sendNotice}
                onChange={e => setSendNotice(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#18191E] px-6 py-3.5 flex items-center justify-between border-t border-white/10 rounded-b-[28px]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-extrabold text-xs px-6 py-2.5 rounded-full shadow-lg transition-all cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Confirm Rejection &amp; Notify</span>
          </button>
        </div>

      </div>
    </div>
  );
};
