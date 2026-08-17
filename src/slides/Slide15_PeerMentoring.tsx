import React from 'react';
import { ArrowDownUp, UserPlus, HeartHandshake, Shield, Sparkles } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide15_PeerMentoring: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          Přechod mezi stupni
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s15_title" defaultText="Peer-mentoring: Vertikální provázání školy" />
        </h2>
      </div>

      {/* Schema Vertical Coupling Diagram */}
      <div className="my-auto space-y-4 sm:space-y-6 py-2 sm:py-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
          {/* Top Mentor Stage Card */}
          <div className="md:col-span-5 bg-gradient-to-br from-gml-green-600 to-gml-green-700 text-white p-5 sm:p-6 rounded-3xl shadow-lg space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-gml-yellow-300 text-gml-slate-900 text-[10px] font-extrabold rounded-full uppercase">
                Mentorský ročník
              </span>
              <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-gml-yellow-200" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display">
              Kvarta / Kvinta & 1. ročník 4G
            </h3>
            <p className="text-xs sm:text-sm text-gml-green-100 leading-relaxed font-medium">
              Zkušení studenti přebírají roli průvodců. Pomáhají nováčkům s adaptací na školní nároky, orientací v budově i studijními strategiemi.
            </p>
          </div>

          {/* Center Connection Arrow */}
          <div className="md:col-span-2 flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 text-center py-2 md:py-0">
            <div className="p-2.5 sm:p-3 bg-gml-yellow-100 border border-gml-yellow-300 rounded-full text-gml-yellow-800 shadow-sm animate-bounce">
              <ArrowDownUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-gml-green-800">
              Patronát & Podpora
            </span>
          </div>

          {/* Bottom Mentee Stage Card */}
          <div className="md:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border-2 border-gml-green-200 shadow-md space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-gml-green-100 text-gml-green-800 text-[10px] font-extrabold rounded-full uppercase">
                Adaptující se ročník
              </span>
              <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-gml-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-gml-slate-900">
              Primáni & Noví žáci
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              Rychlejší zapadnutí do komunity GML, snížení stresu z přechodu na gymnázium a navázání mezigeneračních přátelství.
            </p>
          </div>
        </div>

        {/* 3 Pillars of Peer Mentoring */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 bg-gml-green-50/60 rounded-2xl border border-gml-green-200 flex items-start gap-3">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gml-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gml-slate-900">Bezpečné klima třídy</h4>
              <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5">Prevence šikany a úzkostí z nových nároků výuky.</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-gml-yellow-50/60 rounded-2xl border border-gml-yellow-300 flex items-start gap-3">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gml-yellow-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gml-slate-900">Rozvoj soft-skills</h4>
              <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5">Starší žáci si trénují empatii, vedení lidí a komunikaci.</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 bg-blue-50/60 rounded-2xl border border-blue-200 flex items-start gap-3">
            <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gml-slate-900">Jednotná kultura GML</h4>
              <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5">Předávání tradic a hodnot gymnázia mezi studenty.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="p-3.5 sm:p-4 bg-white border border-gray-200 rounded-xl text-center text-xs sm:text-sm text-gml-slate-800 font-semibold">
        Peer-mentoring je zakotven přímo v ŠVP jako součást průřezových témat a klíčových kompetencí.
      </div>
    </div>
  );
};
