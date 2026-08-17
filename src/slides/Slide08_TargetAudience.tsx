import React, { useState } from 'react';
import { Users, GraduationCap, Building2, ChevronRight, Eye } from 'lucide-react';
import { EditableText, useAdminEdit } from '../context/AdminEditContext';

export const Slide08_TargetAudience: React.FC = () => {
  const { isAdminMode } = useAdminEdit();

  // Card 3 starts hidden (or each card can be toggled by clicking)
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({
    t1: true,
    t2: true,
    t3: false, // Hidden until clicked
  });

  const toggleCard = (id: string) => {
    setRevealedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const targets = [
    {
      id: 't1',
      icon: Users,
      title: 'Pro učitele?',
      color: 'border-gml-green-300 bg-gml-green-50/70',
      points: [
        'Jasná a srozumitelná opora pro každodenní výuku',
        'Metodická svoboda při zachování společného smyslu',
        'Efektivnější mezipředmětová spolupráce',
        'Méně formální byrokracie, více reálného učení',
      ],
    },
    {
      id: 't2',
      icon: GraduationCap,
      title: 'Pro žáky?',
      color: 'border-gml-yellow-300 bg-gml-yellow-50/70',
      points: [
        'Smysluplné vzdělávání propojené s reálným světem',
        'Podpora individuálního nadání',
        'Spravedlivá a motivující zpětná vazba',
        'Plynulý přechod mezi nižším a vyšším stupněm',
      ],
    },
    {
      id: 't3',
      icon: Building2,
      title: 'Pro koho ještě?',
      color: 'border-blue-300 bg-blue-50/70',
      points: [
        'Rodiče (Jasná komunikace cílů a očekávání školy)',
        'Vedení školy & ČŠI (Kvalitní a obhajitelný koncepční dokument)',
        'Vysoké školy & Budoucí zaměstnavatelé (Klíčové kompetence 21. století)',
      ],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          <EditableText id="s8_badge" defaultText="Cílová skupina ŠVP" />
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s8_title" defaultText="Komu má nový ŠVP primárně sloužit?" />
        </h2>
      </div>

      {/* Interactive Mind Map Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 my-auto items-stretch py-2 sm:py-4">
        {targets.map((t) => {
          const Icon = t.icon;
          // In admin mode, automatically show all cards so everything is editable
          const isRevealed = isAdminMode || revealedCards[t.id];

          return (
            <div
              key={t.id}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.isContentEditable || target.closest('[contenteditable="true"]')) {
                  return;
                }
                toggleCard(t.id);
              }}
              className={`p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-lg min-h-[220px] sm:min-h-[280px] ${
                t.color
              } ${isRevealed ? 'shadow-sm' : 'hover:scale-[1.01]'}`}
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 sm:p-3 bg-white rounded-2xl shadow-2xs">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gml-slate-900" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold font-display text-gml-slate-900">
                  <EditableText id={`s8_${t.id}_title`} defaultText={t.title} />
                </h3>

                {isRevealed ? (
                  <ul className="space-y-2.5 sm:space-y-3 pt-1 animate-fade-in">
                    {t.points.map((pt, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-start gap-2 text-xs sm:text-sm text-gml-slate-800 font-medium leading-relaxed"
                      >
                        <ChevronRight className="w-4 h-4 text-gml-green-600 shrink-0 mt-0.5" />
                        <span>
                          <EditableText id={`s8_${t.id}_point_${pIdx}`} defaultText={pt} />
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 sm:py-12 flex items-center justify-center text-center border-2 border-dashed border-gray-300/80 rounded-2xl bg-white/40 hover:bg-white/70 transition-all">
                    <Eye className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Takeaway */}
      <div className="p-3.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs sm:text-sm font-semibold text-gml-slate-800">
        <EditableText
          id="s8_bottom_takeaway"
          defaultText="ŠVP není byrokratický výkaz pro inspekci, ale živá dohoda celého školního společenství."
        />
      </div>
    </div>
  );
};
