import React from 'react';
import { Clock, Coffee, Sparkles } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide01b_Schedule: React.FC = () => {
  const scheduleItems = [
    {
      id: 'sch1',
      time: '9:00 – 10:00',
      title: 'První blok',
      subtitle: 'Východiska & Vize ŠVP 8G',
      desc: 'Kontext změn RVP ZV, specifika žáků osmiletého gymnázia, živá reflexe a společná vize.',
      icon: Sparkles,
      color: '#16a34a', // GML Green
      accent: 'text-gml-green-700',
    },
    {
      id: 'sch2',
      time: '10:00 – 10:15',
      title: 'Přestávka',
      subtitle: 'Čas pro wellbeing & kávu',
      desc: 'Prostor pro občerstvení, kávu a neformální rozhovory napříč předmětovými komisemi.',
      icon: Coffee,
      color: '#eab308', // Warm Yellow
      accent: 'text-gml-yellow-700',
    },
    {
      id: 'sch3',
      time: '10:15 – 11:30',
      title: 'Druhý blok',
      subtitle: 'Týmová práce & Akční plán',
      desc: 'Práce v předmětových komisích na klíčových kompetencích, integrace témat, výstupní evaluace.',
      icon: Clock,
      color: '#0284c7', // River Blue
      accent: 'text-blue-700',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none relative bg-white overflow-hidden">
      {/* Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="sch_title" defaultText="Časový harmonogram dnešního setkání" />
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          <EditableText
            id="sch_subtitle"
            defaultText="Plynulý průběh dopoledne: 9:00 – 11:30 (včetně přestávky na kávu)"
          />
        </p>
      </div>

      {/* Main Flowing Wave Timeline Canvas */}
      <div className="relative my-auto max-w-6xl w-full mx-auto py-4 sm:py-6">
        {/* Organic SVG Wavy Line River Path on md+ */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-32 pointer-events-none -z-10 hidden md:block">
          <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="w-full h-full">
            {/* Soft Shadow Wave */}
            <path
              d="M 0,60 C 180,10 320,110 500,60 C 680,10 820,110 1000,60"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Flowing Organic River Gradient Wave */}
            <path
              d="M 0,60 C 180,10 320,110 500,60 C 680,10 820,110 1000,60"
              fill="none"
              stroke="url(#scheduleWaveGradient)"
              strokeWidth="3.5"
              strokeDasharray="6,4"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="scheduleWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 3 Interactive Timeline Milestone Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 md:gap-10 relative z-10 items-stretch">
          {scheduleItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex flex-col space-y-3 sm:space-y-4 group transition-all duration-300"
              >
                {/* 1. Top Time & Icon Node */}
                <div className="flex items-center gap-3 h-12 sm:h-14">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110 shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest block">
                      Časový úsek
                    </span>
                    <span className="text-sm sm:text-base md:text-lg font-extrabold text-gml-slate-900 font-mono">
                      <EditableText id={`sch_${item.id}_time`} defaultText={item.time} />
                    </span>
                  </div>
                </div>

                {/* 2. Structured Card Container */}
                <div className="flex-1 bg-white p-4 sm:p-6 rounded-3xl border border-gray-200/90 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-gray-300 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className={`text-xs sm:text-xs font-bold uppercase tracking-wider block ${item.accent}`}>
                      <EditableText id={`sch_${item.id}_title`} defaultText={item.title} />
                    </span>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold font-display text-gml-slate-900 leading-snug">
                      <EditableText id={`sch_${item.id}_subtitle`} defaultText={item.subtitle} />
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium pt-1">
                      <EditableText id={`sch_${item.id}_desc`} defaultText={item.desc} />
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
