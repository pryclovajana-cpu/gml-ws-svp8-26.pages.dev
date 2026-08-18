import React from 'react';
import { FileText, ExternalLink, Download, Sparkles } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide15b_GeographyPdf: React.FC = () => {
  const pdfUrl = '/docs/2025-predmetovy-geografie-2st.pdf';

  return (
    <div className="w-full h-full min-h-[580px] sm:min-h-[640px] md:min-h-[700px] flex flex-col p-2 sm:p-3 md:p-4 select-none bg-white space-y-2">
      {/* Sleek Header Bar */}
      <div className="flex items-center justify-between gap-3 bg-white px-2 py-1 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2.5 py-1 bg-gml-green-100 text-gml-green-800 text-[10px] font-extrabold rounded-lg uppercase tracking-wider shrink-0 hidden sm:inline-block">
            <EditableText id="s15b_badge" defaultText="Ukázka kurikula" />
          </span>
          <h2 className="text-sm sm:text-base md:text-lg font-extrabold font-display text-gml-slate-900 truncate">
            <EditableText id="s15b_title" defaultText="Vzdělávací obor Geografie (2. stupeň ZŠ / Nižší gymnázium)" />
          </h2>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={pdfUrl}
            download="2025-predmetovy-geografie-2st.pdf"
            className="px-3 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gml-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Stáhnout PDF do počítače"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stáhnout</span>
          </a>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 sm:py-2 bg-gml-green-600 hover:bg-gml-green-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Otevřít v novém okně</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Full-Height Edge-to-Edge Embedded PDF Viewer */}
      <div className="w-full flex-1 min-h-[500px] sm:min-h-[560px] md:min-h-[620px] rounded-2xl border-2 border-gml-green-300 shadow-md bg-slate-100 overflow-hidden relative flex flex-col">
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
          title="RVP Geografie PDF"
          className="w-full h-full border-0 absolute inset-0 bg-white"
        />
      </div>
    </div>
  );
};
