import React from 'react';
import { ArrowRight } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide12_BridgeCompetencies: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          <EditableText id="s12_badge" defaultText="Klíčové kompetence jako most" />
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s12_title" defaultText="Propojení nižšího a vyššího stupně gymnázia skrze KLÍČOVÉ KOMPETENCE" />
        </h2>
      </div>

      {/* Visual Bridge Metaphor Container - Spacious & Prominent */}
      <div className="my-auto py-2 sm:py-6">
        <div className="relative p-6 sm:p-8 md:p-10 bg-gradient-to-r from-gml-green-50/60 via-amber-50/40 to-blue-50/60 rounded-3xl border-2 border-gml-green-200 shadow-md overflow-hidden">
          {/* Bridge Graphic 3-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
            {/* Left Bank: Lower Stage 8G */}
            <div className="md:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-gml-green-300 shadow-sm space-y-3">
              <span className="px-3 py-1 bg-gml-green-100 text-gml-green-800 rounded-full text-xs font-extrabold uppercase inline-block">
                <EditableText id="s12_left_badge" defaultText="Nižší stupeň (Prima – Kvarta)" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display text-gml-slate-900">
                <EditableText id="s12_left_title" defaultText="Příprava & Základy" />
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                <EditableText
                  id="s12_left_desc"
                  defaultText="Získávání znalostí, budování studijních návyků, týmové projekty a objevování osobního nadání."
                />
              </p>
            </div>

            {/* Center Bridge Image & Flow */}
            <div className="md:col-span-4 flex flex-col items-center text-center space-y-3 p-3 sm:p-4 bg-white/90 rounded-2xl border border-amber-300 shadow-sm">
              <div className="w-full h-36 sm:h-44 md:h-48 rounded-xl overflow-hidden shadow-inner border border-amber-200 relative group">
                <img
                  src="/images/gml_bridge_metaphor.jpg"
                  alt="Most klíčových kompetencí"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end justify-center pb-2.5">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white drop-shadow-md">
                    Most klíčových kompetencí
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-gml-slate-900 bg-amber-100/90 px-3 py-1.5 rounded-xl border border-amber-300 justify-center w-full">
                <span>Cíl (OVU)</span>
                <ArrowRight className="w-3.5 h-3.5 text-gml-green-700 shrink-0" />
                <span>Aktivita</span>
                <ArrowRight className="w-3.5 h-3.5 text-gml-green-700 shrink-0" />
                <span>Prostředky</span>
              </div>
            </div>

            {/* Right Bank: Upper Stage 8G */}
            <div className="md:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-blue-300 shadow-sm space-y-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-extrabold uppercase inline-block">
                <EditableText id="s12_right_badge" defaultText="Vyšší stupeň (Kvinta – Oktáva)" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display text-gml-slate-900">
                <EditableText id="s12_right_title" defaultText="Specializace & Autonomie" />
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                <EditableText
                  id="s12_right_desc"
                  defaultText="Akademická hloubka, maturitní profilace, SOČ, kritická analýza a příprava na univerzity."
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Takeaway */}
      <div className="p-3.5 sm:p-4 bg-gml-green-50 border border-gml-green-200 rounded-2xl text-center text-xs sm:text-sm text-gml-green-950 font-bold shadow-2xs">
        <EditableText
          id="s12_bottom_takeaway"
          defaultText="Kompetence nejsou učivo navíc, ale způsob, jakým žáci s učivem pracují."
        />
      </div>
    </div>
  );
};
