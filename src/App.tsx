import React, { useState } from 'react';
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
  UserCheck
} from 'lucide-react';
import { Header } from './components/Header';
import { ProposalSubmissionModal } from './components/ProposalSubmissionModal';
import { StageGateTracker } from './components/StageGateTracker';
import { ConflictResolutionDashboard } from './components/ConflictResolutionDashboard';
import { HistoricalRepository } from './components/HistoricalRepository';
import { AnalyticsAndGantt } from './components/AnalyticsAndGantt';
import { FeedbackLogModal } from './components/FeedbackLogModal';
import { PresentationViewerModal } from './components/PresentationViewerModal';

import { 
  ProjectProposal, 
  UserRole, 
  HistoricalProject, 
  StageGateMilestone, 
  GuideFeedback,
  GitHubSyncData
} from './types';
import { 
  INITIAL_PROPOSALS, 
  INITIAL_HISTORICAL_PROJECTS, 
  CURRENT_USER_STUDENT 
} from './data/mockData';
import { getStatusBadgeDetails, getNextStatus } from './utils/stateMachine';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('proposals');
  
  // App state
  const [proposals, setProposals] = useState<ProjectProposal[]>(INITIAL_PROPOSALS);
  const [historicalProjects, setHistoricalProjects] = useState<HistoricalProject[]>(INITIAL_HISTORICAL_PROJECTS);
  const [selectedProposalId, setSelectedProposalId] = useState<string>('prop-group-05');
  
  // Load initial data from PostgreSQL database
  React.useEffect(() => {
    async function loadFromDatabase() {
      try {
        const [propsRes, histRes] = await Promise.all([
          fetch('/api/proposals'),
          fetch('/api/historical-projects')
        ]);
        if (propsRes.ok) {
          const propsData = await propsRes.json();
          if (Array.isArray(propsData) && propsData.length > 0) {
            setProposals(propsData);
          }
        }
        if (histRes.ok) {
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
  }, []);

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isPresentationModalOpen, setIsPresentationModalOpen] = useState(false);

  // Status Filter for Proposals list
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const activeProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0];

  // Count conflicts
  const conflictCount = proposals.filter(
    p => p.status === 'flagged_conflict' || p.status === 'coordinator_arbitration'
  ).length;

  // Handlers
  const handleCreateProposal = (newProp: Partial<ProjectProposal>) => {
    const id = `prop-${Date.now()}`;
    const generatedProjectId = `DBIT-SE-2026-T${newProp.trackNo || 7}-G${String(newProp.groupNo || 1).padStart(2, '0')}`;
    
    const fullProposal: ProjectProposal = {
      id,
      projectId: generatedProjectId,
      trackNo: newProp.trackNo || 7,
      groupNo: newProp.groupNo || 1,
      academicYear: '2026-27',
      cohort: newProp.cohort || 'SE COMPS C (Batch A)',
      title: newProp.title || 'Untitled Proposal',
      domain: newProp.domain || 'AI/ML',
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
      techStack: newProp.techStack || ['TypeScript', 'React'],
      teamMembers: newProp.teamMembers || [
        { name: 'Rishik Ezhuthachan', rollNo: '15', email: 'rishiks1207@gmail.com', isLeader: true }
      ],
      guideName: newProp.guideName || 'Mr. Nazareth Remedios',
      coordinatorName: 'Prof. Meenal Kulkarni',
      status: newProp.status || 'under_guide_review',
      similarityData: newProp.similarityData,
      pitchDefense: newProp.pitchDefense,
      feedbackHistory: [],
      stageGates: [
        {
          id: `sg-${Date.now()}-1`,
          title: 'Exp 1: Empathy Study & Problem Framing',
          phase: 'stage1_design',
          weekRange: 'W1 - W3',
          status: 'in_progress',
          dueDate: '2026-08-15',
          deliverableType: 'architecture_spec'
        },
        {
          id: `sg-${Date.now()}-2`,
          title: 'Exp 2: Literature Matrix & App Benchmark',
          phase: 'stage1_design',
          weekRange: 'W4 - W6',
          status: 'pending',
          dueDate: '2026-08-30',
          deliverableType: 'architecture_spec'
        },
        {
          id: `sg-${Date.now()}-3`,
          title: 'Exp 3: User Survey & Problem Formulation',
          phase: 'stage1_design',
          weekRange: 'W5 - W6',
          status: 'pending',
          dueDate: '2026-09-10',
          deliverableType: 'architecture_spec'
        },
        {
          id: `sg-${Date.now()}-4`,
          title: 'Exp 4: UML Diagrams & Architecture Design',
          phase: 'stage1_design',
          weekRange: 'W7 - W8',
          status: 'pending',
          dueDate: '2026-09-28',
          deliverableType: 'uml_diagram'
        },
        {
          id: `sg-${Date.now()}-5`,
          title: 'Exp 5: NLP Engine Development (SBERT & Cosine)',
          phase: 'stage2_dev',
          weekRange: 'W9 - W11',
          status: 'pending',
          dueDate: '2026-10-25',
          deliverableType: 'github_pr'
        },
        {
          id: `sg-${Date.now()}-6`,
          title: 'Exp 6: Web Portal UI (Student, Guide & Coordinator)',
          phase: 'stage2_dev',
          weekRange: 'W10 - W12',
          status: 'pending',
          dueDate: '2026-11-05',
          deliverableType: 'architecture_spec'
        },
        {
          id: `sg-${Date.now()}-7`,
          title: 'Exp 7: System Integration & Final Evaluation',
          phase: 'stage3_testing',
          weekRange: 'W12 - W14',
          status: 'pending',
          dueDate: '2026-11-20',
          deliverableType: 'demo_video'
        }
      ],
      githubData: {
        owner: 'rishiks1207',
        repo: 'dbit-project-track',
        repoUrl: 'https://github.com/rishiks1207/dbit-project-track',
        connected: true,
        lastSyncedAt: new Date().toISOString(),
        defaultBranch: 'main',
        starsCount: 1,
        openIssuesCount: 0,
        primaryLanguage: 'TypeScript',
        latestCommits: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lockedTopic: false
    };

    setProposals([fullProposal, ...proposals]);
    setSelectedProposalId(id);

    // Save to Cloud SQL PostgreSQL asynchronously
    fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: fullProposal.id,
        projectId: fullProposal.projectId,
        trackNo: fullProposal.trackNo,
        groupNo: fullProposal.groupNo,
        academicYear: fullProposal.academicYear,
        cohort: fullProposal.cohort,
        title: fullProposal.title,
        domain: fullProposal.domain,
        abstract: fullProposal.abstract,
        problemStatement: fullProposal.problemStatement,
        techStack: fullProposal.techStack,
        teamMembers: fullProposal.teamMembers,
        guideName: fullProposal.guideName,
        coordinatorName: fullProposal.coordinatorName,
        status: fullProposal.status,
        similarityScore: fullProposal.similarityData?.overallScore || 0,
        sbertScore: fullProposal.similarityData?.sbertScore || 0,
        tfidfScore: fullProposal.similarityData?.tfidfScore || 0,
        similarityExplanation: fullProposal.similarityData?.explanation,
        conflictWithId: fullProposal.conflictWithId,
        lockedTopic: fullProposal.lockedTopic,
        pitchDefenseContent: fullProposal.pitchDefense?.content,
        pitchDifferentiator: fullProposal.pitchDefense?.keyDifferentiator,
        pitchTargetStack: fullProposal.pitchDefense?.targetStack,
        githubOwner: fullProposal.githubData?.owner || 'rishiks1207',
        githubRepo: fullProposal.githubData?.repo || 'dbit-project-track'
      })
    }).catch(e => console.warn('Database async insert notice:', e));

    if (fullProposal.status === 'flagged_conflict' || fullProposal.status === 'coordinator_arbitration') {
      showToast('Proposal submitted! Conflict threshold exceeded (>= 0.75). Forwarded to Coordinator Arbitration.');
      setActiveTab('conflicts');
    } else {
      showToast('Proposal submitted! High originality verified. Queued in Faculty Guide Dashboard.');
    }
  };

  const handleUpdateMilestone = (milestoneId: string, updates: Partial<StageGateMilestone>) => {
    setProposals(prev => prev.map(p => {
      if (p.id !== selectedProposalId) return p;
      return {
        ...p,
        stageGates: p.stageGates.map(m => m.id === milestoneId ? { ...m, ...updates } : m),
        updatedAt: new Date().toISOString()
      };
    }));

    // Save milestone updates to database
    fetch(`/api/stage-gates/${milestoneId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(e => console.warn('Database async milestone update notice:', e));

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

    showToast('Arbitration verdict recorded and student teams notified.');
  };

  // Direct guide quick-approve for testing
  const handleQuickApprove = (propId: string) => {
    setProposals(prev => prev.map(p => {
      if (p.id !== propId) return p;
      return {
        ...p,
        status: 'approved',
        lockedTopic: true,
        feedbackHistory: [
          {
            id: `fb-app-${Date.now()}`,
            authorName: currentRole === 'coordinator' ? p.coordinatorName : p.guideName,
            authorRole: currentRole === 'coordinator' ? 'coordinator' : 'guide',
            timestamp: new Date().toISOString(),
            stage: 'Topic Approval',
            status: 'approved',
            remarks: 'Technical scope and methodology verified. Topic approved for SE Mini Project.'
          },
          ...p.feedbackHistory
        ]
      };
    }));

    showToast('Topic approved by Faculty Guide! Stage 1 Design unlocked.');
  };

  // Filtered proposals list
  const filteredProposals = proposals.filter(p => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'conflicts') return p.status === 'flagged_conflict' || p.status === 'coordinator_arbitration';
    if (statusFilter === 'approved') return p.status === 'approved' || p.status === 'completed';
    if (statusFilter === 'under_review') return p.status === 'under_guide_review' || p.status === 'evaluating_similarity';
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-100/70 text-zinc-900 font-sans flex flex-col">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-zinc-700 text-xs animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-white ml-2 text-base leading-none"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Institute Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenPresentation={() => setIsPresentationModalOpen(true)}
        conflictCount={conflictCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* User Identity Banner */}
        <div className="bg-white rounded-xl border border-zinc-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs text-xs">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
              currentRole === 'student' ? 'bg-blue-600' : currentRole === 'guide' ? 'bg-purple-600' : 'bg-emerald-600'
            }`}>
              {currentRole === 'student' ? <GraduationCap className="w-4 h-4" /> : currentRole === 'guide' ? <UserCheck className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-zinc-500 text-[11px] block">Active Persona</span>
              <div className="font-bold text-zinc-900 flex items-center gap-2">
                <span>
                  {currentRole === 'student'
                    ? 'Rishik Ezhuthachan (Roll 15, Group 05)'
                    : currentRole === 'guide'
                      ? 'Mr. Nazareth Remedios (Internal Project Guide)'
                      : 'Prof. Meenal Kulkarni (Project Coordinator, 12 yrs exp)'}
                </span>
                <span className="text-[10px] bg-zinc-100 text-zinc-700 font-mono px-2 py-0.5 rounded border border-zinc-200">
                  {currentRole === 'student' ? 'SE COMPS C (Batch A)' : 'DBIT Department of Computer Engineering'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-zinc-500">
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-purple-700 bg-zinc-50 hover:bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
              <span>Feedback Log ({activeProposal.feedbackHistory?.length || 0})</span>
            </button>
            <button
              onClick={() => setIsPresentationModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-blue-700 bg-zinc-50 hover:bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Review 1 Slides</span>
            </button>
          </div>
        </div>

        {/* 1. PROPOSALS & SCREENING TAB */}
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            {/* Header & Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900">
                  Undergraduate Project Proposals (Track 7 SE Mini Project)
                </h2>
                <p className="text-xs text-zinc-500">
                  Live SBERT + TF-IDF similarity screening, originality scores, and guide approval status
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 font-medium">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-zinc-300 rounded-lg font-medium text-zinc-800"
                >
                  <option value="all">All Proposals ({proposals.length})</option>
                  <option value="conflicts">Flagged Conflicts ({conflictCount})</option>
                  <option value="under_review">Under Guide Review</option>
                  <option value="approved">Approved &amp; Active</option>
                </select>
              </div>
            </div>

            {/* Proposal Cards */}
            <div className="space-y-4">
              {filteredProposals.map((prop) => {
                const badge = getStatusBadgeDetails(prop.status);
                const isSelected = selectedProposalId === prop.id;
                const originality = prop.similarityData 
                  ? Math.max(0, Math.round((1 - prop.similarityData.overallScore) * 100))
                  : 85;

                return (
                  <div
                    key={prop.id}
                    className={`bg-white rounded-2xl border transition-all p-6 shadow-xs ${
                      isSelected 
                        ? 'border-blue-500 ring-2 ring-blue-500/10' 
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      {/* Left: Proposal info */}
                      <div className="space-y-2 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                            {prop.projectId}
                          </span>
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${badge.badgeClass}`}>
                            {badge.label}
                          </span>
                          <span className="text-xs text-zinc-500 font-medium">
                            Track {prop.trackNo} • Group {prop.groupNo} • {prop.cohort}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-zinc-900 hover:text-blue-600 transition-colors">
                          {prop.title}
                        </h3>

                        <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                          {prop.abstract}
                        </p>

                        {/* Tech Stack tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-zinc-500 mr-1">Stack:</span>
                          {prop.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-zinc-100 text-zinc-700 font-mono px-2 py-0.5 rounded border border-zinc-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Team & Guide */}
                        <div className="pt-2 text-xs text-zinc-500 flex flex-wrap items-center gap-4 border-t border-zinc-100 mt-3">
                          <div>
                            Guide: <strong className="text-zinc-800">{prop.guideName}</strong>
                          </div>
                          <div className="h-3 w-px bg-zinc-300" />
                          <div>
                            Team Members: <strong className="text-zinc-800">{prop.teamMembers.map(m => m.name).join(', ')}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Right: Similarity Metric & Action Buttons */}
                      <div className="flex flex-col items-end gap-3 shrink-0">
                        {/* Originality / Similarity Meter */}
                        <div className={`p-3 rounded-xl border text-right w-44 ${
                          prop.similarityData?.isConflict 
                            ? 'bg-red-50 border-red-200 text-red-900' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                        }`}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-zinc-500 text-[10px] font-semibold uppercase">NLP SBERT Score</span>
                            <span className="font-mono font-bold text-xs">
                              {prop.similarityData ? `${(prop.similarityData.overallScore * 100).toFixed(0)}% Overlap` : '18% Overlap'}
                            </span>
                          </div>
                          <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${prop.similarityData?.isConflict ? 'bg-red-600' : 'bg-emerald-500'}`}
                              style={{ width: `${prop.similarityData ? prop.similarityData.overallScore * 100 : 18}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-zinc-500 block mt-1">
                            Originality: <strong>{originality}%</strong> (Cutoff: &lt;75%)
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProposalId(prop.id);
                              setActiveTab('stages');
                            }}
                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-2xs"
                          >
                            <GitBranch className="w-3.5 h-3.5" />
                            <span>Stage-Gates &amp; Git</span>
                          </button>

                          {(prop.status === 'flagged_conflict' || prop.status === 'coordinator_arbitration') && (
                            <button
                              onClick={() => {
                                setSelectedProposalId(prop.id);
                                setActiveTab('conflicts');
                              }}
                              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-2xs"
                            >
                              <Scale className="w-3.5 h-3.5" />
                              <span>Pitch Defense</span>
                            </button>
                          )}

                          {/* Quick Guide Approve */}
                          {(currentRole === 'guide' || currentRole === 'coordinator') && prop.status === 'under_guide_review' && (
                            <button
                              onClick={() => handleQuickApprove(prop.id)}
                              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-2xs"
                            >
                              <Stamp className="w-3.5 h-3.5" />
                              <span>Approve Topic</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. VISUAL STAGE-GATE & GITHUB SYNC TAB */}
        {activeTab === 'stages' && (
          <StageGateTracker
            proposal={activeProposal}
            currentRole={currentRole}
            onUpdateMilestone={handleUpdateMilestone}
            onUpdateGitHubData={handleUpdateGitHubData}
          />
        )}

        {/* 3. PITCH DEFENSE & CONFLICT RESOLUTION TAB */}
        {activeTab === 'conflicts' && (
          <ConflictResolutionDashboard
            proposals={proposals}
            currentRole={currentRole}
            onArbitrateConflict={handleArbitrateConflict}
            onSubmitPitchDefense={(propId, pitchText) => {
              setProposals(prev => prev.map(p => {
                if (p.id !== propId) return p;
                return {
                  ...p,
                  status: 'coordinator_arbitration',
                  pitchDefense: {
                    content: pitchText,
                    submittedAt: new Date().toISOString(),
                    keyDifferentiator: 'Architectural distinction & verified benchmarks',
                    targetStack: p.techStack.join(', '),
                    expectedDeliverable: 'Working deployment'
                  }
                };
              }));
              showToast('200-Word Pitch Defense submitted to Coordinator Queue.');
            }}
          />
        )}

        {/* 4. HISTORICAL REPOSITORY TAB */}
        {activeTab === 'repository' && (
          <HistoricalRepository
            projects={historicalProjects}
            onSelectForComparison={(p) => {
              showToast(`Selected "${p.title}" for comparison.`);
              setIsSubmitModalOpen(true);
            }}
          />
        )}

        {/* 5. SURVEY & GANTT ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <AnalyticsAndGantt />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 mt-12 py-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-zinc-800">
              DBIT ProjectTrack • Centralized Project Proposal &amp; Progress Tracking Portal
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              SE Mini Project-I (Semester III) • Academic Year 2026–27 • Department of Computer Engineering
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Group 05: Apoorvadeep (Lead), Ron, Rishik, Aryan</span>
            <span>•</span>
            <span>Guides: Mr. Nazareth Remedios / Ms. Harleen Kaur Plaha</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProposalSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleCreateProposal}
        historicalProjects={historicalProjects}
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
    </div>
  );
}
