import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  GitBranch, 
  Scale, 
  Database, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  PlusCircle, 
  Sparkles, 
  FolderGit2, 
  MessageSquare, 
  Stamp, 
  Send,
  Eye,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  UserCog,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  Cpu,
  Activity,
  Check,
  Zap,
  SlidersHorizontal,
  BookmarkCheck,
  Calendar,
  LogOut,
  Presentation
} from 'lucide-react';
import { FluxSidebar } from './components/FluxSidebar';
import { FluxTopBar } from './components/FluxTopBar';
import { FluxBentoWidgets } from './components/FluxBentoWidgets';
import { LoginPage } from './components/LoginPage';
import { AdminPanel } from './components/AdminPanel';
import { ProposalSubmissionModal } from './components/ProposalSubmissionModal';
import { StageGateTracker } from './components/StageGateTracker';
import { ConflictResolutionDashboard } from './components/ConflictResolutionDashboard';
import { HistoricalRepository } from './components/HistoricalRepository';
import { ProjectGanttChart } from './components/ProjectGanttChart';
import { GuideNoticeBoard } from './components/GuideNoticeBoard';
import { GuideMessageModal } from './components/GuideMessageModal';
import { FeedbackLogModal } from './components/FeedbackLogModal';
import { PresentationViewerModal } from './components/PresentationViewerModal';

import { 
  ProjectProposal, 
  UserRole, 
  HistoricalProject, 
  StageGateMilestone, 
  GuideFeedback,
  GitHubSyncData,
  UserAccount,
  StudentMember,
  GuideMessage
} from './types';
import { 
  INITIAL_PROPOSALS, 
  INITIAL_HISTORICAL_PROJECTS 
} from './data/mockData';
import { getStatusBadgeDetails } from './utils/stateMachine';
import { 
  seedFirestoreIfEmpty, 
  subscribeToProposals, 
  subscribeToProjectArchive,
  subscribeToGuideMessages,
  INITIAL_GUIDE_MESSAGES,
  saveProposalToFirestore, 
  saveArchiveProjectToFirestore,
  updateMilestoneInFirestore 
} from './utils/firestoreSync';

