import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { GmlLogo } from '../components/GmlLogo';
import { EditableText } from '../context/AdminEditContext';

export const Slide00_Title: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 relative overflow-hidden select-none bg-white">
      {/* Top Header - Clean logo on the left */}
      <div className="flex items-center justify-between z-10 border-b border-gray-100 pb-4 sm:pb-5">
        <GmlLogo size="lg" />
      </div>

      {/* Main Grid: Left Stretched Spacious Text & Right Large Line Art Illustration */}
      <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center z-10 py-2 sm:py-4">
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-display text-gml-slate-900 leading-[1.12] sm:leading-[1.08] tracking-tight">
            <EditableText id="slide0_main_heading" defaultText="Tvorba a revize ŠVP 8G:" />
            <br />
            <span className="text-gml-green-700">
              <EditableText id="slide0_sub_heading" defaultText="Příležitost pro moderní výuku a rozvoj nadání" />
            </span>
          </h1>

          <div className="space-y-2 sm:space-y-3 pt-1">
            <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
              <EditableText
                id="slide0_desc"
                defaultText="Úvodní setkání k přípravě ŠVP pro osmileté gymnázium."
              />
            </p>

            {/* Date positioned directly under text */}
            <div className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-bold text-gml-green-800 font-mono pt-1">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gml-green-600" />
              <EditableText id="slide0_date" defaultText="25. 8. 2026" />
            </div>
          </div>
        </div>

        {/* Right side: Responsive Transparent Line Art Meadow Drawing */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
          <img
            src="/images/hero_meadow.png"
            alt="Botanická louka GML"
            className="w-full max-h-[220px] sm:max-h-[320px] md:max-h-[420px] lg:max-h-[520px] object-contain select-none pointer-events-none mix-blend-multiply"
          />
        </div>
      </div>

      {/* Footer Navigation CTA */}
      <div className="flex justify-between items-center z-10 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          Stiskněte <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-[11px]">Mezerník</kbd> pro pokračování
        </span>

        <button
          onClick={onNext}
          className="w-full sm:w-auto px-5 py-2.5 bg-gml-green-600 text-white font-bold text-xs rounded-xl hover:bg-gml-green-700 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          Zahájit prezentaci <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
