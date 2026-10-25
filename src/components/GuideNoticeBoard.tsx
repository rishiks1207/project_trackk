import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  Send, 
  UserCheck, 
  CheckCircle2, 
  Bell, 
  Filter 
} from 'lucide-react';
import { GuideMessage, UserRole } from '../types';

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
  const [messages, setMessages] = useState<GuideMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterGroup, setFilterGroup] = useState<number | 'all'>(userGroupNo || 'all');

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      let url = '/api/messages';
      if (filterGroup !== 'all') {
        url += `?groupNo=${filterGroup}`;
      } else if (userRole === 'student' && userGroupNo) {
        url += `?groupNo=${userGroupNo}`;
      }
      const res = await fetch(url);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      }
    } catch (err) {
      console.warn('Failed to load guide notices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filterGroup, userGroupNo]);

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
                Direct Mentoring Channel
              </span>
              <span className="text-xs text-white/60 font-medium">
                Cloud SQL Mentoring Audit Trail
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
              Guide Direct Notices &amp; Technical Advisories
            </h2>
            <p className="text-xs text-white/70 max-w-xl mt-1">
              Direct notifications, review feedback, and stage-gate instructions issued by Faculty Guides.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {userRole === 'guide' && onOpenSendModal && (
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
                  onChange={e => setFilterGroup(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="bg-transparent text-[#D4F938] font-bold text-xs focus:outline-hidden"
                >
                  <option value="all" className="bg-[#18191E] text-white">All Groups</option>
                  <option value={5} className="bg-[#18191E] text-white">Group 05</option>
                  <option value={6} className="bg-[#18191E] text-white">Group 06</option>
                  <option value={1} className="bg-[#18191E] text-white">Group 01</option>
                  <option value={2} className="bg-[#18191E] text-white">Group 02</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            Loading mentoring notices from Cloud SQL...
          </div>
        ) : messages.length > 0 ? (
          messages.map(msg => (
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
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    msg.urgency === 'critical'
                      ? 'bg-red-500/20 text-red-900 border border-red-300'
                      : msg.urgency === 'high'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {msg.urgency} priority
                  </span>
                  <span className="font-mono text-xs font-black px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938]">
                    Target: Group {msg.targetGroupNo}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    From: {msg.senderName} ({msg.senderRole})
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <h4 className="text-base font-extrabold text-[#18191E] mb-1">
                {msg.subject}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-[#F4F5F8] p-4 rounded-2xl border border-slate-100 mt-2">
                {msg.message}
              </p>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-[28px] border border-slate-200/80">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No notices dispatched yet</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {userRole === 'guide'
                ? 'Click "Send Student Text Notice" to message your assigned student groups.'
                : 'Direct notices from your Faculty Guide will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
