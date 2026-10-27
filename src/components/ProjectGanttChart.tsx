import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  GitBranch, 
  ShieldCheck, 
  Layers, 
  Info,
  Sparkles,
  ArrowRight,
  Edit3,
  Sliders,
  Check,
  RotateCcw,
  Save,
  Percent,
  SlidersHorizontal,
  Presentation,
  Upload,
  ExternalLink,
  Award,
  AlertCircle,
  FileCheck,
  Download,
  Trash2,
  Stamp
} from 'lucide-react';
import { ProjectProposal, StageGateMilestone } from '../types';

interface ProjectGanttChartProps {
  proposals: ProjectProposal[];
  activeProposalId?: string;
  onSelectProposal?: (id: string) => void;
  userRole?: string;
  onUpdateMilestone?: (milestoneId: string, updates: Partial<StageGateMilestone>) => void;
}

export interface PPTPresentationItem {
  id: 'review-1' | 'review-2';
  expNumber: number;
  reviewTitle: string;
  stageName: string;
  recommendedWeek: string;
  fileName?: string;
  slideCount?: number;
  fileUrl?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  presenters?: string;
  notes?: string;
  status: 'pending' | 'submitted' | 'under_review' | 'approved' | 'revision';
  score?: number;
  maxScore: number;
  feedback?: string;
  evaluatedBy?: string;
  evaluatedAt?: string;
}

export interface MilestoneScheduleItem {
  id: string;
  expNumber: number;
  title: string;
  phase: string;
  startWeek: number;
  endWeek: number;
  deliverable: string;
  defaultStatus: 'completed' | 'in_progress' | 'pending';
  progress: number;
  dueDate: string;
}

const DEFAULT_14_WEEK_SCHEDULE: MilestoneScheduleItem[] = [
  {
    id: 'exp-1',
    expNumber: 1,
    title: 'Exp 1: Project Identification & SBERT Duplicate Screening',
    phase: 'Phase 1: Initiation',
    startWeek: 1,
    endWeek: 2,
    deliverable: 'Topic Abstract & Similarity Cross-Check',
    defaultStatus: 'completed',
    progress: 100,
    dueDate: 'Week 2 (Jan 24, 2026)'
  },
  {
    id: 'exp-2',
    expNumber: 2,
    title: 'Exp 2: Literature Survey & SRS Requirement Specification',
    phase: 'Phase 1: Initiation',
    startWeek: 3,
    endWeek: 4,
    deliverable: 'SRS Document (IEEE 830 standard)',
    defaultStatus: 'completed',
    progress: 100,
    dueDate: 'Week 4 (Feb 07, 2026)'
  },
  {
    id: 'exp-3',
    expNumber: 3,
    title: 'Exp 3: System Architecture & UML Modeling',
    phase: 'Phase 2: Design',
    startWeek: 5,
    endWeek: 6,
    deliverable: 'Class, Sequence, State & Activity Diagrams',
    defaultStatus: 'in_progress',
    progress: 80,
    dueDate: 'Week 6 (Feb 21, 2026)'
  },
  {
    id: 'exp-4',
    expNumber: 4,
    title: 'Exp 4: Detailed Module Design & Git Repository Initialization',
    phase: 'Phase 2: Design',
    startWeek: 7,
    endWeek: 8,
    deliverable: 'DB Schema, API Specs & GitHub Branching Rules',
    defaultStatus: 'in_progress',
    progress: 45,
    dueDate: 'Week 8 (Mar 07, 2026)'
  },
  {
    id: 'exp-5',
    expNumber: 5,
    title: 'Exp 5: Core Implementation & Intermediate Review',
    phase: 'Phase 3: Implementation',
    startWeek: 9,
    endWeek: 10,
    deliverable: 'Functional Prototype & Mid-Term Review (50% Code)',
    defaultStatus: 'pending',
    progress: 10,
    dueDate: 'Week 10 (Mar 21, 2026)'
  },
  {
    id: 'exp-6',
    expNumber: 6,
    title: 'Exp 6: Unit & Integration Testing (Test Suite)',
    phase: 'Phase 3: Implementation',
    startWeek: 11,
    endWeek: 12,
    deliverable: 'Automated Test Cases & Test Summary Report',
    defaultStatus: 'pending',
    progress: 0,
    dueDate: 'Week 12 (Apr 04, 2026)'
  },
  {
    id: 'exp-7',
    expNumber: 7,
    title: 'Exp 7: Final Deployment & Review 2 Presentation',
    phase: 'Phase 4: Closure',
    startWeek: 13,
    endWeek: 14,
    deliverable: 'Live Deployment, Final Report & Viva Defense',
    defaultStatus: 'pending',
    progress: 0,
    dueDate: 'Week 14 (Apr 18, 2026)'
  }
];

