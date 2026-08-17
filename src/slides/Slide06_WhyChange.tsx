import React from 'react';
import { EditableText } from '../context/AdminEditContext';

export const Slide06_WhyChange: React.FC = () => {
  const pillars = [
    {
      id: 'p1',
      title: '1. Zadání státu & Pilotáž RVP ZV 2028',
      desc: 'Unikátní příležitost si změnu rok vyzkoušet nanečisto – silný argument a náskok před ČŠI.',
      accent: 'border-gml-green-600',
    },
    {
      id: 'p2',
      title: '2. Vazba na ŠVP 4G',
      desc: 'Osmileté gymnázium (nižší stupeň 8G) nemůže zaostávat za standardem a dynamikou čtyřletého stupně.',
      accent: 'border-gml-yellow-500',
    },
    {
      id: 'p3',
      title: '3. Změna je jediná jistota',
      desc: 'Ne všechny změny jsou špatně a ne všechny věci musí zůstat ve škole stejné dlouhé roky. Pojďme se nebát „pohnout kameny“.',
      accent: 'border-blue-500',
    },
    {
      id: 'p4',
      title: '4. Nástup AI & Nová kognitivní éra',
      desc: 'Změna paradigmatu ve vzdělávání: Přesun od pouhého pamatování faktů k analytickému a kritickému myšlení.',
      accent: 'border-purple-500',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none relative bg-white">
      {/* Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          Proč je změna nutná?
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s6_title" defaultText="4 klíčové pilíře pro revizi našeho ŠVP" />
        </h2>
      </div>

      {/* Main Grid: Left 4 Pillars (Enlarged Fonts) & Right Transparent GML Monolith Line Art */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-2 sm:py-4">
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-5 sm:gap-y-7">
          {pillars.map((p) => (
            <div key={p.id} className={`space-y-2 border-l-4 ${p.accent} pl-4 sm:pl-5 py-1`}>
              <h3 className="text-base sm:text-lg md:text-xl font-black font-display text-gml-slate-900 leading-snug">
                <EditableText id={`s6_${p.id}_title`} defaultText={p.title} />
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                <EditableText id={`s6_${p.id}_desc`} defaultText={p.desc} />
              </p>
            </div>
          ))}
        </div>

        {/* Right side: Responsive Line Art Illustration of GML Monolith Atrium */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <img
            src="/images/monolith_hall.png"
            alt="Atrium GML s kamenným monolitem"
            className="w-full max-h-[220px] sm:max-h-[280px] md:max-h-[340px] object-contain select-none pointer-events-none mix-blend-multiply"
          />
        </div>
      </div>

      {/* Open Question Banner */}
      <div className="pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Otevřená otázka pro sborovnu
          </span>
          <p className="text-sm sm:text-base md:text-lg font-bold text-gml-slate-900">
            <EditableText
              id="s6_open_question"
              defaultText="Proč ještě? Jaké další důvody vnímáte přímo ve vašich aprobačních předmětech?"
            />
          </p>
        </div>
      </div>
    </div>
  );
};
