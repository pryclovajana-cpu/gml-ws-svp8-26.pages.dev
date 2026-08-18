import React from 'react';
import { CalendarCheck, Layers, Sparkles } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide14_SubjectIntegration: React.FC = () => {
  const pillars = [
    {
      id: 'si1',
      icon: CalendarCheck,
      title: 'Časová harmonizace tematických plánů',
      desc: 'Výuka propojeného mezipředmětového tématu ve stejném měsíci (např. Průmyslová revoluce v Dějepisu, Fyzice a Literaturu).',
      color: 'border-gml-green-300 bg-gml-green-50/70 text-gml-green-900',
    },
    {
      id: 'si2',
      icon: Layers,
      title: 'Práce s OVU na konci 9. třídy (Kvarta)',
      desc: 'Identifikace přirozených průniků a překryvů učiva napříč předmětovými komisemi pro zefektivnění výuky.',
      color: 'border-gml-yellow-300 bg-gml-yellow-50/70 text-gml-yellow-900',
    },
    {
      id: 'si3',
      icon: Sparkles,
      title: 'Interdisciplinarita pro nadané žáky',
      desc: 'Nadaní žáci přirozeně uvažují v souvislostech. Propojení vědních oborů stimuluje hlubší porozumění a zvědavost.',
      color: 'border-blue-300 bg-blue-50/70 text-blue-900',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          <EditableText id="s14_badge" defaultText="Integrace a společná témata" />
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s14_title" defaultText="Jak smysluplně propojit předměty na GML?" />
        </h2>
      </div>

      {/* Grid of 3 Integration Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 my-auto py-2 sm:py-4">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className={`p-5 sm:p-6 rounded-3xl border-2 transition-all hover:shadow-md flex flex-col justify-between space-y-3 sm:space-y-4 ${p.color}`}
            >
              <div className="p-3 bg-white rounded-2xl shadow-2xs w-fit">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="text-lg sm:text-xl font-bold font-display text-gml-slate-900">
                  <EditableText id={`s14_${p.id}_title`} defaultText={p.title} />
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  <EditableText id={`s14_${p.id}_desc`} defaultText={p.desc} />
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 text-[10px] sm:text-[11px] font-bold text-gray-400">
                GML 8G Synergie
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
