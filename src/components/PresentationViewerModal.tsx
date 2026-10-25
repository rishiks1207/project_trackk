import React from 'react';
import { X, ExternalLink, Download, FileText, Presentation } from 'lucide-react';

interface PresentationViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationViewerModal: React.FC<PresentationViewerModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const pdfUrl = '/assets/aistudio/SE_Mini_Project_Review_1_Presentation_Updated.pptx_7d36a469.pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200/80 w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="bg-[#18191E] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 text-[#D4F938] flex items-center justify-center">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-white">
                  DBIT SE Mini Project-I Review 1 Presentation
                </h3>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#D4F938] text-black font-extrabold uppercase">
                  Verified Deck
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                Track No. 7 Group No. 5 • Department of Computer Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-[#D4F938] font-bold px-4 py-2 rounded-full transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </a>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              aria-label="Close presentation viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded PDF iframe */}
        <div className="flex-1 w-full h-full bg-[#F4F5F8]">
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full"
          >
            <div className="p-12 text-center text-slate-600 space-y-3">
              <FileText className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-[#18191E]">
                Unable to display PDF directly in your browser.
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#D4F938] hover:bg-[#c2e72f] text-black text-xs font-black px-6 py-2.5 rounded-full shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Open Presentation PDF</span>
              </a>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
};
