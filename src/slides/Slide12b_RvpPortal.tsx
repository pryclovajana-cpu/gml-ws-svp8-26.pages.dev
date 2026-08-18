import React, { useState } from 'react';
import { Globe, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide12b_RvpPortal: React.FC = () => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const portalUrl = 'https://prohlednout.rvp.cz/zakladni-vzdelavani/obecne-casti';

  const reloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="w-full h-full flex flex-col p-2 sm:p-3 md:p-4 select-none bg-white space-y-2">
      {/* Sleek Compact Header Bar with Title, URL Address Bar & External Link */}
      <div className="flex items-center justify-between gap-3 bg-white px-2 py-1 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2.5 py-1 bg-gml-green-100 text-gml-green-800 text-[10px] font-extrabold rounded-lg uppercase tracking-wider shrink-0 hidden sm:inline-block">
            <EditableText id="s12b_badge" defaultText="Portál RVP" />
          </span>
          <h2 className="text-sm sm:text-base md:text-lg font-extrabold font-display text-gml-slate-900 truncate">
            <EditableText id="s12b_title" defaultText="Prohlédnout RVP: Obecné části nového kurikula" />
          </h2>
        </div>

        {/* Center URL Address Bar */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-100/90 border border-gray-200 rounded-xl px-3 py-1 text-xs font-mono text-gray-700 shadow-2xs">
          <Globe className="w-3.5 h-3.5 text-gml-green-600 shrink-0" />
          <span className="truncate max-w-[280px]">prohlednout.rvp.cz/.../obecne-casti</span>
          <button
            onClick={reloadIframe}
            className="text-gray-400 hover:text-gray-700 p-0.5 rounded cursor-pointer transition-colors"
            title="Znovu načíst portál"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={reloadIframe}
            className="lg:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
            title="Znovu načíst portál"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <a
            href={portalUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 sm:py-2 bg-gml-green-600 hover:bg-gml-green-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Otevřít v okně</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Full-Height Edge-to-Edge Embedded Browser Window */}
      <div className="flex-1 w-full rounded-2xl border-2 border-gml-green-300 shadow-lg bg-white overflow-hidden relative flex flex-col">
        {/* Browser Sub-Header */}
        <div className="bg-gray-100/90 border-b border-gray-200 px-3 py-1.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-gml-green-400" />
            <span className="text-[11px] font-bold text-gray-500 pl-2 hidden sm:inline">
              Interaktivní živé procházení
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-gml-green-800">
            <Sparkles className="w-3.5 h-3.5 text-gml-green-600" />
            <span className="hidden md:inline">
              <EditableText
                id="s12b_hint"
                defaultText="Můžete přímo v okně rozklikávat kapitoly a procházet očekávané výsledky učení"
              />
            </span>
          </div>
        </div>

        {/* Full-Height Responsive Iframe */}
        <div className="flex-1 w-full relative bg-slate-50">
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
    </div>
  );
};
