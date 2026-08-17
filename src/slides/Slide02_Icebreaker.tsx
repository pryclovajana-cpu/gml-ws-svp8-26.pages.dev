import React, { useState } from 'react';
import { Eye, Check } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide02_Icebreaker: React.FC = () => {
  const items = [
    { id: 'i1', text: 'Kdo se podílel na tvorbě ŠVP 4G?', category: 'ŠVP Tým', color: 'border-gml-green-400 bg-gml-green-50' },
    { id: 'i2', text: 'Kdo učí jazyky?', category: 'Cizí i český jazyk', color: 'border-gml-yellow-400 bg-gml-yellow-50' },
    { id: 'i3', text: 'Kdo učí přírodní vědy?', category: 'Matematika, Fyzika, Chemie, Bio', color: 'border-blue-300 bg-blue-50' },
    { id: 'i4', text: 'Kdo učíte humanitní obory?', category: 'Dějepis, ZSV, Zeměpis', color: 'border-purple-300 bg-purple-50' },
    { id: 'i5', text: 'Kdo tělocvik?', category: 'Tělesná výchova & Sport', color: 'border-orange-300 bg-orange-50' },
    { id: 'i6', text: 'Kdo informatiku a technické předměty?', category: 'ICT & Robotika', color: 'border-teal-300 bg-teal-50' },
    { id: 'i7', text: 'Kdo výchovy?', category: 'Hudební & Výtvarná výchova', color: 'border-pink-300 bg-pink-50' },
  ];

  const [visibleCount, setVisibleCount] = useState<number>(1);

  const revealNext = () => {
    setVisibleCount((prev) => Math.min(prev + 1, items.length));
  };

  const revealAll = () => {
    setVisibleCount(items.length);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none bg-white max-w-[1700px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 sm:pb-6">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-gml-yellow-700 block">
            Rychlé seznámení
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-gml-slate-900">
            <EditableText id="s2_title" defaultText="Dnešní složení sborovny" />
          </h2>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={revealNext}
            disabled={visibleCount >= items.length}
            className="px-5 py-2.5 bg-gml-green-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-gml-green-700 disabled:opacity-40 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" /> Odkrýt další položku ({visibleCount}/{items.length})
          </button>
          <button
            onClick={revealAll}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-200 transition-all cursor-pointer"
          >
            Zobrazit vše
          </button>
        </div>
      </div>

      {/* Grid of items revealing sequentially */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7 my-auto py-6">
        {items.map((item, idx) => {
          const isRevealed = idx < visibleCount;
          return (
            <div
              key={item.id}
              onClick={revealNext}
              className={`p-6 sm:p-7 rounded-3xl border-2 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[140px] sm:min-h-[160px] ${
                isRevealed
                  ? `${item.color} shadow-md opacity-100 scale-100 hover:shadow-lg`
                  : 'bg-gray-50/70 border-dashed border-gray-200 opacity-40 scale-95 hover:opacity-60'
              }`}
            >
              {isRevealed ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-gml-slate-700">
                      {item.category}
                    </span>
                    <span className="p-1 bg-white rounded-full text-gml-green-600 shadow-2xs">
                      <Check className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-gml-slate-900 mt-3 leading-snug">
                    <EditableText id={`s2_${item.id}`} defaultText={item.text} />
                  </h3>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 font-semibold text-sm sm:text-base gap-2">
                  <Eye className="w-4 h-4 opacity-50" />
                  <span>Klikněte pro odkrytí #{idx + 1}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
