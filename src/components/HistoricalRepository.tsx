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
  FolderGit2
} from 'lucide-react';
import { HistoricalProject } from '../types';
import { calculateHybridSimilarity } from '../utils/nlpSimilarity';

interface HistoricalRepositoryProps {
  projects: HistoricalProject[];
  onSelectForComparison?: (project: HistoricalProject) => void;
}

export const HistoricalRepository: React.FC<HistoricalRepositoryProps> = ({
  projects,
  onSelectForComparison
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  
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
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase tracking-wider">
                UC-01: Search Archive
              </span>
              <span className="text-xs text-zinc-500">
                Joshi &amp; Kulkarni (2020): Archive access cuts redundant submissions by 60%
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mt-1">
              Searchable Historical Project Repository
            </h2>
            <p className="text-xs text-zinc-500">
              Department repository of past approved and completed projects across DBIT Computer Engineering cohorts
            </p>
          </div>

          <div className="text-xs font-mono bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-200">
            <span className="text-zinc-500 block text-[10px]">Archived Projects</span>
            <span className="font-bold text-zinc-900">{projects.length} Verified Records</span>
          </div>
        </div>

        {/* Quick Pre-Submission Originality Sandbox */}
        <form onSubmit={handleTestAgainstArchive} className="mt-5 pt-4 border-t border-zinc-100 bg-zinc-50/70 p-4 rounded-xl border border-zinc-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Pre-Submission Originality Sandbox</span>
            </span>
            <span className="text-[11px] text-zinc-500">
              Type any project idea to check instant SBERT similarity before drafting
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={testIdeaInput}
              onChange={e => setTestIdeaInput(e.target.value)}
              placeholder="e.g. Traffic light optimization using OpenCV cameras or Decentralized land deed registration..."
              className="flex-1 px-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors shrink-0"
            >
              Check Originality
            </button>
          </div>

          {quickTestResult && (
            <div className={`mt-3 p-3 rounded-lg border text-xs flex flex-wrap items-center justify-between gap-3 ${
              quickTestResult.score >= 0.75 
                ? 'bg-red-50 border-red-300 text-red-900' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div>
                <span className="font-bold">
                  {quickTestResult.score >= 0.75 
                    ? `⚠️ High Similarity Conflict (${(quickTestResult.score * 100).toFixed(1)}%)`
                    : `✓ High Originality (${((1 - quickTestResult.score) * 100).toFixed(1)}% unique)`}
                </span>
                <span className="ml-2 text-[11px]">
                  Closest match: &ldquo;{projects.find(p => p.id === quickTestResult.projectId)?.title}&rdquo;
                </span>
              </div>
              <div className="font-mono text-[11px] flex gap-3">
                <span>SBERT: {(quickTestResult.sbertScore * 100).toFixed(1)}%</span>
                <span>TF-IDF: {(quickTestResult.tfidfScore * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by topic title, abstract keywords, tech stack (Solidity, YOLO, ESP32)..."
              className="w-full pl-9 pr-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Academic Year Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-medium">Year:</span>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="px-2.5 py-2 border border-zinc-300 rounded-lg bg-white"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs">
          <span className="text-zinc-500 font-medium mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Domain:</span>
          </span>
          {domains.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedDomain === d
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
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
            className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {p.code}
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{p.status} ({p.academicYear})</span>
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-900 hover:text-blue-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Class: <strong>{p.classCohort}</strong> • Guide: <strong>{p.guideName}</strong>
                </p>
              </div>

              <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                {p.abstract}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1">
                {p.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded border border-zinc-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <div className="text-[11px] text-zinc-500">
                Grade: <strong className="text-zinc-800 font-mono">{p.finalRating}</strong>
              </div>

              <div className="flex items-center gap-2">
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-600 hover:text-blue-600 font-medium"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>Repo</span>
                  </a>
                )}
                {onSelectForComparison && (
                  <button
                    type="button"
                    onClick={() => onSelectForComparison(p)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Compare
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
