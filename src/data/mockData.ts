import { ProjectProposal, HistoricalProject } from '../types';

export const CURRENT_USER_STUDENT = {
  name: 'Rishik Ezhuthachan',
  rollNo: '15',
  email: 'rishiks1207@gmail.com',
  groupNo: 5,
  trackNo: 7,
  cohort: 'SE COMPS C (Batch A)'
};

export const INITIAL_HISTORICAL_PROJECTS: HistoricalProject[] = [
  {
    id: 'dbit-hist-01',
    code: 'DBIT-TE-2024-T2-G04',
    title: 'Smart City Traffic Signal Coordination with Computer Vision',
    abstract: 'An automated intersection traffic light control system utilizing OpenCV vehicle count tracking and YOLOv8 object detection cameras to dynamically adjust green light timers based on queue lengths.',
    domain: 'AI/ML',
    academicYear: '2024-25',
    classCohort: 'TE COMPS A',
    groupMembers: ['Rahul Sharma', 'Sneha Patil', 'Aditya More'],
    guideName: 'Mr. Nazareth Remedios',
    techStack: ['Python', 'YOLOv8', 'OpenCV', 'Flask', 'Raspberry Pi'],
    githubUrl: 'https://github.com/dbit-comps/traffic-vision-2024',
    finalRating: 'A+',
    status: 'Archived'
  },
  {
    id: 'dbit-hist-02',
    code: 'DBIT-TE-2024-T4-G11',
    title: 'Decentralized Property Registration & Land Deed Smart Contracts',
    abstract: 'A tamperproof land deed registration portal built on the Ethereum blockchain with Solidity smart contracts and IPFS document storage, mitigating fraudulent land sales and multiple deed mortgages.',
    domain: 'Web3 & Blockchain',
    academicYear: '2024-25',
    classCohort: 'TE COMPS B',
    groupMembers: ['Vikas Nair', 'Pooja Iyer', 'Karan Mehta'],
    guideName: 'Prof. Meenal Kulkarni',
    techStack: ['Solidity', 'Ethereum', 'React', 'IPFS', 'Hardhat'],
    githubUrl: 'https://github.com/dbit-comps/land-registry-web3',
    finalRating: 'A+',
    status: 'Archived'
  },
  {
    id: 'dbit-hist-03',
    code: 'DBIT-SE-2025-T1-G08',
    title: 'IoT Microgrid Solar Battery Storage & Telemetry Monitoring',
    abstract: 'ESP32 sensor telemetry network measuring solar panel voltage, battery state-of-charge, and ambient temperature, communicating over MQTT to an AWS IoT dashboard.',
    domain: 'IoT & Embedded',
    academicYear: '2025-26',
    classCohort: 'SE COMPS A',
    groupMembers: ['Rohan Gupta', 'Neha Deshmukh', 'Sahil Khan'],
    guideName: 'Mr. Nazareth Remedios',
    techStack: ['ESP32', 'C++', 'MQTT', 'AWS IoT Core', 'Node.js'],
    githubUrl: 'https://github.com/dbit-comps/iot-solar-telemetry',
    finalRating: 'A',
    status: 'Archived'
  },
  {
    id: 'dbit-hist-04',
    code: 'DBIT-BE-2025-T6-G02',
    title: 'Automated Academic Project Allocation & Plagiarism Scanner',
    abstract: 'A legacy PHP and MySQL portal for student team allocation, relying on basic keyword string tokenization and manual spreadsheet reviews for final approval.',
    domain: 'EdTech',
    academicYear: '2025-26',
    classCohort: 'BE COMPS B',
    groupMembers: ['Siddharth Rao', 'Ananya Sen'],
    guideName: 'Ms. Harleen Kaur Plaha',
    techStack: ['PHP', 'MySQL', 'Bootstrap', 'Apache'],
    githubUrl: 'https://github.com/dbit-comps/legacy-project-allocation',
    finalRating: 'B+',
    status: 'Archived'
  },
  {
    id: 'dbit-hist-05',
    code: 'DBIT-TE-2025-T3-G15',
    title: 'Automated Diabetic Retinopathy Grading using Deep Convolutional Networks',
    abstract: 'Early detection and classification of diabetic retinopathy from fundus photographs using transfer learning on EfficientNet-B4 with grad-CAM explainability.',
    domain: 'HealthTech',
    academicYear: '2025-26',
    classCohort: 'TE COMPS C',
    groupMembers: ['Tanvi Kulkarni', 'Arjun Verma', 'Preeti Shah'],
    guideName: 'Prof. Meenal Kulkarni',
    techStack: ['PyTorch', 'EfficientNet', 'FastAPI', 'React'],
    githubUrl: 'https://github.com/dbit-comps/retinopathy-ai',
    finalRating: 'A+',
    status: 'Archived'
  },
  {
    id: 'dbit-hist-06',
    code: 'DBIT-BE-2024-T5-G09',
    title: 'Zero-Knowledge Proof Identity Verification for Campus Elections',
    abstract: 'Electronic voting protocol implementing zk-SNARKs and circom circuits to ensure voter anonymity while providing cryptographic verifiability of ballot integrity.',
    domain: 'CyberSecurity',
    academicYear: '2024-25',
    classCohort: 'BE COMPS A',
    groupMembers: ['Farhan Shaikh', 'Devika Menon'],
    guideName: 'Ms. Harleen Kaur Plaha',
    techStack: ['Circom', 'SnarkJS', 'Next.js', 'Solidity'],
    githubUrl: 'https://github.com/dbit-comps/zk-campus-voting',
    finalRating: 'A+',
    status: 'Archived'
  }
];

