import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { GmlLogo } from '../components/GmlLogo';
import { EditableText } from '../context/AdminEditContext';

export const Slide20_Conclusion: React.FC = () => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#facc15', '#0ea5e9', '#f472b6'],
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#16a34a', '#facc15', '#0ea5e9', '#f472b6'],
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-14 relative overflow-hidden select-none bg-white">
      {/* Background Artwork Layer */}
      <div className="absolute inset-0 opacity-10 pointer-events-none -z-10 overflow-hidden flex items-center justify-center">
        <img
          src="/images/hero_meadow.png"
          alt=""
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 sm:pb-4">
        <GmlLogo size="md" />
        <span className="text-xs font-semibold text-gray-500 font-mono">
          Gymnázium Matyáše Lercha • 25. 8. 2026
        </span>
      </div>

      {/* Center Hero Conclusion Text */}
      <div className="my-auto max-w-3xl mx-auto text-center space-y-4 sm:space-y-6 py-4">
        <span className="text-xs font-bold text-gml-green-700 uppercase tracking-widest block">
          Poděkování lektorky
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display text-gml-slate-900 leading-tight">
          <EditableText
            id="s20_thank_you"
            defaultText="Děkuji vám za pozornost, energii a otevřenost ke změnám!"
          />
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium max-w-xl mx-auto">
          <EditableText
            id="s20_sub"
            defaultText="Přeji celému pedagogickému sboru GML mnoho inspirace a radosti při tvorbě nového ŠVP 8G."
          />
        </p>
      </div>

      {/* Bottom Contact Linear Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-gray-100 pt-3 sm:pt-4 text-center sm:text-left max-w-4xl mx-auto w-full">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Lektorka</span>
          <span className="text-xs sm:text-sm font-extrabold text-gml-slate-900">
            <EditableText id="s20_name" defaultText="Mgr. et Mgr. Jana Pryclová" />
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Kontakt & Mentoring</span>
          <span className="text-xs font-semibold text-gml-slate-800 font-mono">
            <EditableText id="s20_email" defaultText="jana.pryclova@afres.cz" />
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase block">Web školy</span>
          <span className="text-xs font-semibold text-gml-slate-800 font-mono">
            <EditableText id="s20_web" defaultText="www.gml.cz" />
          </span>
        </div>
      </div>
    </div>
  );
};
