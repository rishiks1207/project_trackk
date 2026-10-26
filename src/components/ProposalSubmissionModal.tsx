import React, { useState, useEffect, useId } from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Cpu, 
  Flame, 
  Layers, 
  Send, 
  Plus, 
  Trash2,
  FileCheck,
  RotateCcw,
  Scale,
  Users,
  Check,
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { ProjectProposal, HistoricalProject, StudentMember, UserAccount } from '../types';
import { scanProposalSimilarity } from '../utils/nlpSimilarity';
import { analyzeProposalWithAi } from '../utils/geminiAi';
import { subscribeToUsers } from '../utils/firestoreSync';

interface ProposalSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposal: Partial<ProjectProposal>) => void;
  historicalProjects: HistoricalProject[];
  currentUser?: UserAccount | null;
}

export const ProposalSubmissionModal: React.FC<ProposalSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  historicalProjects,
  currentUser
}) => {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<ProjectProposal['domain']>('AI/ML');
  const [trackNo, setTrackNo] = useState<number>(currentUser?.trackNo ?? 7);
  const [groupNo, setGroupNo] = useState<number>(currentUser?.groupNo ?? 1);
  const [cohort, setCohort] = useState(currentUser?.cohort || 'SE COMPS C (Batch A)');
  const [abstract, setAbstract] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [techStackInput, setTechStackInput] = useState('TypeScript, React, Python');
  const [githubUrl, setGithubUrl] = useState('');
  const [guideName, setGuideName] = useState(currentUser?.role === 'guide' ? currentUser.name : 'Mr. Nazareth Remedios');
  
  // Database students & guides
  const [availableStudents, setAvailableStudents] = useState<UserAccount[]>([]);
  const [availableGuides, setAvailableGuides] = useState<UserAccount[]>([]);
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  // Team members
  const [teamMembers, setTeamMembers] = useState<StudentMember[]>(() => {
    if (currentUser?.role === 'student' && currentUser.name) {
      return [{
        name: currentUser.name,
        rollNo: currentUser.rollNo || '1',
        email: currentUser.email || 'student@dbit.in',
        isLeader: true
      }];
    }
    return [
      { name: 'Rishik Ezhuthachan', rollNo: '15', email: 'student@dbit.in', isLeader: true },
      { name: 'Apoorvadeep Sinha', rollNo: '16', email: 'apoorvadeep.sinha@dbit.in' },
      { name: 'Ron Barretto', rollNo: '17', email: 'ron.barretto@dbit.in' },
      { name: 'Aryan Gaikwad', rollNo: '18', email: 'aryan.gaikwad@dbit.in' }
    ];
  });

  // Re-sync with currentUser when modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      if (currentUser.groupNo) setGroupNo(currentUser.groupNo);
      if (currentUser.trackNo) setTrackNo(currentUser.trackNo);
      if (currentUser.cohort) setCohort(currentUser.cohort);
      if (currentUser.role === 'guide') setGuideName(currentUser.name);

      if (currentUser.role === 'student' && currentUser.name) {
        // If not Rishik or group 5, start with user's own profile as team leader
        const isDefaultRishik = currentUser.email === 'student@dbit.in' || currentUser.name.toLowerCase().includes('rishik');
        if (!isDefaultRishik) {
          setTeamMembers([{
            name: currentUser.name,
            rollNo: currentUser.rollNo || '1',
            email: currentUser.email || 'student@dbit.in',
            isLeader: true
          }]);
        }
      }
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    // 1. Subscribe to live Firestore users
    const unsub = subscribeToUsers((allUsers) => {
      const studs = allUsers.filter(u => u.role === 'student');
      if (studs.length > 0) {
        setAvailableStudents(studs);
      }
      const gds = allUsers.filter(u => u.role === 'guide');
      if (gds.length > 0) {
        setAvailableGuides(gds);
        if (currentUser?.role !== 'guide' && !guideName) {
          setGuideName(gds[0].name);
        }
      }
    });

    // 2. Also try API endpoint if on Express
    fetch('/api/users')
      .then(res => {
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) return res.json();
        return [];
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const studs = data.filter((u: UserAccount) => u.role === 'student');
          setAvailableStudents(prev => {
            const combined = [...prev];
            studs.forEach(s => {
              if (!combined.some(c => c.email.toLowerCase() === s.email.toLowerCase())) {
                combined.push(s);
              }
            });
            return combined;
          });

          const gds = data.filter((u: UserAccount) => u.role === 'guide');
          setAvailableGuides(prev => {
            const combined = [...prev];
            gds.forEach((g: UserAccount) => {
              if (!combined.some(c => c.email.toLowerCase() === g.email.toLowerCase())) {
                combined.push(g);
              }
            });
            return combined;
          });
        }
      })
      .catch(err => console.warn('Could not load registered users:', err));

    return () => unsub();
  }, [currentUser, guideName]);

  // Pitch defense
  const [pitchDefense, setPitchDefense] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Unique IDs for accessibility
  const titleInputId = useId();
  const domainSelectId = useId();
  const trackInputId = useId();
  const groupInputId = useId();
  const cohortInputId = useId();
  const guideSelectId = useId();
  const githubInputId = useId();
  const techStackInputId = useId();
  const problemStatementId = useId();
  const abstractTextareaId = useId();
  const pitchDefenseId = useId();

  if (!isOpen) return null;

  // Real-time similarity scan
  const similarityReport = scanProposalSimilarity(title, abstract, historicalProjects);
  const originalityPercent = Math.max(0, Math.min(100, Math.round((1 - similarityReport.overallScore) * 100)));
  const simPercent = Math.round(similarityReport.overallScore * 100);

  // Quick preset loader to test both branches
  const loadPreset = (type: 'duplicate' | 'novel' | 'group5') => {
    if (type === 'duplicate') {
      setTitle('Smart City Traffic Signal Management via Computer Vision');
      setDomain('AI/ML');
      setAbstract('An automated intersection traffic light control system utilizing OpenCV vehicle count tracking and YOLOv8 object detection cameras to dynamically adjust green light timers based on queue lengths.');
      setProblemStatement('City traffic intersections suffer from static timer delays, leading to severe rush-hour vehicle congestion.');
      setTechStackInput('Python, OpenCV, YOLO, Flask');
    } else if (type === 'novel') {
      setTitle('Edge-Compute Bioacoustic Forest Canopy Wildlife Sensor Grid');
      setDomain('IoT & Embedded');
      setAbstract('Autonomous ultra-low-power ESP32 audio sensor mesh deployed in canopy tiers detecting endangered bird frequencies and acoustic distress signals with lightweight micro-DSP FFT classification.');
      setProblemStatement('Habitat destruction and poaching lack continuous low-latency acoustic tracking in remote dense biomes.');
      setTechStackInput('ESP32, TinyML, LoRaWAN, WebAssembly, C++');
    } else {
      setTitle('Centralized Project Proposal & Progress Tracking Portal (DBIT ProjectTrack)');
      setDomain('AI/ML');
      setAbstract('DBIT ProjectTrack automates topic screening, faculty review, and milestone tracking. Featuring automated real-time NLP pre-screening using Sentence-BERT (SBERT) contextual embeddings and TF-IDF cosine similarity with a threshold of 0.75, it flags paraphrased duplicate ideas. An expert-in-the-loop conflict queue provides side-by-side pitch defense evaluation instead of first-come allocation.');
      setProblemStatement('Manual Google Sheets and WhatsApp submissions cause 79.2% topic overlap and 81.8% stage gate confusion across SE/TE cohorts.');
      setTechStackInput('Sentence-BERT, TF-IDF, React 19, TypeScript, GitHub API');
    }
  };

  const handleGenerateAiDefense = async () => {
    setIsAiAnalyzing(true);
    try {
      const res = await analyzeProposalWithAi(title, abstract, similarityReport.matchedProjectTitle);
      if (res) {
        setPitchDefense(res.suggestedPitchPhrasing);
        setAiSuggestions(res.distinctiveAngles);
      }
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !abstract.trim()) return;

    const stackList = techStackInput.split(',').map(s => s.trim()).filter(Boolean);

    onSubmit({
      trackNo,
      groupNo,
      cohort,
      title,
      domain,
      abstract,
      problemStatement: problemStatement || 'Undergraduate engineering project problem definition.',
      techStack: stackList.length > 0 ? stackList : ['TypeScript', 'React'],
      guideName,
      teamMembers,
      status: similarityReport.isConflict 
        ? (pitchDefense.trim() ? 'coordinator_arbitration' : 'flagged_conflict')
        : 'under_guide_review',
      similarityData: similarityReport,
      pitchDefense: pitchDefense.trim() ? {
        content: pitchDefense,
        submittedAt: new Date().toISOString(),
        keyDifferentiator: aiSuggestions[0] || 'Technical novelty & distinct institutional constraints',
        targetStack: stackList.join(', '),
        expectedDeliverable: 'Working deployment with verified benchmarks'
      } : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#18191E] rounded-[34px] sm:rounded-[40px] p-2 sm:p-2.5 shadow-2xl border border-black/40 w-full max-w-4xl my-6 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Dark Header with Neon-Lime Spark Logo */}
        <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4F938] to-[#C6B5FD] flex items-center justify-center p-2 shadow-md shadow-[#D4F938]/20">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-950 fill-current">
                <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#D4F938] text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  SBERT Active
                </span>
                <span className="text-slate-400 text-[11px] font-mono">
                  Cutoff: 0.75
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                Submit Engineering Project Proposal
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Test Presets Bar in Charcoal Theme */}
        <div className="bg-[#18191E] px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-white/10">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4F938]" />
            <span>Load Test Preset:</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadPreset('group5')}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white text-slate-200 hover:text-slate-950 text-[11px] font-bold transition-all cursor-pointer"
            >
              Group 5 (DBIT ProjectTrack)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('duplicate')}
              className="px-3 py-1 rounded-full bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
            >
              Simulate Duplicate (≥ 0.75)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('novel')}
              className="px-3 py-1 rounded-full bg-[#D4F938]/20 hover:bg-[#D4F938] text-[#D4F938] hover:text-slate-950 text-[11px] font-bold transition-all cursor-pointer"
            >
              Simulate 100% Novel
            </button>
          </div>
        </div>

        {/* Main Porcelain Content Body */}
        <div className="flex-1 bg-[#F4F5F8] rounded-[24px] sm:rounded-[30px] p-5 sm:p-7 overflow-y-auto space-y-5 m-1">
          
          {/* Real-Time Similarity Score Card in White Bento Design */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100/90 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Circular Originality Score Bubble */}
                <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-black text-sm shadow-sm ${
                  similarityReport.isConflict 
                    ? 'bg-red-500 text-white' 
                    : similarityReport.overallScore >= 0.4 
                      ? 'bg-[#C6B5FD] text-slate-900' 
                      : 'bg-[#D4F938] text-slate-950'
                }`}>
                  <span className="text-base font-mono leading-none">{originalityPercent}%</span>
                  <span className="text-[8px] uppercase tracking-wider font-extrabold mt-0.5">Novel</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      Originality Score: {originalityPercent}%
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-slate-100 text-slate-700">
                      Overlap: {simPercent}%
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#18191E] text-white font-mono font-semibold">
                      Cutoff: 75%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {similarityReport.explanation}
                  </p>
                </div>
              </div>

              {/* Sub-scores: SBERT (Lilac) vs TF-IDF (Obsidian) */}
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/60 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">SBERT (Dense)</span>
                  <span className="font-black text-slate-900">{(similarityReport.sbertScore * 100).toFixed(1)}%</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">TF-IDF (Lexical)</span>
                  <span className="font-black text-slate-900">{(similarityReport.tfidfScore * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Conflict Alert Banner */}
            {similarityReport.isConflict && similarityReport.matchedProjectTitle && (
              <div className="mt-4 pt-3.5 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 font-bold text-red-600">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Clashing Proposal Flagged (Overlap &ge; 0.75):</span>
                </div>
                <p className="mt-1 text-slate-900 font-bold pl-6">
                  &ldquo;{similarityReport.matchedProjectTitle}&rdquo; ({similarityReport.matchedProjectYear})
                </p>
                <p className="mt-0.5 pl-6 text-slate-500 text-[11px]">
                  Requires submission of a 200-Word Pitch Defense. Coordinator &amp; Guide will evaluate both proposals side-by-side.
                </p>
              </div>
            )}
          </div>

          {/* Form Controls */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Project Title & Domain Track */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label htmlFor={titleInputId} className="block font-bold text-slate-800 mb-1.5">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  id={titleInputId}
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Centralized Project Proposal & Progress Tracking Portal"
                  className="w-full bg-white rounded-2xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200/80 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#D4F938] font-medium"
                />
              </div>

              <div>
                <label htmlFor={domainSelectId} className="block font-bold text-slate-800 mb-1.5">
                  Domain Track <span className="text-red-500">*</span>
                </label>
                <select
                  id={domainSelectId}
                  value={domain}
                  onChange={e => setDomain(e.target.value as any)}
                  className="w-full bg-white rounded-2xl px-4 py-2.5 text-xs text-slate-900 border border-slate-200/80 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#D4F938] font-medium"
                >
                  <option value="AI/ML">AI / Machine Learning (Track 7)</option>
                  <option value="Web3 & Blockchain">Web3 & Blockchain (Track 4)</option>
                  <option value="IoT & Embedded">IoT & Embedded Systems (Track 1)</option>
                  <option value="Cloud & Distributed">Cloud & Distributed (Track 2)</option>
                  <option value="CyberSecurity">CyberSecurity (Track 5)</option>
                  <option value="HealthTech">HealthTech (Track 3)</option>
                  <option value="EdTech">EdTech & Campus Automation (Track 6)</option>
                </select>
              </div>
            </div>

            {/* Track, Group, Cohort, Guide */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label htmlFor={trackInputId} className="block font-bold text-slate-700 mb-1">Track No.</label>
                <input
                  id={trackInputId}
                  type="number"
                  value={trackNo}
                  onChange={e => setTrackNo(parseInt(e.target.value) || 1)}
                  className="w-full bg-white rounded-2xl px-3 py-2 border border-slate-200/80 shadow-xs text-xs font-mono font-medium focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                />
              </div>
              <div>
                <label htmlFor={groupInputId} className="block font-bold text-slate-700 mb-1">Group No.</label>
                <input
                  id={groupInputId}
                  type="number"
                  value={groupNo}
                  onChange={e => setGroupNo(parseInt(e.target.value) || 1)}
                  className="w-full bg-white rounded-2xl px-3 py-2 border border-slate-200/80 shadow-xs text-xs font-mono font-medium focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                />
              </div>
              <div>
                <label htmlFor={cohortInputId} className="block font-bold text-slate-700 mb-1">Cohort Class</label>
                <input
                  id={cohortInputId}
                  type="text"
                  value={cohort}
                  onChange={e => setCohort(e.target.value)}
                  className="w-full bg-white rounded-2xl px-3 py-2 border border-slate-200/80 shadow-xs text-xs font-medium focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                />
              </div>
              <div>
                <label htmlFor={guideSelectId} className="block font-bold text-slate-700 mb-1">Faculty Guide</label>
                <select
                  id={guideSelectId}
                  value={guideName}
                  onChange={e => setGuideName(e.target.value)}
                  className="w-full bg-white rounded-2xl px-3 py-2 border border-slate-200/80 shadow-xs text-xs font-medium focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                >
                  {availableGuides.length > 0 ? (
                    availableGuides.map(g => (
                      <option key={g.id || g.name} value={g.name}>
                        {g.name} ({g.department || 'Faculty Guide'}{g.trackNo ? ` • Track ${g.trackNo}` : ''})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Mr. Nazareth Remedios">Mr. Nazareth Remedios</option>
                      <option value="Ms. Harleen Kaur Plaha">Ms. Harleen Kaur Plaha</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Proposal Abstract */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <label htmlFor={abstractTextareaId} className="font-bold text-slate-800">
                  Proposal Abstract <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Vectors computed against 500+ theses
                </span>
              </div>
              <textarea
                id={abstractTextareaId}
                required
                rows={4}
                value={abstract}
                onChange={e => setAbstract(e.target.value)}
                placeholder="Detailed project summary outlining technical methodology, algorithms, and expected deliverables..."
                className="w-full bg-white rounded-3xl p-4 text-xs text-slate-900 border border-slate-200/80 shadow-xs focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden font-medium leading-relaxed"
              />
            </div>

            {/* Problem Statement & Tech Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label htmlFor={problemStatementId} className="block font-bold text-slate-700 mb-1.5">
                  Problem Statement
                </label>
                <textarea
                  id={problemStatementId}
                  rows={2}
                  value={problemStatement}
                  onChange={e => setProblemStatement(e.target.value)}
                  placeholder="What academic or engineering pain point does this address?"
                  className="w-full bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs text-xs font-medium focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                />
              </div>

              <div>
                <label htmlFor={techStackInputId} className="block font-bold text-slate-700 mb-1.5">
                  Tech Stack (comma separated)
                </label>
                <input
                  id={techStackInputId}
                  type="text"
                  value={techStackInput}
                  onChange={e => setTechStackInput(e.target.value)}
                  className="w-full bg-white rounded-2xl px-3 py-2 border border-slate-200/80 shadow-xs text-xs font-medium focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                />
                
                <div className="mt-2.5">
                  <label htmlFor={githubInputId} className="block font-bold text-slate-700 mb-1">
                    GitHub Repository (Stage 2 Sync)
                  </label>
                  <input
                    id={githubInputId}
                    type="text"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full bg-white rounded-2xl px-3 py-2 border border-slate-200/80 shadow-xs text-xs font-mono font-medium focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Pitch Defense section (if conflict flagged or voluntary) */}
            {(similarityReport.isConflict || pitchDefense.length > 0) && (
              <div className="bg-white rounded-3xl p-5 border border-red-200 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-red-950 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-red-600" />
                      <span>200-Word Pitch Defense</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Defend why your team should be awarded this topic over overlapping proposals.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isAiAnalyzing}
                    onClick={handleGenerateAiDefense}
                    className="inline-flex items-center gap-1 bg-[#18191E] hover:bg-black text-[#D4F938] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAiAnalyzing ? 'Drafting...' : 'AI Assist Pitch'}</span>
                  </button>
                </div>

                <textarea
                  id={pitchDefenseId}
                  rows={3}
                  value={pitchDefense}
                  onChange={e => setPitchDefense(e.target.value)}
                  placeholder="Explain the unique architectural nuances, distinct algorithms, datasets, or DBIT department scope that differentiates your proposal..."
                  className="w-full bg-[#F4F5F8] rounded-2xl p-3 text-xs text-slate-900 border border-slate-200 focus:ring-2 focus:ring-[#D4F938] focus:outline-hidden font-medium"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>
                    Words: {pitchDefense.trim() ? pitchDefense.trim().split(/\s+/).length : 0} / 200
                  </span>
                  {aiSuggestions.length > 0 && (
                    <span className="text-emerald-600 font-bold font-sans">
                      Novelty points ready for Coordinator Review
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Team Members Selection from Students Database */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-900" />
                    <span>Team Members (DBIT Student Database)</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {teamMembers.length} / 4 students selected • Picked from registered accounts
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowStudentPicker(!showStudentPicker)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 bg-[#D4F938] hover:bg-[#cbf525] px-3.5 py-1.5 rounded-full shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showStudentPicker ? 'Hide Student List' : 'Choose From Student DB'}</span>
                </button>
              </div>

              {/* Selected Team Members Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {teamMembers.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#F4F5F8] px-3.5 py-2.5 rounded-2xl border border-slate-200/60 shadow-2xs">
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 truncate">{m.name}</span>
                        {m.isLeader && (
                          <span className="text-[9px] bg-[#18191E] text-[#D4F938] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Leader
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                        {m.rollNo && <span>Roll: {m.rollNo} • </span>}
                        <span>{m.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!m.isLeader && (
                        <button
                          type="button"
                          onClick={() => {
                            setTeamMembers(teamMembers.map((mem, i) => ({
                              ...mem,
                              isLeader: i === idx
                            })));
                          }}
                          className="text-[10px] text-slate-600 hover:text-slate-950 px-2 py-1 rounded-full bg-white border border-slate-200 font-bold transition-colors cursor-pointer"
                          title="Set as team leader"
                        >
                          Leader
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setTeamMembers(teamMembers.filter((_, i) => i !== idx));
                        }}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Database Student Picker Drawer */}
              {showStudentPicker && (
                <div className="p-4 bg-[#F4F5F8] rounded-2xl border border-slate-200 space-y-2.5 mt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Registered Students in Cloud SQL:</span>
                    <span className="text-slate-400 font-mono">{availableStudents.length} accounts found</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {availableStudents.map(stud => {
                      const isAlreadySelected = teamMembers.some(m => m.email.toLowerCase() === stud.email.toLowerCase());

                      return (
                        <button
                          key={stud.id}
                          type="button"
                          disabled={isAlreadySelected || teamMembers.length >= 4}
                          onClick={() => {
                            if (teamMembers.length >= 4) return;
                            setTeamMembers([
                              ...teamMembers,
                              {
                                name: stud.name,
                                rollNo: stud.rollNo || '',
                                email: stud.email,
                                isLeader: teamMembers.length === 0
                              }
                            ]);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all text-xs flex items-center justify-between cursor-pointer ${
                            isAlreadySelected
                              ? 'bg-white border-[#D4F938] text-slate-900 opacity-60 cursor-default shadow-xs'
                              : teamMembers.length >= 4
                                ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                                : 'bg-white border-slate-200 hover:border-[#D4F938] hover:shadow-xs'
                          }`}
                        >
                          <div className="truncate">
                            <div className="font-bold text-slate-900 text-xs truncate">{stud.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono truncate">
                              Roll {stud.rollNo || 'N/A'} • {stud.cohort || 'SE COMPS'}
                            </div>
                          </div>

                          {isAlreadySelected ? (
                            <Check className="w-4 h-4 text-slate-900 shrink-0 ml-1" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-slate-400 hover:text-slate-900 shrink-0 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Modal Action Footer */}
        <div className="bg-[#18191E] px-6 py-3.5 flex items-center justify-between border-t border-white/10 rounded-b-[30px]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || !abstract.trim()}
            className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#cbf525] disabled:opacity-50 text-slate-950 font-black text-xs px-6 py-3 rounded-full shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {similarityReport.isConflict 
                ? (pitchDefense.trim() ? 'Submit with Pitch Defense' : 'Flag Conflict & Proceed')
                : 'Submit for Guide Review'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
