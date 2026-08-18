import React, { useState } from 'react';
import { Globe, ExternalLink, RefreshCw, Maximize2, Minimize2, Sparkles, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide12b_RvpPortal: React.FC = () => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const portalUrl = 'https://prohlednout.rvp.cz/zakladni-vzdelavani/obecne-casti';

  const reloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none bg-white space-y-3">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="space-y-0.5">
          <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
            <EditableText id="s12b_badge" defaultText="Interaktivní kurikulární portál" />
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display text-gml-slate-900">
            <EditableText id="s12b_title" defaultText="Prohlédnout RVP: Obecné části nového kurikula" />
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gml-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title={isExpanded ? 'Zmenšit okno' : 'Zvětšit na celou výšku'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isExpanded ? 'Standardní pohled' : 'Zvětšit portál'}</span>
          </button>

          <a
            href={portalUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-gml-green-600 hover:bg-gml-green-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>Otevřít v novém okně</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Interactive Browser Window */}
      <div
        className={`w-full rounded-2xl border-2 border-gml-green-200 shadow-md bg-white flex flex-col overflow-hidden transition-all duration-300 ${
          isExpanded ? 'flex-1 min-h-[480px]' : 'flex-1 min-h-[360px] max-h-[520px]'
        }`}
      >
        {/* Browser Top Address Bar */}
        <div className="bg-gray-100/90 border-b border-gray-200 px-3 py-2 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-gml-green-400" />
          </div>

          {/* URL Pill */}
          <div className="flex-1 max-w-xl mx-auto bg-white border border-gray-200 rounded-xl px-3 py-1 text-[11px] sm:text-xs font-mono text-gray-700 flex items-center justify-between shadow-2xs">
            <span className="truncate flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gml-green-600 shrink-0" />
              prohlednout.rvp.cz/zakladni-vzdelavani/obecne-casti
            </span>
            <button
              onClick={reloadIframe}
              className="text-gray-400 hover:text-gray-700 p-0.5 rounded cursor-pointer"
              title="Obnovit portál"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <span className="text-[10px] font-bold text-gml-green-700 uppercase tracking-wider hidden md:inline">
            Živý náhled
          </span>
        </div>

        {/* Live Iframe View */}
        <div className="flex-1 w-full h-full relative bg-slate-50">
          <iframe
            key={iframeKey}
            src={portalUrl}
            title="Prohlédnout RVP"
            className="w-full h-full border-0 absolute inset-0 bg-white"
            allow="fullscreen"
            loading="lazy"
          />
        </div>
      </div>

      {/* Bottom Information Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 sm:p-3 bg-gml-green-50/80 border border-gml-green-200 rounded-2xl text-xs text-gml-slate-800 shrink-0">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-gml-green-700 shrink-0" />
          <span>
            <EditableText
              id="s12b_footer_hint"
              defaultText="V portálu můžete interaktivně procházet vazby mezi Klíčovými kompetencemi, Gramotnostmi a OVU."
            />
          </span>
        </div>
        <a
          href={portalUrl}
          target="_blank"
          rel="noreferrer"
          className="text-gml-green-800 font-bold underline hover:text-gml-green-950 flex items-center gap-1 shrink-0"
        >
          Přejít na prohlednout.rvp.cz <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
