import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  Send, 
  UserCheck, 
  CheckCircle2, 
  Bell, 
  Filter,
  CornerDownRight,
  ShieldCheck,
  User,
  GraduationCap
} from 'lucide-react';
import { GuideMessage, MessageReply, UserRole } from '../types';
import { 
  subscribeToGuideMessages, 
  addReplyToGuideMessageInFirestore, 
  INITIAL_GUIDE_MESSAGES 
} from '../utils/firestoreSync';

interface GuideNoticeBoardProps {
  userRole: UserRole;
  userGroupNo?: number;
  userName: string;
  onOpenSendModal?: () => void;
}

export const GuideNoticeBoard: React.FC<GuideNoticeBoardProps> = ({
  userRole,
  userGroupNo,
  userName,
  onOpenSendModal
}) => {
  const [messages, setMessages] = useState<GuideMessage[]>(INITIAL_GUIDE_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [filterGroup, setFilterGroup] = useState<number | 'all'>(
    userRole === 'student' && userGroupNo ? userGroupNo : 'all'
  );
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);

  // Subscribe to real-time Firestore updates for notices and student replies
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToGuideMessages((allMsgs) => {
      setMessages(allMsgs);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Filter messages based on role and group filter
  const displayedMessages = messages.filter((msg) => {
    if (userRole === 'student') {
      // Student sees notices targeted at their group or cohort-wide (e.g., group 0 or matches groupNo)
      if (userGroupNo) {
        return msg.targetGroupNo === userGroupNo || msg.targetGroupNo === 0;
      }
      return true;
    }

    // Guide / Coordinator / Admin
    if (filterGroup === 'all') return true;
    return msg.targetGroupNo === Number(filterGroup);
  });

  const handleSendReply = async (messageId: string) => {
    const text = (replyTexts[messageId] || '').trim();
    if (!text) return;

    setSubmittingReplyId(messageId);

    const newReply: MessageReply = {
      id: `reply-${Date.now()}`,
      senderName: userName || (userRole === 'student' ? 'Student' : 'Faculty Guide'),
      senderRole: userRole,
      message: text,
      timestamp: new Date().toISOString()
    };

    // Optimistically update local state immediately
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        return {
          ...m,
          replies: [...(m.replies || []), newReply]
        };
      })
    );

    // Clear input
    setReplyTexts((prev) => ({ ...prev, [messageId]: '' }));

    try {
      // Persist to Cloud Firestore real-time database
      await addReplyToGuideMessageInFirestore(messageId, newReply);

      // Also notify backend API
      fetch(`/api/messages/${messageId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: newReply.senderName,
          senderRole: newReply.senderRole,
          message: newReply.message
        })
      }).catch((e) => console.warn('Backend reply sync note:', e));
    } catch (err) {
      console.warn('Error saving reply:', err);
    } finally {
      setSubmittingReplyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#18191E] text-white rounded-[28px] p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4F938]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-[#D4F938] text-black font-extrabold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                {userRole === 'guide'
                  ? 'Faculty Guide Dispatched Console'
                  : userRole === 'coordinator'
                  ? 'Coordinator Advisory Dispatch'
                  : 'Student Mentoring Space'}
              </span>
              <span className="text-xs text-white/60 font-medium">
                Real-Time Cloud Firestore Sync
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
              {userRole === 'guide' || userRole === 'coordinator'
                ? 'Dispatched Notices & Student Interaction Trail'
                : 'Guide Direct Notices & Advisories'}
            </h2>
            <p className="text-xs text-white/70 max-w-xl mt-1">
              {userRole === 'guide' || userRole === 'coordinator'
                ? 'Review all dispatched advisories to your assigned student groups, inspect live student replies, and send instant instructions.'
                : 'Official notifications, milestone directions, and review feedback dispatched by your Faculty Guide and Coordinator.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {(userRole === 'guide' || userRole === 'coordinator') && onOpenSendModal && (
              <button
                type="button"
                onClick={onOpenSendModal}
                className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#c2e72f] text-black font-black text-xs px-5 py-2.5 rounded-full transition-colors shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Student Text Notice</span>
              </button>
            )}

            {userRole !== 'student' && (
              <div className="flex items-center gap-2 text-xs bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                <Filter className="w-3.5 h-3.5 text-white/60" />
                <select
                  value={filterGroup}
                  onChange={(e) =>
                    setFilterGroup(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="bg-transparent text-[#D4F938] font-bold text-xs focus:outline-hidden cursor-pointer"
                >
                  <option value="all" className="bg-[#18191E] text-white">
                    All Dispatched Groups
                  </option>
                  <option value={5} className="bg-[#18191E] text-white">
                    Group 05 (DBIT-SE-2026-T7-G05)
                  </option>
                  <option value={6} className="bg-[#18191E] text-white">
                    Group 06 (DBIT-SE-2026-T7-G06)
                  </option>
                  <option value={1} className="bg-[#18191E] text-white">
                    Group 01 (DBIT-SE-2026-T7-G01)
                  </option>
                  <option value={2} className="bg-[#18191E] text-white">
                    Group 02 (DBIT-SE-2026-T7-G02)
                  </option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dispatched Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-[24px] p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {userRole === 'student' ? 'Received Notices' : 'Total Dispatched'}
            </span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {displayedMessages.length}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#18191E] text-[#D4F938] flex items-center justify-center font-bold">
            <Bell className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Student Replies
            </span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {displayedMessages.reduce((acc, m) => acc + (m.replies?.length || 0), 0)}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#F4F5F8] text-slate-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Target Scope
            </span>
            <span className="text-sm font-extrabold text-slate-800">
              {userRole === 'student'
                ? `Group ${userGroupNo || 5} Workspace`
                : filterGroup === 'all'
                ? 'All Cohort Groups'
                : `Group ${filterGroup}`}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            Syncing notices with Cloud Firestore...
          </div>
        ) : displayedMessages.length > 0 ? (
          displayedMessages.map((msg) => {
            const replies = msg.replies || [];
            const currentReplyText = replyTexts[msg.id] || '';

            return (
              <div
                key={msg.id}
                className={`p-6 rounded-[28px] border transition-all bg-white shadow-xs ${
                  msg.urgency === 'critical'
                    ? 'border-red-300 ring-2 ring-red-200'
                    : msg.urgency === 'high'
                    ? 'border-amber-300 ring-2 ring-amber-200'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        msg.urgency === 'critical'
                          ? 'bg-red-500/20 text-red-900 border border-red-300'
                          : msg.urgency === 'high'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {msg.urgency} priority
                    </span>
                    <span className="font-mono text-xs font-black px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938]">
                      Target: Group {String(msg.targetGroupNo).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        From: {msg.senderName} ({msg.senderRole})
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(msg.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {/* Subject & Body */}
                <h4 className="text-base font-extrabold text-[#18191E] mb-2">
                  {msg.subject}
                </h4>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap bg-[#F4F5F8] p-4 rounded-2xl border border-slate-100">
                  {msg.message}
                </div>

                {/* Replies Thread Section */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                      <span>
                        Interaction Thread ({replies.length}{' '}
                        {replies.length === 1 ? 'reply' : 'replies'})
                      </span>
                    </div>
                  </div>

                  {/* List of Replies */}
                  {replies.length > 0 && (
                    <div className="space-y-2.5 pl-2 sm:pl-4 border-l-2 border-slate-200">
                      {replies.map((reply) => {
                        const isStudent = reply.senderRole === 'student';
                        return (
                          <div
                            key={reply.id}
                            className={`p-3.5 rounded-2xl text-xs border ${
                              isStudent
                                ? 'bg-white border-slate-200'
                                : 'bg-[#18191E] text-white border-black'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-black text-[11px] ${
                                    isStudent ? 'text-[#18191E]' : 'text-[#D4F938]'
                                  }`}
                                >
                                  {reply.senderName}
                                </span>
                                <span
                                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                                    isStudent
                                      ? 'bg-[#C6B5FD] text-black'
                                      : 'bg-white/20 text-white'
                                  }`}
                                >
                                  {reply.senderRole}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-mono ${
                                  isStudent ? 'text-slate-400' : 'text-white/50'
                                }`}
                              >
                                {new Date(reply.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p
                              className={`leading-relaxed whitespace-pre-wrap ${
                                isStudent ? 'text-slate-700' : 'text-white/90'
                              }`}
                            >
                              {reply.message}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reply Input Bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <CornerDownRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                    <input
                      type="text"
                      value={currentReplyText}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({ ...prev, [msg.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply(msg.id);
                        }
                      }}
                      placeholder={
                        userRole === 'student'
                          ? 'Reply to your Faculty Guide or Coordinator...'
                          : 'Reply to student group in this thread...'
                      }
                      className="flex-1 px-4 py-2.5 text-xs bg-[#F4F5F8] border border-slate-200 rounded-full focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938] text-slate-900"
                    />
                    <button
                      type="button"
                      disabled={!currentReplyText.trim() || submittingReplyId === msg.id}
                      onClick={() => handleSendReply(msg.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#18191E] hover:bg-black text-[#D4F938] text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingReplyId === msg.id ? 'Sending...' : 'Reply'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-[28px] border border-slate-200/80">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">
              {userRole === 'guide'
                ? 'No notices dispatched yet'
                : 'No notices dispatched to your group yet'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {userRole === 'guide'
                ? 'Click "Send Student Text Notice" to broadcast advisories to your assigned groups.'
                : 'When your Faculty Guide or Coordinator dispatches instructions, they will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
