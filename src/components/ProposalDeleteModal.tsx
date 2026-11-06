import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { ProjectProposal } from '../types';

interface ProposalDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: ProjectProposal | null;
  onConfirmDelete: (proposalId: string) => void;
}

export const ProposalDeleteModal: React.FC<ProposalDeleteModalProps> = ({
  isOpen,
  onClose,
  proposal,
  onConfirmDelete
}) => {
  if (!isOpen || !proposal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#18191E] rounded-[32px] p-2 sm:p-2.5 shadow-2xl border border-red-500/40 w-full max-w-lg my-6 flex flex-col text-xs">
        
        {/* Header */}
        <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-red-400 font-mono text-[10px] font-black uppercase">
                Student Proposal Withdrawal
              </span>
              <h2 className="text-base font-black text-white tracking-tight mt-0.5">
                Withdraw &amp; Remove Proposal
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

        {/* Content */}
        <div className="bg-white rounded-[24px] p-6 space-y-4 m-1 text-slate-800">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-xs text-amber-950">
                You are withdrawing your registered proposal:
              </p>
              <p className="text-xs font-black text-slate-900 bg-white p-2.5 rounded-xl border border-amber-200/80">
                &ldquo;{proposal.title}&rdquo;
              </p>
              <p className="text-[11px] text-amber-800">
                Withdrawing this proposal will remove it from the department database, allowing your team to submit a new or revised engineering proposal.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Note: Once a proposal is officially <strong>Approved</strong> by the Project Coordinator and Guide, it cannot be withdrawn or modified.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-[#18191E] px-6 py-3.5 flex items-center justify-between border-t border-white/10 rounded-b-[28px]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            Keep Proposal
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirmDelete(proposal.id);
              onClose();
            }}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-full shadow-lg transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Withdrawal</span>
          </button>
        </div>

      </div>
    </div>
  );
};
