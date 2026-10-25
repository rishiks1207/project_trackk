import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  ExternalLink, 
  Sparkles, 
  Tag, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  FolderGit2,
  PlusCircle,
  X
} from 'lucide-react';
import { HistoricalProject } from '../types';
import { calculateHybridSimilarity } from '../utils/nlpSimilarity';

interface HistoricalRepositoryProps {
  projects: HistoricalProject[];
  onSelectForComparison?: (project: HistoricalProject) => void;
  onAddArchiveProject?: (project: HistoricalProject) => void;
}

export const HistoricalRepository: React.FC<HistoricalRepositoryProps> = ({
  projects,
  onSelectForComparison,
  onAddArchiveProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  
  // Add to Archive Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [newDomain, setNewDomain] = useState('AI/ML');
  const [newYear, setNewYear] = useState('2025-26');
  const [newCohort, setNewCohort] = useState('TE COMPS A');
  const [newMembers, setNewMembers] = useState('');
  const [newGuide, setNewGuide] = useState('Mr. Nazareth Remedios');
  const [newTech, setNewTech] = useState('');
  const [newGithub, setNewGithub] = useState('');
  const [newRating, setNewRating] = useState('A+');

  // Quick test idea state
  const [testIdeaInput, setTestIdeaInput] = useState('');
  const [quickTestResult, setQuickTestResult] = useState<{
    projectId: string;
    score: number;
    sbertScore: number;
    tfidfScore: number;
  } | null>(null);

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.guideName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = selectedDomain === 'All' || p.domain === selectedDomain;
    const matchesYear = selectedYear === 'All' || p.academicYear === selectedYear;

    return matchesSearch && matchesDomain && matchesYear;
  });

  const domains = ['All', 'AI/ML', 'Web3 & Blockchain', 'IoT & Embedded', 'HealthTech', 'EdTech', 'CyberSecurity'];
  const years = ['All', '2024-25', '2025-26', '2026-27'];

  const handleTestAgainstArchive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testIdeaInput.trim()) return;

    let highestSim = 0;
    let highestProjId = '';
    let topScores = { sbertScore: 0, tfidfScore: 0 };

    for (const p of projects) {
      const scores = calculateHybridSimilarity(testIdeaInput, `${p.title}. ${p.abstract}`);
      if (scores.overallScore > highestSim) {
        highestSim = scores.overallScore;
        highestProjId = p.id;
        topScores = scores;
      }
    }

    setQuickTestResult({
      projectId: highestProjId,
      score: highestSim,
      sbertScore: topScores.sbertScore,
      tfidfScore: topScores.tfidfScore
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#18191E] text-white rounded-[28px] p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4F938]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-[#D4F938] text-black font-extrabold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                UC-01: Search Archive
              </span>
              <span className="text-xs text-white/60">
                Department thesis &amp; project knowledge repository
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
              Searchable Historical Project Repository
            </h2>
            <p className="text-xs text-white/70 max-w-xl mt-1">
              Curated repository of past approved and completed projects across DBIT Computer Engineering cohorts.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-xs font-mono bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15">
              <span className="text-white/60 block text-[10px] uppercase font-bold tracking-wider">Archived Records</span>
              <span className="font-extrabold text-[#D4F938] text-base tabular-nums">{projects.length} Verified Projects</span>
            </div>
            {onAddArchiveProject && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#c2e72f] text-black font-extrabold text-xs px-5 py-2.5 rounded-full transition-colors shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add to Archive Database</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Pre-Submission Originality Sandbox */}
        <form onSubmit={handleTestAgainstArchive} className="relative z-10 mt-6 pt-5 border-t border-white/10 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4F938]" />
              <span>Pre-Submission Originality Sandbox</span>
            </span>
            <span className="text-[11px] text-white/60">
              Type any project idea to check instant SBERT similarity before drafting
            </span>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <input
              type="text"
              value={testIdeaInput}
              onChange={e => setTestIdeaInput(e.target.value)}
              placeholder="e.g. Traffic light optimization using OpenCV cameras or Decentralized land deed registration..."
              className="flex-1 px-4 py-2.5 text-xs bg-white text-black placeholder-slate-400 rounded-full focus:outline-hidden focus:ring-2 focus:ring-[#D4F938]"
            />
            <button
              type="submit"
              className="bg-[#D4F938] hover:bg-[#c2e72f] text-black font-extrabold text-xs px-6 py-2.5 rounded-full transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Check Originality
            </button>
          </div>

          {quickTestResult && (
            <div className={`mt-3.5 p-3.5 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-3 ${
              quickTestResult.score >= 0.75 
                ? 'bg-red-500/20 border-red-500/40 text-red-200' 
                : 'bg-[#D4F938]/20 border-[#D4F938]/40 text-[#D4F938]'
            }`}>
              <div>
                <span className="font-extrabold">
                  {quickTestResult.score >= 0.75 
                    ? `⚠️ High Similarity Conflict (${(quickTestResult.score * 100).toFixed(1)}%)`
                    : `✓ High Originality (${((1 - quickTestResult.score) * 100).toFixed(1)}% unique)`}
                </span>
                <span className="ml-2 text-white/80 text-[11px]">
                  Closest archive match: &ldquo;{projects.find(p => p.id === quickTestResult.projectId)?.title}&rdquo;
                </span>
              </div>
              <div className="font-mono text-[11px] flex gap-3 text-white">
                <span>SBERT: {(quickTestResult.sbertScore * 100).toFixed(1)}%</span>
                <span>TF-IDF: {(quickTestResult.tfidfScore * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[24px] p-4 sm:p-5 shadow-xs space-y-3.5 border border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by topic title, abstract keywords, tech stack (Solidity, YOLO, ESP32)..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#F4F5F8] rounded-full text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D4F938] text-xs"
            />
          </div>

          {/* Academic Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold text-xs">Year:</span>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-[#F4F5F8] rounded-full font-bold text-slate-800 border border-slate-200 focus:outline-hidden"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 text-xs">
          <span className="text-slate-400 font-bold mr-1 flex items-center gap-1 shrink-0 text-xs uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Domain:</span>
          </span>
          {domains.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedDomain === d
                  ? 'bg-[#18191E] text-[#D4F938] shadow-xs'
                  : 'bg-[#F4F5F8] text-slate-700 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-xs font-black text-black bg-[#D4F938] px-3 py-1 rounded-full">
                  {p.code}
                </span>
                <span className="bg-[#C6B5FD] text-black text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                  <span>{p.status} ({p.academicYear})</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#18191E] hover:text-black transition-colors">
                  {p.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Class: <strong className="text-black">{p.classCohort}</strong> • Guide: <strong className="text-black">{p.guideName}</strong>
                </p>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {p.abstract}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold bg-[#F4F5F8] text-slate-800 px-2.5 py-1 rounded-full border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-500">
                Grade: <strong className="text-black font-mono font-bold">{p.finalRating}</strong>
              </div>

              <div className="flex items-center gap-3">
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-700 hover:text-black font-bold"
                  >
                    <FolderGit2 className="w-4 h-4 text-black" />
                    <span>Repo</span>
                  </a>
                )}
                {onSelectForComparison && (
                  <button
                    type="button"
                    onClick={() => onSelectForComparison(p)}
                    className="text-xs bg-[#18191E] text-[#D4F938] hover:bg-black font-extrabold px-3 py-1 rounded-full transition-colors cursor-pointer"
                  >
                    Compare
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project to Archive Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#18191E] text-white w-full max-w-xl rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#D4F938] text-black font-extrabold uppercase">
                  Cloud Firestore Database
                </span>
                <h3 className="text-lg font-black text-white mt-1">Archive Completed Project</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTitle.trim() || !newAbstract.trim()) return;
                const newProject: HistoricalProject = {
                  id: `dbit-hist-${Date.now()}`,
                  code: newCode.trim() || `DBIT-TE-2026-T1-G${Math.floor(Math.random() * 20) + 1}`,
                  title: newTitle.trim(),
                  abstract: newAbstract.trim(),
                  domain: newDomain,
                  academicYear: newYear,
                  classCohort: newCohort,
                  groupMembers: newMembers ? newMembers.split(',').map(m => m.trim()) : ['Project Team'],
                  guideName: newGuide.trim(),
                  techStack: newTech ? newTech.split(',').map(t => t.trim()) : ['React', 'Python'],
                  githubUrl: newGithub.trim() || 'https://github.com/dbit-comps/project',
                  finalRating: newRating,
                  status: 'Archived'
                };
                if (onAddArchiveProject) {
                  onAddArchiveProject(newProject);
                }
                setShowAddModal(false);
                setNewTitle('');
                setNewCode('');
                setNewAbstract('');
                setNewMembers('');
                setNewTech('');
                setNewGithub('');
              }}
              className="mt-4 space-y-3.5 overflow-y-auto pr-1 flex-1 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. AI Autonomous Drone Navigation for Crop Disease Inspection"
                  className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-hidden focus:border-[#D4F938]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Project Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    placeholder="DBIT-BE-2025-T3-G09"
                    className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-hidden focus:border-[#D4F938]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Domain</label>
                  <select
                    value={newDomain}
                    onChange={e => setNewDomain(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-white/15 rounded-xl text-white focus:outline-hidden focus:border-[#D4F938]"
                  >
                    {domains.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Academic Year</label>
                  <select
                    value={newYear}
                    onChange={e => setNewYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-white focus:outline-hidden focus:border-[#D4F938]"
                  >
                    {years.filter(y => y !== 'All').map(y => (
                      <option key={y} value={y} className="bg-slate-900 text-white">{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Cohort</label>
                  <input
                    type="text"
                    value={newCohort}
                    onChange={e => setNewCohort(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-white focus:outline-hidden focus:border-[#D4F938]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Rating</label>
                  <select
                    value={newRating}
                    onChange={e => setNewRating(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-white focus:outline-hidden focus:border-[#D4F938]"
                  >
                    <option value="A+" className="bg-slate-900">A+</option>
                    <option value="A" className="bg-slate-900">A</option>
                    <option value="B+" className="bg-slate-900">B+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Abstract &amp; Problem Statement</label>
                <textarea
                  required
                  rows={3}
                  value={newAbstract}
                  onChange={e => setNewAbstract(e.target.value)}
                  placeholder="Detailed synopsis of technical implementation, novelty, and outcomes..."
                  className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-hidden focus:border-[#D4F938]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Group Members (comma separated)</label>
                <input
                  type="text"
                  value={newMembers}
                  onChange={e => setNewMembers(e.target.value)}
                  placeholder="Siddharth Mehta, Tanya Rao, Aditya Vernekar"
                  className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-hidden focus:border-[#D4F938]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Faculty Guide</label>
                  <input
                    type="text"
                    value={newGuide}
                    onChange={e => setNewGuide(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-white focus:outline-hidden focus:border-[#D4F938]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={newTech}
                    onChange={e => setNewTech(e.target.value)}
                    placeholder="Python, TensorFlow, ROS"
                    className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-hidden focus:border-[#D4F938]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">GitHub Repository URL</label>
                <input
                  type="url"
                  value={newGithub}
                  onChange={e => setNewGithub(e.target.value)}
                  placeholder="https://github.com/dbit-comps/smart-drone-2025"
                  className="w-full px-3.5 py-2 bg-white/10 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-hidden focus:border-[#D4F938]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#D4F938] hover:bg-[#c2e72f] text-black font-extrabold px-6 py-2 rounded-full transition-colors cursor-pointer"
                >
                  Save to Archive Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
