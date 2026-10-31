import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Bell, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  ShieldCheck,
  Calendar,
  Sparkles
} from 'lucide-react';
import { GuideFeedback, ProjectProposal, UserRole } from '../types';

interface FeedbackLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: ProjectProposal;
  currentRole: UserRole;
  onAddFeedback: (feedback: Omit<GuideFeedback, 'id' | 'timestamp'>) => void;
  onSendReminder: () => void;
}

export const FeedbackLogModal: React.FC<FeedbackLogModalProps> = ({
  isOpen,
  onClose,
  proposal,
  currentRole,
  onAddFeedback,
  onSendReminder
}) => {
  const [remarks, setRemarks] = useState('');
  const [stage, setStage] = useState('Stage 2: Development & Similarity Engine');
  const [status, setStatus] = useState<GuideFeedback['status']>('comment');
  const [actionItemInput, setActionItemInput] = useState('');
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [reminderSent, setReminderSent] = useState(false);

  if (!isOpen) return null;

  const handleAddActionItem = () => {
    if (actionItemInput.trim()) {
      setActionItems([...actionItems, actionItemInput.trim()]);
      setActionItemInput('');
    }
  };

  const handleRemoveActionItem = (index: number) => {
    setActionItems(actionItems.filter((_, i) => i !== index));
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) return;

    const authorName = currentRole === 'coordinator' 
      ? proposal.coordinatorName 
      : currentRole === 'guide' 
        ? proposal.guideName 
        : 'Student Group Representative';

    onAddFeedback({
      authorName,
      authorRole: currentRole === 'coordinator' ? 'coordinator' : 'guide',
      stage,
      status,
      remarks,
      actionItems: actionItems.length > 0 ? actionItems : undefined
    });

    setRemarks('');
    setActionItems([]);
  };

  const handleTriggerReminder = () => {
    onSendReminder();
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200/80 w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#D4F938] text-black text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase">
                UC-08: Log Written Remarks
              </span>
              <span className="bg-white/10 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                Automated Review Alerts
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">
              Centralized Written Feedback Log &amp; Audit Trail
            </h3>
            <p className="text-xs text-white/60">
              Permanent record of reviews solving communication delays
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-full text-xl font-bold"
            aria-label="Close feedback log"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Automated Reminder Alert Banner */}
        <div className="bg-[#F4F5F8] border-b border-slate-200/80 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-800">
            <Bell className="w-4 h-4 text-black shrink-0" />
            <span>
              Pending Guide Sign-Off: <strong className="text-black">{proposal.guideName}</strong> (Similarity Screening)
            </span>
          </div>

          <button
            type="button"
            onClick={handleTriggerReminder}
            disabled={reminderSent}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              reminderSent 
                ? 'bg-[#C6B5FD] text-black' 
                : 'bg-[#D4F938] hover:bg-[#c2e72f] text-black'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{reminderSent ? '✓ Reminder Dispatched' : 'Send Alert Ping'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* History Timeline */}
          <div>
            <h4 className="font-bold text-[#18191E] uppercase tracking-wider mb-3 text-[11px] flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-black" />
              <span>Auditable Feedback Timeline</span>
            </h4>

            <div className="space-y-3">
              {proposal.feedbackHistory && proposal.feedbackHistory.length > 0 ? (
                proposal.feedbackHistory.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl border border-slate-200 bg-[#F4F5F8] space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.authorRole === 'coordinator' ? (
                          <span className="bg-[#18191E] text-[#D4F938] text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-[#D4F938]" />
                            <span>Coordinator</span>
                          </span>
                        ) : (
                          <span className="bg-[#C6B5FD] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-black" />
                            <span>Guide</span>
                          </span>
                        )}
                        <strong className="text-black font-extrabold">{item.authorName}</strong>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 font-medium">
                      Stage: <span className="text-black font-bold">{item.stage}</span>
                    </div>

                    <p className="text-slate-800 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                      {item.remarks}
                    </p>

                    {item.actionItems && item.actionItems.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Action Items:
                        </span>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-xs">
                          {item.actionItems.map((act, idx) => (
                            <li key={idx}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400 border border-dashed rounded-2xl">
                  No feedback entries recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Add Written Feedback (Faculty Guide or Coordinator) */}
          <form onSubmit={handleSubmitFeedback} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#18191E]">
                Log New Written Feedback ({currentRole})
              </span>
              <span className="text-[11px] text-slate-500">
                Creates permanent timestamped record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Target Stage Gate
                </label>
                <select
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-[#F4F5F8] text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                >
                  <option value="Topic Approval">Topic Approval</option>
                  <option value="Stage 1: Exp 1-4 Design">Stage 1: Exp 1-4 Design</option>
                  <option value="Stage 2: Development & Similarity Engine">Stage 2: Development & Similarity Engine</option>
                  <option value="Stage 3: Testing & Evaluation">Stage 3: Testing & Evaluation</option>
                  <option value="Review 2 Committee Sign-Off">Review 2 Committee Sign-Off</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Review Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-[#F4F5F8] text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                >
                  <option value="comment">Comment / Mentoring Note</option>
                  <option value="approved">Milestone Approved &amp; Signed</option>
                  <option value="revision_required">Revision Required</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Faculty Remarks &amp; Mentoring Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Log specific guidance on technical architecture, system design, or deliverables..."
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-[#F4F5F8] text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Add Actionable To-Do Items (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={actionItemInput}
                  onChange={e => setActionItemInput(e.target.value)}
                  placeholder="e.g. Include evaluation metric charts in Exp 5 report"
                  className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl bg-[#F4F5F8] text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddActionItem}
                  className="px-4 py-2 bg-[#18191E] text-white hover:bg-black rounded-xl font-bold text-xs cursor-pointer"
                >
                  Add
                </button>
              </div>

              {actionItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {actionItems.map((act, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-[#F4F5F8] border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-800"
                    >
                      <span>{act}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveActionItem(idx)}
                        className="text-slate-400 hover:text-red-500 font-bold"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!remarks.trim()}
                className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#c2e72f] disabled:opacity-50 text-black font-extrabold px-6 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Written Feedback</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-[#F4F5F8] border-t border-slate-200 px-6 py-3.5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 hover:text-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
