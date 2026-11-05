import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Download, 
  FileText, 
  Presentation, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface PresentationViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationViewerModal: React.FC<PresentationViewerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeDeck, setActiveDeck] = useState<'final' | 'review1'>('final');
  const [activeView, setActiveView] = useState<'pdf' | 'slides'>('pdf');
  const [copiedSlide, setCopiedSlide] = useState<number | null>(null);

  if (!isOpen) return null;

  const finalPdfUrl = '/assets/aistudio/Final_Review_Presentation_Filled.pdf';
  const review1PdfUrl = '/assets/aistudio/SE_Mini_Project_Review_1_Presentation_Final.pptx_e1860b59.pdf';
  const currentUrl = activeDeck === 'final' ? finalPdfUrl : review1PdfUrl;

  const slidesData = [
    {
      num: 1,
      title: 'Slide 1: Title Slide (Cover)',
      details: [
        'Subject: 25CE3CEP01: MINI PROJECT I COMMUNITY ENGAGEMENT PROJECT (CEP)',
        'Track & Group: Track No. 7  •  Group No. 5',
        'Main Title: Centralized Project Proposal & Progress Tracking Portal (DBIT ProjectTrack)',
        'Academic Cohort: SE Mini Project-I (Semester III) | Academic Year 2026–27 | Class: SE COMPS C (Batch A)',
        'Team: Apoorvadeep Sinha (Leader, Roll No. 01), Ron Barretto (Roll No. 05), Rishik Ezhuthachan (Roll No. 15), Aryan Gaikwad (Roll No. 17)',
        'Internal Project Guides: Ms. Harleen Kaur Plaha  \\  Mr. Nazareth Remedios',
        'Project Coordinator: Prof. Meenal Kulkarni'
      ]
    },
    {
      num: 2,
      title: 'Slide 2: Introduction',
      details: [
        'DBIT ProjectTrack automates topic screening, faculty review, and milestone tracking for undergraduate project courses (CEP, SE/TE Mini Projects, Capstone).',
        'Academic Lifecycle: Continuous 14-week rigor mapped against Mumbai University syllabus (Exp 1 to Exp 7).',
        'Current Bottlenecks: 40+ groups submit via uncoordinated Google Sheets and WhatsApp. Manual cross-checks of 500+ theses cause review fatigue.',
        'Proposed Intervention: Automated SBERT + TF-IDF pre-screening, merit-based conflict queue, and auditable stage-gate milestone logs.'
      ]
    },
    {
      num: 3,
      title: 'Slide 3: Problem Statement',
      details: [
        'Formal Statement: "To develop a web-based centralized portal for students and project guides that provides automated detection of duplicate or overlapping project topics, a searchable archive of approved topics, and real-time approval, feedback and stage tracking with deadline reminders, thereby reducing overlapping projects and the delays and confusion caused by slow, scattered and untracked feedback."',
        'Key Outcomes: Zero Topic Overlap via NLP similarity filtering, Instant Transparency via live stage-gate Gantt, and Auditable Feedback with centralized reviewer logs.'
      ]
    },
    {
      num: 4,
      title: 'Slide 4: Literature Review (Table of 5 Papers)',
      details: [
        '1. S. Sharma, A. Kumar, P. Deshmukh (2021) - RBAC PHP/MySQL allocation portal cut follow-ups by 40%. Gap: Lacks automated duplicate detection.',
        '2. R. Patel, V. Shah, M. Mehta (2023) - Tokenization & TF-IDF with 88% accuracy. Gap: High false negatives on rephrased titles.',
        '3. J. Dev, S. Nair, L. Verma (2024) - Sentence-BERT embeddings with 94.2% accuracy. Gap: High computational overhead, no faculty approval integration.',
        '4. M. R. Gupta, P. K. Singh (2022) - Expert-in-the-Loop conflict queue. Gap: Lacks pre-submission student screening.',
        '5. A. Joshi, R. Kulkarni (2020) - Tagged digital archive cut duplicates by 60%. Gap: Static repository disconnected from live submission.'
      ]
    },
    {
      num: 5,
      title: 'Slide 5: Main Research Gaps',
      details: [
        'Gap 1: Keyword matching fails on paraphrased proposals -> SBERT dense vector embeddings detect semantic similarity regardless of wording.',
        'Gap 2: Arbitrary automated rejections cause student friction -> Expert-in-the-Loop conflict queue with 200-word pitch defense evaluation.',
        'Gap 3: Isolated static archives without workflow integration -> Live repository search embedded directly into the submission form.'
      ]
    },
    {
      num: 6,
      title: 'Slide 6: Final Feature List (Table)',
      details: [
        '1. Real-Time NLP Duplicate & Similarity Detection (SBERT + TF-IDF cosine >= 0.75).',
        '2. Faculty Pitch Defense & Conflict Resolution Queue (side-by-side merit arbitration).',
        '3. Searchable Historical Project Repository (500+ past DBIT theses with domain filters).',
        '4. Visual 14-Week Stage-Gate Progress Tracker (Exp 1 to Exp 7 milestone schedule).',
        '5. Centralized Written Feedback Log & Automated Alerts (eliminates 44.2% >=3-day feedback delays).'
      ]
    },
    {
      num: 7,
      title: 'Slide 7: Survey Analysis',
      details: [
        'Empirical Survey of n = 79 respondents (77 SE/TE students, 2 project guides in DBIT Computer Engineering).',
        'Key Findings: 79.2% faced topic overlap; 81.8% confused on stage gates; 44.2% waited >= 3 days for feedback.',
        'Top Student Feature Demands: Duplicate Check (57.1%), Topic Search (55.8%), Alerts & Reminders (49.4%).',
        'Coordinator Persona: Prof. Meenal Kulkarni needs fast, objective, audit-proof topic approvals.'
      ]
    },
    {
      num: 8,
      title: 'Slide 8: Methodology',
      details: [
        '3-Tier Architecture: React 19 Client SPA <-> FastAPI / Node.js SBERT & TF-IDF Engine <-> PostgreSQL / Firestore DB.',
        'UML Models: Use Case Diagram (11 primary use cases), 2.5 State Machine Lifecycle (Draft -> EvaluatingSimilarity -> GuideReview/Conflict -> Approved -> StageGateTracking -> Completed).',
        '14-Week Stage Gates: Exp 1 (Empathy) -> Exp 2 (Lit Review) -> Exp 3 (Survey) -> Exp 4 (Architecture) -> Review 1 -> Exp 5 (NLP Engine) -> Exp 6 (UI) -> Exp 7 (Defense).'
      ]
    },
    {
      num: 9,
      title: 'Slide 9: Future Scope',
      details: [
        '1. Full-Document Thesis Plagiarism Scanning (Turnitin-style PDF/DOCX chunk parsing).',
        '2. Automated Code Repository Static Analysis (CI/CD GitHub Actions commit cadence & unit test checks).',
        '3. Multi-Department & University Deployment (cross-departmental scaling across autonomous Mumbai colleges).',
        '4. AI-Generated Defense Questions & Viva Rubric Copilot.'
      ]
    },
    {
      num: 10,
      title: 'Slide 10: References',
      details: [
        '1. S. Sharma, A. Kumar, P. Deshmukh (2021) - IJCA, vol. 183(2), pp. 14–19.',
        '2. R. Patel, V. Shah, M. Mehta (2023) - IEEE Access, vol. 11, pp. 45120–45129.',
        '3. J. Dev, S. Nair, L. Verma (2024) - ACM TOCE, vol. 24(1), pp. 45–58.',
        '4. M. R. Gupta, P. K. Singh (2022) - JETS, vol. 51(3), pp. 312–328.',
        '5. A. Joshi, R. Kulkarni (2020) - Springer CCIS, vol. 1324, pp. 88–99.',
        '6. OMG UML 2.5.1 Formal Specification (2024).'
      ]
    },
    {
      num: 11,
      title: 'Slide 11: Thank You & QnA',
      details: [
        'Inviting Questions & Feedback from the Final Review Evaluation Committee.',
        'Project Team: Apoorvadeep Sinha (Leader) • Ron Barretto • Rishik Ezhuthachan • Aryan Gaikwad',
        'Internal Project Guides: Ms. Harleen Kaur Plaha / Mr. Nazareth Remedios | Coordinator: Prof. Meenal Kulkarni',
        'Department of Computer Engineering • Don Bosco Institute of Technology, Mumbai'
      ]
    }
  ];

  const handleCopySlide = (num: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlide(num);
    setTimeout(() => setCopiedSlide(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200/80 w-full max-w-6xl h-[92vh] overflow-hidden flex flex-col">
        
        {/* Top Control Header */}
        <div className="bg-[#18191E] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#D4F938] flex items-center justify-center shadow-inner">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">
                  DBIT SE Mini Project-I Evaluation Deck
                </h3>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#D4F938] text-black font-extrabold uppercase">
                  {activeDeck === 'final' ? 'Filled Template' : 'Review 1'}
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                Track No. 7 Group No. 5 • Department of Computer Engineering
              </p>
            </div>
          </div>

          {/* Deck Switcher & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-white/10 p-1 rounded-full border border-white/10 text-xs">
              <button
                onClick={() => setActiveDeck('final')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeDeck === 'final'
                    ? 'bg-[#D4F938] text-black shadow-xs'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Final Review (Filled)
              </button>
              <button
                onClick={() => setActiveDeck('review1')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeDeck === 'review1'
                    ? 'bg-[#D4F938] text-black shadow-xs'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Review 1 Deck
              </button>
            </div>

            <div className="flex items-center bg-white/10 p-1 rounded-full border border-white/10 text-xs">
              <button
                onClick={() => setActiveView('pdf')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeView === 'pdf'
                    ? 'bg-white text-black'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                PDF View
              </button>
              <button
                onClick={() => setActiveView('slides')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeView === 'slides'
                    ? 'bg-white text-black'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                11 Slides Text
              </button>
            </div>

            <a
              href={finalPdfUrl}
              download="DBIT_Final_Review_Presentation_Track7_Group5.pdf"
              className="inline-flex items-center gap-1.5 text-xs bg-[#D4F938] hover:bg-[#c2e72f] text-black font-black px-4 py-2 rounded-full transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-[#D4F938] font-bold px-3 py-2 rounded-full transition-colors"
              title="Open in browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {activeView === 'pdf' ? (
          <div className="flex-1 w-full h-full bg-[#F4F5F8] overflow-hidden flex flex-col">
            <object
              data={currentUrl}
              type="application/pdf"
              className="w-full flex-1"
            >
              <div className="p-12 text-center text-slate-600 space-y-4 max-w-lg mx-auto">
                <FileText className="w-14 h-14 text-slate-400 mx-auto" />
                <h4 className="text-base font-black text-[#18191E]">
                  {activeDeck === 'final' ? 'Final Review Presentation Generated' : 'Review 1 Presentation Deck'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The PDF has been generated with all 11 filled template slides (Title, Introduction, Problem Statement, Literature Review table, Research Gaps, Final Features table, Survey Analytics, Methodology with UML diagrams, Future Scope, References, and QnA).
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <a
                    href={finalPdfUrl}
                    download="DBIT_Final_Review_Presentation_Track7_Group5.pdf"
                    className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#c2e72f] text-black text-xs font-black px-6 py-2.5 rounded-full shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Final Review PDF</span>
                  </a>
                  <button
                    onClick={() => setActiveView('slides')}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold px-5 py-2.5 rounded-full border border-slate-300"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Text of All 11 Slides</span>
                  </button>
                </div>
              </div>
            </object>
          </div>
        ) : (
          <div className="flex-1 w-full h-full bg-[#F8F9FA] p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h4 className="text-base font-black text-[#18191E]">
                  Complete 11-Slide Content Breakdown (Final Presentation Template)
                </h4>
                <p className="text-xs text-slate-500">
                  Exact content mapped into DBIT template with Literature Review table, Features table, Survey metrics, and UML methodology.
                </p>
              </div>
              <a
                href={finalPdfUrl}
                download="DBIT_Final_Review_Presentation_Track7_Group5.pdf"
                className="inline-flex items-center gap-1.5 text-xs bg-[#18191E] text-[#D4F938] font-bold px-4 py-2 rounded-full hover:bg-black transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Filled Template PDF</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slidesData.map((s) => (
                <div 
                  key={s.num} 
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2.5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-lg bg-[#18191E] text-[#D4F938] inline-flex items-center justify-center text-[11px] font-mono">
                        {s.num}
                      </span>
                      <span>{s.title}</span>
                    </span>
                    <button
                      onClick={() => handleCopySlide(s.num, s.details.join('\n'))}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-black px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
                      title="Copy slide content to clipboard"
                    >
                      {copiedSlide === s.num ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                    {s.details.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <span className="text-[#D4F938] bg-[#18191E] rounded-full w-1.5 h-1.5 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
