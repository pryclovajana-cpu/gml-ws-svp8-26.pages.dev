import React from 'react';
import { ChevronLeft, ChevronRight, Menu, Maximize2, Minimize2, Edit3, Check } from 'lucide-react';
import { useAdminEdit } from '../../context/AdminEditContext';

interface RiverProgressBarProps {
  currentSlide: number;
  totalSlides: number;
  chapterTitle: string;
  slideTitle: string;
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
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const { isAdminMode, toggleAdminMode } = useAdminEdit();

  const progressPercent = ((currentSlide + 1) / totalSlides) * 100;

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 px-2 sm:px-4 py-2 sm:py-3 bg-white/95 backdrop-blur-md border-t border-gml-green-100 shadow-2xl select-none">
      {/* Top thin flowing river progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gml-green-600 via-gml-yellow-500 to-gml-river-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Drawer button & Chapter badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDrawer();
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-gml-green-50 text-gml-green-700 hover:bg-gml-green-100 active:bg-gml-green-200 transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm shadow-2xs min-h-[38px] sm:min-h-[42px]"
            title="Přehled slidů / Menu (Klávesa M)"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline sm:inline">Kapitoly</span>
          </button>

          <div className="hidden md:flex flex-col">
            <span className="text-[10px] font-bold tracking-widest text-gml-green-700 uppercase">
              {chapterTitle}
            </span>
            <span className="text-xs font-semibold text-gml-slate-800 truncate max-w-xs">
              {slideTitle}
            </span>
          </div>
        </div>

        {/* Center: Slide counter & Navigation controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            disabled={currentSlide === 0}
            className="p-2 sm:p-2.5 rounded-xl bg-gray-100 text-gml-slate-800 hover:bg-gml-green-100 hover:text-gml-green-800 active:bg-gml-green-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all shadow-2xs min-h-[38px] sm:min-h-[42px]"
            title="Předchozí slide (Klávesa Doleva / Nahoru)"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="px-2.5 sm:px-3 py-1 bg-gml-green-50 border border-gml-green-200 rounded-lg text-xs sm:text-xs font-extrabold text-gml-green-800 tracking-wide font-mono shrink-0">
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
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleAdminMode();
            }}
            className={`p-2 sm:p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold min-h-[38px] sm:min-h-[42px] ${
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
