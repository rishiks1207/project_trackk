import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  UserCog, 
  LogOut, 
  Presentation,
  Check,
  UserCircle2
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';

interface FluxTopBarProps {
  currentUser: UserAccount;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  onOpenPresentation?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateTab?: (tab: string) => void;
  noticesCount?: number;
}

export interface AppNotification {
  id: string;
  type: 'notice' | 'stage' | 'ppt' | 'conflict' | 'system';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  actionTab: string;
}

export const FluxTopBar: React.FC<FluxTopBarProps> = ({
  currentUser,
  currentRole,
  onRoleChange,
  onLogout,
  searchQuery,
  onSearchChange,
  onNavigateTab,
  noticesCount = 2
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const getRoleDefaultNotifications = (role: UserRole): AppNotification[] => {
    if (role === 'guide') {
      return [
        {
          id: 'notif-g1',
          type: 'ppt',
          title: 'Review 1 PPT Submitted',
          description: 'Group 05 uploaded Review 1 slides (24 slides) for rubric evaluation.',
          time: '25m ago',
          isRead: false,
          actionTab: 'gantt'
        },
        {
          id: 'notif-g2',
          type: 'stage',
          title: 'Exp 5 Code Deliverable',
          description: 'Group 05 synchronized GitHub PR for similarity screening.',
          time: '2h ago',
          isRead: false,
          actionTab: 'stages'
        },
        {
          id: 'notif-g3',
          type: 'notice',
          title: 'Student Text Notice Dispatched',
          description: 'Advisory successfully broadcast to SE COMPS Track 7 groups.',
          time: 'Yesterday',
          isRead: true,
          actionTab: 'notices'
        }
      ];
    }

    if (role === 'coordinator') {
      return [
        {
          id: 'notif-c1',
          type: 'conflict',
          title: 'Topic Arbitration Pending',
          description: 'Track 7 Group 05 vs Group 12 pitch defenses ready for final award.',
          time: '1h ago',
          isRead: false,
          actionTab: 'conflicts'
        },
        {
          id: 'notif-c2',
          type: 'ppt',
          title: 'Review 1 PPT Presentations',
          description: 'Cohort Review 1 slide decks ready for coordinator inspection in Gantt.',
          time: '3h ago',
          isRead: false,
          actionTab: 'gantt'
        }
      ];
    }

    if (role === 'admin') {
      return [
        {
          id: 'notif-a1',
          type: 'system',
          title: 'PostgreSQL Database Health',
          description: 'Project catalog and user directories synchronized with Firestore.',
          time: '10m ago',
          isRead: false,
          actionTab: 'admin'
        },
        {
          id: 'notif-a2',
          type: 'notice',
          title: 'Institutional Accounts',
          description: 'Faculty and student account credentials verified.',
          time: '2h ago',
          isRead: true,
          actionTab: 'admin'
        }
      ];
    }

    // Student notifications
    return [
      {
        id: 'notif-s1',
        type: 'notice',
        title: 'Guide Advisory: Mr. Nazareth Remedios',
        description: 'Ensure your UML sequence diagrams map with FastAPI endpoints by Week 6.',
        time: '4h ago',
        isRead: false,
        actionTab: 'notices'
      },
      {
        id: 'notif-s2',
        type: 'ppt',
        title: 'Review 1 PPT Upload Active',
        description: 'Upload your Review 1 Presentation (PPT) in the Gantt Chart for guide grading.',
        time: '1h ago',
        isRead: false,
        actionTab: 'gantt'
      },
      {
        id: 'notif-s3',
        type: 'stage',
        title: 'Exp 4 Stage Gate Approved',
        description: 'Mr. Nazareth Remedios approved your UML Diagrams & Architecture design.',
        time: 'Yesterday',
        isRead: true,
        actionTab: 'stages'
      }
    ];
  };

  // Dynamic notifications state based on role with localStorage persistence
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`dbit_notifs_${currentRole}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return getRoleDefaultNotifications(currentRole);
  });

  // Re-seed or restore notifications if currentRole changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`dbit_notifs_${currentRole}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
          return;
        }
      }
    } catch (e) {}
    const defaults = getRoleDefaultNotifications(currentRole);
    setNotifications(defaults);
    try {
      localStorage.setItem(`dbit_notifs_${currentRole}`, JSON.stringify(defaults));
    } catch (e) {}
  }, [currentRole]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      try {
        localStorage.setItem(`dbit_notifs_${currentRole}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearAll = () => {
    setNotifications([]);
    try {
      localStorage.setItem(`dbit_notifs_${currentRole}`, JSON.stringify([]));
    } catch (e) {}
  };

  const handleNotificationClick = (notif: AppNotification) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n);
      try {
        localStorage.setItem(`dbit_notifs_${currentRole}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setIsNotificationsOpen(false);
    if (onNavigateTab && notif.actionTab) {
      onNavigateTab(notif.actionTab);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-6 relative">
      {/* User Profile Selector Pill */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex items-center gap-2.5 sm:gap-3 p-1.5 pr-3 sm:pr-4 rounded-full bg-white/60 sm:bg-transparent hover:bg-white transition-colors duration-200 cursor-pointer text-left group border border-slate-200/60 sm:border-transparent"
        >
          {/* Avatar with smooth rounded frame */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#18191E] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm ring-2 ring-white shrink-0">
            {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'US'}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight group-hover:text-black truncate max-w-[150px] sm:max-w-none">
                {currentUser.name}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block -mt-0.5 truncate max-w-[180px] sm:max-w-none">
              {currentUser.email}
            </span>
          </div>
        </button>

        {/* Profile / Role Switcher Popover */}
        {isProfileMenuOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl p-3 shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2 border-b border-slate-100 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Active Account &amp; Role
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500">{currentUser.department || 'Computer Engineering'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                Switch Authority
              </span>

              {/* Student */}
              <button
                onClick={() => {
                  onRoleChange('student');
                  setIsProfileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentRole === 'student' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Student Controller</span>
                </div>
                {currentRole === 'student' && <Check className="w-3.5 h-3.5 text-slate-900" />}
              </button>

              {/* Faculty Guide */}
              <button
                onClick={() => {
                  onRoleChange('guide');
                  setIsProfileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentRole === 'guide' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span>Guide Controller</span>
                </div>
                {currentRole === 'guide' && <Check className="w-3.5 h-3.5 text-slate-900" />}
              </button>

              {/* Coordinator */}
              <button
                onClick={() => {
                  onRoleChange('coordinator');
                  setIsProfileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentRole === 'coordinator' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Coordinator Controller</span>
                </div>
                {currentRole === 'coordinator' && <Check className="w-3.5 h-3.5 text-slate-900" />}
              </button>

              {/* Admin */}
              <button
                onClick={() => {
                  onRoleChange('admin');
                  setIsProfileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentRole === 'admin' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCog className="w-4 h-4 text-slate-900" />
                  <span>Admin Authority</span>
                </div>
                {currentRole === 'admin' && <Check className="w-3.5 h-3.5 text-slate-900" />}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 mt-2">
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Search Pill & Working Notification Bell */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
        {/* Pill Search Input */}
        <div className="relative flex-1 sm:flex-none">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search proposals, topics..."
            className="w-full sm:w-56 md:w-64 lg:w-72 bg-white rounded-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200/70 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-slate-300 transition-all font-medium"
          />
        </div>

        {/* Working Notification Bell with Interactive Dropdown Popover */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-slate-950 border border-slate-200/70 shadow-xs relative transition-all duration-200 hover:scale-105 cursor-pointer shrink-0"
            title="Notifications"
            aria-label="Open notifications panel"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4F938] text-slate-950 text-[10px] font-black flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Notifications Drawer/Popover */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl p-4 shadow-2xl border border-slate-200/80 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#18191E] text-[#D4F938] text-[10px] font-mono font-bold">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[11px] font-bold text-slate-500 hover:text-black transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-[11px] font-medium text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Notification Items List */}
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No active notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`py-3 px-2 rounded-2xl transition-all cursor-pointer flex items-start gap-3 hover:bg-slate-50 ${
                        !n.isRead ? 'bg-slate-50/80' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        n.type === 'notice'
                          ? 'bg-[#18191E] text-[#D4F938]'
                          : n.type === 'ppt'
                            ? 'bg-[#D4F938] text-slate-950'
                            : n.type === 'conflict'
                              ? 'bg-red-500/10 text-red-600'
                              : 'bg-blue-500/10 text-blue-600'
                      }`}>
                        {n.type === 'notice' ? '💬' : n.type === 'ppt' ? '📊' : n.type === 'conflict' ? '⚖️' : '🔔'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs truncate ${!n.isRead ? 'font-black text-slate-950' : 'font-bold text-slate-800'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                          {n.description}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full inline-block">
                            Go to {n.actionTab.toUpperCase()}
                          </span>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#D4F938] ring-2 ring-[#18191E]" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-xs font-bold text-slate-500 hover:text-black transition-colors cursor-pointer"
                >
                  Close Notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
