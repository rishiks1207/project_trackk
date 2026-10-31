import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Users, 
  Target, 
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  Layers
} from 'lucide-react';
import { SURVEY_DATA, GANTT_SCHEDULE, LITERATURE_REVIEW_PAPERS } from '../data/mockData';

export const AnalyticsAndGantt: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'survey' | 'gantt' | 'literature' | 'benchmark'>('survey');

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase tracking-wider">
                Research Foundation &amp; DBIT Survey
              </span>
              <span className="text-xs text-zinc-500">
                Department of Computer Engineering • n = 79 Cohort Study
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mt-1">
              Survey Analytics, 14-Week Gantt &amp; Literature Benchmark
            </h2>
            <p className="text-xs text-zinc-500">
              Empirical grounding for real-time similarity filtering and expert-in-the-loop stage gates (Slides 7, 9, 11, 15)
            </p>
          </div>

          {/* Sub-tab pills */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-medium">
            <button
              onClick={() => setActiveSubTab('survey')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'survey' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Survey Data (n=79)
            </button>
            <button
              onClick={() => setActiveSubTab('gantt')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'gantt' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              14-Week Gantt
            </button>
            <button
              onClick={() => setActiveSubTab('literature')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'literature' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Literature Matrix
            </button>
            <button
              onClick={() => setActiveSubTab('benchmark')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'benchmark' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              App Benchmark
            </button>
          </div>
        </div>
      </div>

      {/* 1. SURVEY TAB */}
      {activeSubTab === 'survey' && (
        <div className="space-y-6">
          {/* Key Metric Highlights from Slide 11 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-red-900 uppercase tracking-wider block">
                Primary Bottleneck #1
              </span>
              <div className="text-3xl font-extrabold text-red-600 font-mono mt-1">
                79.2%
              </div>
              <p className="text-xs font-semibold text-red-900 mt-1">
                Encountered Topic Overlap (61 / 77)
              </p>
              <p className="text-[11px] text-red-700 mt-1 leading-relaxed">
                Teams faced repeated or overlapping topics during submission rush due to manual spreadsheet verification.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Primary Bottleneck #2
              </span>
              <div className="text-3xl font-extrabold text-amber-600 font-mono mt-1">
                44.2%
              </div>
              <p className="text-xs font-semibold text-amber-900 mt-1">
                Wait Time &ge; 3 Days (34 / 77)
              </p>
              <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                Students waited 3 or more days for guide feedback over informal WhatsApp/verbal chats without audit tracking.
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
                Primary Bottleneck #3
              </span>
              <div className="text-3xl font-extrabold text-rose-600 font-mono mt-1">
                81.8%
              </div>
              <p className="text-xs font-semibold text-rose-900 mt-1">
                Confusion on Next Stage Gates (63 / 77)
              </p>
              <p className="text-[11px] text-rose-700 mt-1 leading-relaxed">
                Students lacked clarity on upcoming deliverables, deadlines, and milestone sign-off criteria.
              </p>
            </div>
          </div>

          {/* Survey Results Bar Graph */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  DBIT Computer Engineering Survey Results (n = 79)
                </h3>
                <p className="text-xs text-zinc-500">
                  Google Forms survey of 77 SE/TE students and 2 project guides across cohorts
                </p>
              </div>
              <span className="text-xs font-mono bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-lg">
                Slide 11 Data
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {SURVEY_DATA.metrics.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800">
                      {idx + 1}.0 {m.label}
                    </span>
                    <div className="font-mono flex items-center gap-2">
                      <span className="text-zinc-500 text-[11px]">{m.fraction}</span>
                      <strong className="text-zinc-900">{m.value}%</strong>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{ 
                        width: `${m.value}%`,
                        backgroundColor: m.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. GANTT SCHEDULE TAB */}
      {activeSubTab === 'gantt' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Project Implementation Schedule: 14-Week Milestone Gantt Chart
              </h3>
              <p className="text-xs text-zinc-500">
                Academic Year 2026–27 | SE Mini Project-I | Track 7 Group 05
              </p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">
              Slide 15 Schedule
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-zinc-200 rounded-xl overflow-hidden">
              <thead className="bg-zinc-100 text-zinc-700 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 border-b border-zinc-200">Milestone / Task (SE CEP)</th>
                  <th className="p-3 border-b border-zinc-200">Timeline</th>
                  <th className="p-3 border-b border-zinc-200">W1-W3</th>
                  <th className="p-3 border-b border-zinc-200">W4-W6</th>
                  <th className="p-3 border-b border-zinc-200">W7-W8*</th>
                  <th className="p-3 border-b border-zinc-200">W9-W11</th>
                  <th className="p-3 border-b border-zinc-200">W12-W14</th>
                  <th className="p-3 border-b border-zinc-200">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {GANTT_SCHEDULE.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/80">
                    <td className="p-3 font-medium text-zinc-900">
                      <span className="font-mono font-bold text-blue-600 mr-2">{item.exp}</span>
                      <span>{item.title}</span>
                    </td>
                    <td className="p-3 font-mono text-zinc-600 text-[11px] whitespace-nowrap">
                      {item.weeks}
                    </td>

                    {/* Gantt Bar indicators */}
                    <td className="p-2">
                      {item.startWeek <= 3 && item.endWeek >= 1 && (
                        <div className="bg-blue-600 text-white text-[10px] py-1 px-1.5 rounded font-mono text-center font-bold">
                          {item.weeks}
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      {item.startWeek <= 6 && item.endWeek >= 4 && (
                        <div className="bg-indigo-600 text-white text-[10px] py-1 px-1.5 rounded font-mono text-center font-bold">
                          {item.weeks}
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      {item.startWeek <= 8 && item.endWeek >= 7 && (
                        <div className={`text-white text-[10px] py-1 px-1.5 rounded font-mono text-center font-bold ${
                          item.exp.includes('Milestone') ? 'bg-amber-600 ring-2 ring-amber-400' : 'bg-purple-600'
                        }`}>
                          {item.exp.includes('Milestone') ? 'Review 1 ◆' : item.weeks}
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      {item.startWeek <= 11 && item.endWeek >= 9 && (
                        <div className="bg-emerald-600 text-white text-[10px] py-1 px-1.5 rounded font-mono text-center font-bold">
                          {item.weeks}
                        </div>
                      )}
                    </td>
                    <td className="p-2">
                      {item.endWeek >= 12 && (
                        <div className="bg-zinc-700 text-white text-[10px] py-1 px-1.5 rounded font-mono text-center font-bold">
                          {item.weeks}
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        item.status.includes('Completed') 
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status.includes('Progress') || item.status.includes('Active')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. LITERATURE MATRIX TAB */}
      {activeSubTab === 'literature' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Literature Review Matrix &amp; Comparative Methodology
              </h3>
              <p className="text-xs text-zinc-500">
                Academic foundations cited in DBIT ProjectTrack (Slide 7)
              </p>
            </div>
            <span className="text-xs font-mono bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-200">
              Slide 7 Papers
            </span>
          </div>

          <div className="space-y-4">
            {LITERATURE_REVIEW_PAPERS.map((paper) => (
              <div key={paper.srNo} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 hover:bg-zinc-50 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-blue-600 font-bold">
                    Paper #{paper.srNo} • {paper.year}
                  </span>
                  <span className="text-zinc-500">{paper.authors}</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 mt-1">
                  {paper.title}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-zinc-200">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Methodology</span>
                    <span className="text-zinc-800 font-medium">{paper.methodology}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">Key Findings</span>
                    <span className="font-medium">{paper.keyFindings}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900">
                    <span className="text-[10px] text-red-700 uppercase font-bold block">Limitations</span>
                    <span className="font-medium">{paper.limitations}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. APP BENCHMARK COMPARISON TAB */}
      {activeSubTab === 'benchmark' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Competitive Website &amp; App Comparison Matrix
              </h3>
              <p className="text-xs text-zinc-500">
                Evaluation against existing software tools (Slide 9)
              </p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
              Slide 9 Matrix
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-zinc-200 rounded-xl overflow-hidden">
              <thead className="bg-zinc-100 text-zinc-700 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="p-3 border-b">Tool / App</th>
                  <th className="p-3 border-b">Existing Features</th>
                  <th className="p-3 border-b text-red-600">Missing Features</th>
                  <th className="p-3 border-b text-blue-700">Reference to DBIT ProjectTrack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-zinc-900">Google Classroom / Teams</td>
                  <td className="p-3 text-zinc-600">File submissions, gradebooks, assignment deadlines.</td>
                  <td className="p-3 text-red-700 font-medium">Automated duplicate alerts, semantic title checks, pitch conflict matrix.</td>
                  <td className="p-3 text-zinc-700">Proves general tools cannot prevent topic hoarding or manage duplicate topics.</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-zinc-900">Trello / Jira</td>
                  <td className="p-3 text-zinc-600">Visual Kanban boards, stage-gate tracking, activity logs.</td>
                  <td className="p-3 text-red-700 font-medium">Academic proposal forms, NLP similarity checks, guide approval workflows.</td>
                  <td className="p-3 text-zinc-700">Direct inspiration for our visual progress dashboard and stage gates.</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-zinc-900">Turnitin / iThenticate</td>
                  <td className="p-3 text-zinc-600">Plagiarism detection, similarity scoring, full document text matching.</td>
                  <td className="p-3 text-red-700 font-medium">Instant title checking, pitch defense judging, lightweight speed.</td>
                  <td className="p-3 text-zinc-700">Demonstrates similarity matching utility, but shows need for real-time pre-checks.</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-zinc-900">Shared Google Sheets</td>
                  <td className="p-3 text-zinc-600">Low-cost collaborative spreadsheet logging.</td>
                  <td className="p-3 text-red-700 font-medium">Automated duplicate alerts, overwrite protection, structured feedback logs.</td>
                  <td className="p-3 text-zinc-700">Represents the flawed baseline causing coordinator burnout and lost records.</td>
                </tr>
                <tr className="hover:bg-zinc-50">
                  <td className="p-3 font-bold text-zinc-900">GitHub / GitLab Projects</td>
                  <td className="p-3 text-zinc-600">Repository archiving, milestone tracking, PR reviews.</td>
                  <td className="p-3 text-red-700 font-medium">Early proposal screening, semantic topic checks, non-code pitch evaluation.</td>
                  <td className="p-3 text-blue-700 font-semibold">Validates multi-semester repository model while highlighting early-stage gaps; linked directly into our Stage 2.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
