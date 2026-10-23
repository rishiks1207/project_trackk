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
  const [stage, setStage] = useState('Stage 2: Development & SBERT Engine');
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
      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-800 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                UC-08: Log Written Remarks
              </span>
              <span className="bg-indigo-800 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded">
                Automated Reminder Alerts
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Centralized Written Feedback Log &amp; Audit Trail
            </h3>
            <p className="text-xs text-purple-200">
              Permanent record of reviews solving the 44.2% &ge; 3 days feedback delay bottleneck
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
            aria-label="Close feedback log"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Automated Reminder Alert Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <Bell className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Pending Guide Sign-Off: <strong>{proposal.guideName}</strong> (Exp 5 NLP SBERT Engine)
            </span>
          </div>

          <button
            type="button"
            onClick={handleTriggerReminder}
            disabled={reminderSent}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              reminderSent 
                ? 'bg-emerald-600 text-white' 
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{reminderSent ? '✓ Reminder Dispatched' : 'Send Automated Alert Ping'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* History Timeline */}
          <div>
            <h4 className="font-bold text-zinc-900 uppercase tracking-wider mb-3 text-[11px] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Auditable Feedback Timeline</span>
            </h4>

            <div className="space-y-3">
              {proposal.feedbackHistory && proposal.feedbackHistory.length > 0 ? (
                proposal.feedbackHistory.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.authorRole === 'coordinator' ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Coordinator</span>
                          </span>
                        ) : (
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-purple-600" />
                            <span>Guide</span>
                          </span>
                        )}
                        <strong className="text-zinc-900">{item.authorName}</strong>
                      </div>

                      <div className="text-[11px] text-zinc-500 font-mono">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-500 font-medium">
                      Stage: <span className="text-zinc-800">{item.stage}</span>
                    </div>

                    <p className="text-zinc-700 leading-relaxed bg-white p-3 rounded-lg border border-zinc-200">
                      {item.remarks}
                    </p>

                    {item.actionItems && item.actionItems.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">
                          Action Items:
                        </span>
                        <ul className="list-disc pl-4 space-y-0.5 text-zinc-600 text-[11px]">
                          {item.actionItems.map((act, idx) => (
                            <li key={idx}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-zinc-400 border border-dashed rounded-xl">
                  No feedback entries recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Add Written Feedback (Faculty Guide or Coordinator) */}
          <form onSubmit={handleSubmitFeedback} className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-800">
                Log New Written Feedback ({currentRole})
              </span>
              <span className="text-[11px] text-zinc-500">
                Creates permanent timestamped record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                  Target Stage Gate
                </label>
                <select
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg bg-white"
                >
                  <option value="Topic Approval">Topic Approval</option>
                  <option value="Stage 1: Exp 1-4 Design">Stage 1: Exp 1-4 Design</option>
                  <option value="Stage 2: Development & SBERT Engine">Stage 2: Development & SBERT Engine</option>
                  <option value="Stage 3: Testing & Evaluation">Stage 3: Testing & Evaluation</option>
                  <option value="Review 2 Committee Sign-Off">Review 2 Committee Sign-Off</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                  Review Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg bg-white"
                >
                  <option value="comment">Comment / Mentoring Note</option>
                  <option value="approved">Milestone Approved &amp; Signed</option>
                  <option value="revision_required">Revision Required</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                Faculty Remarks &amp; Mentoring Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Log specific guidance on technical architecture, algorithm optimizations, or deliverables..."
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                Add Actionable To-Do Items (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={actionItemInput}
                  onChange={e => setActionItemInput(e.target.value)}
                  placeholder="e.g. Include cosine similarity ROC curve in Exp 5 report"
                  className="flex-1 px-3 py-1.5 border border-zinc-300 rounded-lg bg-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddActionItem}
                  className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 rounded-lg font-medium text-zinc-800"
                >
                  Add
                </button>
              </div>

              {actionItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {actionItems.map((act, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-white border border-zinc-300 px-2 py-0.5 rounded text-[11px] text-zinc-700"
                    >
                      <span>{act}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveActionItem(idx)}
                        className="text-zinc-400 hover:text-red-500"
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
                className="inline-flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Written Feedback</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-zinc-100 border-t border-zinc-200 px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
