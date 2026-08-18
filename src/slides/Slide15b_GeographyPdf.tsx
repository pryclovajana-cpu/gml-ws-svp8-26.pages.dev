import React from 'react';
import { FileText, ExternalLink, Download, ArrowRightLeft } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide15b_GeographyPdf: React.FC = () => {
  const rvpPdfUrl = '/docs/2025-predmetovy-geografie-2st.pdf';
  const svpPdfUrl = '/docs/SVP_4lete_geografie_p167_174.pdf';
  const svpFullPdfUrl = '/docs/SVP_4lete_od2026.pdf';

  return (
    <div className="w-full h-full min-h-[580px] sm:min-h-[640px] md:min-h-[700px] flex flex-col p-2 sm:p-3 md:p-4 select-none bg-white space-y-2">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 bg-white px-2 py-1 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2.5 py-1 bg-gml-green-100 text-gml-green-800 text-[10px] font-extrabold rounded-lg uppercase tracking-wider shrink-0 hidden sm:inline-block">
            <EditableText id="s15b_badge" defaultText="Porovnání kurikula" />
          </span>
          <h2 className="text-sm sm:text-base md:text-lg font-extrabold font-display text-gml-slate-900 truncate">
            <EditableText
              id="s15b_title"
              defaultText="Vzdělávací obor Geografie: Nový RVP ZV vs. ŠVP 4leté GML"
            />
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold hidden md:flex">
          <ArrowRightLeft className="w-4 h-4 text-gml-green-600" />
          <span>Provázání nižšího a vyššího stupně</span>
        </div>
      </div>

      {/* 2-Column Side-by-Side PDF Viewers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 w-full min-h-[500px] sm:min-h-[560px] md:min-h-[620px]">
        {/* Left Column: RVP ZV Geografie */}
        <div className="flex flex-col h-full rounded-2xl border-2 border-gml-green-300 shadow-md bg-white overflow-hidden">
          {/* Sub-header */}
          <div className="bg-gml-green-50/90 border-b border-gml-green-200 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="px-2 py-0.5 bg-gml-green-600 text-white rounded text-[10px] font-black uppercase shrink-0">
                RVP ZV
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-gml-slate-900 truncate">
                <EditableText id="s15b_left_h3" defaultText="Geografie – 2. stupeň ZŠ / Nižší 8G" />
              </h3>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href={rvpPdfUrl}
                download="2025-predmetovy-geografie-2st.pdf"
                className="p-1 rounded-lg text-gray-600 hover:bg-gml-green-100 hover:text-gml-green-900 transition-colors"
                title="Stáhnout RVP Geografie PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
              <a
                href={rvpPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-gml-green-600 hover:bg-gml-green-700 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-2xs"
              >
                <span>Otevřít</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Embedded PDF Viewer */}
          <div className="flex-1 w-full relative bg-slate-100">
            <iframe
              src={`${rvpPdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
              title="RVP Geografie PDF"
              className="w-full h-full border-0 absolute inset-0 bg-white"
            />
          </div>
        </div>

        {/* Right Column: ŠVP 4leté GML (str. 167–174) */}
        <div className="flex flex-col h-full rounded-2xl border-2 border-blue-300 shadow-md bg-white overflow-hidden">
          {/* Sub-header */}
          <div className="bg-blue-50/90 border-b border-blue-200 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-black uppercase shrink-0">
                ŠVP 4G
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-gml-slate-900 truncate">
                <EditableText id="s15b_right_h3" defaultText="ŠVP 4leté GML – Geografie (str. 167–174)" />
              </h3>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href={svpFullPdfUrl}
                download="SVP_4lete_od2026.pdf"
                className="p-1 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-900 transition-colors"
                title="Stáhnout celé ŠVP 4G"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
              <a
                href={svpPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-2xs"
              >
                <span>Otevřít</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Embedded PDF Viewer */}
          <div className="flex-1 w-full relative bg-slate-100">
            <iframe
              src={`${svpPdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
              title="ŠVP 4leté Geografie PDF"
              className="w-full h-full border-0 absolute inset-0 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
