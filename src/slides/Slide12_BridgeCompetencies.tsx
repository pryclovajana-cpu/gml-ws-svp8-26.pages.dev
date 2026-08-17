import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide12_BridgeCompetencies: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          Klíčové kompetence jako most
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s12_title" defaultText="Propojení nižšího a vyššího stupně 8G" />
        </h2>
      </div>

      {/* Visual Bridge Metaphor Container */}
      <div className="my-auto space-y-4 sm:space-y-6 py-2 sm:py-4">
        <div className="relative p-4 sm:p-6 md:p-8 bg-gradient-to-r from-gml-green-50 via-gml-yellow-50 to-blue-50 rounded-3xl border-2 border-gml-green-200 shadow-md">
          {/* Bridge Graphic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-center relative z-10">
            {/* Left Bank: Lower Stage 8G */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gml-green-300 shadow-sm space-y-1.5 sm:space-y-2">
              <span className="px-2.5 py-0.5 bg-gml-green-100 text-gml-green-800 rounded-full text-[10px] font-extrabold uppercase inline-block">
                Nižší stupeň (Prima – Kvarta)
              </span>
              <h3 className="text-base sm:text-lg font-bold font-display text-gml-slate-900">
                Příprava & Základy
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Získávání znalostí, budování studijních návyků, týmové projekty a objevování osobního nadání.
              </p>
            </div>

            {/* Center Arch of the Bridge */}
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/85 rounded-2xl border border-gml-yellow-300 shadow-sm">
              <div className="p-2 sm:p-3 bg-gml-yellow-400 text-gml-slate-900 rounded-2xl shadow-sm animate-bounce">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-gml-yellow-800">
                Most Klíčových Kompetencí
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-gml-slate-900 bg-gml-yellow-100 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-gml-yellow-300 flex-wrap justify-center">
                <span>Cíl (OVU)</span>
                <ArrowRight className="w-3 h-3 text-gml-green-600 shrink-0" />
                <span>Aktivita</span>
                <ArrowRight className="w-3 h-3 text-gml-green-600 shrink-0" />
                <span>Prostředky</span>
              </div>
            </div>

            {/* Right Bank: Upper Stage 8G */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-300 shadow-sm space-y-1.5 sm:space-y-2">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-extrabold uppercase inline-block">
                Vyšší stupeň (Kvinta – Oktáva)
              </span>
              <h3 className="text-base sm:text-lg font-bold font-display text-gml-slate-900">
                Specializace & Autonomie
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Akademická hloubka, maturitní profilace, SOČ, kritická analýza a příprava na univerzitu.
              </p>
            </div>
          </div>
        </div>

        {/* Trajectory Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-gray-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-gml-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gml-slate-900">1. Definice cíle (OVU)</h4>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Co má žák konkrétně umět a prokázat na konci ročníku.</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-gray-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-gml-yellow-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gml-slate-900">2. Návrh aktivity</h4>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Badatelský úkol, experiment, diskuse či týmový projekt.</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-gray-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gml-slate-900">3. Volba prostředků</h4>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Digitální nástroje, zdroje, hodnocení a sebereflexe.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="p-3 bg-gml-green-50 border border-gml-green-200 rounded-xl text-center text-xs sm:text-sm text-gml-green-900 font-semibold">
        Kompetence nejsou učivo navíc, ale způsob, jakým žáci s učivem pracují.
      </div>
    </div>
  );
};
