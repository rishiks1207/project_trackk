export type UserRole = 'student' | 'guide' | 'coordinator';

export type ProposalStatus = 
  | 'draft'
  | 'evaluating_similarity'
  | 'flagged_conflict'
  | 'coordinator_arbitration'
  | 'under_guide_review'
  | 'revision_required'
  | 'approved'
  | 'rejected'
  | 'completed';

export type StagePhase = 'stage1_design' | 'stage2_dev' | 'stage3_testing' | 'completed';

export interface StudentMember {
  name: string;
  rollNo: string;
  email: string;
  isLeader?: boolean;
}

export interface SimilarityResult {
  overallScore: number; // 0.0 to 1.0 (>= 0.75 is conflict)
  sbertScore: number;
  tfidfScore: number;
  matchedProjectId?: string;
  matchedProjectTitle?: string;
  matchedProjectYear?: string;
  matchedSnippets?: string[];
  isConflict: boolean;
  explanation: string;
  aiNoveltySuggestions?: string[];
}

export interface PitchDefense {
  content: string; // ~200 words
  submittedAt: string;
  keyDifferentiator: string;
  targetStack: string;
  expectedDeliverable: string;
}

export interface GuideFeedback {
  id: string;
  authorName: string;
  authorRole: 'guide' | 'coordinator';
  timestamp: string;
  stage: string;
  status: 'approved' | 'revision_required' | 'rejected' | 'comment';
  remarks: string;
  actionItems?: string[];
}

export interface StageGateMilestone {
  id: string;
  title: string;
  phase: StagePhase;
  weekRange: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'revision';
  dueDate: string;
  submissionLink?: string;
  submissionNotes?: string;
  submissionDate?: string;
  guideApprovedBy?: string;
  guideApprovedDate?: string;
  deliverableType: 'uml_diagram' | 'github_pr' | 'test_report' | 'architecture_spec' | 'demo_video';
}

export interface GitHubSyncData {
  owner: string;
  repo: string;
  repoUrl: string;
  connected: boolean;
  lastSyncedAt?: string;
  defaultBranch: string;
  starsCount: number;
  openIssuesCount: number;
  openPrsCount?: number;
  primaryLanguage: string;
  languages?: Record<string, number>;
  latestCommits: Array<{
    sha: string;
    message: string;
    author: string;
    date: string;
    url: string;
  }>;
}

export interface ProjectProposal {
  id: string;
  projectId?: string; // DBIT-SE-2026-T7-G05
  trackNo: number;
  groupNo: number;
  academicYear: string;
  cohort: string; // SE COMPS C (Batch A)
  title: string;
  domain: 'AI/ML' | 'Web3 & Blockchain' | 'IoT & Embedded' | 'Cloud & Distributed' | 'CyberSecurity' | 'HealthTech' | 'EdTech';
  abstract: string;
  problemStatement: string;
  objectives: string[];
  scope: {
    inScope: string[];
    outOfScope: string[];
  };
  techStack: string[];
  teamMembers: StudentMember[];
  guideName: string;
  coordinatorName: string;
  status: ProposalStatus;
  similarityData?: SimilarityResult;
  pitchDefense?: PitchDefense;
  feedbackHistory: GuideFeedback[];
  stageGates: StageGateMilestone[];
  githubData?: GitHubSyncData;
  createdAt: string;
  updatedAt: string;
  lockedTopic: boolean;
  conflictWithId?: string;
}

export interface HistoricalProject {
  id: string;
  code: string;
  title: string;
  abstract: string;
  domain: string;
  academicYear: string;
  classCohort: string;
  groupMembers: string[];
  guideName: string;
  techStack: string[];
  githubUrl?: string;
  finalRating: string;
  status: 'Archived' | 'Approved' | 'Completed';
}