export const ProjectGanttChart: React.FC<ProjectGanttChartProps> = ({
  proposals,
  activeProposalId,
  onSelectProposal,
  userRole = 'student',
  onUpdateMilestone
}) => {
  const [selectedPropId, setSelectedPropId] = useState<string>(
    activeProposalId || (proposals[0]?.id ?? '')
  );

  const currentProposal = proposals.find(p => p.id === selectedPropId) || proposals[0];

  // Local storage key for persistent student customizations per proposal
  const storageKey = `dbit_gantt_custom_${selectedPropId || 'default'}`;

  // Custom schedule state
  const [customSchedule, setCustomSchedule] = useState<Record<string, MilestoneScheduleItem>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved Gantt schedule:', e);
    }
    return {};
  });

  // Edit Mode toggle
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Modal editor state
  const [editingMilestone, setEditingMilestone] = useState<MilestoneScheduleItem | null>(null);
  const [editProgress, setEditProgress] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<'completed' | 'in_progress' | 'pending'>('in_progress');
  const [editStartWeek, setEditStartWeek] = useState<number>(1);
  const [editEndWeek, setEditEndWeek] = useState<number>(2);
  const [editDeliverable, setEditDeliverable] = useState<string>('');
  const [editDueDate, setEditDueDate] = useState<string>('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // PPT Presentations Storage Key
  const pptStorageKey = `dbit_gantt_ppts_${selectedPropId || 'default'}`;

  const defaultPptItems: PPTPresentationItem[] = [
    {
      id: 'review-1',
      expNumber: 4,
      reviewTitle: 'Review 1 PPT Presentation (Architecture & UML)',
      stageName: 'Stage 1 Design Closure',
      recommendedWeek: 'Weeks 7–8',
      fileName: 'DBIT_SE_Review1_Group05_Architecture.pptx',
      slideCount: 24,
      fileUrl: 'https://docs.google.com/presentation/d/dbit-se-review1-sample',
      uploadedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      uploadedBy: 'Rishik Ezhuthachan',
      presenters: 'Rishik E., Apoorvadeep S., Ron B., Aryan G.',
      notes: 'Covers SBERT duplicate check validation (0.18), UML sequence diagrams, FastAPI schemas, and Git milestones.',
      status: 'approved',
      score: 23,
      maxScore: 25,
      feedback: 'Excellent literature survey and architectural clarity. Sequence diagrams align well with API controllers. Approved for Stage 2.',
      evaluatedBy: currentProposal?.guideName || 'Mr. Nazareth Remedios',
      evaluatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'review-2',
      expNumber: 7,
      reviewTitle: 'Review 2 / Final PPT Presentation (Live Deployment & Viva)',
      stageName: 'Stage 3 Closure & Viva',
      recommendedWeek: 'Weeks 13–14',
      fileName: '',
      slideCount: 0,
      fileUrl: '',
      presenters: '',
      notes: '',
      status: 'pending',
      maxScore: 25,
      feedback: '',
      evaluatedBy: '',
      evaluatedAt: ''
    }
  ];

  const [pptDeliverables, setPptDeliverables] = useState<PPTPresentationItem[]>(() => {
    try {
      const saved = localStorage.getItem(pptStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultPptItems;
  });

  // Upload PPT Modal State
  const [uploadModalPpt, setUploadModalPpt] = useState<PPTPresentationItem | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadSlideCount, setUploadSlideCount] = useState<number>(20);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadPresenters, setUploadPresenters] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');

  // Evaluate PPT Modal State (For Faculty Guides & Coordinators)
  const [evaluateModalPpt, setEvaluateModalPpt] = useState<PPTPresentationItem | null>(null);
  const [evalScore, setEvalScore] = useState<number>(22);
  const [evalDecision, setEvalDecision] = useState<'approved' | 'revision' | 'under_review'>('approved');
  const [evalFeedback, setEvalFeedback] = useState('');
  const [evaluatorName, setEvaluatorName] = useState('');

  // Sync state if proposal changes
  useEffect(() => {
    try {
      const savedGantt = localStorage.getItem(`dbit_gantt_custom_${selectedPropId}`);
      if (savedGantt) setCustomSchedule(JSON.parse(savedGantt));
      else setCustomSchedule({});

      const savedPpt = localStorage.getItem(`dbit_gantt_ppts_${selectedPropId}`);
      if (savedPpt) {
        setPptDeliverables(JSON.parse(savedPpt));
      } else {
        setPptDeliverables(defaultPptItems);
      }
    } catch (e) {
      setCustomSchedule({});
    }
  }, [selectedPropId]);

  const handleOpenUploadPpt = (item: PPTPresentationItem) => {
    setUploadModalPpt(item);
    setUploadFileName(item.fileName || `${currentProposal?.projectId || 'DBIT'}_${item.id === 'review-1' ? 'Review1' : 'Review2'}_Slides.pptx`);
    setUploadSlideCount(item.slideCount || 20);
    setUploadUrl(item.fileUrl || '');
    setUploadPresenters(item.presenters || (currentProposal?.teamMembers ? currentProposal.teamMembers.map(m => m.name).join(', ') : ''));
    setUploadNotes(item.notes || '');
  };

  const handleSavePptUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadModalPpt) return;

    const updated: PPTPresentationItem = {
      ...uploadModalPpt,
      fileName: uploadFileName.trim() || 'Project_Presentation.pptx',
      slideCount: Number(uploadSlideCount) || 1,
      fileUrl: uploadUrl.trim() || 'https://docs.google.com/presentation/d/sample',
      presenters: uploadPresenters.trim(),
      notes: uploadNotes.trim(),
      uploadedAt: new Date().toISOString(),
      uploadedBy: userRole === 'student' ? 'Student Team' : 'Author',
      status: 'submitted'
    };

    const nextList = pptDeliverables.map(p => p.id === uploadModalPpt.id ? updated : p);
    setPptDeliverables(nextList);
    try {
      localStorage.setItem(`dbit_gantt_ppts_${selectedPropId}`, JSON.stringify(nextList));
    } catch (err) {}

    // Update corresponding milestone if possible
    if (onUpdateMilestone) {
      const expGate = currentProposal?.stageGates?.find(g => g.id.includes(String(uploadModalPpt.expNumber)));
      if (expGate) {
        onUpdateMilestone(expGate.id, {
          submissionLink: updated.fileUrl,
          submissionNotes: `PPT Uploaded: ${updated.fileName} (${updated.slideCount} slides). ${updated.notes}`,
          submissionDate: updated.uploadedAt,
          status: 'submitted'
        });
      }
    }

    setUploadModalPpt(null);
  };

  const handleOpenEvaluatePpt = (item: PPTPresentationItem) => {
    setEvaluateModalPpt(item);
    setEvalScore(item.score ?? 22);
    setEvalDecision(item.status === 'revision' ? 'revision' : 'approved');
    setEvalFeedback(item.feedback || '');
    setEvaluatorName(item.evaluatedBy || currentProposal?.guideName || 'Faculty Guide');
  };

  const handleSavePptEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluateModalPpt) return;

    const updated: PPTPresentationItem = {
      ...evaluateModalPpt,
      status: evalDecision,
      score: Number(evalScore),
      feedback: evalFeedback.trim(),
      evaluatedBy: evaluatorName.trim() || currentProposal?.guideName || 'Faculty Guide',
      evaluatedAt: new Date().toISOString()
    };

    const nextList = pptDeliverables.map(p => p.id === evaluateModalPpt.id ? updated : p);
    setPptDeliverables(nextList);
    try {
      localStorage.setItem(`dbit_gantt_ppts_${selectedPropId}`, JSON.stringify(nextList));
    } catch (err) {}

    if (onUpdateMilestone) {
      const expGate = currentProposal?.stageGates?.find(g => g.id.includes(String(evaluateModalPpt.expNumber)));
      if (expGate) {
        onUpdateMilestone(expGate.id, {
          status: evalDecision === 'approved' ? 'approved' : evalDecision === 'revision' ? 'revision' : 'submitted',
          guideApprovedBy: updated.evaluatedBy,
          guideApprovedDate: updated.evaluatedAt,
          submissionNotes: `PPT Evaluated: Score ${updated.score}/${updated.maxScore}. ${updated.feedback}`
        });
      }
    }

    setEvaluateModalPpt(null);
  };

  // Merge default + proposal stage gates + custom student edits
  const scheduleItems: MilestoneScheduleItem[] = DEFAULT_14_WEEK_SCHEDULE.map(item => {
    // 1. Proposal stage gates
    let merged = { ...item };
    if (currentProposal?.stageGates) {
      const match = currentProposal.stageGates.find(
        g => g.id.includes(String(item.expNumber)) || g.title.toLowerCase().includes(`exp ${item.expNumber}`)
      );
      if (match) {
        merged = {
          ...merged,
          defaultStatus: match.status === 'approved' ? 'completed' : match.status === 'in_progress' ? 'in_progress' : 'pending',
          progress: match.progress !== undefined 
            ? match.progress 
            : (match.status === 'approved' ? 100 : match.status === 'in_progress' ? 65 : 0),
          dueDate: match.dueDate || merged.dueDate,
          deliverable: match.deliverable || merged.deliverable,
          startWeek: match.startWeek || merged.startWeek,
          endWeek: match.endWeek || merged.endWeek
        };
      }
    }

    // 2. Custom student override
    if (customSchedule[item.id]) {
      merged = {
        ...merged,
        ...customSchedule[item.id]
      };
    }

    return merged;
  });

  const overallProgress = Math.round(
    scheduleItems.reduce((acc, curr) => acc + curr.progress, 0) / scheduleItems.length
  );

  const completedCount = scheduleItems.filter(i => i.defaultStatus === 'completed').length;
  const inProgressCount = scheduleItems.filter(i => i.defaultStatus === 'in_progress').length;

  const weeks = Array.from({ length: 14 }, (_, i) => i + 1);

  // Open modal editor
  const handleOpenEditModal = (item: MilestoneScheduleItem) => {
    setEditingMilestone(item);
    setEditProgress(item.progress);
    setEditStatus(item.defaultStatus);
    setEditStartWeek(item.startWeek);
    setEditEndWeek(item.endWeek);
    setEditDeliverable(item.deliverable);
    setEditDueDate(item.dueDate);
    setSaveSuccessNotice(null);
  };

  // Quick inline progress update
  const handleQuickProgressChange = (itemId: string, newProgress: number) => {
    const targetItem = scheduleItems.find(i => i.id === itemId);
    if (!targetItem) return;

    let newStatus: 'completed' | 'in_progress' | 'pending' = targetItem.defaultStatus;
    if (newProgress === 100) newStatus = 'completed';
    else if (newProgress > 0) newStatus = 'in_progress';
    else newStatus = 'pending';

    const updatedItem: MilestoneScheduleItem = {
      ...targetItem,
      progress: newProgress,
      defaultStatus: newStatus
    };

    const newCustom = {
      ...customSchedule,
      [itemId]: updatedItem
    };
    setCustomSchedule(newCustom);
    localStorage.setItem(storageKey, JSON.stringify(newCustom));

    // Propagate to App proposal stage gates if matched
    if (onUpdateMilestone && currentProposal?.stageGates) {
      const match = currentProposal.stageGates.find(
        g => g.id.includes(String(targetItem.expNumber)) || g.title.toLowerCase().includes(`exp ${targetItem.expNumber}`)
      );
      if (match) {
        onUpdateMilestone(match.id, {
          progress: newProgress,
          status: newStatus === 'completed' ? 'approved' : newStatus === 'in_progress' ? 'in_progress' : 'pending'
        });
      }
    }
  };

  // Save changes from modal
  const handleSaveModalEdit = () => {
    if (!editingMilestone) return;

    const updatedItem: MilestoneScheduleItem = {
      ...editingMilestone,
      progress: editProgress,
      defaultStatus: editStatus,
      startWeek: Math.min(editStartWeek, editEndWeek),
      endWeek: Math.max(editStartWeek, editEndWeek),
      deliverable: editDeliverable,
      dueDate: editDueDate
    };

    const newCustom = {
      ...customSchedule,
      [editingMilestone.id]: updatedItem
    };
    setCustomSchedule(newCustom);
    localStorage.setItem(storageKey, JSON.stringify(newCustom));

    // Propagate to App proposal stage gates
    if (onUpdateMilestone && currentProposal?.stageGates) {
      const match = currentProposal.stageGates.find(
        g => g.id.includes(String(editingMilestone.expNumber)) || g.title.toLowerCase().includes(`exp ${editingMilestone.expNumber}`)
      );
      if (match) {
        onUpdateMilestone(match.id, {
          progress: editProgress,
          status: editStatus === 'completed' ? 'approved' : editStatus === 'in_progress' ? 'in_progress' : 'pending',
          weekRange: `Weeks ${Math.min(editStartWeek, editEndWeek)}-${Math.max(editStartWeek, editEndWeek)}`,
          dueDate: editDueDate,
          deliverable: editDeliverable,
          startWeek: Math.min(editStartWeek, editEndWeek),
          endWeek: Math.max(editStartWeek, editEndWeek)
        });
      }
    }

    setSaveSuccessNotice('Progress and schedule updated successfully!');
    setTimeout(() => {
      setEditingMilestone(null);
      setSaveSuccessNotice(null);
    }, 900);
  };

  // Reset to default schedule
  const handleResetSchedule = () => {
    if (window.confirm('Reset all custom progress percentages and week adjustments back to default curriculum schedule?')) {
      setCustomSchedule({});
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Proposal Selector */}
      <div className="bg-[#18191E] text-white rounded-[28px] p-6 sm:p-7 shadow-lg relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4F938]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-[#D4F938] text-black font-extrabold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                14-Week Milestone Tracker
              </span>
              <span className="text-xs text-white/60 font-medium">
                Interactive Schedule &amp; Progress Setting
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
              Dedicated Project Gantt Chart &amp; Schedule
            </h2>
            <p className="text-xs text-white/70 max-w-xl mt-1">
              Set and track progress percentage for each experiment from Exp 1 through Exp 7 with customized week timelines.
            </p>
          </div>

          {/* Action buttons: Edit Mode Toggle & Reset */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`inline-flex items-center gap-2 text-xs font-black px-4 py-2.5 rounded-full shadow-sm transition-all cursor-pointer ${
                isEditMode
                  ? 'bg-[#D4F938] text-black ring-2 ring-white/30'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Finish Editing' : 'Edit Progress & Schedule'}</span>
            </button>

            {Object.keys(customSchedule).length > 0 && (
              <button
                onClick={handleResetSchedule}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white px-3 py-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset customizations to default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {/* Project Switcher if multiple proposals */}
            {proposals.length > 1 && (
              <div className="flex items-center gap-2 bg-white/10 p-1.5 pl-3 rounded-full border border-white/15">
                <span className="text-xs font-semibold text-white/80">Project:</span>
                <select
                  value={selectedPropId}
                  onChange={e => {
                    setSelectedPropId(e.target.value);
                    if (onSelectProposal) onSelectProposal(e.target.value);
                  }}
                  className="text-xs px-3 py-1.5 bg-[#18191E] text-[#D4F938] font-bold rounded-full border border-white/20 focus:outline-hidden focus:border-[#D4F938]"
                >
                  {proposals.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#18191E] text-white">
                      {p.projectId || `Group ${p.groupNo}`}: {p.title.length > 25 ? p.title.substring(0, 25) + '...' : p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Selected Project Summary Card */}
        {currentProposal && (
          <div className="relative z-10 mt-6 p-4 sm:p-5 bg-white/5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs backdrop-blur-md">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-black px-3 py-1 rounded-full bg-[#D4F938] text-black">
                  {currentProposal.projectId || `Group ${currentProposal.groupNo}`}
                </span>
                <span className="font-bold text-white text-base">
                  {currentProposal.title}
                </span>
              </div>
              <div className="text-white/70 flex flex-wrap items-center gap-3 text-xs">
                <span>Guide: <strong className="text-white">{currentProposal.guideName}</strong></span>
                <span>•</span>
                <span>Cohort: <strong className="text-white">{currentProposal.cohort}</strong></span>
                <span>•</span>
                <span>Domain: <strong className="text-white">{currentProposal.domain}</strong></span>
                <span>•</span>
                <span>Track: <strong className="text-white">Track {currentProposal.trackNo}</strong></span>
              </div>
            </div>

            {/* Overall Progress Dial */}
            <div className="flex items-center gap-4 bg-[#18191E] px-4 py-2.5 rounded-2xl border border-white/15">
              <div>
                <span className="text-[10px] uppercase font-bold text-white/50 block tracking-wider">Overall Progress</span>
                <span className="text-xl font-black text-[#D4F938] font-mono tabular-nums">{overallProgress}%</span>
              </div>
              <div className="w-28 bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#D4F938] h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Milestone Quick Stats Bento Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Total Milestones</span>
          <div className="text-2xl font-black text-[#18191E] mt-1 font-mono">7 Experiments</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">14-week semester</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Completed</span>
          <div className="text-2xl font-black text-[#18191E] mt-1 font-mono tabular-nums flex items-center gap-2">
            <span>{completedCount} / 7</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#C6B5FD] text-black font-bold">Signed</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Faculty Guide Verified</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">In Progress</span>
          <div className="text-2xl font-black text-[#18191E] mt-1 font-mono tabular-nums flex items-center gap-2">
            <span>{inProgressCount}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#D4F938] text-black font-bold">Active</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Current Sprint Cycle</span>
        </div>

        <div className="bg-[#18191E] text-white rounded-3xl p-5 shadow-xs">
          <span className="text-[#D4F938] text-[10px] uppercase font-bold tracking-wider block">Current Milestone</span>
          <div className="text-base font-extrabold text-white mt-1 truncate">Exp 3: UML Models</div>
          <span className="text-[11px] text-white/60 mt-0.5 block">Target Due: Week 6</span>
        </div>
      </div>

      {/* Visual Gantt Chart Grid with Edit Mode Features */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-[#F4F5F8]/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#18191E] text-[#D4F938] flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#18191E] uppercase tracking-wider">
                14-Week Visual Timeline (Weeks 1 to 14)
              </h3>
              <p className="text-[11px] text-slate-500">
                {isEditMode 
                  ? 'Edit Mode Active: Use quick chips or click any experiment to adjust progress % and schedule' 
                  : 'Click any experiment row to edit progress percentage, timeline, or deliverable'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="w-3 h-3 rounded-full bg-[#C6B5FD] inline-block" /> Completed
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="w-3 h-3 rounded-full bg-[#D4F938] inline-block border border-black/20" /> Active Sprint
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-400">
              <span className="w-3 h-3 rounded-full bg-slate-200 inline-block" /> Pending
            </span>
          </div>
        </div>

        <div className="overflow-x-auto p-5">
          <div className="min-w-[840px]">
            {/* Header: Weeks 1 - 14 */}
            <div className="grid grid-cols-12 gap-1.5 mb-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-4 text-left pl-2">Experiment / Deliverable</div>
              <div className="col-span-8 grid grid-cols-14 gap-1">
                {weeks.map(w => (
                  <div 
                    key={w} 
                    className={`py-1.5 rounded-lg font-mono text-[10px] ${
                      w === 5 || w === 6 
                        ? 'bg-[#18191E] text-[#D4F938] font-black shadow-xs ring-1 ring-[#D4F938]' 
                        : 'bg-[#F4F5F8] text-slate-600 font-bold'
                    }`}
                  >
                    W{w}
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Bars */}
            <div className="space-y-3">
              {scheduleItems.map((item) => {
                const leftPercentage = ((item.startWeek - 1) / 14) * 100;
                const widthPercentage = ((item.endWeek - item.startWeek + 1) / 14) * 100;

                return (
                  <div 
                    key={item.id}
                    className="grid grid-cols-12 gap-1.5 items-center p-3 rounded-2xl hover:bg-[#F4F5F8] transition-all border border-slate-100 hover:border-slate-300 group"
                  >
                    {/* Left details + Edit button */}
                    <div className="col-span-4 pr-3">
                      <div className="flex items-center justify-between">
                        <div 
                          onClick={() => handleOpenEditModal(item)}
                          className="font-bold text-[#18191E] text-xs truncate flex items-center gap-2 cursor-pointer flex-1"
                        >
                          {item.defaultStatus === 'completed' && (
                            <span className="w-4 h-4 rounded-full bg-[#C6B5FD] text-black flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-3 h-3" />
                            </span>
                          )}
                          {item.defaultStatus === 'in_progress' && (
                            <span className="w-4 h-4 rounded-full bg-[#D4F938] text-black flex items-center justify-center shrink-0 animate-pulse font-mono font-bold text-[9px]">
                              ▶
                            </span>
                          )}
                          {item.defaultStatus === 'pending' && (
                            <span className="w-4 h-4 rounded-full border border-slate-300 inline-block shrink-0" />
                          )}
                          <span className="truncate group-hover:text-black">{item.title}</span>
                        </div>

                        {/* Direct Edit Pencil Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1 rounded-full text-slate-400 hover:text-black hover:bg-slate-200 transition-colors ml-1 shrink-0 cursor-pointer"
                          title="Edit this experiment schedule and progress"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-500 truncate mt-0.5 pl-6 flex items-center justify-between">
                        <span className="truncate">{item.deliverable} • <span className="font-mono">{item.dueDate}</span></span>
                      </div>

                      {/* Direct PPT Presentation Upload/Review Links */}
                      {item.expNumber === 4 && (
                        <div className="mt-1.5 pl-6 flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const r1 = pptDeliverables.find(p => p.id === 'review-1');
                              if (r1) handleOpenUploadPpt(r1);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18191E] text-[#D4F938] hover:bg-black text-[10px] font-black transition-all cursor-pointer shadow-xs"
                          >
                            <Presentation className="w-3 h-3 text-[#D4F938]" />
                            <span>Review 1 PPT {pptDeliverables.find(p => p.id === 'review-1')?.status === 'approved' ? '✓ (23/25 Marks)' : '• Upload Deck'}</span>
                          </button>
                        </div>
                      )}

                      {item.expNumber === 7 && (
                        <div className="mt-1.5 pl-6 flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const r2 = pptDeliverables.find(p => p.id === 'review-2');
                              if (r2) handleOpenUploadPpt(r2);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18191E] text-[#C6B5FD] hover:bg-black text-[10px] font-black transition-all cursor-pointer shadow-xs"
                          >
                            <Presentation className="w-3 h-3 text-[#C6B5FD]" />
                            <span>Review 2 Final PPT {pptDeliverables.find(p => p.id === 'review-2')?.status === 'approved' ? '✓ Passed' : '• Upload Deck'}</span>
                          </button>
                        </div>
                      )}

                      {/* Quick Percentage Chips in Edit Mode */}
                      {isEditMode && (
                        <div className="flex items-center gap-1.5 mt-2 pl-6 pt-1 border-t border-slate-200/60">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Set %:</span>
                          {[0, 25, 50, 75, 100].map(pct => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => handleQuickProgressChange(item.id, pct)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-all cursor-pointer ${
                                item.progress === pct
                                  ? 'bg-[#18191E] text-[#D4F938]'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:border-black'
                              }`}
                            >
                              {pct}%
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timeline visualization bar */}
                    <div 
                      onClick={() => handleOpenEditModal(item)}
                      className="col-span-8 relative bg-[#F4F5F8] h-9 rounded-xl overflow-hidden border border-slate-200/60 cursor-pointer"
                    >
                      {/* 14 column grid lines */}
                      <div className="absolute inset-0 grid grid-cols-14 pointer-events-none opacity-20">
                        {weeks.map(w => (
                          <div key={w} className="border-r border-slate-400 h-full" />
                        ))}
                      </div>

                      {/* Active milestone bar */}
                      <div
                        className={`absolute top-1 bottom-1 rounded-lg px-2.5 flex items-center justify-between text-[10px] font-bold transition-all shadow-xs ${
                          item.defaultStatus === 'completed'
                            ? 'bg-[#C6B5FD] text-black font-extrabold'
                            : item.defaultStatus === 'in_progress'
                              ? 'bg-[#D4F938] text-black font-black ring-1 ring-black/20'
                              : 'bg-slate-300 text-slate-600'
                        }`}
                        style={{
                          left: `${leftPercentage}%`,
                          width: `${widthPercentage}%`,
                          minWidth: '45px'
                        }}
                      >
                        <span className="truncate">W{item.startWeek}-W{item.endWeek}</span>
                        <span className="text-[9px] font-mono opacity-90">{item.progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Milestone Detail Footer Info */}
        <div className="p-4 bg-[#F4F5F8] border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#18191E] shrink-0" />
            <span>
              Students can set progress percentage and adjust week timelines. Changes are automatically saved.
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold text-[#18191E] px-3 py-1 rounded-full bg-white border border-slate-200">
            Current Academic Week: Week 5
          </span>
        </div>
      </div>

      {/* ================= PPT PRESENTATION REVIEWS (REVIEW 1 & REVIEW 2) ================= */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18191E] text-[#D4F938] flex items-center justify-center font-bold shadow-sm">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#18191E] text-[#D4F938] font-black uppercase">
                  Milestone Deliverables
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Two Mandatory Capstone Evaluations
                </span>
              </div>
              <h3 className="text-lg font-black text-[#18191E] tracking-tight mt-0.5">
                Review 1 &amp; Review 2 Presentation (PPT) Uploadables
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-[#F4F5F8] px-3.5 py-1.5 rounded-full border border-slate-200">
              Exp 4 &amp; Exp 7 Viva Defense
            </span>
          </div>
        </div>

        {/* The Two PPT Presentation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {pptDeliverables.map((ppt) => {
            const isReview1 = ppt.id === 'review-1';
            const isApproved = ppt.status === 'approved';
            const isSubmitted = ppt.status === 'submitted';
            const isUnderReview = ppt.status === 'under_review';
            const isRevision = ppt.status === 'revision';

            return (
              <div
                key={ppt.id}
                className={`rounded-[24px] p-5 sm:p-6 border transition-all duration-200 relative flex flex-col justify-between ${
                  isApproved
                    ? 'bg-gradient-to-br from-white to-[#F4F5F8] border-[#18191E] shadow-sm'
                    : isSubmitted
                      ? 'bg-white border-amber-300 ring-2 ring-amber-100 shadow-sm'
                      : isRevision
                        ? 'bg-red-50/40 border-red-300'
                        : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header with Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isReview1 ? 'bg-[#18191E] text-[#D4F938]' : 'bg-[#18191E] text-[#C6B5FD]'
                      }`}>
                        {isReview1 ? 'R1' : 'R2'}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                          {isReview1 ? 'Exp 4 • Weeks 7–8' : 'Exp 7 • Weeks 13–14'}
                        </span>
                        <h4 className="text-sm font-black text-[#18191E] leading-tight">
                          {ppt.reviewTitle}
                        </h4>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                      isApproved
                        ? 'bg-[#C6B5FD] text-black'
                        : isSubmitted
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : isRevision
                            ? 'bg-red-100 text-red-900 border border-red-300'
                            : isUnderReview
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isApproved ? 'Approved (Passed)' : isSubmitted ? 'Awaiting Sign-Off' : isRevision ? 'Revisions Requested' : isUnderReview ? 'Under Review' : 'Pending Upload'}
                    </span>
                  </div>

                  {/* Stage Context Note */}
                  <div className="p-3 bg-[#F4F5F8] rounded-xl border border-slate-200/60 text-[11px] text-slate-600">
                    <strong className="text-black font-bold">Focus Area: </strong>
                    {isReview1 
                      ? 'Topic novelty validation, SRS compliance, UML models (Class, Sequence, State) & detailed DB schema.'
                      : 'Working prototype demo, automated test coverage, production deployment, and final Viva examination.'}
                  </div>

                  {/* Uploaded PPT Deck Details (if present) */}
                  {ppt.fileName ? (
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-xs text-[#18191E] truncate">
                            {ppt.fileName}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#18191E] text-[#D4F938] shrink-0">
                          {ppt.slideCount} Slides
                        </span>
                      </div>

                      {ppt.presenters && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span className="font-semibold text-slate-400">Presenters:</span>
                          <span className="text-slate-700 font-medium truncate">{ppt.presenters}</span>
                        </div>
                      )}

                      {ppt.notes && (
                        <p className="text-[11px] text-slate-600 italic bg-[#F4F5F8] p-2 rounded-lg leading-snug">
                          &ldquo;{ppt.notes}&rdquo;
                        </p>
                      )}

                      {ppt.uploadedAt && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          Uploaded: {new Date(ppt.uploadedAt).toLocaleDateString()} at {new Date(ppt.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-[#F8F9FA]">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">No PPT presentation uploaded yet</p>
                      <p className="text-[11px] text-slate-500">
                        {isReview1 
                          ? 'Upload your 15-25 slide Review 1 deck before the Week 8 deadline.' 
                          : 'Upload your final 20-30 slide Viva deck before the Week 14 deadline.'}
                      </p>
                    </div>
                  )}

                  {/* Rubric Evaluation Score & Faculty Remarks */}
                  {ppt.score !== undefined && (
                    <div className="p-3.5 bg-gradient-to-r from-[#D4F938]/15 via-white to-white rounded-2xl border border-slate-200/90 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-[#18191E] flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>Evaluation Rubric Score</span>
                        </span>
                        <span className="font-mono text-sm font-black text-black px-2.5 py-0.5 rounded-full bg-[#D4F938]">
                          {ppt.score} / {ppt.maxScore}
                        </span>
                      </div>

                      {ppt.feedback && (
                        <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                          {ppt.feedback}
                        </p>
                      )}

                      {ppt.evaluatedBy && (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium pt-1">
                          <Stamp className="w-3 h-3 text-black" />
                          <span>Signed off by: <strong className="text-black">{ppt.evaluatedBy}</strong></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    {ppt.fileUrl && (
                      <a
                        href={ppt.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>Preview Slides</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Student Upload Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenUploadPpt(ppt)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18191E] hover:bg-black text-[#D4F938] text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{ppt.fileName ? 'Update PPT Deck' : 'Upload PPT Deck'}</span>
                    </button>

                    {/* Faculty/Coordinator Evaluate Button */}
                    {(userRole === 'guide' || userRole === 'coordinator' || userRole === 'admin') && (
                      <button
                        type="button"
                        onClick={() => handleOpenEvaluatePpt(ppt)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#D4F938] hover:bg-[#cbf525] text-black text-xs font-black transition-all shadow-xs cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Grade &amp; Sign Off</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= UPLOAD PPT PRESENTATION MODAL ================= */}
      {uploadModalPpt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#18191E] rounded-[34px] p-2 border border-black/40 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col text-xs">
            <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-[#D4F938] uppercase font-bold">
                    {uploadModalPpt.id === 'review-1' ? 'Exp 4 Milestone' : 'Exp 7 Milestone'}
                  </span>
                  <h3 className="text-sm font-black text-white mt-0.5">
                    Upload {uploadModalPpt.reviewTitle}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setUploadModalPpt(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer text-base"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSavePptUpload} className="p-6 bg-[#F4F5F8] rounded-[26px] space-y-4 m-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Presentation File Name (.pptx / .ppt / .pdf)
                </label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={e => setUploadFileName(e.target.value)}
                  placeholder="e.g. DBIT_SE_Review1_Group05_Slides.pptx"
                  className="w-full bg-white rounded-xl px-3.5 py-2.5 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Total Slides Count
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={uploadSlideCount}
                    onChange={e => setUploadSlideCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-white rounded-xl px-3.5 py-2.5 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Slide Deck Link / Cloud URL
                  </label>
                  <input
                    type="url"
                    value={uploadUrl}
                    onChange={e => setUploadUrl(e.target.value)}
                    placeholder="https://docs.google.com/presentation/..."
                    className="w-full bg-white rounded-xl px-3.5 py-2.5 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Presenting Team Members
                </label>
                <input
                  type="text"
                  value={uploadPresenters}
                  onChange={e => setUploadPresenters(e.target.value)}
                  placeholder="e.g. Rishik E., Apoorvadeep S., Ron B., Aryan G."
                  className="w-full bg-white rounded-xl px-3.5 py-2.5 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Presentation Key Highlights &amp; Abstract
                </label>
                <textarea
                  rows={3}
                  value={uploadNotes}
                  onChange={e => setUploadNotes(e.target.value)}
                  placeholder="Summarize key diagrams, SBERT threshold validation, technology stack demo points..."
                  className="w-full bg-white rounded-xl px-3.5 py-2.5 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setUploadModalPpt(null)}
                  className="px-4 py-2 text-slate-500 hover:text-black font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#cbf525] text-black font-black px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Submit PPT for Guide Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EVALUATE PPT PRESENTATION MODAL ================= */}
      {evaluateModalPpt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#18191E] rounded-[34px] p-2 border border-black/40 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col text-xs">
            <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-[#D4F938] uppercase font-bold">
                    Faculty Evaluation Console
                  </span>
                  <h3 className="text-sm font-black text-white mt-0.5">
                    Grade {evaluateModalPpt.reviewTitle}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setEvaluateModalPpt(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer text-base"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSavePptEvaluation} className="p-6 bg-[#F4F5F8] rounded-[26px] space-y-4 m-1">
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold">Deck:</span>
                  <span className="font-extrabold text-black font-mono">{evaluateModalPpt.fileName || 'Pending File'}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-500 font-bold">Slides:</span>
                  <span className="font-extrabold text-black">{evaluateModalPpt.slideCount || 0} Slides</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Rubric Score (out of 25)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    required
                    value={evalScore}
                    onChange={e => setEvalScore(parseInt(e.target.value) || 0)}
                    className="w-full bg-white rounded-xl px-3.5 py-2.5 border border-slate-300 text-base font-black font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Evaluation Decision
                  </label>
                  <select
                    value={evalDecision}
                    onChange={e => setEvalDecision(e.target.value as any)}
                    className="w-full bg-white rounded-xl px-3.5 py-2.5 border border-slate-300 text-xs font-black text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                  >
                    <option value="approved">Approved (Passed)</option>
                    <option value="revision">Revisions Required</option>
                    <option value="under_review">Mark Under Evaluation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Evaluator Name / Faculty Title
                </label>
                <input
                  type="text"
                  required
                  value={evaluatorName}
                  onChange={e => setEvaluatorName(e.target.value)}
                  placeholder="e.g. Mr. Nazareth Remedios"
                  className="w-full bg-white rounded-xl px-3.5 py-2.5 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Guide / Coordinator Feedback &amp; Rubric Remarks
                </label>
                <textarea
                  rows={3}
                  required
                  value={evalFeedback}
                  onChange={e => setEvalFeedback(e.target.value)}
                  placeholder="Detail strengths in literature survey, UML modeling accuracy, or suggest required slide additions..."
                  className="w-full bg-white rounded-xl px-3.5 py-2.5 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEvaluateModalPpt(null)}
                  className="px-4 py-2 text-slate-500 hover:text-black font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#cbf525] text-black font-black px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                >
                  <Stamp className="w-4 h-4" />
                  <span>Sign-Off &amp; Save Evaluation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT MILESTONE & PROGRESS MODAL ================= */}
      {editingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#18191E] rounded-[34px] p-2 border border-black/40 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col text-xs">
            
            {/* Modal Header */}
            <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4F938] text-black flex items-center justify-center font-bold">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-[#D4F938] uppercase font-bold">
                    Student Schedule Editor
                  </span>
                  <h3 className="text-sm font-black text-white mt-0.5">
                    {editingMilestone.title}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setEditingMilestone(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-[#F4F5F8] rounded-[26px] space-y-4 m-1">
              
              {saveSuccessNotice && (
                <div className="p-3 bg-emerald-100 text-emerald-950 font-bold rounded-2xl border border-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>{saveSuccessNotice}</span>
                </div>
              )}

              {/* 1. Progress Percentage Slider & Quick Chips */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-[#18191E] text-xs flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-black" />
                    <span>Experiment Progress Percentage</span>
                  </label>
                  <span className="font-mono text-base font-black px-3 py-0.5 rounded-full bg-[#18191E] text-[#D4F938]">
                    {editProgress}%
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={editProgress}
                  onChange={e => {
                    const val = parseInt(e.target.value);
                    setEditProgress(val);
                    if (val === 100) setEditStatus('completed');
                    else if (val > 0) setEditStatus('in_progress');
                    else setEditStatus('pending');
                  }}
                  className="w-full accent-[#18191E] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                {/* Quick Selection Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Set:</span>
                  {[0, 25, 50, 75, 100].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setEditProgress(pct);
                        if (pct === 100) setEditStatus('completed');
                        else if (pct > 0) setEditStatus('in_progress');
                        else setEditStatus('pending');
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                        editProgress === pct
                          ? 'bg-[#D4F938] text-black font-extrabold shadow-2xs'
                          : 'bg-[#F4F5F8] text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Status & Week Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Status Selector */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Experiment Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full bg-[#F4F5F8] rounded-xl px-3 py-2 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden"
                  >
                    <option value="pending">Pending (0%)</option>
                    <option value="in_progress">In Progress (Active)</option>
                    <option value="completed">Completed (Signed Off)</option>
                  </select>
                </div>

                {/* Week Range Dropdowns */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Timeline Week Range
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={editStartWeek}
                      onChange={e => setEditStartWeek(parseInt(e.target.value))}
                      className="flex-1 bg-[#F4F5F8] rounded-xl px-2.5 py-2 border border-slate-200 text-xs font-bold text-slate-800"
                    >
                      {weeks.map(w => (
                        <option key={w} value={w}>W{w}</option>
                      ))}
                    </select>
                    <span className="text-slate-400 font-bold">to</span>
                    <select
                      value={editEndWeek}
                      onChange={e => setEditEndWeek(parseInt(e.target.value))}
                      className="flex-1 bg-[#F4F5F8] rounded-xl px-2.5 py-2 border border-slate-200 text-xs font-bold text-slate-800"
                    >
                      {weeks.map(w => (
                        <option key={w} value={w}>W{w}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Deliverable Title & Description */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Expected Deliverable Spec
                  </label>
                  <input
                    type="text"
                    value={editDeliverable}
                    onChange={e => setEditDeliverable(e.target.value)}
                    placeholder="e.g. Class, Sequence, State & Activity Diagrams"
                    className="w-full bg-[#F4F5F8] rounded-xl px-3.5 py-2 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Submission Due Date
                  </label>
                  <input
                    type="text"
                    value={editDueDate}
                    onChange={e => setEditDueDate(e.target.value)}
                    placeholder="e.g. Week 6 (Feb 21, 2026)"
                    className="w-full bg-[#F4F5F8] rounded-xl px-3.5 py-2 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-4 py-2 text-slate-500 hover:text-black font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalEdit}
                  className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#cbf525] text-black font-black px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Progress &amp; Schedule</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
