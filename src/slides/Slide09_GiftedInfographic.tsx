import React, { useState } from 'react';
import { UserCheck, Sparkles } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

const PUPIL_COLOR_CLASSES = [
  'bg-gml-yellow-400 text-gml-slate-900 shadow-md ring-2 ring-gml-yellow-500', // Default yellow
  'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-400',
  'bg-sky-500 text-white shadow-md ring-2 ring-sky-400',
  'bg-purple-500 text-white shadow-md ring-2 ring-purple-400',
  'bg-rose-500 text-white shadow-md ring-2 ring-rose-400',
  'bg-orange-500 text-white shadow-md ring-2 ring-orange-400',
  'bg-indigo-500 text-white shadow-md ring-2 ring-indigo-400',
  'bg-teal-500 text-white shadow-md ring-2 ring-teal-400',
  'bg-amber-300 text-gml-slate-900 shadow-md ring-2 ring-amber-400',
];

export const Slide09_GiftedInfographic: React.FC = () => {
  // 30 pupils ZŠ: 1 exceptionally gifted (gold), 5 talented (green), 24 standard (gray)
  const zsPupils = [
    { type: 'gifted' },
    ...Array(5).fill({ type: 'talented' }),
    ...Array(24).fill({ type: 'standard' }),
  ];

  // Dynamic colors for each of the 30 GML pupils, cycling on mouse hover or touch tap
  const [gmlColorIndices, setGmlColorIndices] = useState<number[]>(() => Array(30).fill(0));

  const handlePupilInteraction = (idx: number) => {
    setGmlColorIndices((prev) => {
      const next = [...prev];
      next[idx] = (next[idx] + 1) % PUPIL_COLOR_CLASSES.length;
      return next;
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          Specifika žáků 8G (Metafora)
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s9_title" defaultText="Proč vyžaduje osmileté gymnázium jiný přístup?" />
        </h2>
      </div>

      {/* Main Infographic Grid Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 my-auto py-2 sm:py-4">
        {/* Left Side: Standard Elementary School (Běžná ZŠ) */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-3 sm:space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
                Srovnání • Třída 30 žáků
              </span>
              <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-extrabold rounded-md">
                Běžná ZŠ
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-gml-slate-900">
              Heterogenní kolektiv na ZŠ
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              1 mimořádně nadaný žák, 5 talentovaných, 24 žáků s běžným tempem. Nadaný žák je často osamocen.
            </p>
          </div>

          {/* 30 Icon Grid for ZŠ */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5 p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-100">
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

          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-gray-500 border-t border-gray-100 pt-2.5 sm:pt-3">
            <span className="flex items-center gap-1">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-gml-yellow-400 inline-block" /> 1 Nadaný
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-gml-green-200 inline-block" /> 5 Talentovaných
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-gray-300 inline-block" /> 24 Standard
            </span>
          </div>
        </div>

        {/* Right Side: Osmileté Gymnázium GML (All 30 bouncing & color shifting on hover/touch) */}
        <div className="bg-gradient-to-br from-gml-green-500/10 via-gml-yellow-500/10 to-white p-4 sm:p-6 rounded-3xl border-2 border-gml-green-300 shadow-lg flex flex-col justify-between space-y-3 sm:space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gml-green-700">
                GML 8G • Třída 30 žáků
              </span>
              <span className="px-2.5 py-0.5 bg-gml-green-600 text-white text-[10px] font-extrabold rounded-md shadow-2xs">
                GML Osmileté gymnázium
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-gml-slate-900 flex items-center gap-2">
              Všech 30 žáků je nadaných! <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gml-yellow-600 shrink-0" />
            </h3>
            <p className="text-xs text-gml-slate-700 mt-1 font-medium">
              Všichni žáci prošli přísným výběrem. Každý v lavici má vysoký intelektový potenciál a očekává výzvy!
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

          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-extrabold text-gml-green-900 border-t border-gml-green-200 pt-2.5 sm:pt-3">
            <span className="truncate pr-2">100% koncentrace nadání a potenciálu</span>
            <span className="bg-gml-yellow-200 text-gml-slate-900 px-2 py-0.5 rounded-full shrink-0">
              30 / 30 Nadaných
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Key Takeaway */}
      <div className="p-3.5 sm:p-4 bg-gml-green-600 text-white rounded-2xl text-center text-xs sm:text-sm font-bold shadow-md">
        Důsledek pro ŠVP 8G: Naše učivo nemůže být pouhým „opakováním ZŠ“. Potřebujeme hloubku, gradaci úloh a rozvoj kritického myšlení.
      </div>
    </div>
  );
};
