import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  Database, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Lock,
  KeyRound,
  ArrowRight,
  Sparkles,
  Link2,
  X
} from 'lucide-react';
import { UserAccount, UserRole, ProjectProposal } from '../types';
import { 
  INITIAL_INSTITUTIONAL_USERS, 
  subscribeToUsers, 
  saveUserToFirestore, 
  deleteUserFromFirestore 
} from '../utils/firestoreSync';

interface AdminPanelProps {
  proposals: ProjectProposal[];
  onSelectProposal: (proposalId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  proposals,
  onSelectProposal,
  onNavigateToTab
}) => {
  const [userList, setUserList] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('dbit_admin_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_INSTITUTIONAL_USERS;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Password Edit State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Form State for New Account Creation
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('dbit2026');
  const [role, setRole] = useState<UserRole>('student');
  const [rollNo, setRollNo] = useState('');
  const [cohort, setCohort] = useState('SE COMPS C (Batch A)');
  const [groupNo, setGroupNo] = useState<number>(5);
  const [trackNo, setTrackNo] = useState<number>(7);
  const [department, setDepartment] = useState('Computer Engineering');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch users with resilience against static hosts
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setUserList(data);
          try {
            localStorage.setItem('dbit_admin_users', JSON.stringify(data));
          } catch (e) {}
          setIsLoading(false);
          return;
        }
      }
    } catch (err: any) {
      console.warn('Backend API offline, using local store:', err);
    }

    try {
      const saved = localStorage.getItem('dbit_admin_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUserList(parsed);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {}

    setUserList(INITIAL_INSTITUTIONAL_USERS);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();

    // Subscribe to Firestore users collection in real time
    const unsub = subscribeToUsers((firestoreUsers) => {
      if (firestoreUsers && firestoreUsers.length > 0) {
        setUserList(firestoreUsers);
        try {
          localStorage.setItem('dbit_admin_users', JSON.stringify(firestoreUsers));
        } catch (e) {}
      }
    });

    return () => unsub();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Name and email are required.');
      return;
    }

    setIsCreating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim() || 'dbit2026',
      role,
      rollNo: role === 'student' ? rollNo.trim() : null,
      cohort: cohort.trim(),
      groupNo: role === 'student' ? Number(groupNo) : null,
      trackNo: role === 'student' || role === 'guide' ? Number(trackNo) : null,
      department
    };

    try {
      let created: UserAccount | null = null;
      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          created = await res.json();
        }
      } catch (err) {
        // Fallback to local creation
      }

      if (!created) {
        created = {
          id: Date.now(),
          uid: `usr-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          role: payload.role as UserRole,
          rollNo: payload.rollNo || undefined,
          cohort: payload.cohort,
          groupNo: payload.groupNo || undefined,
          trackNo: payload.trackNo || undefined,
          department: payload.department,
          assignedProjectCount: 0,
          createdAt: new Date().toISOString()
        };
      }

      const updated = [created, ...userList];
      setUserList(updated);
      try {
        localStorage.setItem('dbit_admin_users', JSON.stringify(updated));
      } catch (e) {}

      // Save directly to Cloud Firestore users collection
      saveUserToFirestore(created);

      setSuccessMsg(`Successfully created ${created.role.toUpperCase()} account for ${created.name}!`);
      setShowCreateModal(false);
      setName('');
      setEmail('');
      setPassword('dbit2026');
      setRollNo('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating user in database.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (id: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete the account for "${userName}"?`)) return;

    try {
      fetch(`/api/users/${id}`, { method: 'DELETE' }).catch(() => {});
      const updated = userList.filter(u => u.id !== id);
      setUserList(updated);
      try {
        localStorage.setItem('dbit_admin_users', JSON.stringify(updated));
      } catch (e) {}

      // Delete from Cloud Firestore
      deleteUserFromFirestore(id);

      setSuccessMsg(`Account for "${userName}" deleted.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete account.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !newPassword.trim()) return;

    setIsUpdatingPassword(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      fetch(`/api/users/${editingUser.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword.trim() })
      }).catch(() => {});

      setSuccessMsg(`Password successfully updated for ${editingUser.name} (${editingUser.email}).`);
      setEditingUser(null);
      setNewPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating password in database.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Filtered accounts
  const filteredUsers = userList.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.rollNo && u.rollNo.includes(searchQuery)) ||
      (u.cohort && u.cohort.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  // Role counts
  const studentCount = userList.filter(u => u.role === 'student').length;
  const guideCount = userList.filter(u => u.role === 'guide').length;
  const coordCount = userList.filter(u => u.role === 'coordinator').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card in Dark Cockpit Theme */}
      <div className="bg-[#18191E] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#D4F938] text-slate-950 font-black uppercase tracking-wider">
                Admin Governance
              </span>
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                <Database className="w-3.5 h-3.5 text-[#D4F938]" />
                <span>Cloud SQL Relational Storage</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Department User Account Management &amp; Project Relations
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Provision accounts for Students, Faculty Guides, and Coordinators with linked project proposal tables
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#cbf525] text-slate-950 text-xs font-black px-5 py-3 rounded-full shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User Account</span>
          </button>
        </div>

        {/* 4 Stat Cards in Bento Colors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10 text-xs relative z-10">
          <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-sm">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Total Accounts</span>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono tabular-nums">{userList.length}</div>
            <span className="text-[11px] text-slate-500 font-medium">in PostgreSQL</span>
          </div>

          <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-sm">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Students</span>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono tabular-nums">{studentCount}</div>
            <span className="text-[11px] text-[#C6B5FD] font-bold">Submissions &amp; SBERT</span>
          </div>

          <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-sm">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Faculty Guides</span>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono tabular-nums">{guideCount}</div>
            <span className="text-[11px] text-[#D4F938] font-bold">Sign-offs &amp; Texts</span>
          </div>

          <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-sm">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Coordinators</span>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono tabular-nums">{coordCount}</div>
            <span className="text-[11px] text-slate-900 font-bold">Arbitration &amp; Awards</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-800 text-xs rounded-2xl border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-bold">{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-white text-slate-900 text-xs rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs border border-slate-100">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, roll number, or cohort..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#F4F5F8] rounded-full text-slate-800 placeholder-slate-400 border border-slate-200/60 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938] font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Role:</span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-[#F4F5F8] border border-slate-200/60 rounded-full font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
          >
            <option value="all">All Roles ({userList.length})</option>
            <option value="student">Students ({studentCount})</option>
            <option value="guide">Faculty Guides ({guideCount})</option>
            <option value="coordinator">Coordinators ({coordCount})</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Database Table Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-900" />
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
              Database User Accounts &amp; Related Projects
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-semibold">
            PostgreSQL • users table
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F5F8] text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4 pl-6">User Profile</th>
                <th className="p-4">Role</th>
                <th className="p-4">Cohort &amp; Details</th>
                <th className="p-4">Relational Project Linkage</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => {
                  const matchingProposal = proposals.find(p => 
                    p.teamMembers.some(m => m.email.toLowerCase() === user.email.toLowerCase()) ||
                    p.guideName.toLowerCase().includes(user.name.toLowerCase()) ||
                    (user.groupNo && p.groupNo === user.groupNo)
                  );

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Email */}
                      <td className="p-4 pl-6">
                        <div className="font-extrabold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{user.email}</div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          user.role === 'admin'
                            ? 'bg-[#18191E] text-white'
                            : user.role === 'coordinator'
                              ? 'bg-[#18191E] text-[#D4F938]'
                              : user.role === 'guide'
                                ? 'bg-[#C6B5FD] text-slate-900'
                                : 'bg-slate-100 text-slate-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Cohort / Roll / Group */}
                      <td className="p-4 text-slate-700">
                        <div className="font-semibold">{user.cohort || 'DBIT Department'}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {user.rollNo && <span>Roll: {user.rollNo} • </span>}
                          {user.groupNo && <span>Group: {user.groupNo} • </span>}
                          {user.trackNo && <span>Track: {user.trackNo}</span>}
                        </div>
                      </td>

                      {/* Relational Project Linkage */}
                      <td className="p-4">
                        {matchingProposal ? (
                          <div className="flex items-center gap-2">
                            <Link2 className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                            <div className="max-w-xs truncate">
                              <span className="font-mono text-[10px] font-bold text-slate-900 mr-1.5">
                                {matchingProposal.projectId || `G${matchingProposal.groupNo}`}
                              </span>
                              <span className="text-slate-600 font-medium truncate">
                                {matchingProposal.title}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                onSelectProposal(matchingProposal!.id);
                                onNavigateToTab('stages');
                              }}
                              className="text-[10px] text-slate-900 hover:text-black font-bold px-2 py-0.5 rounded-full bg-slate-100 hover:bg-[#D4F938] transition-colors shrink-0 cursor-pointer"
                            >
                              Check
                            </button>
                          </div>
                        ) : user.role === 'coordinator' ? (
                          <div className="text-[11px] text-slate-500 font-medium">
                            Arbitrates all {proposals.length} cohort proposals
                          </div>
                        ) : user.role === 'admin' ? (
                          <div className="text-[11px] text-slate-400 italic">
                            Department Administrator (Full Access)
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">
                            No proposal linked yet
                          </div>
                        )}
                      </td>

                      {/* Actions: Edit Password & Delete Account */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingUser(user);
                              setNewPassword('');
                            }}
                            className="text-slate-600 hover:text-slate-950 hover:bg-slate-100 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                            title="Edit Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Password</span>
                          </button>

                          {user.email !== 'admin@dbit.in' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    No accounts found matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Account Modal in Flux Design */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#18191E] rounded-[34px] p-2 border border-black/40 shadow-2xl w-full max-w-xl my-8 overflow-hidden flex flex-col">
            <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D4F938] text-slate-950 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#D4F938] uppercase font-bold">
                    Admin Authority
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    Create DBIT User Account in PostgreSQL
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="p-6 bg-[#F4F5F8] rounded-[26px] space-y-4 text-xs m-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Apoorvadeep Sinha"
                    className="w-full bg-white rounded-2xl px-4 py-2.5 border border-slate-200 font-medium focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Institutional Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. student@dbit.in"
                    className="w-full bg-white rounded-2xl px-4 py-2.5 border border-slate-200 font-medium focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Account Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full bg-white rounded-2xl px-4 py-2.5 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                  >
                    <option value="student">Student (Submit &amp; Cross-Check with SBERT)</option>
                    <option value="guide">Faculty Guide (Review &amp; Sign-off)</option>
                    <option value="coordinator">Project Coordinator (Arbitrate &amp; Award)</option>
                    <option value="admin">Administrator (Account &amp; DB Manager)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Initial Password
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="dbit2026"
                    className="w-full bg-white rounded-2xl px-4 py-2.5 border border-slate-200 font-mono font-bold focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Conditional fields based on role */}
              {role === 'student' && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block text-xs">
                    Student Cohort &amp; Project Group Linkage
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Roll No.</label>
                      <input
                        type="text"
                        value={rollNo}
                        onChange={e => setRollNo(e.target.value)}
                        placeholder="e.g. 01"
                        className="w-full bg-[#F4F5F8] rounded-xl px-3 py-1.5 border border-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Group No.</label>
                      <input
                        type="number"
                        value={groupNo}
                        onChange={e => setGroupNo(parseInt(e.target.value) || 1)}
                        className="w-full bg-[#F4F5F8] rounded-xl px-3 py-1.5 border border-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Track No.</label>
                      <input
                        type="number"
                        value={trackNo}
                        onChange={e => setTrackNo(parseInt(e.target.value) || 1)}
                        className="w-full bg-[#F4F5F8] rounded-xl px-3 py-1.5 border border-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Class Cohort</label>
                    <input
                      type="text"
                      value={cohort}
                      onChange={e => setCohort(e.target.value)}
                      className="w-full bg-[#F4F5F8] rounded-xl px-3 py-1.5 border border-slate-200 font-medium"
                    />
                  </div>
                </div>
              )}

              {role === 'guide' && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block text-xs">
                    Faculty Guide Allocation
                  </span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Assigned Track</label>
                    <input
                      type="number"
                      value={trackNo}
                      onChange={e => setTrackNo(parseInt(e.target.value) || 7)}
                      placeholder="e.g. 7"
                      className="w-full bg-[#F4F5F8] rounded-xl px-3 py-1.5 border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-[#D4F938] hover:bg-[#cbf525] text-slate-950 font-black px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                >
                  {isCreating ? 'Saving to Database...' : 'Save Account to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Password Modal in Flux Design */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#18191E] rounded-[34px] p-2 border border-black/40 shadow-2xl w-full max-w-md overflow-hidden flex flex-col text-xs">
            <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D4F938] text-slate-950 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#D4F938] uppercase font-bold">
                    Security Controller
                  </span>
                  <h3 className="text-sm font-black text-white mt-0.5">
                    Reset Password for {editingUser.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="p-6 bg-[#F4F5F8] rounded-[26px] space-y-4 m-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Account
                </label>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="font-extrabold text-slate-900">{editingUser.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{editingUser.email} • Role: {editingUser.role}</div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 4 chars)"
                  className="w-full bg-white rounded-2xl px-4 py-2.5 border border-slate-200 font-mono font-bold focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Password will be immediately updated in Cloud SQL `users` table.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword || !newPassword.trim()}
                  className="bg-[#D4F938] hover:bg-[#cbf525] disabled:opacity-50 text-slate-950 font-black px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                >
                  {isUpdatingPassword ? 'Updating Password...' : 'Save New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
