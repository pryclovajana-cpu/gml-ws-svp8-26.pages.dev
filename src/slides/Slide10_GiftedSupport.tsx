import React, { useState } from 'react';
import { CheckSquare, Square, X, BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide10_GiftedSupport: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    c1: true,
    c2: true,
    c3: false,
    c4: true,
    c5: false,
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  const checklist = [
    { id: 'c1', text: 'Gradace náročnosti úloh (Základní -> Rozšiřující -> Výzva)' },
    { id: 'c2', text: 'Možnost volby vlastního tempa a hloubky zpracování témat' },
    { id: 'c3', text: 'Propojování teorie s badatelskou výukou a projekty' },
    { id: 'c4', text: 'Pravidelné zařazování otevřených úloh bez jednoho správného řešení' },
    { id: 'c5', text: 'Formativní zpětná vazba zaměřená na osobní pokrok a pokus/omyl' },
  ];

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          <EditableText id="s10_badge" defaultText="Podpora nadání v ŠVP" />
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s10_title" defaultText="Checklist pro sborovnu: Co si můžeme dovolit a chtít?" />
        </h2>
      </div>

      {/* Grid: Left Checklist & Right Modal Trigger */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 my-auto py-2 sm:py-4">
        {/* Left Column: Interactive Checklist */}
        <div className="md:col-span-7 bg-white p-4 sm:p-6 rounded-3xl border border-gml-green-200 shadow-sm space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-bold font-display text-gml-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gml-green-600 shrink-0" />
            <EditableText id="s10_checklist_heading" defaultText="Standardy pro výuku na GML 8G" />
          </h3>

          <div className="space-y-2 sm:space-y-3">
            {checklist.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.isContentEditable || target.closest('[contenteditable="true"]')) {
                      return;
                    }
                    toggleCheck(item.id);
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isChecked
                      ? 'bg-gml-green-50/80 border-gml-green-300 text-gml-slate-900'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-gml-green-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-semibold leading-snug">
                    <EditableText id={`s10_${item.id}`} defaultText={item.text} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Good Practice Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-gml-yellow-100/60 via-gml-yellow-50 to-white p-4 sm:p-6 rounded-3xl border border-gml-yellow-300 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-gml-yellow-300 text-gml-slate-900 text-[10px] font-extrabold rounded-full uppercase tracking-wider inline-block">
              <EditableText id="s10_practice_badge" defaultText="Inspirace z praxe" />
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-display text-gml-slate-900">
              <EditableText id="s10_practice_title" defaultText="Ukázka dobré praxe" />
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              <EditableText
                id="s10_practice_desc"
                defaultText="Osvědčený model podpory mimořádně nadaných žáků, mezipředmětových bloků a individuálních studijních plánů."
              />
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 bg-gml-yellow-400 text-gml-slate-900 font-extrabold text-xs rounded-2xl hover:bg-gml-yellow-300 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" /> Zobrazit ukázku dobré praxe
          </button>
        </div>
      </div>

      {/* Modal Dialog with Exact Authentic Good Practice Text */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gml-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-gml-green-200 p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg sm:text-xl font-extrabold font-display text-gml-slate-900">
                <EditableText id="s10_modal_heading" defaultText="Příklad dobré praxe:" />
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="space-y-4 text-xs sm:text-sm text-gml-slate-900 leading-relaxed">
              <h4 className="text-base sm:text-lg font-black font-display text-gml-slate-900">
                <EditableText id="s10_modal_subheading" defaultText="Žáci nadaní a mimořádně nadaní" />
              </h4>

              <p className="font-medium text-gray-700">
                <EditableText
                  id="s10_modal_lead"
                  defaultText="U nadaných žáků směřuje hodnocení k tomu, aby si zachovali vztah k učení a ochotu jít do náročných úkolů. Proto:"
                />
              </p>

              <ul className="space-y-2.5 pl-1">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gml-green-600 shrink-0 mt-2" />
                  <span>
                    <EditableText
                      id="s10_modal_pt1"
                      defaultText="hodnotíme i náročnější varianty zadání, na kterých žák pracoval, nikoli jen splnění základní úrovně,"
                    />
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gml-green-600 shrink-0 mt-2" />
                  <span>
                    <EditableText
                      id="s10_modal_pt2"
                      defaultText="oceňujeme postup, originalitu řešení a ochotu riskovat neúspěch, ne pouze bezchybný výkon,"
                    />
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gml-green-600 shrink-0 mt-2" />
                  <span>
                    <EditableText
                      id="s10_modal_pt3"
                      defaultText="vedeme žáka k tomu, aby si stanovoval vlastní cíle nad rámec kritérií třídy, a hodnotíme jejich naplnění,"
                    />
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gml-green-600 shrink-0 mt-2" />
                  <span>
                    <EditableText
                      id="s10_modal_pt4"
                      defaultText="u mimořádně nadaných žáků s IVP se hodnocení vztahuje k cílům stanoveným v tomto plánu."
                    />
                  </span>
                </li>
              </ul>

              <p className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs sm:text-sm font-medium text-gml-slate-800 leading-relaxed">
                <EditableText
                  id="s10_modal_note"
                  defaultText="Zvláštní pozornost věnujeme nadaným žákům s vysokou citlivostí a dvojí výjimečností — hodnocení u nich nesmí vytvářet tlak, který by prohluboval úzkost nebo vedl k vyhýbání se náročným úkolům."
                />
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-gml-green-600 text-white font-bold text-xs rounded-xl hover:bg-gml-green-700 cursor-pointer shadow-sm transition-all"
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
