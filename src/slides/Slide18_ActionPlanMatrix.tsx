import React from 'react';
import { StickyNote, Sparkles, ArrowRight } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide18_ActionPlanMatrix: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          <EditableText id="s18_badge" defaultText="AKČNÍ PLÁN" />
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s18_title" defaultText="Můj osobní krok pro září" />
        </h2>
      </div>

      {/* Main Spacious Instruction Card */}
      <div className="my-auto py-6 sm:py-10 max-w-4xl mx-auto w-full">
        <div className="bg-gradient-to-br from-gml-green-50/80 via-white to-gml-yellow-50/60 p-8 sm:p-12 md:p-14 rounded-3xl border-2 border-gml-green-300 shadow-lg space-y-6 sm:space-y-8 text-center relative overflow-hidden">
          {/* Subtle Decorative Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-3xl shadow-sm border border-gml-green-200 mx-auto flex items-center justify-center text-gml-green-600">
            <StickyNote className="w-8 h-8 sm:w-10 sm:h-10 text-gml-green-600" />
          </div>

          {/* Main Requested Text */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-lg sm:text-2xl md:text-3xl font-extrabold font-display text-gml-slate-900 leading-snug">
              <EditableText
                id="s18_instruction_1"
                defaultText="Napište si pro sebe aspoň jeden akční krok, který můžete udělat v září v souvislosti s tvorbou nového ŠVP sami."
              />
            </p>
            <div className="pt-2">
              <span className="inline-block px-5 py-2.5 bg-gml-yellow-200/90 text-gml-slate-900 font-extrabold text-sm sm:text-base md:text-lg rounded-2xl shadow-2xs border border-gml-yellow-300">
                <EditableText
                  id="s18_instruction_2"
                  defaultText="Nalepte ho na připravený papír. ✍️"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="p-3.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs sm:text-sm font-semibold text-gml-slate-800">
        <EditableText
          id="s18_bottom_hint"
          defaultText="Každá velká změna začíná jedním konkrétním, splnitelným krokem."
        />
      </div>
    </div>
  );
};
