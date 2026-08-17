import React, { useState } from 'react';
import { UserCheck, Sparkles } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

const PUPIL_COLOR_CLASSES = [
  'bg-gml-yellow-400 text-gml-slate-900 shadow-md ring-2 ring-gml-yellow-500', // 0: Default yellow
  'bg-gml-green-400 text-white shadow-md ring-2 ring-gml-green-500',           // 1: Green
  'bg-blue-400 text-white shadow-md ring-2 ring-blue-500',                     // 2: Blue
  'bg-purple-400 text-white shadow-md ring-2 ring-purple-500',                 // 3: Purple
  'bg-pink-400 text-white shadow-md ring-2 ring-pink-500',                     // 4: Pink
  'bg-amber-500 text-white shadow-md ring-2 ring-amber-600',                   // 5: Amber
  'bg-teal-400 text-white shadow-md ring-2 ring-teal-500',                     // 6: Teal
  'bg-rose-400 text-white shadow-md ring-2 ring-rose-500',                     // 7: Rose
];

export const Slide09_GiftedInfographic: React.FC = () => {
  const zsPupils = [
    { type: 'gifted' },
    { type: 'talented' }, { type: 'talented' }, { type: 'talented' }, { type: 'talented' }, { type: 'talented' },
    ...Array(24).fill({ type: 'standard' }),
  ];

  // Each GML pupil has an active color index (starts at 0 = yellow, cycles on interaction)
  const [gmlColorIndices, setGmlColorIndices] = useState<number[]>(() => Array(30).fill(0));

  const handlePupilInteraction = (index: number) => {
    setGmlColorIndices((prev) => {
      const next = [...prev];
      // Cycle to the next vibrant color in palette
      next[index] = (next[index] + 1) % PUPIL_COLOR_CLASSES.length;
      return next;
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          <EditableText id="s9_badge" defaultText="Specifikum žákovské populace" />
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText
            id="s9_title"
            defaultText="Proč nemůžeme učit stejně jako na běžné základní škole?"
          />
        </h2>
      </div>

      {/* 2-Column Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 my-auto py-2 sm:py-4">
        {/* Left Side: Běžná ZŠ */}
        <div className="bg-gray-50/80 p-4 sm:p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-3 sm:space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
                <EditableText id="s9_zs_label" defaultText="Běžná ZŠ • Třída 30 žáků" />
              </span>
              <span className="px-2.5 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-extrabold rounded-md">
                <EditableText id="s9_zs_tag" defaultText="Základní škola" />
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-gml-slate-900">
              <EditableText id="s9_zs_heading" defaultText="1–2 mimořádně nadaní žáci" />
            </h3>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              <EditableText
                id="s9_zs_desc"
                defaultText="Učitel vysvětluje základní učivo pro většinu třídy. Nadaný žák často čeká, nudí se nebo dostává práci navíc."
              />
            </p>
          </div>

          {/* 30 Icon Grid - Běžná ZŠ (1 jumping yellow, 5 green, 24 grey) */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5 p-3 sm:p-4 bg-white rounded-2xl border border-gray-200 shadow-inner">
            {zsPupils.map((p, idx) => (
              <div
                key={idx}
                className={`h-7 sm:h-9 rounded-xl flex items-center justify-center transition-all ${
                  p.type === 'gifted'
                    ? 'bg-gml-yellow-400 text-gml-slate-900 shadow-md ring-2 ring-gml-yellow-500 animate-bounce'
                    : p.type === 'talented'
                    ? 'bg-gml-green-200 text-gml-green-900 font-bold'
                    : 'bg-gray-200 text-gray-400'
                }`}
                title={p.type === 'gifted' ? 'Mimořádně nadaný žák' : p.type === 'talented' ? 'Talentovaný žák' : 'Standardní tempo'}
              >
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Osmileté Gymnázium GML (All 30 bouncing & color shifting on hover/touch) */}
        <div className="bg-gradient-to-br from-gml-green-500/10 via-gml-yellow-500/10 to-white p-4 sm:p-6 rounded-3xl border-2 border-gml-green-300 shadow-lg flex flex-col justify-between space-y-3 sm:space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gml-green-700">
                <EditableText id="s9_gml_label" defaultText="GML 8G • Třída 30 žáků" />
              </span>
              <span className="px-2.5 py-0.5 bg-gml-green-600 text-white text-[10px] font-extrabold rounded-md shadow-2xs">
                <EditableText id="s9_gml_tag" defaultText="GML Osmileté gymnázium" />
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-gml-slate-900 flex items-center gap-2">
              <EditableText id="s9_gml_heading" defaultText="Všech 30 žáků je nadaných!" />{' '}
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gml-yellow-600 shrink-0" />
            </h3>
            <p className="text-xs text-gml-slate-700 mt-1 font-medium">
              <EditableText
                id="s9_gml_desc"
                defaultText="Všichni žáci prošli přísným výběrem. Každý v lavici má vysoký intelektový potenciál a očekává výzvy!"
              />
            </p>
          </div>

          {/* 30 Icon Grid - ALL BOUNCING & COLOR SHIFTING ON HOVER / TOUCH */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5 p-3 sm:p-4 bg-white/95 rounded-2xl border border-gml-green-200 shadow-inner">
            {gmlColorIndices.map((colorIdx, idx) => (
              <div
                key={idx}
                onMouseEnter={() => handlePupilInteraction(idx)}
                onTouchStart={() => handlePupilInteraction(idx)}
                style={{
                  animationDelay: `${(idx % 6) * 0.12 + Math.floor(idx / 6) * 0.08}s`,
                }}
                className={`h-7 sm:h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-200 animate-bounce ${
                  PUPIL_COLOR_CLASSES[colorIdx]
                }`}
                title="Nadaný žák 8G (Přejeďte myší pro změnu barvy)"
              >
                <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Key Takeaway */}
      <div className="p-3.5 sm:p-4 bg-gml-green-600 text-white rounded-2xl text-center text-xs sm:text-sm font-bold shadow-md">
        <EditableText
          id="s9_takeaway"
          defaultText="Důsledek pro ŠVP 8G: Naše učivo nemůže být pouhým „opakováním ZŠ“. Potřebujeme hloubku, gradaci úloh a rozvoj kritického myšlení."
        />
      </div>
    </div>
  );
};