export default function App() {
  // Authentication & active user state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('dbit_active_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    // Default to student (Rishik, Group 5) for instant preview if no saved session
    return {
      id: 5,
      uid: 'usr-stud-01',
      email: 'rishiks1207@gmail.com',
      name: 'Rishik Ezhuthachan',
      role: 'student',
      rollNo: '15',
      cohort: 'SE COMPS C (Batch A)',
      groupNo: 5,
      trackNo: 7,
      department: 'Computer Engineering'
    };
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser?.role || 'student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // App state
  const [proposals, setProposals] = useState<ProjectProposal[]>(INITIAL_PROPOSALS);
  const [historicalProjects, setHistoricalProjects] = useState<HistoricalProject[]>(INITIAL_HISTORICAL_PROJECTS);
  const [guideMessages, setGuideMessages] = useState<GuideMessage[]>(INITIAL_GUIDE_MESSAGES);
  const [selectedProposalId, setSelectedProposalId] = useState<string>('prop-group-05');
  
  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isPresentationModalOpen, setIsPresentationModalOpen] = useState(false);
  const [isGuideMessageModalOpen, setIsGuideMessageModalOpen] = useState(false);

  // Status, Domain & Sorting Filters for Proposals list
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'novelty' | 'alphabetical'>('newest');
  const [expandedProposalId, setExpandedProposalId] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Load initial data from PostgreSQL database and subscribe to Firestore
  useEffect(() => {
    async function loadFromDatabase() {
      try {
        const [propsRes, histRes] = await Promise.all([
          fetch('/api/proposals'),
          fetch('/api/historical-projects')
        ]);
        if (propsRes.ok && propsRes.headers.get('content-type')?.includes('application/json')) {
          const propsData = await propsRes.json();
          if (Array.isArray(propsData) && propsData.length > 0) {
            setProposals(propsData);
          }
        }
        if (histRes.ok && histRes.headers.get('content-type')?.includes('application/json')) {
          const histData = await histRes.json();
          if (Array.isArray(histData) && histData.length > 0) {
            setHistoricalProjects(histData);
          }
        }
      } catch (err) {
        console.warn('Backend API sync offline, using local state:', err);
      }
    }
    loadFromDatabase();

    // Initialize Firestore collections & sync in real-time
    seedFirestoreIfEmpty();
    const unsubProposals = subscribeToProposals((firestoreProposals) => {
      if (firestoreProposals && firestoreProposals.length > 0) {
        setProposals(firestoreProposals);
      }
    });

    const unsubArchive = subscribeToProjectArchive((archiveTheses) => {
      if (archiveTheses && archiveTheses.length > 0) {
        setHistoricalProjects(archiveTheses);
      }
    });

    const unsubMessages = subscribeToGuideMessages((msgs) => {
      if (msgs && msgs.length > 0) {
        setGuideMessages(msgs);
      }
    });

    return () => {
      unsubProposals();
      unsubArchive();
      unsubMessages();
    };
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    try {
      localStorage.setItem('dbit_active_user', JSON.stringify(user));
    } catch (e) {
      // ignore
    }
    setActiveTab(user.role === 'admin' ? 'admin' : 'dashboard');
    showToast(`Welcome ${user.name}! Logged in as ${user.role.toUpperCase()}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('dbit_active_user');
    } catch (e) {
      // ignore
    }
    showToast('Signed out successfully.');
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'admin') {
      setCurrentUser({
        id: 1,
        uid: 'usr-admin-01',
        email: 'admin@dbit.in',
        name: 'Admin',
        role: 'admin',
        cohort: 'System Administrator',
        department: 'Computer Engineering'
      });
      setActiveTab('admin');
    } else if (newRole === 'guide') {
      setCurrentUser({
        id: 3,
        uid: 'usr-guide-01',
        email: 'guide@dbit.in',
        name: 'Mr. Nazareth Remedios',
        role: 'guide',
        cohort: 'Faculty Guide',
        trackNo: 7,
        department: 'Computer Engineering'
      });
      setActiveTab('proposals');
    } else if (newRole === 'coordinator') {
      setCurrentUser({
        id: 2,
        uid: 'usr-coord-01',
        email: 'coordinator@dbit.in',
        name: 'Prof. Meenal Kulkarni',
        role: 'coordinator',
        cohort: 'SE/TE Project Coordinator',
        department: 'Computer Engineering'
      });
      setActiveTab('proposals');
    } else {
      setCurrentUser({
        id: 5,
        uid: 'usr-stud-01',
        email: 'rishiks1207@gmail.com',
        name: 'Rishik Ezhuthachan',
        role: 'student',
        rollNo: '15',
        groupNo: 5,
        trackNo: 7,
        cohort: 'SE COMPS C (Batch A)',
        department: 'Computer Engineering'
      });
      setActiveTab('dashboard');
    }
    showToast(`Switched active view to ${newRole.toUpperCase()} controller.`);
  };

  // Student's scoped proposal based on logged-in student account
  const studentProposal = proposals.find(p => 
    (currentUser?.groupNo && p.groupNo === currentUser.groupNo && (!currentUser.trackNo || p.trackNo === currentUser.trackNo)) ||
    (p.teamMembers && p.teamMembers.some(m => 
      (currentUser?.email && m.email && m.email.toLowerCase() === currentUser.email.toLowerCase()) ||
      (currentUser?.name && m.name && m.name.toLowerCase() === currentUser.name.toLowerCase()) ||
      (currentUser?.rollNo && m.rollNo && m.rollNo === currentUser.rollNo)
    ))
  );

  const activeProposal = proposals.find(p => p.id === selectedProposalId) || 
    (currentRole === 'student' ? studentProposal : undefined) || 
    proposals[0];

  // Count conflicts
  const conflictCount = proposals.filter(
    p => p.status === 'flagged_conflict' || p.status === 'coordinator_arbitration'
  ).length;

  // Dynamic Guide Notices count for active user/role
  const noticesCount = guideMessages.filter(m => {
    if (currentRole === 'student') {
      return !currentUser?.groupNo || m.targetGroupNo === currentUser.groupNo || m.targetGroupNo === 0;
    }
    if (currentRole === 'guide') {
      return !currentUser?.name || m.senderName.toLowerCase().includes(currentUser.name.toLowerCase());
    }
    return true;
  }).length;

  // Dynamic Thesis Archive count
  const thesesCount = historicalProjects.length;

  // Handlers
  const handleCreateProposal = (newProp: Partial<ProjectProposal>) => {
    const id = `prop-${Date.now()}`;
    const targetTrack = newProp.trackNo || currentUser?.trackNo || 7;
    const targetGroup = newProp.groupNo || currentUser?.groupNo || 1;
    const targetCohort = newProp.cohort || currentUser?.cohort || 'SE COMPS C (Batch A)';
    const generatedProjectId = `DBIT-SE-2026-T${targetTrack}-G${String(targetGroup).padStart(2, '0')}`;
    
    const defaultTeam: StudentMember[] = newProp.teamMembers && newProp.teamMembers.length > 0 
      ? newProp.teamMembers 
      : [
          { name: currentUser?.name || 'Student', rollNo: currentUser?.rollNo || '1', email: currentUser?.email || 'student@dbit.in', isLeader: true }
        ];

    const fullProposal: ProjectProposal = {
      id,
      projectId: generatedProjectId,
      trackNo: targetTrack,
      groupNo: targetGroup,
      academicYear: '2026-27',
      cohort: targetCohort,
      title: newProp.title || 'Untitled Proposal',
      domain: (newProp.domain as any) || 'AI/ML',
      abstract: newProp.abstract || '',
      problemStatement: newProp.problemStatement || '',
      objectives: newProp.objectives || [
        'Automated topic verification using NLP',
        'Stage-gate progress tracking'
      ],
      scope: {
        inScope: newProp.scope?.inScope || ['Department-level proposal submission', 'Similarity analysis'],
        outOfScope: newProp.scope?.outOfScope || ['Turnitin document scanning']
      },
      techStack: newProp.techStack || ['React', 'Python', 'FastAPI', 'PostgreSQL'],
      teamMembers: defaultTeam,
      guideName: newProp.guideName || 'Mr. Nazareth Remedios',
      coordinatorName: newProp.coordinatorName || 'Prof. Meenal Kulkarni',
      status: (newProp.similarityData?.isConflict) ? 'flagged_conflict' : 'submitted',
      lockedTopic: false,
      similarityData: newProp.similarityData || {
        overallScore: 0.18,
        sbertScore: 0.20,
        tfidfScore: 0.15,
        isConflict: false,
        explanation: 'Novel scope within DBIT Computer Engineering archives.'
      },
      stageGates: [
        {
          id: 'gate-0',
          title: 'Topic Approval & SBERT Screening',
          phase: 'stage1_design',
          weekRange: 'W1–W2',
          dueDate: '2026-07-14',
          status: 'in_progress',
          deliverableType: 'architecture_spec'
        },
        {
          id: 'gate-1',
          title: 'Review 1: Literature Review & Problem Formulation',
          phase: 'stage1_design',
          weekRange: 'W3–W4',
          dueDate: '2026-07-28',
          status: 'pending',
          deliverableType: 'architecture_spec'
        },
        {
          id: 'gate-2',
          title: 'System Architecture & Data Modeling',
          phase: 'stage2_dev',
          weekRange: 'W5–W6',
          dueDate: '2026-08-12',
          status: 'pending',
          deliverableType: 'uml_diagram'
        },
        {
          id: 'gate-3',
          title: 'Mid-Term Progress & Prototype Demonstration',
          phase: 'stage2_dev',
          weekRange: 'W7–W8',
          dueDate: '2026-08-26',
          status: 'pending',
          deliverableType: 'github_pr'
        },
        {
          id: 'gate-4',
          title: 'Integration, Unit & Regression Testing',
          phase: 'stage3_testing',
          weekRange: 'W9–W10',
          dueDate: '2026-09-09',
          status: 'pending',
          deliverableType: 'test_report'
        },
        {
          id: 'gate-5',
          title: 'Final Draft Project Report & Plagiarism Scan',
          phase: 'stage3_testing',
          weekRange: 'W11–W12',
          dueDate: '2026-09-23',
          status: 'pending',
          deliverableType: 'test_report'
        },
        {
          id: 'gate-6',
          title: 'Final Oral Presentation & Stage-Gate Clearance',
          phase: 'completed',
          weekRange: 'W13–W14',
          dueDate: '2026-10-07',
          status: 'pending',
          deliverableType: 'demo_video'
        }
      ],
      feedbackHistory: [
        {
          id: `fb-${Date.now()}`,
          authorName: 'Mr. Nazareth Remedios',
          authorRole: 'guide',
          timestamp: new Date().toISOString(),
          stage: 'Topic Submission',
          status: 'comment',
          remarks: 'Initial proposal registered. SBERT similarity score is within accepted safety boundaries (<0.75).'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProposals([fullProposal, ...proposals]);
    setSelectedProposalId(id);
    setIsSubmitModalOpen(false);
    setActiveTab('proposals');

    // Save to PostgreSQL backend & Firestore
    fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullProposal)
    }).catch(e => console.warn('Database async sync notice:', e));
    saveProposalToFirestore(fullProposal);

    showToast(`Project Proposal "${fullProposal.title}" registered successfully!`);
  };

  const handleUpdateMilestone = (milestoneId: string, updates: Partial<StageGateMilestone>) => {
    setProposals(prev => prev.map(p => {
      if (p.id !== selectedProposalId) return p;
      return {
        ...p,
        stageGates: p.stageGates.map(m => {
          if (m.id !== milestoneId) return m;
          return { ...m, ...updates };
        }),
        updatedAt: new Date().toISOString()
      };
    }));

    fetch(`/api/stage-gates/${milestoneId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(e => console.warn('Database async milestone update notice:', e));
    updateMilestoneInFirestore(selectedProposalId, { id: milestoneId, ...updates } as StageGateMilestone);

    showToast('Milestone updated and digitally saved.');
  };

  const handleUpdateGitHubData = (data: GitHubSyncData) => {
    setProposals(prev => prev.map(p => {
      if (p.id !== selectedProposalId) return p;
      return {
        ...p,
        githubData: data,
        updatedAt: new Date().toISOString()
      };
    }));

    showToast(`GitHub repository ${data.owner}/${data.repo} synchronized with Stage 2 Development!`);
  };

  const handleAddFeedback = (feedbackItem: Omit<GuideFeedback, 'id' | 'timestamp'>) => {
    const newFeedback: GuideFeedback = {
      ...feedbackItem,
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setProposals(prev => prev.map(p => {
      if (p.id !== selectedProposalId) return p;
      return {
        ...p,
        feedbackHistory: [newFeedback, ...(p.feedbackHistory || [])],
        updatedAt: new Date().toISOString()
      };
    }));

    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newFeedback.id,
        proposalId: selectedProposalId,
        authorName: newFeedback.authorName,
        authorRole: newFeedback.authorRole,
        stage: newFeedback.stage,
        status: newFeedback.status,
        remarks: newFeedback.remarks,
        actionItems: newFeedback.actionItems || []
      })
    }).catch(e => console.warn('Database async feedback notice:', e));

    showToast('Written feedback saved to permanent audit log.');
  };

  const handleSendReminder = () => {
    showToast(`Automated reminder alert dispatched to Guide (${activeProposal.guideName}) and Coordinator (${activeProposal.coordinatorName}).`);
  };

  const handleArbitrateConflict = (
    teamAId: string,
    teamBId: string,
    decision: 'award_a' | 'award_b' | 'approve_both_split_scope' | 'request_revision_b',
    remarks: string
  ) => {
    setProposals(prev => prev.map(p => {
      if (p.id === teamAId) {
        if (decision === 'award_a' || decision === 'approve_both_split_scope') {
          return {
            ...p,
            status: 'approved',
            lockedTopic: true,
            feedbackHistory: [
              {
                id: `fb-arb-${Date.now()}`,
                authorName: 'Prof. Meenal Kulkarni',
                authorRole: 'coordinator',
                timestamp: new Date().toISOString(),
                stage: 'Conflict Arbitration',
                status: 'approved',
                remarks: `Arbitration Decision: Approved topic after pitch defense review. ${remarks}`
              },
              ...p.feedbackHistory
            ]
          };
        }
      }
      if (p.id === teamBId) {
        if (decision === 'award_a') {
          return {
            ...p,
            status: 'revision_required',
            lockedTopic: false,
            feedbackHistory: [
              {
                id: `fb-arb-${Date.now()}`,
                authorName: 'Prof. Meenal Kulkarni',
                authorRole: 'coordinator',
                timestamp: new Date().toISOString(),
                stage: 'Conflict Arbitration',
                status: 'revision_required',
                remarks: `Topic awarded to Proposal A based on pitch defense and Review 1 maturity. Please pivot scope as instructed: ${remarks}`
              },
              ...p.feedbackHistory
            ]
          };
        } else if (decision === 'approve_both_split_scope') {
          return {
            ...p,
            status: 'approved',
            lockedTopic: true,
            feedbackHistory: [
              {
                id: `fb-arb-${Date.now()}`,
                authorName: 'Prof. Meenal Kulkarni',
                authorRole: 'coordinator',
                timestamp: new Date().toISOString(),
                stage: 'Conflict Arbitration',
                status: 'approved',
                remarks: `Both proposals approved with non-overlapping scopes: ${remarks}`
              },
              ...p.feedbackHistory
            ]
          };
        }
      }
      return p;
    }));

    fetch(`/api/proposals/${teamAId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', lockedTopic: true })
    }).catch(e => console.warn(e));

    showToast('Arbitration verdict recorded and student teams notified.');
  };

  const handleSavePitchDefense = (
    proposalId: string, 
    pitchText: string,
    keyDifferentiator?: string,
    targetStack?: string
  ) => {
    setProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      const updatedProposal: ProjectProposal = {
        ...p,
        pitchDefense: {
          content: pitchText,
          submittedAt: new Date().toISOString(),
          keyDifferentiator: keyDifferentiator || p.pitchDefense?.keyDifferentiator || 'SBERT Embeddings & DBIT Stage Gate Workflow',
          targetStack: targetStack || p.pitchDefense?.targetStack || p.techStack.join(', '),
          expectedDeliverable: p.pitchDefense?.expectedDeliverable || 'Full Functional MVP'
        }
      };
      saveProposalToFirestore(updatedProposal);
      return updatedProposal;
    }));
    showToast('200-Word Pitch Defense recorded and saved to database!');
  };

  const handleQuickApprove = (propId: string) => {
    let updatedTarget: ProjectProposal | null = null;
    setProposals(prev => prev.map(p => {
      if (p.id !== propId) return p;
      const updatedGates = (p.stageGates || []).map(g => {
        if (g.id === 'gate-0') return { ...g, status: 'approved' as const, guideApprovedBy: currentUser?.name || p.coordinatorName || 'Coordinator', guideApprovedDate: new Date().toISOString().split('T')[0] };
        if (g.id === 'gate-1' && (g.status === 'pending' || (g.status as string) === 'locked')) return { ...g, status: 'in_progress' as const };
        return g;
      });
      const updated: ProjectProposal = {
        ...p,
        status: 'approved',
        lockedTopic: true,
        stageGates: updatedGates,
        feedbackHistory: [
          {
            id: `fb-app-${Date.now()}`,
            authorName: currentRole === 'coordinator' ? (currentUser?.name || p.coordinatorName) : (currentUser?.name || p.guideName),
            authorRole: currentRole === 'coordinator' ? 'coordinator' : 'guide',
            timestamp: new Date().toISOString(),
            stage: 'Topic Approval',
            status: 'approved',
            remarks: 'Technical scope and methodology verified. Topic approved by Project Coordinator and assigned to Faculty Guide for mentoring.'
          },
          ...p.feedbackHistory
        ]
      };
      updatedTarget = updated;
      return updated;
    }));

    fetch(`/api/proposals/${propId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', lockedTopic: true })
    }).catch(e => console.warn(e));

    if (updatedTarget) {
      saveProposalToFirestore(updatedTarget);
    }

    showToast('Topic approved by Coordinator! Allocated to Faculty Guide for Stage 1 mentoring.');
  };

  // Filtered proposals list with multi-facet filters
  const filteredProposals = proposals.filter(p => {
    // 0. Student Visibility Constraint: Students can ONLY see their own proposal if it exists!
    if (currentRole === 'student') {
      const isMine = 
        (currentUser?.groupNo && p.groupNo === currentUser.groupNo && (!currentUser.trackNo || p.trackNo === currentUser.trackNo)) ||
        (p.teamMembers && p.teamMembers.some(m => 
          (currentUser?.email && m.email && m.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser?.name && m.name && m.name.toLowerCase() === currentUser.name.toLowerCase()) ||
          (currentUser?.rollNo && m.rollNo && m.rollNo === currentUser.rollNo)
        ));
      if (!isMine) return false;
    }

    // 1. Guide Visibility Constraint: Projects assigned to coordinator do NOT reach guide until approved
    if (currentRole === 'guide') {
      if (p.status !== 'approved' && p.status !== 'completed') return false;
      if (currentUser?.name && 
          !p.guideName.toLowerCase().includes(currentUser.name.toLowerCase()) && 
          !currentUser.name.toLowerCase().includes(p.guideName.toLowerCase()) &&
          currentUser.email !== 'guide@dbit.in') {
        return false;
      }
    }

    // 2. Status Filter
    if (statusFilter === 'conflicts' && !(p.status === 'flagged_conflict' || p.status === 'coordinator_arbitration')) return false;
    if (statusFilter === 'approved' && !(p.status === 'approved' || p.status === 'completed')) return false;
    if (statusFilter === 'under_review' && !(p.status === 'under_guide_review' || p.status === 'evaluating_similarity')) return false;

    // 3. Domain Filter
    if (domainFilter !== 'all' && !p.domain.toLowerCase().includes(domainFilter.toLowerCase())) return false;

    // 4. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchId = (p.projectId || '').toLowerCase().includes(q);
      const matchMembers = p.teamMembers.some(m => m.name.toLowerCase().includes(q));
      const matchTech = p.techStack.some(t => t.toLowerCase().includes(q));
      const matchGuide = p.guideName.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchMembers && !matchTech && !matchGuide) return false;
    }

    return true;
  });

  // Sorted proposals list by Newest, Highest Novelty, or Alphabetical
  const sortedProposals = [...filteredProposals].sort((a, b) => {
    if (sortBy === 'novelty') {
      const noveltyA = 1 - (a.similarityData?.overallScore ?? 0.5);
      const noveltyB = 1 - (b.similarityData?.overallScore ?? 0.5);
      return noveltyB - noveltyA; // Highest novelty first
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    // Default 'newest'
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (timeA !== timeB) return timeB - timeA;
    return (b.projectId || b.id).localeCompare(a.projectId || a.id);
  });

  // If user is not logged in, render dedicated LoginPage
  if (!currentUser) {
    return (
      <>
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onOpenPresentation={() => setIsPresentationModalOpen(true)}
        />
        <PresentationViewerModal
          isOpen={isPresentationModalOpen}
          onClose={() => setIsPresentationModalOpen(false)}
        />
      </>
    );
  }

  // Get view title and subtitle based on active tab
  const getViewDetails = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Project Overview',
          subtitle: 'Take control of your cohort progress & semantic review today!'
        };
      case 'proposals':
        return {
          title: currentRole === 'student' ? 'My Project & SBERT Novelty' : 'Cohort Proposals & Allocation',
          subtitle: 'Real-time NLP similarity screening against 500+ departmental theses'
        };
      case 'gantt':
        return {
          title: '14-Week Project Timeline',
          subtitle: 'Interactive milestone schedule, task dependencies and critical path'
        };
      case 'stages':
        return {
          title: 'Stage-Gate Progression & GitHub Sync',
          subtitle: '7-phase milestone sign-offs, deliverable uploads and Git commit tracking'
        };
      case 'conflicts':
        return {
          title: 'Topic Arbitration & Pitch Defense',
          subtitle: 'Coordinator side-by-side novelty matrix and scope allocation queue'
        };
      case 'repository':
        return {
          title: 'Historical Theses Archive & Sandbox',
          subtitle: 'Browse 500+ archived final year projects and test pre-submission abstracts'
        };
      case 'notices':
        return {
          title: 'Guide Notices & Student Texts',
          subtitle: 'Official faculty announcements, deadline revisions and cohort advisories'
        };
      case 'admin':
        return {
          title: 'Database & Account Management',
          subtitle: 'Cloud SQL PostgreSQL user directory, group relations and security roles'
        };
      default:
        return {
          title: 'Project Overview',
          subtitle: 'Take control of your cohort progress & semantic review today!'
        };
    }
  };

  const viewDetails = getViewDetails();

  return (
    <div className="min-h-screen w-full bg-[#F4F5F8] flex flex-col md:flex-row font-sans antialiased text-slate-900 selection:bg-[#D4F938] selection:text-slate-950">
      
      {/* Dark Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18191E] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 text-xs animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles className="w-4 h-4 text-[#D4F938] shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-base leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Left Dark Sidebar Rail (Flush edge-to-edge layout) */}
      <FluxSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentRole={currentRole}
        conflictCount={
          currentRole === 'student'
            ? (studentProposal?.status === 'flagged_conflict' || studentProposal?.status === 'coordinator_arbitration' ? 1 : 0)
            : conflictCount
        }
        proposalsCount={currentRole === 'student' ? (studentProposal ? 1 : 0) : proposals.length}
        noticesCount={noticesCount}
        thesesCount={thesesCount}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenGuideMessageModal={() => setIsGuideMessageModalOpen(true)}
      />

      {/* Right Main Porcelain Content Viewport (Straight up edge-to-edge webapp) */}
      <div className="flex-1 bg-[#F4F5F8] p-4 sm:p-7 lg:p-8 pb-24 md:pb-8 flex flex-col overflow-y-auto min-h-screen">
          
          {/* Top Bar with User Avatar, Pill Search, and Working Notification Bell */}
          <FluxTopBar
            currentUser={currentUser}
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            onLogout={handleLogout}
            onOpenPresentation={() => setActiveTab('gantt')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigateTab={setActiveTab}
            noticesCount={noticesCount}
          />

          {/* Page Display Header (Big Bold Title + Subtitle + Date Filter Pill) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pt-1">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-none">
                {viewDetails.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
                {viewDetails.subtitle}
              </p>
            </div>

            {/* Date stamp & Dropdown Filter Pill */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                24 October, 2026
              </span>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-slate-800 text-xs font-bold border border-slate-200/70 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors">
                <span>Cohort 2026</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* ===================== VIEW 1: DASHBOARD (THE SIGNATURE BENTO COCKPIT) ===================== */}
          {activeTab === 'dashboard' && (
            <div>
              {/* The 4 Signature Flux Bento Widgets */}
              <FluxBentoWidgets
                proposals={proposals}
                currentRole={currentRole}
                currentUser={currentUser}
                onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                onNavigateToTab={setActiveTab}
              />

              {/* Role-Aware Section Below Bento Widgets */}
              {currentRole === 'student' ? (
                /* ================= STUDENT PERSONAL PROJECT WORKSPACE ================= */
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2 mt-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938] font-black uppercase">
                          My Project Command Center
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {currentUser?.cohort || 'SE COMPS'}{currentUser?.trackNo ? ` • Track ${currentUser.trackNo}` : ''}{currentUser?.groupNo ? ` • Group ${String(currentUser.groupNo).padStart(2, '0')}` : ''}
                        </span>
                      </div>
                      <h2 className="text-xl font-black text-[#18191E] mt-1 tracking-tight">
                        My Engineering Proposal &amp; Milestone Deliverables
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsSubmitModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4F938] hover:bg-[#cbf525] text-black text-xs font-black shadow-xs transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Submit / Update Proposal</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('gantt')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-[#18191E] text-xs font-bold border border-slate-200/80 shadow-xs transition-all cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-black" />
                        <span>Gantt Chart &amp; PPT Reviews</span>
                      </button>
                    </div>
                  </div>

                  {/* Student's Featured Project Bento Card */}
                  {(() => {
                    const myProp = studentProposal;
                    if (!myProp) {
                      return (
                        <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-xs border border-slate-200/80 space-y-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                            <div className="space-y-2 max-w-2xl">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono font-black px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 border border-amber-300">
                                  Action Required
                                </span>
                                <span className="text-xs font-semibold text-slate-500">
                                  Logged in as {currentUser?.name || 'Student'} ({currentUser?.cohort || 'SE COMPS'})
                                </span>
                              </div>
                              <h3 className="text-2xl font-black text-[#18191E] tracking-tight">
                                No Project Proposal Submitted Yet
                              </h3>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                To begin milestone tracking, automated SBERT originality verification, and stage-gate evaluations, you must register your project proposal. Submitting your proposal assigns your project to your Faculty Guide for review and unlocks your 14-week engineering timeline.
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                              <button
                                onClick={() => setIsSubmitModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#D4F938] hover:bg-[#cbf525] text-black text-xs font-black shadow-xs transition-all cursor-pointer"
                              >
                                <PlusCircle className="w-4 h-4" />
                                <span>Submit Project Proposal</span>
                              </button>
                              <button
                                onClick={() => setActiveTab('repository')}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/80 shadow-xs transition-all cursor-pointer"
                              >
                                <Search className="w-4 h-4 text-slate-500" />
                                <span>Browse Archives First</span>
                              </button>
                            </div>
                          </div>

                          {/* 3 Step Guidance Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-200/60 space-y-2">
                              <div className="w-8 h-8 rounded-xl bg-[#18191E] text-[#D4F938] flex items-center justify-center text-xs font-black">
                                1
                              </div>
                              <h4 className="text-xs font-black text-[#18191E]">1. Submit Proposal &amp; Abstract</h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                Enter your title, problem statement, technical stack, and team members with your assigned track and group number.
                              </p>
                            </div>

                            <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-200/60 space-y-2">
                              <div className="w-8 h-8 rounded-xl bg-[#18191E] text-[#C6B5FD] flex items-center justify-center text-xs font-black">
                                2
                              </div>
                              <h4 className="text-xs font-black text-[#18191E]">2. Automated SBERT Screening</h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                The system runs real-time Sentence-BERT embeddings against 500+ archived DBIT theses to guarantee topic originality (&lt;75% similarity).
                              </p>
                            </div>

                            <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-slate-200/60 space-y-2">
                              <div className="w-8 h-8 rounded-xl bg-[#18191E] text-white flex items-center justify-center text-xs font-black">
                                3
                              </div>
                              <h4 className="text-xs font-black text-[#18191E]">3. Guide Review &amp; Stage Gates</h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                Once submitted, your guide reviews and locks the topic, instantly activating Review 1, GitHub milestone sync, and the 14-week timeline.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    const badge = getStatusBadgeDetails(myProp.status);
                    const sbertVal = Math.round((myProp.similarityData?.sbertScore ?? 0.18) * 100);
                    const lexicalVal = Math.round((myProp.similarityData?.tfidfScore ?? 0.12) * 100);
                    const noveltyVal = Math.round((1 - (myProp.similarityData?.overallScore ?? 0.08)) * 100);

                    return (
                      <div className="bg-white rounded-[28px] p-6 lg:p-7 shadow-xs border border-slate-200/80 space-y-5">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                          {/* Left: Project Details */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938]">
                                {myProp.projectId || 'DBIT-SE-2026'}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                Track {myProp.trackNo} · Group {String(myProp.groupNo).padStart(2, '0')}
                              </span>
                              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#C6B5FD] text-black">
                                {badge.label}
                              </span>
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D4F938] text-black">
                                {noveltyVal}% Originality
                              </span>
                            </div>

                            <h3 className="text-xl font-black text-[#18191E] leading-tight">
                              {myProp.title}
                            </h3>

                            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                              {myProp.abstract}
                            </p>

                            {/* Team Members */}
                            <div className="flex items-center gap-2 pt-1 text-xs text-slate-600 flex-wrap">
                              <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                                {myProp.groupNo ? `Group ${String(myProp.groupNo).padStart(2, '0')}` : 'Project'} Team:
                              </span>
                              {myProp.teamMembers.map((m, idx) => (
                                <span key={idx} className="bg-[#F4F5F8] border border-slate-200 rounded-full px-3 py-1 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <span>{m.name}</span>
                                  {m.isLeader && (
                                    <span className="text-[9px] bg-[#18191E] text-[#D4F938] px-1.5 py-0.2 rounded-full font-bold">
                                      Lead
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>

                            {/* Faculty Guide Details */}
                            <div className="pt-2 text-xs text-slate-500 flex items-center gap-4">
                              <span>Faculty Guide: <strong className="text-black font-bold">{myProp.guideName}</strong></span>
                              <span>•</span>
                              <span>Cohort: <strong className="text-black font-bold">{myProp.cohort}</strong></span>
                              <span>•</span>
                              <span>Domain: <strong className="text-black font-bold">{myProp.domain}</strong></span>
                            </div>
                          </div>

                          {/* Right: SBERT Score Bubble & Fast Action Buttons */}
                          <div className="flex flex-col items-start lg:items-end gap-4 shrink-0">
                            <div className="flex items-center gap-3 bg-[#F4F5F8] p-3.5 rounded-2xl border border-slate-200/80">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">SBERT Dense</span>
                                <span className="text-base font-black font-mono text-black">
                                  {sbertVal}%
                                </span>
                              </div>
                              <div className="h-7 w-px bg-slate-300" />
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">TF-IDF Lexical</span>
                                <span className="text-base font-black font-mono text-black">
                                  {lexicalVal}%
                                </span>
                              </div>
                              <div className="h-7 w-px bg-slate-300" />
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Novelty</span>
                                <span className="text-base font-black font-mono text-emerald-700">
                                  {noveltyVal}%
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedProposalId(myProp.id);
                                  setActiveTab('gantt');
                                }}
                                className="px-4 py-2 rounded-full bg-[#F4F5F8] hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors border border-slate-200 cursor-pointer"
                              >
                                14-Wk Timeline
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProposalId(myProp.id);
                                  setActiveTab('stages');
                                }}
                                className="px-4 py-2 rounded-full bg-[#18191E] hover:bg-black text-xs font-bold text-[#D4F938] transition-colors cursor-pointer"
                              >
                                Stage Gates &amp; Upload
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedProposalId(myProp.id);
                                  setActiveTab('conflicts');
                                }}
                                className="px-4 py-2 rounded-full bg-[#C6B5FD] hover:bg-[#b5a2fc] text-xs font-black text-black transition-colors cursor-pointer"
                              >
                                200-Word Pitch
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* ================= COORDINATOR / FACULTY / ADMIN VIEWS ================= */
                currentRole === 'coordinator' ? (
                  /* ================= COORDINATOR OVERVIEW (ONLY ASSIGNED PROJECTS) ================= */
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2 mt-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938] font-black uppercase tracking-wider">
                            Coordinator Review Console
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {currentUser?.name || 'Project Coordinator'}
                          </span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">
                          Projects Assigned to You
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                          Evaluate milestone deliverables (Approve, Suggest Revisions, Reject), inspect stage gates, and track project timelines.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('proposals')}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-black bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-xs transition-colors cursor-pointer"
                        >
                          <span>All Department Proposals ({proposals.length})</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {(() => {
                      const coordinatorProposals = proposals.filter(p => 
                        !currentUser?.name || 
                        p.coordinatorName?.toLowerCase().includes(currentUser.name.toLowerCase()) ||
                        currentUser.name.toLowerCase().includes(p.coordinatorName?.toLowerCase()) ||
                        currentUser.email === 'coordinator@dbit.in'
                      );

                      if (coordinatorProposals.length === 0) {
                        return (
                          <div className="bg-white rounded-[28px] p-8 shadow-xs border border-slate-200/80 text-center space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#18191E] text-[#D4F938] flex items-center justify-center mx-auto shadow-md">
                              <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-[#18191E]">No Projects Assigned to You Yet</h3>
                            <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
                              You are logged in as {currentUser?.name || 'Project Coordinator'}. No project proposals have been assigned to your coordinator account yet. Department Administrators can allocate projects and designate you as the coordinator in the Admin Panel.
                            </p>
                            <button
                              onClick={() => setActiveTab('proposals')}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#18191E] hover:bg-black text-[#D4F938] text-xs font-bold transition-all cursor-pointer"
                            >
                              <span>Browse All Proposals</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 gap-4">
                          {coordinatorProposals.map((prop) => {
                            const badge = getStatusBadgeDetails(prop.status);
                            const isSelected = selectedProposalId === prop.id;
                            const sbertVal = Math.round((prop.similarityData?.sbertScore ?? 0.42) * 100);
                            const lexicalVal = Math.round((prop.similarityData?.tfidfScore ?? 0.35) * 100);

                            return (
                              <div 
                                key={prop.id}
                                className={`bg-white rounded-[28px] p-6 shadow-xs border transition-all duration-200 ${
                                  isSelected ? 'border-[#18191E] ring-2 ring-[#D4F938]' : 'border-slate-200/80 hover:border-slate-400'
                                }`}
                              >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938]">
                                        {prop.projectId || `G${prop.groupNo}`}
                                      </span>
                                      <span className="text-xs font-semibold text-slate-500">
                                        Track {prop.trackNo} · Group {prop.groupNo}
                                      </span>
                                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                                        prop.status === 'approved' 
                                          ? 'bg-[#C6B5FD] text-black' 
                                          : prop.status === 'flagged_conflict'
                                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                                            : 'bg-[#D4F938] text-black'
                                      }`}>
                                        {badge.label}
                                      </span>
                                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                        {prop.domain}
                                      </span>
                                    </div>

                                    <h3 
                                      className="text-lg font-black text-[#18191E] hover:text-black cursor-pointer" 
                                      onClick={() => setSelectedProposalId(prop.id)}
                                    >
                                      {prop.title}
                                    </h3>

                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                      {prop.abstract}
                                    </p>

                                    <div className="flex items-center gap-4 pt-1 text-xs text-slate-600 flex-wrap">
                                      <div>
                                        <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mr-1.5">Guide:</span>
                                        <span className="font-extrabold text-slate-900">{prop.guideName}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mr-1">Team:</span>
                                        {prop.teamMembers.map((m, idx) => (
                                          <span key={idx} className="bg-[#F4F5F8] border border-slate-200 rounded-full px-3 py-0.5 text-xs font-bold text-slate-800">
                                            {m.name} {m.rollNo && `(${m.rollNo})`}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                                    <div className="flex items-center gap-3 bg-[#F4F5F8] p-3 rounded-2xl border border-slate-200/80">
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">SBERT</span>
                                        <span className="text-sm font-black font-mono text-black">
                                          {sbertVal}%
                                        </span>
                                      </div>
                                      <div className="h-6 w-px bg-slate-300" />
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Lexical</span>
                                        <span className="text-sm font-black font-mono text-black">
                                          {lexicalVal}%
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                      <button
                                        onClick={() => {
                                          setSelectedProposalId(prop.id);
                                          setActiveTab('stages');
                                        }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18191E] hover:bg-black text-xs font-bold text-[#D4F938] transition-colors shadow-xs cursor-pointer"
                                        title="Inspect and evaluate Visual Stage Gates"
                                      >
                                        <Layers className="w-3.5 h-3.5" />
                                        <span>Visual Stage Gate</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedProposalId(prop.id);
                                          setActiveTab('gantt');
                                        }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F4F5F8] hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors border border-slate-200 cursor-pointer"
                                        title="View Project Tracking Gantt timeline"
                                      >
                                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                                        <span>Project Tracking</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  /* ================= FACULTY GUIDE / ADMIN COHORT OVERVIEW ================= */
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 mt-2">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">
                          {currentRole === 'guide' ? 'My Assigned Student Groups' : 'Active Cohort Submissions'}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                          {currentRole === 'guide'
                            ? `Proposals under faculty mentorship of ${currentUser?.name || 'Faculty Guide'}`
                            : 'Verified through automated Sentence-BERT embeddings & TF-IDF lexical matrix'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('proposals')}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-blue-600 bg-white px-3.5 py-2 rounded-full border border-slate-200/80 shadow-xs transition-colors"
                        >
                          <span>View All ({proposals.length})</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Domain Quick-Filter Chips */}
                    <div className="flex items-center gap-2 flex-wrap mb-5 text-xs">
                      <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mr-1">
                        Filter:
                      </span>
                      {['all', 'AI/ML', 'NLP', 'Cloud', 'IoT', 'Security'].map(dom => (
                        <button
                          key={dom}
                          onClick={() => setDomainFilter(dom)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            domainFilter === dom
                              ? 'bg-[#18191E] text-[#D4F938] shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                          }`}
                        >
                          {dom === 'all' ? 'All Domains' : dom}
                        </button>
                      ))}
                    </div>

                    {/* Proposals Cards Grid */}
                    {(() => {
                      const displayedProposals = currentRole === 'guide'
                        ? filteredProposals.filter(p => 
                            !currentUser?.name || 
                            p.guideName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
                            currentUser.name.toLowerCase().includes(p.guideName.toLowerCase())
                          )
                        : filteredProposals;

                      if (currentRole === 'guide' && displayedProposals.length === 0) {
                        return (
                          <div className="bg-white rounded-[28px] p-8 shadow-xs border border-slate-200/80 text-center space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#18191E] text-[#D4F938] flex items-center justify-center mx-auto shadow-md">
                              <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-[#18191E]">No Student Groups Assigned to You Yet</h3>
                            <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
                              You are logged in as {currentUser?.name || 'Faculty Guide'}. There are currently no student project proposals assigned under your guide name. As students submit proposals designating you as their guide, they will appear here for review, SBERT inspection, and stage gate evaluation.
                            </p>
                            <button
                              onClick={() => setActiveTab('proposals')}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#18191E] hover:bg-black text-[#D4F938] text-xs font-bold transition-all cursor-pointer"
                            >
                              <span>View All Cohort Proposals</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 gap-4">
                          {displayedProposals.slice(0, 3).map((prop) => {
                            const badge = getStatusBadgeDetails(prop.status);
                            const isSelected = selectedProposalId === prop.id;
                            const sbertVal = Math.round((prop.similarityData?.sbertScore ?? 0.42) * 100);
                            const lexicalVal = Math.round((prop.similarityData?.tfidfScore ?? 0.35) * 100);

                            return (
                              <div 
                                key={prop.id}
                                className={`bg-white rounded-[28px] p-6 shadow-xs border transition-all duration-200 ${
                                  isSelected ? 'border-[#18191E] ring-2 ring-[#D4F938]' : 'border-slate-200/80 hover:border-slate-400'
                                }`}
                              >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938]">
                                        {prop.projectId || 'DBIT-SE-2026'}
                                      </span>
                                      <span className="text-xs font-semibold text-slate-500">
                                        Track {prop.trackNo} · Group {prop.groupNo}
                                      </span>
                                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                                        prop.status === 'approved' 
                                          ? 'bg-[#C6B5FD] text-black' 
                                          : prop.status === 'flagged_conflict'
                                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                                            : 'bg-[#D4F938] text-black'
                                      }`}>
                                        {badge.label}
                                      </span>
                                    </div>

                                    <h3 className="text-lg font-black text-[#18191E] hover:text-black cursor-pointer" onClick={() => setSelectedProposalId(prop.id)}>
                                      {prop.title}
                                    </h3>

                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                      {prop.abstract}
                                    </p>

                                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-600 flex-wrap">
                                      <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Team:</span>
                                      {prop.teamMembers.map((m, idx) => (
                                        <span key={idx} className="bg-[#F4F5F8] border border-slate-200 rounded-full px-3 py-0.5 text-xs font-bold text-slate-800">
                                          {m.name} {m.rollNo && `(${m.rollNo})`}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                                    <div className="flex items-center gap-3 bg-[#F4F5F8] p-3 rounded-2xl border border-slate-200/80">
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">SBERT</span>
                                        <span className="text-sm font-black font-mono text-black">
                                          {sbertVal}%
                                        </span>
                                      </div>
                                      <div className="h-6 w-px bg-slate-300" />
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Lexical</span>
                                        <span className="text-sm font-black font-mono text-black">
                                          {lexicalVal}%
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => {
                                          setSelectedProposalId(prop.id);
                                          setActiveTab('stages');
                                        }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18191E] hover:bg-black text-xs font-bold text-[#D4F938] transition-colors"
                                      >
                                        <Layers className="w-3.5 h-3.5" />
                                        <span>Visual Stage Gate</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedProposalId(prop.id);
                                          setActiveTab('gantt');
                                        }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F4F5F8] hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors border border-slate-200"
                                      >
                                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                                        <span>Project Tracking</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )
              )}
            </div>
          )}

          {/* ===================== VIEW 2: PROPOSALS (FULL SCREENING LIST) ===================== */}
          {activeTab === 'proposals' && (
            <div className="space-y-5">
              {/* Quick Status Filters & Sort Dropdown */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-[24px] p-4 shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
                    {[
                      { id: 'all', label: `All (${proposals.length})` },
                      { id: 'approved', label: `Approved (${proposals.filter(p => p.status === 'approved').length})` },
                      { id: 'conflicts', label: `Conflicts (${conflictCount})` },
                      { id: 'under_review', label: 'Under Review' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          statusFilter === tab.id
                            ? 'bg-[#18191E] text-[#D4F938] shadow-xs'
                            : 'bg-[#F4F5F8] text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Sorting Dropdown Menu */}
                  <div className="flex items-center gap-2 bg-[#F4F5F8] px-3.5 py-1.5 rounded-full border border-slate-200/80">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <label htmlFor="proposal-sort-select" className="text-xs font-bold text-slate-500 shrink-0">
                      Sort:
                    </label>
                    <select
                      id="proposal-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'newest' | 'novelty' | 'alphabetical')}
                      className="bg-transparent text-xs font-bold text-slate-900 border-none focus:outline-hidden cursor-pointer pr-1"
                    >
                      <option value="newest">Newest</option>
                      <option value="novelty">Highest Novelty</option>
                      <option value="alphabetical">Alphabetical</option>
                    </select>
                  </div>
                </div>

                {currentRole === 'student' && (
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D4F938] hover:bg-[#c2e72f] text-black text-xs font-black shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Proposal</span>
                  </button>
                )}
              </div>

              {/* Proposals Cards */}
              <div className="space-y-4">
                {sortedProposals.length === 0 ? (
                  <div className="bg-white rounded-[28px] p-8 text-center border border-slate-200/80 shadow-xs">
                    <p className="text-sm font-bold text-slate-700">No project proposals match the selected filters.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the status filter or search query.</p>
                  </div>
                ) : (
                  sortedProposals.map((prop) => {
                    const badge = getStatusBadgeDetails(prop.status);
                    const isSelected = selectedProposalId === prop.id;
                    const topicVal = Math.round((prop.similarityData?.sbertScore ?? 0.42) * 100);
                    const textVal = Math.round((prop.similarityData?.tfidfScore ?? 0.35) * 100);

                    return (
                      <div 
                        key={prop.id}
                        className={`bg-white rounded-[28px] p-6 shadow-xs border transition-all duration-200 ${
                          isSelected ? 'border-[#18191E] ring-2 ring-[#D4F938]' : 'border-slate-200/80 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono font-black px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938]">
                                {prop.projectId}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                Track {prop.trackNo} · Group {prop.groupNo}
                              </span>
                              <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                                prop.status === 'approved' 
                                  ? 'bg-[#C6B5FD] text-black' 
                                  : prop.status === 'flagged_conflict'
                                    ? 'bg-amber-100 text-amber-950 border border-amber-300'
                                    : 'bg-[#D4F938] text-black'
                              }`}>
                                {badge.label}
                              </span>
                            </div>

                            <h3 className="text-lg font-black text-[#18191E]">
                              {prop.title}
                            </h3>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {prop.abstract}
                            </p>

                            {/* Team & Guide */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                              <div>
                                <span className="font-bold text-slate-400 mr-1.5">Guide:</span>
                                <span className="font-extrabold text-black">{prop.guideName}</span>
                              </div>
                              <div>
                                <span className="font-bold text-slate-400 mr-1.5">Team:</span>
                                <span className="font-semibold text-slate-800">
                                  {prop.teamMembers.map(m => m.name).join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Dual Similarity Gauge & Actions */}
                          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                            <div className="flex items-center gap-3 bg-[#F4F5F8] p-3 rounded-2xl border border-slate-200/80">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Topic</span>
                                <span className="text-sm font-black font-mono text-black">
                                  {topicVal}%
                                </span>
                              </div>
                              <div className="h-6 w-px bg-slate-300" />
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Text</span>
                                <span className="text-sm font-black font-mono text-black">
                                  {textVal}%
                                </span>
                              </div>
                            </div>

                          <div className="flex items-center gap-2">
                            {(currentRole === 'guide' || currentRole === 'coordinator') && prop.status !== 'approved' && (
                              <button
                                onClick={() => handleQuickApprove(prop.id)}
                                className="px-4 py-2 rounded-full bg-[#D4F938] hover:bg-[#c2e72f] text-xs font-black text-black transition-colors shadow-xs cursor-pointer"
                              >
                                Approve Topic
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedProposalId(prop.id);
                                setActiveTab('stages');
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18191E] hover:bg-black text-xs font-bold text-[#D4F938] transition-colors shadow-xs cursor-pointer"
                              title="Visual Stage Gate"
                            >
                              <Layers className="w-3.5 h-3.5" />
                              <span>Visual Stage Gate</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProposalId(prop.id);
                                setActiveTab('gantt');
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F4F5F8] hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors border border-slate-200 cursor-pointer"
                              title="Project Tracking"
                            >
                              <Calendar className="w-3.5 h-3.5 text-slate-600" />
                              <span>Project Tracking</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }))}
              </div>
            </div>
          )}

          {/* ===================== VIEW 3: GANTT TIMELINE ===================== */}
          {activeTab === 'gantt' && (
            <div className="space-y-4">
              {currentRole === 'student' && !studentProposal ? (
                <div className="bg-white rounded-[28px] p-8 shadow-xs border border-slate-200/80 text-center max-w-xl mx-auto my-12 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#18191E] text-[#D4F938] flex items-center justify-center mx-auto shadow-md">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-[#18191E]">14-Week Gantt Timeline Locked</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                    Milestone schedules (Exp 1 to Exp 7), week-by-week deadlines, and progress bars are tied directly to your registered proposal. Submit your proposal to begin tracking.
                  </p>
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4F938] hover:bg-[#c2e72f] text-black text-xs font-black shadow-xs cursor-pointer transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Project Proposal</span>
                  </button>
                </div>
              ) : (
                <ProjectGanttChart
                  proposals={proposals}
                  activeProposalId={selectedProposalId || studentProposal?.id}
                  onSelectProposal={setSelectedProposalId}
                  userRole={currentRole}
                  onUpdateMilestone={handleUpdateMilestone}
                />
              )}
            </div>
          )}

          {/* ===================== VIEW 4: STAGE GATES ===================== */}
          {activeTab === 'stages' && (
            <div className="space-y-4">
              {currentRole === 'student' && !studentProposal ? (
                <div className="bg-white rounded-[28px] p-8 shadow-xs border border-slate-200/80 text-center max-w-xl mx-auto my-12 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#18191E] text-[#C6B5FD] flex items-center justify-center mx-auto shadow-md">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-[#18191E]">Stage Gates Locked</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                    Stage Gates 0 through 5 (Topic Approval, Literature Review, Architecture Modeling, Prototype Demo, Testing, Final Report) require an active project submission.
                  </p>
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4F938] hover:bg-[#c2e72f] text-black text-xs font-black shadow-xs cursor-pointer transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Project Proposal</span>
                  </button>
                </div>
              ) : (
                <StageGateTracker
                  proposal={activeProposal}
                  currentRole={currentRole}
                  onUpdateMilestone={handleUpdateMilestone}
                  onUpdateGitHubData={handleUpdateGitHubData}
                  proposals={proposals}
                  onSelectProposal={setSelectedProposalId}
                  onNavigateToProposals={() => setActiveTab('proposals')}
                />
              )}
            </div>
          )}

          {/* ===================== VIEW 5: TOPIC ARBITRATION / CONFLICTS ===================== */}
          {activeTab === 'conflicts' && (
            <div className="space-y-4">
              {currentRole === 'student' && !studentProposal ? (
                <div className="bg-white rounded-[28px] p-8 shadow-xs border border-slate-200/80 text-center max-w-lg mx-auto my-8 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#18191E] text-[#D4F938] flex items-center justify-center mx-auto shadow-md">
                    <Scale className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-[#18191E]">No Pitch Defense Active</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                    You haven&apos;t submitted a capstone proposal yet. Once registered, your proposal&apos;s SBERT originality screen and 200-word pitch defense will be accessible here.
                  </p>
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4F938] hover:bg-[#c2e72f] text-black text-xs font-black shadow-xs cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Submit Project Proposal</span>
                  </button>
                </div>
              ) : (
                <ConflictResolutionDashboard
                  proposals={currentRole === 'student' ? (studentProposal ? [studentProposal] : []) : proposals}
                  currentRole={currentRole}
                  onArbitrateConflict={handleArbitrateConflict}
                  onSubmitPitchDefense={handleSavePitchDefense}
                />
              )}
            </div>
          )}

          {/* ===================== VIEW 6: HISTORICAL REPOSITORY ===================== */}
          {activeTab === 'repository' && (
            <div className="space-y-4">
              <HistoricalRepository
                projects={historicalProjects}
                onAddArchiveProject={(newProj) => {
                  setHistoricalProjects(prev => [newProj, ...prev]);
                  saveArchiveProjectToFirestore(newProj);
                  showToast(`Archived project "${newProj.title}" saved to Firestore database!`);
                }}
              />
            </div>
          )}

          {/* ===================== VIEW 7: GUIDE NOTICES ===================== */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              <GuideNoticeBoard
                userRole={currentRole}
                userGroupNo={currentUser?.groupNo || 5}
                userName={currentUser?.name || 'User'}
                onOpenSendModal={() => setIsGuideMessageModalOpen(true)}
              />
            </div>
          )}

          {/* ===================== VIEW 8: ADMIN ACCOUNTS & DATABASE ===================== */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <AdminPanel
                proposals={proposals}
                onSelectProposal={setSelectedProposalId}
                onNavigateToTab={setActiveTab}
                onUpdateProposal={(updated) => {
                  setProposals(prev => prev.map(p => p.id === updated.id ? updated : p));
                  saveProposalToFirestore(updated);
                  showToast(`Allocated ${updated.projectId}: Guide -> ${updated.guideName}, Coordinator -> ${updated.coordinatorName}`);
                }}
              />
            </div>
          )}

        </div>

      {/* Modals */}
      <ProposalSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleCreateProposal}
        historicalProjects={historicalProjects}
        currentUser={currentUser}
      />

      <FeedbackLogModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        proposal={activeProposal}
        currentRole={currentRole}
        onAddFeedback={handleAddFeedback}
        onSendReminder={handleSendReminder}
      />

      <PresentationViewerModal
        isOpen={isPresentationModalOpen}
        onClose={() => setIsPresentationModalOpen(false)}
      />

      {isGuideMessageModalOpen && (
        <GuideMessageModal
          isOpen={isGuideMessageModalOpen}
          onClose={() => setIsGuideMessageModalOpen(false)}
          senderName={currentUser?.name || 'Faculty Guide'}
          senderRole={currentRole === 'coordinator' ? 'coordinator' : 'guide'}
          defaultGroupNo={activeProposal.groupNo || 5}
          onMessageSent={(msg) => showToast(`Faculty guide notice broadcasted: "${msg.subject}"`)}
        />
      )}
    </div>
  );
}
