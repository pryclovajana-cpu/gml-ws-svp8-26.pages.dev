import React from 'react';
import { Blocks, BookOpen, KeyRound, Compass, Heart } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide11_KeyChanges: React.FC = () => {
  const stones = [
    {
      id: 'st1',
      icon: BookOpen,
      title: '1. Gramotnosti',
      desc: 'Čtenářská, matematická, digitální a finanční gramotnost jako průřezový základ všech předmětů.',
      color: 'border-gml-green-300 bg-gml-green-50/70 text-gml-green-900',
    },
    {
      id: 'st2',
      icon: KeyRound,
      title: '2. Klíčové kompetence',
      desc: 'Schopnosti k učení, řešení problémů, komunikaci, spolupráci, občanství a podnikavosti.',
      color: 'border-gml-yellow-300 bg-gml-yellow-50/70 text-gml-yellow-900',
    },
    {
      id: 'st3',
      icon: Compass,
      title: '3. Průřezová témata',
      desc: 'Aktuální témata moderního světa: Digitální bezpečnost, environmentální udržitelnost, mediální kritika.',
      color: 'border-blue-300 bg-blue-50/70 text-blue-900',
    },
    {
      id: 'st4',
      icon: Heart,
      title: '4. Člověk a osobnost',
      desc: 'Nový vzdělávací obor zaměřený na duševní zdraví, seberozvoj, etiku a mezilidské vztahy.',
      color: 'border-pink-300 bg-pink-50/70 text-pink-900',
      badge: 'NOVÝ OBOR RVP',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          Klíčové změny v RVP
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s11_title" defaultText="Čtyři hlavní stavební kameny nového kurikula" />
        </h2>
      </div>

      {/* 4 Pillars Building Stones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-auto py-2 sm:py-4">
        {stones.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`p-4 sm:p-6 rounded-3xl border-2 transition-all hover:shadow-md flex flex-col justify-between space-y-3 sm:space-y-4 ${s.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 sm:p-3.5 bg-white rounded-2xl shadow-2xs">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                {s.badge && (
                  <span className="px-3 py-1 bg-pink-500 text-white text-[10px] font-extrabold rounded-full shadow-2xs uppercase">
                    {s.badge}
                  </span>
                )}
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold font-display text-gml-slate-900">
                  <EditableText id={`s11_${s.id}_title`} defaultText={s.title} />
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  <EditableText id={`s11_${s.id}_desc`} defaultText={s.desc} />
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Takeaway */}
      <div className="p-3.5 sm:p-4 bg-white border border-gray-200 rounded-2xl text-center text-xs sm:text-sm text-gml-slate-800 font-semibold">
        Všechny 4 kameny propojují výuku na nižším stupni 8G a připravují žáky pro plynulý přechod na vyšší stupeň gymnázia.
      </div>
    </div>
  );
};
