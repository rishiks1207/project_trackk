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
  onOpenPresentation: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FluxTopBar: React.FC<FluxTopBarProps> = ({
  currentUser,
  currentRole,
  onRoleChange,
  onLogout,
  onOpenPresentation,
  searchQuery,
  onSearchChange
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-6 relative">
      {/* User Profile Selector Pill (Left side, matching reference image) */}
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
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Search Pill, Bell, Review 1 Slides */}
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

        {/* Notification Bell with Badge */}
        <button 
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-slate-950 border border-slate-200/70 shadow-xs relative transition-all duration-200 hover:scale-105 cursor-pointer shrink-0"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#D4F938] text-slate-950 text-[9px] sm:text-[10px] font-black flex items-center justify-center shadow-xs">
            2
          </span>
        </button>

        {/* Review 1 PDF Deck */}
        <button
          onClick={onOpenPresentation}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-800 shadow-xs transition-all hover:scale-105 shrink-0"
        >
          <Presentation className="w-3.5 h-3.5 text-slate-600" />
          <span>Review 1 PDF</span>
        </button>
      </div>
    </div>
  );
};
