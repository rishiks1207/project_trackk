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
  X,
  Layers,
  Calendar,
  UserCog,
  Check,
  GitBranch,
  Edit3,
  School,
  Plus
} from 'lucide-react';
import { UserAccount, UserRole, ProjectProposal, AcademicYearConfig, AcademicClass, AcademicBatch } from '../types';
import { 
  INITIAL_INSTITUTIONAL_USERS, 
  subscribeToUsers, 
  saveUserToFirestore, 
  deleteUserFromFirestore,
  saveProposalToFirestore
} from '../utils/firestoreSync';
import { 
  loadAcademicStructure, 
  saveAcademicStructure, 
  DEFAULT_ACADEMIC_STRUCTURE 
} from '../utils/academicStructure';

interface AdminPanelProps {
  proposals: ProjectProposal[];
  onSelectProposal: (proposalId: string) => void;
  onNavigateToTab: (tab: string) => void;
  onUpdateProposal?: (proposal: ProjectProposal) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  proposals,
  onSelectProposal,
  onNavigateToTab,
  onUpdateProposal
}) => {
  const [activeSection, setActiveSection] = useState<'users' | 'allocations' | 'structure'>('users');
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

  // Academic Structure State (FE, SE, TE, BE with Classes & Batches)
  const [academicStructure, setAcademicStructure] = useState<AcademicYearConfig[]>(() => loadAcademicStructure());
  const [activeYearKey, setActiveYearKey] = useState<string>('SE');
  const [newClassName, setNewClassName] = useState('');
  const [newBatchName, setNewBatchName] = useState('');
  const [activeClassForBatch, setActiveClassForBatch] = useState<string>('');

  // Project Allocation Modal State
  const [selectedPropToAssign, setSelectedPropToAssign] = useState<ProjectProposal | null>(null);
  const [assignedGuideName, setAssignedGuideName] = useState('');
  const [assignedCoordName, setAssignedCoordName] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Password Edit State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // User Details Edit State (Admin can change Email, Name, Role, Cohort, Roll, Group)
  const [editingUserDetails, setEditingUserDetails] = useState<UserAccount | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('student');
  const [editDepartment, setEditDepartment] = useState('Computer Engineering');
  const [editRollNo, setEditRollNo] = useState('');
  const [editGroupNo, setEditGroupNo] = useState<number | undefined>(undefined);
  const [editYear, setEditYear] = useState('SE');
  const [editClass, setEditClass] = useState('COMPS C');
  const [editBatch, setEditBatch] = useState('Batch A');
  const [isSavingUserEdit, setIsSavingUserEdit] = useState(false);

  // Form State for New Account Creation (Track No removed per specification; Year/Class/Batch selector)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('dbit2026');
  const [role, setRole] = useState<UserRole>('student');
  const [rollNo, setRollNo] = useState('');
  const [createYear, setCreateYear] = useState('SE');
  const [createClass, setCreateClass] = useState('COMPS C');
  const [createBatch, setCreateBatch] = useState('Batch A');
  const [groupNo, setGroupNo] = useState<number>(5);
  const [department, setDepartment] = useState('Computer Engineering');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mergeUserLists = (base: UserAccount[], incoming: UserAccount[]): UserAccount[] => {
    const map = new Map<string, UserAccount>();
    // First insert initial institutional users as baseline
    for (const u of INITIAL_INSTITUTIONAL_USERS) {
      const key = (u.email || '').toLowerCase().trim();
      if (key) map.set(key, u);
    }
    // Then merge base (e.g. from localStorage)
    for (const u of base) {
      const key = (u.email || '').toLowerCase().trim() || String(u.id);
      if (key) {
        const existing = map.get(key);
        map.set(key, existing ? { ...existing, ...u } : u);
      }
    }
    // Then merge incoming (e.g. from server / firestore)
    for (const u of incoming) {
      const key = (u.email || '').toLowerCase().trim() || String(u.id);
      if (key) {
        const existing = map.get(key);
        map.set(key, existing ? { ...existing, ...u } : u);
      }
    }
    return Array.from(map.values());
  };

  // Fetch users with resilience against static hosts and reloads
  const fetchUsers = async () => {
    setIsLoading(true);
    let localSaved: UserAccount[] = [];
    try {
      const saved = localStorage.getItem('dbit_admin_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localSaved = parsed;
        }
      }
    } catch (e) {}

    try {
      const res = await fetch('/api/users');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const serverData = await res.json();
        if (Array.isArray(serverData) && serverData.length > 0) {
          const merged = mergeUserLists(localSaved, serverData);
          setUserList(merged);
          try {
            localStorage.setItem('dbit_admin_users', JSON.stringify(merged));
          } catch (e) {}
          setIsLoading(false);
          return;
        }
      }
    } catch (err: any) {
      console.warn('Backend API offline, using local store:', err);
    }

    if (localSaved.length > 0) {
      const merged = mergeUserLists(INITIAL_INSTITUTIONAL_USERS, localSaved);
      setUserList(merged);
      setIsLoading(false);
      return;
    }

    setUserList(INITIAL_INSTITUTIONAL_USERS);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();

    // Subscribe to Firestore users collection in real time
    const unsub = subscribeToUsers((firestoreUsers) => {
      if (firestoreUsers && firestoreUsers.length > 0) {
        setUserList(prev => {
          const merged = mergeUserLists(prev, firestoreUsers);
          try {
            localStorage.setItem('dbit_admin_users', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
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

    const calculatedCohort = role === 'student'
      ? `${createYear} ${createClass} (${createBatch})`
      : role === 'guide'
        ? `${department} Faculty Guide`
        : role === 'coordinator'
          ? `${createYear} Capstone Coordinator`
          : 'DBIT Department Admin';

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim() || 'dbit2026',
      role,
      rollNo: role === 'student' ? rollNo.trim() : null,
      cohort: calculatedCohort,
      groupNo: role === 'student' ? Number(groupNo) : null,
      trackNo: null, // Track number removed per specification: will be assigned when a leader adds students to a project
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
          trackNo: undefined,
          department: payload.department,
          assignedProjectCount: 0,
          createdAt: new Date().toISOString()
        };
      }

      // Preserve credentials in Firestore and local storage
      const userWithCreds = {
        ...created,
        password: payload.password
      };

      const updated = [created, ...userList.filter(u => u.email.toLowerCase() !== created!.email.toLowerCase())];
      setUserList(updated);
      try {
        const localList = [userWithCreds, ...userList.filter(u => u.email.toLowerCase() !== created!.email.toLowerCase())];
        localStorage.setItem('dbit_admin_users', JSON.stringify(localList));
      } catch (e) {}

      // Save directly to Cloud Firestore users collection with full credentials
      await saveUserToFirestore(userWithCreds);

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

  // Open Edit User Details Modal
  const openEditModal = (user: UserAccount) => {
    setEditingUserDetails(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditDepartment(user.department || 'Computer Engineering');
    setEditRollNo(user.rollNo || '');
    setEditGroupNo(user.groupNo || 1);

    // Parse cohort e.g. "SE COMPS C (Batch A)"
    let y = 'SE';
    let c = 'COMPS C';
    let b = 'Batch A';
    if (user.cohort) {
      const parts = user.cohort.match(/(FE|SE|TE|BE)\s+([^(]+)(?:\(([^)]+)\))?/);
      if (parts) {
        if (parts[1]) y = parts[1].trim();
        if (parts[2]) c = parts[2].trim();
        if (parts[3]) b = parts[3].trim();
      }
    }
    setEditYear(y);
    setEditClass(c);
    setEditBatch(b);
  };

  // Save Edit User Details
  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserDetails) return;
    setIsSavingUserEdit(true);
    setErrorMsg(null);

    const calculatedCohort = editRole === 'student'
      ? `${editYear} ${editClass} (${editBatch})`
      : editingUserDetails.cohort || `${editDepartment} Faculty`;

    const updates: Partial<UserAccount> = {
      name: editName.trim(),
      email: editEmail.trim().toLowerCase(),
      role: editRole,
      department: editDepartment,
      rollNo: editRole === 'student' ? editRollNo.trim() : undefined,
      groupNo: editRole === 'student' ? Number(editGroupNo) : undefined,
      cohort: calculatedCohort
    };

    try {
      try {
        await fetch(`/api/users/${editingUserDetails.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      } catch (err) {
        console.warn('API error during user update, falling back:', err);
      }

      const updatedUser: UserAccount = {
        ...editingUserDetails,
        ...updates
      };

      const updatedList = userList.map(u => u.id === editingUserDetails.id ? updatedUser : u);
      setUserList(updatedList);
      try {
        localStorage.setItem('dbit_admin_users', JSON.stringify(updatedList));
      } catch (e) {}

      saveUserToFirestore(updatedUser);

      setSuccessMsg(`User details updated for ${updatedUser.name} (${updatedUser.email})!`);
      setEditingUserDetails(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update user details.');
    } finally {
      setIsSavingUserEdit(false);
    }
  };

  // Academic Structure handlers
  const handleAddClass = (yearKey: string) => {
    if (!newClassName.trim()) return;
    const trimmed = newClassName.trim().toUpperCase();
    const updated = academicStructure.map(y => {
      if (y.yearKey !== yearKey) return y;
      const newClass: AcademicClass = {
        id: `${yearKey.toLowerCase()}-${trimmed.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name: trimmed,
        batches: [
          { id: `b-a-${Date.now()}`, name: 'Batch A' },
          { id: `b-b-${Date.now()}`, name: 'Batch B' },
          { id: `b-c-${Date.now()}`, name: 'Batch C' }
        ]
      };
      return {
        ...y,
        classes: [...y.classes, newClass]
      };
    });
    setAcademicStructure(updated);
    saveAcademicStructure(updated);
    setNewClassName('');
    setSuccessMsg(`Added class "${trimmed}" with default Batch A, B, and C!`);
  };

  const handleRemoveClass = (yearKey: string, classId: string, className: string) => {
    if (!confirm(`Are you sure you want to delete class "${className}" and all its batches?`)) return;
    const updated = academicStructure.map(y => {
      if (y.yearKey !== yearKey) return y;
      return {
        ...y,
        classes: y.classes.filter(c => c.id !== classId)
      };
    });
    setAcademicStructure(updated);
    saveAcademicStructure(updated);
    setSuccessMsg(`Class "${className}" removed.`);
  };

  const handleAddBatch = (yearKey: string, classId: string) => {
    if (!newBatchName.trim()) return;
    const trimmed = newBatchName.trim();
    const updated = academicStructure.map(y => {
      if (y.yearKey !== yearKey) return y;
      return {
        ...y,
        classes: y.classes.map(c => {
          if (c.id !== classId) return c;
          return {
            ...c,
            batches: [...c.batches, { id: `b-${Date.now()}`, name: trimmed }]
          };
        })
      };
    });
    setAcademicStructure(updated);
    saveAcademicStructure(updated);
    setNewBatchName('');
    setActiveClassForBatch('');
    setSuccessMsg(`Added "${trimmed}" to class.`);
  };

  const handleRemoveBatch = (yearKey: string, classId: string, batchId: string, batchName: string) => {
    const updated = academicStructure.map(y => {
      if (y.yearKey !== yearKey) return y;
      return {
        ...y,
        classes: y.classes.map(c => {
          if (c.id !== classId) return c;
          return {
            ...c,
            batches: c.batches.filter(b => b.id !== batchId)
          };
        })
      };
    });
    setAcademicStructure(updated);
    saveAcademicStructure(updated);
    setSuccessMsg(`Batch "${batchName}" removed.`);
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

  const guidesList = userList.filter(u => u.role === 'guide');
  const coordList = userList.filter(u => u.role === 'coordinator');

  const handleAssignAllocation = (proposalId: string, newGuide: string, newCoord: string) => {
    const targetProp = proposals.find(p => p.id === proposalId);
    if (!targetProp) return;

    const updated: ProjectProposal = {
      ...targetProp,
      guideName: newGuide || targetProp.guideName,
      coordinatorName: newCoord || targetProp.coordinatorName,
      updatedAt: new Date().toISOString()
    };

    saveProposalToFirestore(updated);
    if (onUpdateProposal) {
      onUpdateProposal(updated);
    }
    setSuccessMsg(`Allocated ${updated.projectId}: Guide -> "${updated.guideName}", Coordinator -> "${updated.coordinatorName}"`);
    setTimeout(() => setSuccessMsg(null), 4000);
    setShowAssignModal(false);
  };

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
                <span>Cloud SQL &amp; Firestore Relational Sync</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Institutional User Accounts &amp; Faculty Allocations
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Provision accounts, assign Faculty Guides &amp; Coordinators to projects, and configure stage gate workflows
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeSection === 'users' ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#cbf525] text-slate-950 text-xs font-black px-5 py-3 rounded-full shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create New User Account</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (proposals.length > 0) {
                    setSelectedPropToAssign(proposals[0]);
                    setAssignedGuideName(proposals[0].guideName || (guidesList[0]?.name ?? ''));
                    setAssignedCoordName(proposals[0].coordinatorName || (coordList[0]?.name ?? ''));
                    setShowAssignModal(true);
                  }
                }}
                className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#cbf525] text-slate-950 text-xs font-black px-5 py-3 rounded-full shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                <UserCog className="w-4 h-4" />
                <span>Assign Guide &amp; Coordinator</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Stat Cards in Bento Colors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10 text-xs relative z-10">
          <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-sm">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Total Accounts</span>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono tabular-nums">{userList.length}</div>
            <span className="text-[11px] text-slate-500 font-medium">in Firestore DB</span>
          </div>

          <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-sm">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Faculty Guides</span>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono tabular-nums">{guideCount}</div>
            <span className="text-[11px] text-[#D4F938] font-bold">Mentorship &amp; Review</span>
          </div>

          <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-sm">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Coordinators</span>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono tabular-nums">{coordCount}</div>
            <span className="text-[11px] text-slate-900 font-bold">Arbitration &amp; Approval</span>
          </div>

          <div className="bg-white rounded-2xl p-4 text-slate-900 shadow-sm">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Capstones &amp; Projects</span>
            <div className="text-3xl font-black text-slate-900 mt-1 font-mono tabular-nums">{proposals.length}</div>
            <span className="text-[11px] text-[#C6B5FD] font-bold">Active Submissions</span>
          </div>
        </div>
      </div>

      {/* Switcher: User Accounts vs Project Allocations vs Academic Structure */}
      <div className="flex flex-wrap items-center gap-2 bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveSection('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeSection === 'users'
              ? 'bg-[#18191E] text-[#D4F938] shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts &amp; Roles ({userList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('allocations')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeSection === 'allocations'
              ? 'bg-[#18191E] text-[#D4F938] shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCog className="w-4 h-4" />
          <span>Project &amp; Faculty Allocations ({proposals.length} Projects)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('structure')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeSection === 'structure'
              ? 'bg-[#18191E] text-[#D4F938] shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <School className="w-4 h-4" />
          <span>Academic Structure (Years, Classes &amp; Batches)</span>
        </button>
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

      {activeSection === 'users' ? (
        <>
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
                                Arbitrates assigned cohort proposals
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
                                onClick={() => openEditModal(user)}
                                className="text-slate-700 hover:text-black hover:bg-[#D4F938]/40 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                                title="Edit User Details (Email, Name, Cohort, Roll, Group)"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-800" />
                                <span className="hidden sm:inline">Edit Details</span>
                              </button>

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
        </>
      ) : activeSection === 'allocations' ? (
        /* Allocations View: Assign Faculty Guides & Coordinators to Projects */
        <div className="space-y-6">
          {/* Header & Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Active Projects
              </span>
              <div className="text-2xl font-black text-slate-900">{proposals.length}</div>
              <span className="text-[11px] text-slate-500 font-medium">Across all cohorts</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Faculty Guides Registered
              </span>
              <div className="text-2xl font-black text-slate-900">{guidesList.length}</div>
              <span className="text-[11px] text-slate-500 font-medium">Available for allocation</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Project Coordinators
              </span>
              <div className="text-2xl font-black text-[#18191E]">{coordList.length}</div>
              <span className="text-[11px] text-slate-500 font-medium">Designated reviewers</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Database Sync Status
              </span>
              <div className="text-xs font-black text-emerald-700 flex items-center gap-1.5 mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Firestore Live Relational Mode</span>
              </div>
            </div>
          </div>

          {/* Allocations Table */}
          <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <UserCog className="w-5 h-5 text-slate-900" />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                    Project Allocation Console (Assign Guides &amp; Coordinators)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Select any faculty guide or coordinator from the dropdown to assign immediately.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                Auto-saved to Cloud Firestore
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F5F8] text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-4 pl-6">Project Title &amp; ID</th>
                    <th className="p-4">Student Team</th>
                    <th className="p-4">Assigned Faculty Guide</th>
                    <th className="p-4">Assigned Coordinator</th>
                    <th className="p-4 pr-6 text-right">Quick Navigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {proposals.map(proposal => {
                    const dbGuideNames = guidesList.map(g => g.name).filter(Boolean);
                    const guideChoices = Array.from(new Set([
                      ...dbGuideNames,
                      ...(proposal.guideName && !dbGuideNames.includes(proposal.guideName) ? [proposal.guideName] : [])
                    ])).filter(Boolean);

                    const dbCoordNames = coordList.map(c => c.name).filter(Boolean);
                    const coordChoices = Array.from(new Set([
                      ...dbCoordNames,
                      ...(proposal.coordinatorName && !dbCoordNames.includes(proposal.coordinatorName) ? [proposal.coordinatorName] : [])
                    ])).filter(Boolean);

                    return (
                      <tr key={proposal.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Project Details */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[11px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                              {proposal.projectId || `G${proposal.groupNo}`}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                              Track {proposal.trackNo}
                            </span>
                          </div>
                          <div className="font-extrabold text-slate-900 max-w-xs leading-snug line-clamp-2">
                            {proposal.title}
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 mt-0.5 inline-block">
                            {proposal.domain} • {proposal.cohort || proposal.academicYear}
                          </span>
                        </td>

                        {/* Student Team */}
                        <td className="p-4">
                          <div className="text-slate-800 font-bold mb-1">
                            Group {proposal.groupNo} ({proposal.teamMembers.length} Members)
                          </div>
                          <div className="text-[11px] text-slate-500 space-y-0.5">
                            {proposal.teamMembers.map((m, idx) => (
                              <div key={idx} className="truncate max-w-[200px]">
                                {m.name} {m.rollNo ? `(${m.rollNo})` : ''}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Interactive Guide Assignment - Sourced strictly from Database */}
                        <td className="p-4">
                          <div className="space-y-1.5">
                            <select
                              value={proposal.guideName || ''}
                              onChange={(e) => handleAssignAllocation(proposal.id, e.target.value, proposal.coordinatorName)}
                              className="w-full max-w-[220px] px-3 py-2 bg-[#F4F5F8] border border-slate-200/80 rounded-xl font-bold text-slate-800 text-xs focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                            >
                              {guideChoices.length === 0 ? (
                                <option value="" disabled>No Faculty Guides in DB</option>
                              ) : (
                                guideChoices.map(name => (
                                  <option key={name} value={name}>
                                    {name}
                                  </option>
                                ))
                              )}
                            </select>
                            <div className="text-[10px] text-slate-400 font-medium">
                              Sourced from database ({guidesList.length} guides)
                            </div>
                          </div>
                        </td>

                        {/* Interactive Coordinator Assignment - Sourced strictly from Database */}
                        <td className="p-4">
                          <div className="space-y-1.5">
                            <select
                              value={proposal.coordinatorName || ''}
                              onChange={(e) => handleAssignAllocation(proposal.id, proposal.guideName, e.target.value)}
                              className="w-full max-w-[220px] px-3 py-2 bg-[#F4F5F8] border border-slate-200/80 rounded-xl font-bold text-slate-800 text-xs focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                            >
                              {coordChoices.length === 0 ? (
                                <option value="" disabled>No Coordinators in DB</option>
                              ) : (
                                coordChoices.map(name => (
                                  <option key={name} value={name}>
                                    {name}
                                  </option>
                                ))
                              )}
                            </select>
                            <div className="text-[10px] text-slate-400 font-medium">
                              Sourced from database ({coordList.length} coordinators)
                            </div>
                          </div>
                        </td>

                        {/* Direct Navigation & Quick Assign Modal Trigger */}
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPropToAssign(proposal);
                                setAssignedGuideName(proposal.guideName || (guidesList[0]?.name ?? ''));
                                setAssignedCoordName(proposal.coordinatorName || (coordList[0]?.name ?? ''));
                                setShowAssignModal(true);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-400 text-slate-800 font-bold text-[11px] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                              title="Assign Faculty Guide & Coordinator"
                            >
                              <UserCog className="w-3.5 h-3.5 text-slate-700" />
                              <span>Assign</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onSelectProposal(proposal.id);
                                onNavigateToTab('stages');
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18191E] text-white hover:bg-black font-bold text-[11px] shadow-2xs hover:shadow-sm transition-all cursor-pointer"
                              title="Inspect Visual Stage Gate evaluation"
                            >
                              <Layers className="w-3.5 h-3.5 text-[#D4F938]" />
                              <span>Visual Stage Gate</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onSelectProposal(proposal.id);
                                onNavigateToTab('gantt');
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F5F8] text-slate-800 hover:bg-slate-200 font-bold text-[11px] transition-colors cursor-pointer"
                              title="View Project Tracking Gantt Timeline"
                            >
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>Tracking</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Academic Structure (Years, Classes & Batches) View */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938] font-bold uppercase tracking-wider">
                  Academic Governance
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Class Divisions &amp; Batch Management
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure classes for First (FE), Second (SE), Third (TE), and Final Year (BE) with customized division batches (Default: Batch A, Batch B, Batch C).
                </p>
              </div>

              {/* Year Selectors */}
              <div className="flex items-center gap-1.5 bg-[#F4F5F8] p-1.5 rounded-2xl border border-slate-200">
                {academicStructure.map(y => (
                  <button
                    key={y.yearKey}
                    type="button"
                    onClick={() => setActiveYearKey(y.yearKey)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      activeYearKey === y.yearKey
                        ? 'bg-[#18191E] text-[#D4F938] shadow-xs'
                        : 'text-slate-600 hover:text-black hover:bg-slate-200'
                    }`}
                  >
                    {y.yearKey} ({y.classes.length} Classes)
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Year Header & Add Class input */}
            {(() => {
              const currentYearObj = academicStructure.find(y => y.yearKey === activeYearKey) || academicStructure[0];
              return (
                <div className="space-y-6">
                  {/* Add Class bar */}
                  <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <School className="w-5 h-5 text-slate-900" />
                      <span className="text-xs font-bold text-slate-800">
                        Add New Class in <strong className="text-black font-black">{currentYearObj.yearName}</strong>:
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <input
                        type="text"
                        value={newClassName}
                        onChange={e => setNewClassName(e.target.value)}
                        placeholder="e.g. COMPS D or IT A or AI&DS A"
                        className="bg-white rounded-xl px-3.5 py-2 border border-slate-200 text-xs font-bold text-slate-900 flex-1 focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddClass(currentYearObj.yearKey)}
                        disabled={!newClassName.trim()}
                        className="inline-flex items-center gap-1.5 bg-[#18191E] hover:bg-black text-[#D4F938] text-xs font-black px-4 py-2 rounded-xl disabled:opacity-40 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Class</span>
                      </button>
                    </div>
                  </div>

                  {/* Class Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentYearObj.classes.map(cls => (
                      <div key={cls.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 hover:border-slate-400 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-[#18191E] text-[#D4F938] font-black text-xs flex items-center justify-center">
                              {currentYearObj.yearKey}
                            </span>
                            <h4 className="font-black text-slate-900 text-sm">
                              {cls.name}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveClass(currentYearObj.yearKey, cls.id, cls.name)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Class"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Batches Section */}
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                            Batches ({cls.batches.length}):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {cls.batches.map(batch => (
                              <span 
                                key={batch.id} 
                                className="inline-flex items-center gap-1.5 bg-[#F4F5F8] text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200/80"
                              >
                                <span>{batch.name}</span>
                                {cls.batches.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBatch(currentYearObj.yearKey, cls.id, batch.id, batch.name)}
                                    className="text-slate-400 hover:text-red-500 ml-0.5 cursor-pointer"
                                    title="Remove Batch"
                                  >
                                    ×
                                  </button>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Add Batch to this Class */}
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Add batch (e.g. Batch D)"
                            value={activeClassForBatch === cls.id ? newBatchName : ''}
                            onFocus={() => setActiveClassForBatch(cls.id)}
                            onChange={e => {
                              setActiveClassForBatch(cls.id);
                              setNewBatchName(e.target.value);
                            }}
                            className="bg-[#F8F9FA] rounded-xl px-2.5 py-1 text-[11px] border border-slate-200 font-medium flex-1 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddBatch(currentYearObj.yearKey, cls.id)}
                            disabled={activeClassForBatch !== cls.id || !newBatchName.trim()}
                            className="bg-[#18191E] text-white hover:bg-black text-[10px] font-bold px-3 py-1.5 rounded-xl disabled:opacity-40 transition-all cursor-pointer"
                          >
                            + Batch
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Quick Assign Modal */}
      {showAssignModal && selectedPropToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#18191E] rounded-[34px] p-2 border border-black/40 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col text-xs">
            <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D4F938] text-slate-950 flex items-center justify-center font-bold">
                  <UserCog className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#D4F938] uppercase font-bold">
                    Faculty Assignment
                  </span>
                  <h3 className="text-sm font-black text-white mt-0.5">
                    Assign Faculty &amp; Coordinator: {selectedPropToAssign.projectId}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-[#F4F5F8] rounded-[26px] space-y-4 m-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project</label>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs font-bold text-slate-900">
                  {selectedPropToAssign.title}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Assign Faculty Guide
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {guidesList.length} guides in database
                  </span>
                </div>
                <select
                  value={assignedGuideName}
                  onChange={e => setAssignedGuideName(e.target.value)}
                  className="w-full bg-white rounded-2xl px-4 py-2.5 border border-slate-200 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                >
                  <option value="">-- Select Faculty Guide from Database --</option>
                  {guidesList.map(g => (
                    <option key={g.id || g.name} value={g.name}>
                      {g.name} ({g.department || 'Faculty Guide'}{g.trackNo ? ` • Track ${g.trackNo}` : ''})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Assign Project Coordinator
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {coordList.length} coordinators in database
                  </span>
                </div>
                <select
                  value={assignedCoordName}
                  onChange={e => setAssignedCoordName(e.target.value)}
                  className="w-full bg-white rounded-2xl px-4 py-2.5 border border-slate-200 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                >
                  <option value="">-- Select Project Coordinator from Database --</option>
                  {coordList.map(c => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name} ({c.cohort || 'Coordinator'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAssignAllocation(selectedPropToAssign.id, assignedGuideName, assignedCoordName)}
                  className="bg-[#D4F938] hover:bg-[#cbf525] text-slate-950 font-black px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                >
                  Save Allocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <option value="student">Student (Submit &amp; Similarity Check)</option>
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
                    Academic Year, Class &amp; Batch Assignment
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Roll No.</label>
                      <input
                        type="text"
                        value={rollNo}
                        onChange={e => setRollNo(e.target.value)}
                        placeholder="e.g. 01"
                        className="w-full bg-[#F4F5F8] rounded-xl px-3 py-1.5 border border-slate-200 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Group No.</label>
                      <input
                        type="number"
                        value={groupNo}
                        onChange={e => setGroupNo(parseInt(e.target.value) || 1)}
                        className="w-full bg-[#F4F5F8] rounded-xl px-3 py-1.5 border border-slate-200 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Year -> Class -> Batch dropdown cascade */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Academic Year</label>
                      <select
                        value={createYear}
                        onChange={e => {
                          const yr = e.target.value;
                          setCreateYear(yr);
                          const yObj = academicStructure.find(y => y.yearKey === yr);
                          if (yObj && yObj.classes.length > 0) {
                            setCreateClass(yObj.classes[0].name);
                            if (yObj.classes[0].batches.length > 0) {
                              setCreateBatch(yObj.classes[0].batches[0].name);
                            }
                          }
                        }}
                        className="w-full bg-[#F4F5F8] rounded-xl px-2.5 py-1.5 border border-slate-200 font-bold text-xs"
                      >
                        {academicStructure.map(y => (
                          <option key={y.yearKey} value={y.yearKey}>{y.yearName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Class / Division</label>
                      <select
                        value={createClass}
                        onChange={e => {
                          const clsName = e.target.value;
                          setCreateClass(clsName);
                          const yObj = academicStructure.find(y => y.yearKey === createYear);
                          const cObj = yObj?.classes.find(c => c.name === clsName);
                          if (cObj && cObj.batches.length > 0) {
                            setCreateBatch(cObj.batches[0].name);
                          }
                        }}
                        className="w-full bg-[#F4F5F8] rounded-xl px-2.5 py-1.5 border border-slate-200 font-bold text-xs"
                      >
                        {(academicStructure.find(y => y.yearKey === createYear)?.classes || []).map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Batch</label>
                      <select
                        value={createBatch}
                        onChange={e => setCreateBatch(e.target.value)}
                        className="w-full bg-[#F4F5F8] rounded-xl px-2.5 py-1.5 border border-slate-200 font-bold text-xs"
                      >
                        {((academicStructure.find(y => y.yearKey === createYear)?.classes || [])
                          .find(c => c.name === createClass)?.batches || []).map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200/60 flex items-center justify-between">
                    <span>Generated Cohort:</span>
                    <strong className="text-black font-black">{createYear} {createClass} ({createBatch})</strong>
                  </div>
                </div>
              )}

              {role === 'coordinator' && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block text-xs">
                    Project Coordinator Cohort Responsibility
                  </span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Assigned Academic Year</label>
                    <select
                      value={createYear}
                      onChange={e => setCreateYear(e.target.value)}
                      className="w-full bg-[#F4F5F8] rounded-xl px-3 py-2 border border-slate-200 font-bold text-xs"
                    >
                      {academicStructure.map(y => (
                        <option key={y.yearKey} value={y.yearKey}>{y.yearName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {role === 'guide' && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block text-xs">
                    Faculty Department &amp; Domain
                  </span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Academic Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full bg-[#F4F5F8] rounded-xl px-3 py-1.5 border border-slate-200 font-medium text-xs"
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

      {/* Edit User Details Modal (Email, Name, Role, Cohort, Roll, Group) */}
      {editingUserDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#18191E] rounded-[34px] p-2 border border-black/40 shadow-2xl w-full max-w-xl my-8 overflow-hidden flex flex-col">
            <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D4F938] text-slate-950 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#D4F938] uppercase font-bold">
                    Admin Governance
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    Edit Account Details: {editingUserDetails.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUserDetails(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="p-6 bg-[#F4F5F8] rounded-[26px] space-y-4 text-xs m-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
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
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full bg-white rounded-2xl px-4 py-2.5 border border-slate-200 font-medium focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Account Role
                  </label>
                  <select
                    value={editRole}
                    onChange={e => setEditRole(e.target.value as UserRole)}
                    className="w-full bg-white rounded-2xl px-4 py-2.5 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                  >
                    <option value="student">Student</option>
                    <option value="guide">Faculty Guide</option>
                    <option value="coordinator">Project Coordinator</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={e => setEditDepartment(e.target.value)}
                    className="w-full bg-white rounded-2xl px-4 py-2.5 border border-slate-200 font-medium focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Student specific fields: Roll No, Group No, Year, Class, Batch */}
              {editRole === 'student' && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block text-xs">
                    Academic Year, Class Division &amp; Batch
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Roll No.</label>
                      <input
                        type="text"
                        value={editRollNo}
                        onChange={e => setEditRollNo(e.target.value)}
                        placeholder="e.g. 05"
                        className="w-full bg-[#F4F5F8] rounded-xl px-3 py-1.5 border border-slate-200 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Group No.</label>
                      <input
                        type="number"
                        value={editGroupNo || ''}
                        onChange={e => setEditGroupNo(parseInt(e.target.value) || 1)}
                        className="w-full bg-[#F4F5F8] rounded-xl px-3 py-1.5 border border-slate-200 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Year</label>
                      <select
                        value={editYear}
                        onChange={e => {
                          const yr = e.target.value;
                          setEditYear(yr);
                          const yObj = academicStructure.find(y => y.yearKey === yr);
                          if (yObj && yObj.classes.length > 0) {
                            setEditClass(yObj.classes[0].name);
                            if (yObj.classes[0].batches.length > 0) {
                              setEditBatch(yObj.classes[0].batches[0].name);
                            }
                          }
                        }}
                        className="w-full bg-[#F4F5F8] rounded-xl px-2.5 py-1.5 border border-slate-200 font-bold text-xs"
                      >
                        {academicStructure.map(y => (
                          <option key={y.yearKey} value={y.yearKey}>{y.yearName}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Class</label>
                      <select
                        value={editClass}
                        onChange={e => {
                          const clsName = e.target.value;
                          setEditClass(clsName);
                          const yObj = academicStructure.find(y => y.yearKey === editYear);
                          const cObj = yObj?.classes.find(c => c.name === clsName);
                          if (cObj && cObj.batches.length > 0) {
                            setEditBatch(cObj.batches[0].name);
                          }
                        }}
                        className="w-full bg-[#F4F5F8] rounded-xl px-2.5 py-1.5 border border-slate-200 font-bold text-xs"
                      >
                        {(academicStructure.find(y => y.yearKey === editYear)?.classes || []).map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Batch</label>
                      <select
                        value={editBatch}
                        onChange={e => setEditBatch(e.target.value)}
                        className="w-full bg-[#F4F5F8] rounded-xl px-2.5 py-1.5 border border-slate-200 font-bold text-xs"
                      >
                        {((academicStructure.find(y => y.yearKey === editYear)?.classes || [])
                          .find(c => c.name === editClass)?.batches || []).map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200/60 flex items-center justify-between">
                    <span>Target Cohort:</span>
                    <strong className="text-black font-black">{editYear} {editClass} ({editBatch})</strong>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingUserDetails(null)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingUserEdit}
                  className="bg-[#D4F938] hover:bg-[#cbf525] disabled:opacity-50 text-slate-950 font-black px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                >
                  {isSavingUserEdit ? 'Saving Changes...' : 'Save User Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