export const INITIAL_PROPOSALS: ProjectProposal[] = [
  {
    id: 'prop-group-05',
    projectId: 'DBIT-SE-2026-T7-G05',
    trackNo: 7,
    groupNo: 5,
    academicYear: '2026-27',
    cohort: 'SE COMPS C (Batch A)',
    title: 'Centralized Project Proposal & Progress Tracking Portal (DBIT ProjectTrack)',
    domain: 'AI/ML',
    abstract: 'DBIT ProjectTrack is a centralized web portal that automates topic screening, faculty review, and milestone tracking for undergraduate project courses. Featuring automated real-time similarity pre-screening with a threshold of 0.75, it flags duplicate ideas. An expert-in-the-loop conflict queue provides side-by-side pitch defense evaluation instead of first-come allocation, paired with a visual stage-gate tracker and GitHub repository sync.',
    problemStatement: 'To develop a web-based centralized portal for students and project guides that provides automated detection of duplicate or overlapping project topics, a searchable archive of approved topics, and real-time approval, feedback, and stage tracking with deadline reminders, thereby reducing overlapping projects and the delays and confusion caused by slow, scattered, and untracked feedback.',
    objectives: [
      'Automated duplicate detection: flag overlapping titles and abstracts at submission using similarity screening.',
      'Side-by-side pitch defense: faculty merit review for contested topics instead of first-come allocation.',
      'Searchable topic archive: pre-submission visibility into past approved projects.',
      'Stage-gate progress tracking: real-time milestones from approval through testing.',
      'Centralized written feedback log and automated reminder alerts.'
    ],
    scope: {
      inScope: [
        'Department-level proposal submission',
        'Duplicate analysis and similarity check',
        'Faculty resolution queue & side-by-side pitch defense matrix',
        'Milestone tracking and automated reminder alerts for SE/TE courses',
        'GitHub repository sync for stage deliverables'
      ],
      outOfScope: [
        'Full-document thesis plagiarism scanning (Turnitin-style)',
        'Automated code repository static analysis',
        'Multi-institute university deployment'
      ]
    },
    techStack: ['Similarity Engine', 'React 19', 'TypeScript', 'Tailwind CSS', 'GitHub REST API', 'Gemini AI'],
    teamMembers: [
      { name: 'Apoorvadeep Sinha', rollNo: '01', email: 'apoorvadeep.sinha@dbit.in', isLeader: true },
      { name: 'Ron Barretto', rollNo: '05', email: 'ron.barretto@dbit.in' },
      { name: 'Rishik Ezhuthachan', rollNo: '15', email: 'rishiks1207@gmail.com' },
      { name: 'Aryan Gaikwad', rollNo: '17', email: 'aryan.gaikwad@dbit.in' }
    ],
    guideName: 'Mr. Nazareth Remedios',
    coordinatorName: 'Prof. Meenal Kulkarni',
    status: 'approved',
    lockedTopic: true,
    similarityData: {
      overallScore: 0.18,
      sbertScore: 0.22,
      tfidfScore: 0.12,
      isConflict: false,
      explanation: 'HIGH ORIGINALITY (82%): Distinctive topic proposal. Clean stage-gate architecture.'
    },
    pitchDefense: {
      content: 'While legacy systems perform static keyword matching, DBIT ProjectTrack introduces contextual similarity screening that catches rephrased titles. Additionally, our Expert-in-the-Loop Conflict Queue resolves topic clashes through merit-based pitch defenses rather than unfair first-come first-serve locking.',
      submittedAt: '2026-09-15T10:30:00Z',
      keyDifferentiator: 'Automated similarity screening with 0.75 conflict threshold + Side-by-side pitch review',
      targetStack: 'React + TypeScript + Similarity Screening + GitHub Sync',
      expectedDeliverable: 'Full working portal deployed for DBIT SE COMPS with live GitHub verification'
    },
    feedbackHistory: [
      {
        id: 'fb-01',
        authorName: 'Mr. Nazareth Remedios',
        authorRole: 'guide',
        timestamp: '2026-09-16T14:20:00Z',
        stage: 'Topic Approval',
        status: 'approved',
        remarks: 'Topic proposal is well-scoped and addresses a pressing problem in our department. Architecture and similarity threshold approach (0.75) approved for SE Mini Project Track 7.',
        actionItems: ['Finalize UML Activity and State Machine diagrams for Exp 4', 'Verify similarity algorithm performance']
      },
      {
        id: 'fb-02',
        authorName: 'Prof. Meenal Kulkarni',
        authorRole: 'coordinator',
        timestamp: '2026-10-02T11:00:00Z',
        stage: 'Review 1 Evaluation',
        status: 'approved',
        remarks: 'Review 1 completed with high marks. Empathy mapping, literature matrix, and UML 2.5 models align with DBIT project guidelines.',
        actionItems: ['Integrate live GitHub repository sync for Stage 2 development sprint', 'Ensure responsive UI on student and faculty viewports']
      }
    ],
    stageGates: [
      {
        id: 'sg-01',
        title: 'Exp 1: Empathy Study & Problem Framing',
        phase: 'stage1_design',
        weekRange: 'W1 - W3',
        status: 'approved',
        dueDate: '2026-08-15',
        submissionLink: 'https://drive.google.com/dbit-exp1',
        submissionNotes: 'Persona Prof. Meenal Kulkarni empathy map and bottleneck interview notes completed.',
        submissionDate: '2026-08-14',
        guideApprovedBy: 'Mr. Nazareth Remedios',
        guideApprovedDate: '2026-08-16',
        deliverableType: 'architecture_spec'
      },
      {
        id: 'sg-02',
        title: 'Exp 2: Literature Matrix & App Benchmark',
        phase: 'stage1_design',
        weekRange: 'W4 - W6',
        status: 'approved',
        dueDate: '2026-08-30',
        submissionLink: 'https://drive.google.com/dbit-exp2',
        submissionNotes: 'Literature matrix of 5 papers and app benchmark comparison completed.',
        submissionDate: '2026-08-29',
        guideApprovedBy: 'Mr. Nazareth Remedios',
        guideApprovedDate: '2026-09-01',
        deliverableType: 'architecture_spec'
      },
      {
        id: 'sg-03',
        title: 'Exp 3: User Survey & Problem Formulation',
        phase: 'stage1_design',
        weekRange: 'W5 - W6',
        status: 'approved',
        dueDate: '2026-09-10',
        submissionLink: 'https://forms.google.com/dbit-survey-results',
        submissionNotes: 'Survey of 77 students and 2 guides conducted. 79.2% topic overlap, 81.8% stage confusion confirmed.',
        submissionDate: '2026-09-08',
        guideApprovedBy: 'Prof. Meenal Kulkarni',
        guideApprovedDate: '2026-09-12',
        deliverableType: 'architecture_spec'
      },
      {
        id: 'sg-04',
        title: 'Exp 4: UML Diagrams & Architecture Design',
        phase: 'stage1_design',
        weekRange: 'W7 - W8',
        status: 'approved',
        dueDate: '2026-09-28',
        submissionLink: 'https://dbit-uml.docs/review1',
        submissionNotes: 'UML 2.5 Use Case, State Machine Lifecycle, and Activity diagrams with 3-tier pipeline.',
        submissionDate: '2026-09-25',
        guideApprovedBy: 'Mr. Nazareth Remedios',
        guideApprovedDate: '2026-09-29',
        deliverableType: 'uml_diagram'
      },
      {
        id: 'sg-05',
        title: 'Exp 5: Similarity Engine Development',
        phase: 'stage2_dev',
        weekRange: 'W9 - W11',
        status: 'submitted',
        dueDate: '2026-10-25',
        submissionLink: 'https://github.com/rishiks1207/dbit-project-track',
        submissionNotes: 'Automated similarity screening engine implemented with unit tests passing at 0.75 threshold.',
        submissionDate: '2026-10-20',
        deliverableType: 'github_pr'
      },
      {
        id: 'sg-06',
        title: 'Exp 6: Web Portal UI (Student, Guide & Coordinator)',
        phase: 'stage2_dev',
        weekRange: 'W10 - W12',
        status: 'in_progress',
        dueDate: '2026-11-05',
        submissionNotes: 'Developing responsive 3-role portal with live submission originality meter and conflict resolution queue.',
        deliverableType: 'architecture_spec'
      },
      {
        id: 'sg-07',
        title: 'Exp 7: System Integration & Final Evaluation (Review 2)',
        phase: 'stage3_testing',
        weekRange: 'W12 - W14',
        status: 'pending',
        dueDate: '2026-11-20',
        submissionNotes: 'End-to-end integration testing, test suite verification, and final committee demonstration.',
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
      starsCount: 8,
      openIssuesCount: 2,
      primaryLanguage: 'TypeScript',
      languages: {
        TypeScript: 72400,
        Python: 18200,
        HTML: 4800,
        CSS: 4600
      },
      latestCommits: [
        {
          sha: 'a7c1409',
          message: 'feat: real-time contextual similarity screening with 0.75 threshold',
          author: 'Rishik Ezhuthachan',
          date: '2026-10-22T19:30:00Z',
          url: 'https://github.com/rishiks1207/dbit-project-track/commit/a7c1409'
        },
        {
          sha: 'b39f104',
          message: 'feat: side-by-side pitch defense matrix for coordinator conflict queue',
          author: 'Apoorvadeep Sinha',
          date: '2026-10-21T14:15:00Z',
          url: 'https://github.com/rishiks1207/dbit-project-track/commit/b39f104'
        },
        {
          sha: 'c48a901',
          message: 'feat: visual stage-gate tracker with milestone checklist and digital sign-off',
          author: 'Ron Barretto',
          date: '2026-10-20T11:45:00Z',
          url: 'https://github.com/rishiks1207/dbit-project-track/commit/c48a901'
        },
        {
          sha: 'd19e843',
          message: 'feat: searchable historical project archive with domain and class filters',
          author: 'Aryan Gaikwad',
          date: '2026-10-19T09:20:00Z',
          url: 'https://github.com/rishiks1207/dbit-project-track/commit/d19e843'
        }
      ]
    },
    createdAt: '2026-08-05T09:00:00Z',
    updatedAt: '2026-10-22T20:00:00Z'
  },
  {
    id: 'prop-group-12',
    projectId: 'DBIT-SE-2026-T7-G12',
    trackNo: 7,
    groupNo: 12,
    academicYear: '2026-27',
    cohort: 'SE COMPS C (Batch B)',
    title: 'Automated Academic Proposal Duplicate Checker and Allocation Web App',
    domain: 'AI/ML',
    abstract: 'An automated web platform for college student project title and abstract submission that scans for duplicate project titles using sentence embeddings and cosine similarity, notifying project coordinators to avoid duplicate projects.',
    problemStatement: 'Manual spreadsheet allocation leads to topic repetition across engineering batches.',
    objectives: ['Title similarity checking', 'Web interface for coordinators'],
    scope: {
      inScope: ['Title matching', 'Coordinator approval view'],
      outOfScope: ['Stage-gate milestone tracking', 'GitHub integration', 'Pitch defense matrix']
    },
    techStack: ['Python', 'Flask', 'MySQL'],
    teamMembers: [
      { name: 'Kunal Joshi', rollNo: '24', email: 'kunal.j@dbit.in', isLeader: true },
      { name: 'Sameer Sheikh', rollNo: '29', email: 'sameer.s@dbit.in' },
      { name: 'Priya Sawant', rollNo: '33', email: 'priya.s@dbit.in' }
    ],
    guideName: 'Ms. Harleen Kaur Plaha',
    coordinatorName: 'Prof. Meenal Kulkarni',
    status: 'flagged_conflict',
    conflictWithId: 'prop-group-05',
    lockedTopic: false,
    similarityData: {
      overallScore: 0.84,
      sbertScore: 0.88,
      tfidfScore: 0.78,
      isConflict: true,
      explanation: 'CRITICAL TOPIC CLASH (84.0% similarity): Heavy semantic clash with Group 05 "Centralized Project Proposal & Progress Tracking Portal". Both propose automated duplicate screening using embeddings.',
      matchedProjectId: 'prop-group-05',
      matchedProjectTitle: 'Centralized Project Proposal & Progress Tracking Portal (DBIT ProjectTrack)'
    },
    pitchDefense: {
      content: 'Our team aims to build a lightweight desktop wrapper for department administrators focusing specifically on CSV batch uploads and fast rule-based indexing rather than an end-to-end multi-stage student portal.',
      submittedAt: '2026-10-18T16:40:00Z',
      keyDifferentiator: 'Lightweight admin CSV parser vs full stage-gate portal',
      targetStack: 'Python Flask + SQLite',
      expectedDeliverable: 'Admin script with basic similarity report'
    },
    feedbackHistory: [
      {
        id: 'fb-12-01',
        authorName: 'Prof. Meenal Kulkarni',
        authorRole: 'coordinator',
        timestamp: '2026-10-19T10:00:00Z',
        stage: 'Conflict Arbitration',
        status: 'revision_required',
        remarks: 'Semantic overlap with Group 05 is high (84%). Group 05 has already passed Review 1 with comprehensive UML models and SBERT implementation. Group 12 must pivot or refine scope to administrative timetable integration.',
        actionItems: ['Pivot to Automated Exam Timetable & Lab Allocation or differentiate methodology']
      }
    ],
    stageGates: [],
    createdAt: '2026-10-17T11:00:00Z',
    updatedAt: '2026-10-19T10:00:00Z'
  },
  {
    id: 'prop-group-08',
    projectId: 'DBIT-SE-2026-T3-G08',
    trackNo: 3,
    groupNo: 8,
    academicYear: '2026-27',
    cohort: 'SE COMPS A (Batch B)',
    title: 'Autonomous Drone Delivery Route Planner using Genetic Algorithms',
    domain: 'AI/ML',
    abstract: 'Optimizing last-mile parcel logistics using metaheuristic genetic algorithms to compute energy-efficient aerial flight corridors considering wind velocity and no-fly geofences.',
    problemStatement: 'Last mile delivery in congested suburban zones faces delays and excessive carbon emissions.',
    objectives: ['3D flight path optimization', 'Dynamic wind vector adjustment'],
    scope: {
      inScope: ['Simulation environment in WebGL', 'Genetic algorithm pathfinder'],
      outOfScope: ['Physical quadcopter hardware construction']
    },
    techStack: ['Python', 'Three.js', 'React', 'FastAPI'],
    teamMembers: [
      { name: 'Neil Dsouza', rollNo: '08', email: 'neil.d@dbit.in', isLeader: true },
      { name: 'Gaurav Kadam', rollNo: '14', email: 'gaurav.k@dbit.in' }
    ],
    guideName: 'Mr. Nazareth Remedios',
    coordinatorName: 'Prof. Meenal Kulkarni',
    status: 'approved',
    lockedTopic: true,
    similarityData: {
      overallScore: 0.12,
      sbertScore: 0.15,
      tfidfScore: 0.08,
      isConflict: false,
      explanation: 'HIGH ORIGINALITY (88%): Novel topic within robotics and logistics domain.'
    },
    feedbackHistory: [
      {
        id: 'fb-08-01',
        authorName: 'Mr. Nazareth Remedios',
        authorRole: 'guide',
        timestamp: '2026-09-20T12:00:00Z',
        stage: 'Topic Approval',
        status: 'approved',
        remarks: 'Unique focus. Approved for Stage 1 Design.'
      }
    ],
    stageGates: [
      {
        id: 'sg-08-01',
        title: 'Exp 1-4: Architecture & Genetic Algorithm Formulation',
        phase: 'stage1_design',
        weekRange: 'W1 - W8',
        status: 'approved',
        dueDate: '2026-09-30',
        submissionLink: 'https://github.com/dbit-g08/drone-routes',
        deliverableType: 'architecture_spec'
      }
    ],
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-20T12:00:00Z'
  }
];

export const SURVEY_DATA = {
  sampleSize: 79,
  respondents: '77 SE/TE students and 2 project guides across DBIT Computer Engineering cohorts',
  metrics: [
    { label: 'Topic Overlap Encountered', value: 79.2, fraction: '61 / 77 students', color: '#ef4444' },
    { label: 'Wait Time >= 3 Days for Guide Feedback', value: 44.2, fraction: '34 / 77 students', color: '#f59e0b' },
    { label: 'Confusion on Next Deliverables & Stage Gates', value: 81.8, fraction: '63 / 77 students', color: '#dc2626' },
    { label: 'Duplicate Check Feature Demand', value: 57.1, fraction: '44 / 77 respondents', color: '#2563eb' },
    { label: 'Topic Search & Archive Access Demand', value: 55.8, fraction: '43 / 77 respondents', color: '#0284c7' },
    { label: 'Automated Alerts & Reminders Demand', value: 49.4, fraction: '38 / 77 respondents', color: '#059669' }
  ]
};

export const GANTT_SCHEDULE = [
  { exp: 'Exp 1', title: 'Empathy Study & Problem Framing', weeks: 'W1 - W3', startWeek: 1, endWeek: 3, status: 'Completed', owner: 'Team + Guides' },
  { exp: 'Exp 2', title: 'Literature Matrix & App Benchmark', weeks: 'W4 - W6', startWeek: 4, endWeek: 6, status: 'Completed', owner: 'Team' },
  { exp: 'Exp 3', title: 'User Survey & Problem Formulation', weeks: 'W5 - W6', startWeek: 5, endWeek: 6, status: 'Completed', owner: 'Team' },
  { exp: 'Exp 4', title: 'UML Diagrams & Architecture Design', weeks: 'W7 - W8', startWeek: 7, endWeek: 8, status: 'Completed', owner: 'Team' },
  { exp: '★ Milestone', title: 'Progress Review 1 Evaluation', weeks: 'W8*', startWeek: 8, endWeek: 8, status: 'Completed (Pass)', owner: 'Evaluation Committee' },
  { exp: 'Exp 5', title: 'Similarity Engine Development', weeks: 'W9 - W11', startWeek: 9, endWeek: 11, status: 'In Progress', owner: 'Team' },
  { exp: 'Exp 6', title: 'Web Portal UI (Student, Guide & Coordinator)', weeks: 'W10 - W12', startWeek: 10, endWeek: 12, status: 'Active Sprint', owner: 'Team' },
  { exp: 'Exp 7', title: 'System Integration & Final Evaluation (Review 2)', weeks: 'W12 - W14', startWeek: 12, endWeek: 14, status: 'Upcoming', owner: 'Team + Committee' }
];

export const LITERATURE_REVIEW_PAPERS = [
  {
    srNo: 1,
    title: 'Web-Based Centralized Student Project Allocation & Management System',
    authors: 'S. Sharma, A. Kumar, P. Deshmukh',
    year: 2021,
    methodology: 'RBAC, MySQL relational database, PHP web architecture.',
    keyFindings: 'Admin follow-ups cut by 40%; eliminated lost physical forms.',
    limitations: 'Lacks automated duplicate detection.'
  },
  {
    srNo: 2,
    title: 'Detection of Duplicate Project Proposals Using NLP',
    authors: 'R. Patel, V. Shah, M. Mehta',
    year: 2023,
    methodology: 'Tokenization, TF-IDF vectorization, Cosine similarity.',
    keyFindings: '88% accuracy in identifying exact and near-exact duplicates.',
    limitations: 'High false-negative rate on rephrased titles.'
  },
  {
    srNo: 3,
    title: 'Semantic Similarity & Paraphrase Detection for Proposals using BERT',
    authors: 'J. Dev, S. Nair, L. Verma',
    year: 2024,
    methodology: 'Sentence-BERT (SBERT) contextual embeddings, threshold >= 0.75.',
    keyFindings: '94.2% accuracy in detecting paraphrased project titles.',
    limitations: 'Higher computational overhead.'
  },
  {
    srNo: 4,
    title: 'Expert-in-the-Loop Framework for Academic Conflict Resolution',
    authors: 'M. R. Gupta, P. K. Singh',
    year: 2022,
    methodology: 'Threshold escalation queue, side-by-side pitch matrix.',
    keyFindings: 'Human-in-the-loop review maintained fairness & lowered load.',
    limitations: 'Dependent on faculty response times.'
  },
  {
    srNo: 5,
    title: 'Digital Archiving & Semantic Search for Student Engineering Projects',
    authors: 'A. Joshi, R. Kulkarni',
    year: 2020,
    methodology: 'Metadata tag indexing, domain-level relational search.',
    keyFindings: 'Archive access reduced redundant topic submissions by 60%.',
    limitations: 'Static repository without live checks.'
  }
];
