import React, { useState } from 'react';
import { Send, MessageSquarePlus, ShieldCheck } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide17_LeadershipFeedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<string[]>([
    'Více společného času pro setkávání předmětových komisí během školního roku.',
    'Metodickou podporu při formulaci nových očekávaných výstupů učení (OVU).',
    'Jasný harmonogram a garanci, že ŠVP nebude příliš často administrativně měněno.',
    'Snížení úvazku či finanční ohodnocení pro koordinátory tvorby ŠVP.',
  ]);

  const [inputVal, setInputVal] = useState('');

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setFeedbackList([inputVal.trim(), ...feedbackList]);
    setInputVal('');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-yellow-700 block">
          Zpětná vazba pro vedení
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display text-gml-slate-900 leading-snug">
          <EditableText
            id="s17_title"
            defaultText="Co bych já konkrétně potřeboval/a pro to, abych se cítil/a o trochu motivovanější k práci na novém ŠVP?"
          />
        </h2>
      </div>

      {/* Interactive Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 my-auto py-2 sm:py-4">
        {/* Left Column: Interactive Input Form */}
        <div className="md:col-span-5 bg-white p-4 sm:p-6 rounded-3xl border border-gml-green-200 shadow-sm flex flex-col justify-between space-y-3 sm:space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-gml-green-700">
              <MessageSquarePlus className="w-5 h-5" />
              <h3 className="font-display font-bold text-base sm:text-lg text-gml-slate-900">
                Přidat podnět pro vedení
              </h3>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Zadejte konkrétní požadavek nebo přání k podpoře pro pana ředitele a vedení GML.
            </p>
          </div>

          <form onSubmit={handleAddFeedback} className="space-y-3">
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Napište např.: Čas na hospitace, školení k AI, metodika..."
              rows={3}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gml-green-500 focus:bg-white transition-all resize-none"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-full py-2.5 sm:py-3 bg-gml-green-600 text-white font-bold text-xs rounded-2xl hover:bg-gml-green-700 disabled:opacity-40 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" /> Přidat podnět na board
            </button>
          </form>
        </div>

        {/* Right Column: Moderated Collection Board */}
        <div className="md:col-span-7 bg-gradient-to-br from-gml-yellow-50/70 via-white to-gml-green-50/50 p-4 sm:p-6 rounded-3xl border border-gml-yellow-300 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-gml-slate-900 text-sm sm:text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-gml-yellow-600 shrink-0" />
              <span>Sběrná plocha podnětů ({feedbackList.length})</span>
            </h3>
            <span className="text-[10px] font-bold text-gml-yellow-800 bg-gml-yellow-200 px-2 py-0.5 rounded-full uppercase">
              Moderováno
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-2.5 max-h-[220px] sm:max-h-[280px] pr-1">
            {feedbackList.map((item, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:shadow-xs transition-all flex items-start gap-2.5 sm:gap-3"
              >
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gml-yellow-100 text-gml-yellow-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-gml-slate-800 font-medium leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="p-3.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs sm:text-sm font-semibold text-gml-slate-800">
        Všechny podněty budou shrnuty a předány vedení školy k další práci.
      </div>
    </div>
  );
};
