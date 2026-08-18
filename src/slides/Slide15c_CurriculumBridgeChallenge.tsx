import React from 'react';
import { HelpCircle, Sparkles, Lightbulb, ArrowRightLeft, Target } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide15c_CurriculumBridgeChallenge: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-gml-green-100 text-gml-green-800 text-xs font-extrabold rounded-lg uppercase tracking-wider">
            <EditableText id="s15c_badge" defaultText="VÝZVA PRO PŘEDMĚTOVÉ KOMISE" />
          </span>
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <ArrowRightLeft className="w-3.5 h-3.5 text-gml-green-600" />
            Kvarta ➔ Kvinta / 1. ročník 4G
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900 leading-snug">
          <EditableText
            id="s15c_title"
            defaultText="Propojení modelového ŠVP a ŠVP 4letého gymnázia"
          />
        </h2>
      </div>

      {/* Main Content Area: 2 Distinct Spacious Blocks */}
      <div className="my-auto space-y-5 sm:space-y-7 max-w-5xl mx-auto w-full py-2 sm:py-4">
        {/* 1. Main Challenge Box */}
        <div className="p-6 sm:p-8 md:p-10 bg-white rounded-3xl border-2 border-gml-green-300 shadow-md flex items-start gap-4 sm:gap-6 relative overflow-hidden">
          <div className="p-3.5 sm:p-4 bg-gml-green-100/70 text-gml-green-800 rounded-2xl shrink-0 mt-1 shadow-2xs">
            <HelpCircle className="w-7 h-7 sm:w-9 sm:h-9" />
          </div>
          <div className="space-y-3 flex-1">
            <span className="text-xs sm:text-sm font-extrabold text-gml-green-800 uppercase tracking-wider block">
              <EditableText id="s15c_challenge_label" defaultText="Otázka a výzva k diskusi" />
            </span>
            <p className="text-base sm:text-xl md:text-2xl font-bold font-display text-gml-slate-900 leading-relaxed">
              <EditableText
                id="s15c_challenge_text"
                defaultText="Jaké možnosti propojení vidíte u modelového ŠVP pro nižší stupeň gymnázia a Váš nový ŠVP pro čtyřleté gymnázium? Zkuste porovnat úroveň obou dokumentů vzhledem k Vaší zkušenosti z praxe kvarty a kvinty."
              />
            </p>
          </div>
        </div>

        {/* 2. Highlighted Tip for Gifted Pupils Box */}
        <div className="p-6 sm:p-7 md:p-8 bg-gradient-to-r from-gml-yellow-50 via-amber-50/50 to-gml-green-50/40 rounded-3xl border-2 border-gml-yellow-400 shadow-md flex items-start gap-4 sm:gap-6 relative">
          <div className="p-3 sm:p-3.5 bg-gml-yellow-300 text-gml-slate-900 rounded-2xl shrink-0 mt-1 shadow-2xs">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-gml-yellow-200 text-gml-slate-900 text-xs font-black rounded-md uppercase tracking-wider">
                <EditableText id="s15c_tip_badge" defaultText="Doporučení z praxe" />
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-gml-slate-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-gml-yellow-700" />
                <EditableText id="s15c_tip_heading" defaultText="Tip pro mimořádně nadané žáky:" />
              </h3>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gml-slate-900 font-semibold leading-relaxed">
              <EditableText
                id="s15c_tip_text"
                defaultText="Řešením rozdílů v očekávaných výsledcích učení by mohla být individuální možnost diferenciace cílů – u OVU přemýšlet směrem k možnosti výběru OVU vyšší náročnosti."
              />
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Takeaway Hint */}
      <div className="p-3.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs sm:text-sm font-semibold text-gml-slate-800">
        <EditableText
          id="s15c_bottom_hint"
          defaultText="Provázanost obou stupňů zajistí plynulý přechod žáků bez zbytečných duplicit nebo naopak propadů v nárocích."
        />
      </div>
    </div>
  );
};
