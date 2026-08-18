import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, SlidersHorizontal, UserCheck, Scale } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide16_DemandsAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const topics = [
    {
      id: 't1',
      icon: Scale,
      title: '1. Nastavení adekvátních nároků v OVU',
      short: 'Jak nastavit laťku dostatečně vysoko bez přetížení?',
      detail:
        'U žáků 8G na GML nesmíme snižovat nároky na rozumové operace. Očekávané výstupy učení (OVU) musí cílit na vyšší patra Bloomovy taxonomie (Analýza, Hodnocení, Tvorba) s možností gradované náročnosti.',
      color: 'border-gml-green-200 bg-gml-green-50/70',
    },
    {
      id: 't2',
      icon: SlidersHorizontal,
      title: '2. Diferenciace obtížnosti a možnost volby žáka',
      short: 'Jak dát žákům možnost zvolit si vlastní úroveň výzvy?',
      detail:
        'Nabízet úkoly ve 3 úrovních (Základní / Pokročilá / Výzva). Žáci si sami volí úroveň nebo formu zpracování (písemný rozbor, prezentace, video, experiment). Posiluje se tím autonomie a odpovědnost.',
      color: 'border-gml-yellow-300 bg-gml-yellow-50/70',
    },
    {
      id: 't3',
      icon: HelpCircle,
      title: '3. Jak pracovat se žáky „na nutném minimu“?',
      short: 'Co s žáky s vysokým intelektem, kteří dělají jen nejnutnější minimum?',
      detail:
        'U nadaných dětí jde často o obranný mechanismus před nudou nebo strach ze selhání. Pomáhá osobní výzva, zadání propojující učivo s jejich osobním zájmem a kriteriální hodnocení bez pouhého známkování.',
      color: 'border-blue-200 bg-blue-50/70',
    },
    {
      id: 't4',
      icon: UserCheck,
      title: '4. Proměna role učitele: Přesun zodpovědnosti na žáka',
      short: 'Od předavatele hotových faktů k průvodci a mentorovi.',
      detail:
        'Učitel již není jediným zdrojem informací. Role učitele se mění v designéra učebního prostředí, který klade dobré otázky, poskytuje formativní zpětnou vazbu a vede žáka k převzetí odpovědnosti za vlastní učení.',
      color: 'border-purple-200 bg-purple-50/70',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          Nároky a diferenciace
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s16_title" defaultText="Témata k diskusi: Odpovědnost a volba žáka" />
        </h2>
      </div>

      {/* Accordion Topics List */}
      <div className="space-y-2.5 sm:space-y-3.5 my-auto max-w-4xl mx-auto w-full py-2 sm:py-4">
        {topics.map((t, idx) => {
          const Icon = t.icon;
          const isOpen = openIndex === idx;

          return (
            <div
              key={t.id}
              className={`rounded-3xl border-2 transition-all overflow-hidden ${t.color}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-3.5 sm:p-4 md:p-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 bg-white rounded-2xl shadow-2xs shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gml-slate-900" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold font-display text-gml-slate-900">
                      <EditableText id={`s16_${t.id}_title`} defaultText={t.title} />
                    </h3>
                    <p className="text-xs text-gray-500 font-medium hidden sm:block">{t.short}</p>
                  </div>
                </div>

                <div className="p-1.5 sm:p-2 bg-white/80 rounded-xl text-gray-700 shrink-0 ml-2">
                  {isOpen ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-gml-slate-800 leading-relaxed border-t border-black/5 bg-white/70 font-medium animate-fade-in">
                  <EditableText id={`s16_${t.id}_detail`} defaultText={t.detail} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="p-3.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs sm:text-sm font-semibold text-gml-slate-800">
        Diferenciace neznamená mít 30 různých příprav, ale nabídnout žákům různé cesty k dosažení cíle.
      </div>
    </div>
  );
};
