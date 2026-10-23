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
      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                DBIT SE Mini Project-I Review 1 Presentation
              </h3>
              <p className="text-[11px] text-blue-200">
                Track No. 7 Group No. 5 • Department of Computer Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </a>
            <button
              onClick={onClose}
              className="text-zinc-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Close presentation viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded PDF iframe */}
        <div className="flex-1 w-full h-full bg-zinc-100">
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full"
          >
            <div className="p-12 text-center text-zinc-600 space-y-3">
              <FileText className="w-12 h-12 text-zinc-400 mx-auto" />
              <p className="text-sm font-medium">
                Unable to display PDF directly in your browser.
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
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
