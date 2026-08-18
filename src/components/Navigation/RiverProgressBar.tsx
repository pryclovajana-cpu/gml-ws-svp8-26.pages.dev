import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, Maximize2, Minimize2, Edit3, Check, Copy, CheckCheck } from 'lucide-react';
import { useAdminEdit } from '../../context/AdminEditContext';

interface RiverProgressBarProps {
  currentSlide: number;
  totalSlides: number;
  chapterTitle?: string;
  slideTitle?: string;
  onPrev: () => void;
  onNext: () => void;
  onOpenDrawer: () => void;
}

export const RiverProgressBar: React.FC<RiverProgressBarProps> = ({
  currentSlide,
  totalSlides,
  chapterTitle,
  slideTitle,
  onPrev,
  onNext,
  onOpenDrawer,
}) => {
  const { isAdminMode, toggleAdminMode, getAllEditsJson, hasEdits } = useAdminEdit();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const copyEdits = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(getAllEditsJson());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      alert('Zkopírováno: ' + getAllEditsJson());
    }
  };

  const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg select-none transition-all">
      {/* Top River Progress Fill Line */}
      <div className="w-full h-1 sm:h-1.5 bg-gray-100 relative overflow-hidden">
        <div
          className="h-full river-animated-bg transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 md:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 relative min-h-[56px] sm:min-h-[60px]">
        {/* Left: Chapter / Menu Button & Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[calc(50%-110px)]">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gray-100 hover:bg-gml-green-50 text-gml-slate-800 hover:text-gml-green-800 transition-all font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[38px] sm:min-h-[42px]"
            title="Otevřít přehled všech kapitol (M)"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden md:inline font-display">Kapitoly</span>
          </button>

          <div className="hidden sm:flex flex-col text-left min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-gml-green-700 uppercase tracking-widest truncate">
              {chapterTitle || 'ŠVP GML'}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-gml-slate-900 truncate">
              {slideTitle || 'Prezentace'}
            </span>
          </div>
        </div>

        {/* Center: Slide Arrows & Number Counter (ABSOLUTE 100% SCREEN CENTER LOCK) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3 shrink-0 pointer-events-auto z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            disabled={currentSlide === 0}
            className="p-2 sm:p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-gml-slate-900 transition-all min-h-[38px] sm:min-h-[42px]"
            title="Předchozí slide (Klávesa Doleva)"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono font-black text-gml-slate-900 min-w-[68px] sm:min-w-[84px] text-center shadow-2xs">
            {currentSlide + 1} / {totalSlides}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            disabled={currentSlide === totalSlides - 1}
            className="p-2 sm:p-2.5 rounded-xl bg-gml-green-600 text-white hover:bg-gml-green-700 active:bg-gml-green-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all shadow-md min-h-[38px] sm:min-h-[42px]"
            title="Následující slide (Klávesa Doprava / Mezerník)"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Right: Fullscreen & Live edit toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 max-w-[calc(50%-110px)] justify-end">
          {isAdminMode && hasEdits && (
            <button
              type="button"
              onClick={copyEdits}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold min-h-[38px] sm:min-h-[42px] shadow-sm ${
                copied
                  ? 'bg-gml-green-600 text-white'
                  : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
              }`}
              title="Zkopírovat všechny změněné texty do schránky pro trvalý zápis na GitHub"
            >
              {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Zkopírováno!' : 'Kopírovat pro GitHub'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleAdminMode();
            }}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold min-h-[38px] sm:min-h-[42px] ${
              isAdminMode
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title={isAdminMode ? 'Ukončit režim úprav textů' : 'Zapnout režim živých úprav textů'}
          >
            {isAdminMode ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span className="hidden lg:inline">{isAdminMode ? 'Uložit' : 'Upravit'}</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 sm:p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer hidden sm:flex min-h-[38px] sm:min-h-[42px] items-center justify-center"
            title="Celá obrazovka"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </footer>
  );
};
