import React, { useState, useId } from 'react';
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
  Scale
} from 'lucide-react';
import { ProjectProposal, HistoricalProject, StudentMember } from '../types';
import { scanProposalSimilarity } from '../utils/nlpSimilarity';
import { analyzeProposalWithAi } from '../utils/geminiAi';

interface ProposalSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposal: Partial<ProjectProposal>) => void;
  historicalProjects: HistoricalProject[];
}

export const ProposalSubmissionModal: React.FC<ProposalSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  historicalProjects
}) => {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<ProjectProposal['domain']>('AI/ML');
  const [trackNo, setTrackNo] = useState<number>(7);
  const [groupNo, setGroupNo] = useState<number>(5);
  const [cohort, setCohort] = useState('SE COMPS C (Batch A)');
  const [abstract, setAbstract] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [techStackInput, setTechStackInput] = useState('Sentence-BERT, TF-IDF, React, TypeScript');
  const [githubUrl, setGithubUrl] = useState('https://github.com/rishiks1207/dbit-project-track');
  const [guideName, setGuideName] = useState('Mr. Nazareth Remedios');
  
  // Team members
  const [teamMembers, setTeamMembers] = useState<StudentMember[]>([
    { name: 'Apoorvadeep Sinha', rollNo: '01', email: 'apoorvadeep.sinha@dbit.in', isLeader: true },
    { name: 'Ron Barretto', rollNo: '05', email: 'ron.barretto@dbit.in' },
    { name: 'Rishik Ezhuthachan', rollNo: '15', email: 'rishiks1207@gmail.com' },
    { name: 'Aryan Gaikwad', rollNo: '17', email: 'aryan.gaikwad@dbit.in' }
  ]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-4xl my-8 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-800 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                UC-02: Submit Proposal
              </span>
              <span className="bg-indigo-700 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded">
                UC-03: Run Semantic Similarity Screening
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Submit Engineering Project Proposal
            </h2>
            <p className="text-xs text-blue-200">
              Real-time SBERT contextual embedding + TF-IDF cosine duplicate screening
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close submission modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Test Presets Bar */}
        <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-zinc-600 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Load Quick Test Preset:</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadPreset('group5')}
              className="px-2.5 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium transition-colors"
            >
              Group 5 (DBIT ProjectTrack)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('duplicate')}
              className="px-2.5 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 font-medium transition-colors"
            >
              Simulate Duplicate (&ge; 0.75 Clash)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('novel')}
              className="px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium transition-colors"
            >
              Simulate 100% Novel
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Real-time NLP Gauge Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            similarityReport.isConflict 
              ? 'bg-red-50/80 border-red-300 text-red-900' 
              : similarityReport.overallScore >= 0.4 
                ? 'bg-amber-50/80 border-amber-300 text-amber-900'
                : 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-xs ${
                  similarityReport.isConflict ? 'bg-red-600' : similarityReport.overallScore >= 0.4 ? 'bg-amber-500' : 'bg-emerald-600'
                }`}>
                  {originalityPercent}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">
                      Originality Score: {originalityPercent}%
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-medium border bg-white/70">
                      Similarity: {simPercent}%
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-white font-mono">
                      Threshold: 75%
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 opacity-90">
                    {similarityReport.explanation}
                  </p>
                </div>
              </div>

              {/* SBERT vs TF-IDF Sub-scores */}
              <div className="flex items-center gap-3 bg-white/80 px-3 py-1.5 rounded-lg border border-black/5 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px]">SBERT (Semantic)</span>
                  <span className="font-bold text-zinc-900">{(similarityReport.sbertScore * 100).toFixed(1)}%</span>
                </div>
                <div className="h-6 w-px bg-zinc-300" />
                <div>
                  <span className="text-zinc-500 block text-[10px]">TF-IDF (Lexical)</span>
                  <span className="font-bold text-zinc-900">{(similarityReport.tfidfScore * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Matched project alert if conflict */}
            {similarityReport.isConflict && similarityReport.matchedProjectTitle && (
              <div className="mt-3 pt-3 border-t border-red-200/80 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Clashing Topic Flagged (UML: [Sim &ge; 0.75] &rarr; FlaggedConflict):</span>
                </div>
                <p className="mt-1 text-red-950 font-medium pl-5">
                  &ldquo;{similarityReport.matchedProjectTitle}&rdquo; ({similarityReport.matchedProjectYear})
                </p>
                <p className="mt-1 pl-5 text-red-700 text-[11px]">
                  Requires submission of a 200-Word Pitch Defense. The Project Coordinator and Guide will evaluate both proposals side-by-side in the Arbitration Queue.
                </p>
              </div>
            )}
          </div>

          {/* Basic Proposal Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2">
              <label htmlFor={titleInputId} className="block font-semibold text-zinc-800 mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                id={titleInputId}
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Centralized Project Proposal & Progress Tracking Portal"
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label htmlFor={domainSelectId} className="block font-semibold text-zinc-800 mb-1">
                Domain Track <span className="text-red-500">*</span>
              </label>
              <select
                id={domainSelectId}
                value={domain}
                onChange={e => setDomain(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
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
              <label htmlFor={trackInputId} className="block font-semibold text-zinc-700 mb-1">Track No.</label>
              <input
                id={trackInputId}
                type="number"
                value={trackNo}
                onChange={e => setTrackNo(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor={groupInputId} className="block font-semibold text-zinc-700 mb-1">Group No.</label>
              <input
                id={groupInputId}
                type="number"
                value={groupNo}
                onChange={e => setGroupNo(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor={cohortInputId} className="block font-semibold text-zinc-700 mb-1">Cohort Class</label>
              <input
                id={cohortInputId}
                type="text"
                value={cohort}
                onChange={e => setCohort(e.target.value)}
                className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor={guideSelectId} className="block font-semibold text-zinc-700 mb-1">Internal Faculty Guide</label>
              <select
                id={guideSelectId}
                value={guideName}
                onChange={e => setGuideName(e.target.value)}
                className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg bg-white"
              >
                <option value="Mr. Nazareth Remedios">Mr. Nazareth Remedios</option>
                <option value="Ms. Harleen Kaur Plaha">Ms. Harleen Kaur Plaha</option>
                <option value="Prof. Meenal Kulkarni">Prof. Meenal Kulkarni</option>
              </select>
            </div>
          </div>

          {/* Abstract */}
          <div>
            <div className="flex items-center justify-between mb-1 text-xs">
              <label htmlFor={abstractTextareaId} className="font-semibold text-zinc-800">
                Proposal Abstract <span className="text-red-500">*</span>
              </label>
              <span className="text-zinc-500">
                SBERT contextual vectors computed in real-time
              </span>
            </div>
            <textarea
              id={abstractTextareaId}
              required
              rows={4}
              value={abstract}
              onChange={e => setAbstract(e.target.value)}
              placeholder="Detailed project summary outlining technical methodology, algorithms, and expected deliverables..."
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Problem Statement & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor={problemStatementId} className="block font-semibold text-zinc-700 mb-1">
                Problem Statement
              </label>
              <textarea
                id={problemStatementId}
                rows={2}
                value={problemStatement}
                onChange={e => setProblemStatement(e.target.value)}
                placeholder="What academic or engineering pain point does this address?"
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor={techStackInputId} className="block font-semibold text-zinc-700 mb-1">
                Proposed Tech Stack (comma separated)
              </label>
              <input
                id={techStackInputId}
                type="text"
                value={techStackInput}
                onChange={e => setTechStackInput(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg"
              />
              <div className="mt-2">
                <label htmlFor={githubInputId} className="block font-semibold text-zinc-700 mb-0.5">
                  GitHub Repository (for Stage 2 Sync)
                </label>
                <input
                  id={githubInputId}
                  type="text"
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repo or owner/repo"
                  className="w-full px-3 py-1.5 border border-zinc-300 rounded-lg font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Mandatory Pitch Defense section if Similarity >= 0.75 */}
          {(similarityReport.isConflict || pitchDefense.length > 0) && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-red-600" />
                    <span>Expert-in-the-Loop: 200-Word Pitch Defense</span>
                  </h4>
                  <p className="text-[11px] text-red-700">
                    Defend why your team should be awarded this topic over overlapping proposals.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isAiAnalyzing}
                  onClick={handleGenerateAiDefense}
                  className="inline-flex items-center gap-1 bg-white hover:bg-red-50 text-red-700 border border-red-300 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-2xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>{isAiAnalyzing ? 'Drafting...' : 'AI Assist Pitch Phrasing'}</span>
                </button>
              </div>

              <textarea
                id={pitchDefenseId}
                rows={3}
                value={pitchDefense}
                onChange={e => setPitchDefense(e.target.value)}
                placeholder="Explain the unique architectural nuances, distinct algorithms, datasets, or DBIT department scope that differentiates your proposal..."
                className="w-full px-3 py-2 text-xs border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
              />

              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>
                  Words: {pitchDefense.trim() ? pitchDefense.trim().split(/\s+/).length : 0} / 200 target
                </span>
                {aiSuggestions.length > 0 && (
                  <span className="text-red-700 font-medium">
                    Novelty points generated based on DBIT rubric
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Team Members List */}
          <div className="border border-zinc-200 rounded-xl p-3 bg-zinc-50/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-800">
                Team Members (Class SE COMPS C)
              </span>
              <span className="text-[11px] text-zinc-500">
                4 Students Max (DBIT Project Guidelines)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {teamMembers.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-zinc-200">
                  <div className="truncate">
                    <span className="font-semibold text-zinc-900">{m.name}</span>
                    <span className="text-zinc-500 ml-1.5 text-[11px]">Roll {m.rollNo}</span>
                    {m.isLeader && (
                      <span className="ml-1.5 text-[10px] bg-blue-100 text-blue-700 px-1 rounded font-bold">
                        Leader
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="bg-zinc-100 border-t border-zinc-200 px-6 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || !abstract.trim()}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-xs transition-colors"
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
