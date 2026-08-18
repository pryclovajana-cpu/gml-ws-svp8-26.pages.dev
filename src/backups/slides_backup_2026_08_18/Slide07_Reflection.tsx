import React from 'react';
import { StickyNote } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide07_Reflection: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-16 select-none relative overflow-hidden bg-white max-w-[1700px] mx-auto">
      {/* Subtle organic light accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gml-green-50/50 rounded-full blur-3xl -z-10" />

      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          Společná reflexe
        </span>
      </div>

      {/* Dominant Centered Question */}
      <div className="my-auto text-center space-y-6 sm:space-y-8 max-w-5xl mx-auto py-8">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display text-gml-slate-900 leading-[1.1] tracking-tight">
          <EditableText id="s7_main_question" defaultText="Jaké by mělo Vaše nové ŠVP být?" />
        </h1>

        <div className="w-32 h-2 bg-gradient-to-r from-gml-green-500 via-gml-yellow-400 to-gml-river-500 rounded-full mx-auto" />
      </div>

      {/* Workshop Activity Instruction Banner */}
      <div className="p-4 sm:p-6 bg-gml-yellow-50 border border-gml-yellow-300 rounded-3xl flex items-center justify-between gap-4 max-w-3xl mx-auto w-full shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-3 bg-gml-yellow-400 text-gml-slate-900 rounded-2xl shrink-0">
            <StickyNote className="w-6 h-6" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-gml-yellow-800 uppercase tracking-wider">
              Aktivita v sále
            </span>
            <span className="text-sm sm:text-base font-semibold text-gml-slate-900 leading-snug">
              Napište 3 klíčová přídavná jména na papírové lístky a vlepte na sdílenou tabuli.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
