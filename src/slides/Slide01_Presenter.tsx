import React from 'react';
import { EditableText } from '../context/AdminEditContext';

export const Slide01_Presenter: React.FC = () => {
  const leftMilestones = [
    {
      id: 'l0',
      badge: 'Vzdělání',
      title: 'PedF Univerzity Karlovy',
      desc: 'Speciální pedagogika, psychologie a systematický rozvoj nadání a talentu.',
    },
    {
      id: 'l1',
      badge: 'Revize RVP',
      title: 'NPI ČR',
      desc: 'Účast na revizích RVP ZV a systémové podpoře nadaných žáků v ČR.',
    },
    {
      id: 'l2',
      badge: 'Inovace výuky',
      title: 'Svět vzdělání, z. s.',
      desc: 'Tvorba inovativních výukových metodik a rozvojové programy pro nadané děti.',
    },
  ];

  const rightMilestones = [
    {
      id: 'r1',
      badge: 'Mentoring změn',
      title: 'Mentor ve školách (AFREŠ)',
      desc: 'Provázení školních týmů změnami, nastavením inkluzivní kultury a podporou talentu.',
    },
    {
      id: 'r2',
      badge: 'Živá praxe',
      title: 'Praxe na ZŠ (1 den v týdnu)',
      desc: 'Stálý přímý kontakt se žáky a školní realitou – přístup s „nohama na zemi“.',
    },
    {
      id: 'r3',
      badge: 'Průvodce pro GML',
      title: 'Facilitace nového ŠVP 8G',
      desc: 'Podpora sborovny a předmětových komisí při tvorbě kurikula šitého na míru gymnáziu.',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none relative bg-white">
      {/* Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s1_title" defaultText="Mgr. et Mgr. Jana Pryclová" />
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          <EditableText
            id="s1_subtitle"
            defaultText="Průvodkyně workshopem v souladu s novým RVP ZV a formativním přístupem k rozvoji školy"
          />
        </p>
      </div>

      {/* Main Grid: Left Column (2 sections) | Vertical Divider | Right Column (3 sections) */}
      <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start max-w-6xl w-full mx-auto py-2">
        {/* Left Column: 2 Sections */}
        <div className="md:col-span-5 space-y-6 sm:space-y-8">
          <div className="border-b border-gray-100 pb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gml-green-700">
              <EditableText id="s1_left_col_title" defaultText="Vzdělání a revize RVP" />
            </span>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {leftMilestones.map((m) => (
              <div key={m.id} className="space-y-1.5 border-l-2 border-gml-green-600 pl-4 py-1">
                <span className="text-xs font-bold text-gml-green-700 uppercase tracking-wider block">
                  <EditableText id={`s1_${m.id}_badge`} defaultText={m.badge} />
                </span>
                <h3 className="text-base sm:text-lg font-bold font-display text-gml-slate-900">
                  <EditableText id={`s1_${m.id}_title`} defaultText={m.title} />
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  <EditableText id={`s1_${m.id}_desc`} defaultText={m.desc} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Divider between Left and Right */}
        <div className="hidden md:flex md:col-span-1 justify-center self-stretch">
          <div className="w-px h-full bg-gradient-to-b from-gray-100 via-gml-green-200 to-gray-100 min-h-[260px]" />
        </div>

        {/* Right Column: 3 Sections */}
        <div className="md:col-span-6 space-y-5 sm:space-y-6">
          <div className="border-b border-gray-100 pb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-700">
              <EditableText id="s1_right_col_title" defaultText="Školní praxe & Mentoring" />
            </span>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {rightMilestones.map((m) => (
              <div key={m.id} className="space-y-1.5 border-l-2 border-blue-600 pl-4 py-1">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  <EditableText id={`s1_${m.id}_badge`} defaultText={m.badge} />
                </span>
                <h3 className="text-base sm:text-lg font-bold font-display text-gml-slate-900">
                  <EditableText id={`s1_${m.id}_title`} defaultText={m.title} />
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  <EditableText id={`s1_${m.id}_desc`} defaultText={m.desc} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
