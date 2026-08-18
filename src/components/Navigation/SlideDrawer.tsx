import React, { useState } from 'react';
import { X, Search, CheckCircle, Sparkles, Folder } from 'lucide-react';
import { SlideData } from '../../types';

interface SlideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideData[];
  currentSlideIndex?: number;
  currentSlide?: number;
  onSelectSlide: (index: number) => void;
}

export const SlideDrawer: React.FC<SlideDrawerProps> = ({
  isOpen,
  onClose,
  slides,
  currentSlideIndex,
  currentSlide,
  onSelectSlide,
}) => {
  const [search, setSearch] = useState('');
  const activeSlideIndex = currentSlideIndex !== undefined ? currentSlideIndex : (currentSlide || 0);

  if (!isOpen) return null;

  const filteredSlides = slides.filter(
    (slide) =>
      slide.title.toLowerCase().includes(search.toLowerCase()) ||
      slide.chapter.toLowerCase().includes(search.toLowerCase()) ||
      `slide ${slide.number}`.includes(search.toLowerCase())
  );

  // Group slides by chapter for clear structured hierarchy
  const chaptersMap: { [chapter: string]: SlideData[] } = {};
  filteredSlides.forEach((slide) => {
    if (!chaptersMap[slide.chapter]) {
      chaptersMap[slide.chapter] = [];
    }
    chaptersMap[slide.chapter].push(slide);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gml-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-r border-gml-green-100">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gml-green-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gml-green-600" />
              <h2 className="font-display font-bold text-lg text-gml-slate-900">
                Přehled programu workshopu
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Hledat v tématech a slidech..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gml-green-500 transition-all shadow-2xs font-medium"
              />
            </div>
          </div>

          {/* Slide list grouped by Chapter */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.keys(chaptersMap).map((chapterName) => {
              const chapterSlides = chaptersMap[chapterName];
              return (
                <div key={chapterName} className="space-y-1.5">
                  {/* Chapter Section Title */}
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg text-[11px] font-black text-gml-green-800 uppercase tracking-wider">
                    <Folder className="w-3.5 h-3.5 text-gml-green-600" />
                    <span>{chapterName}</span>
                  </div>

                  {/* Chapter Slides */}
                  <div className="space-y-1.5 pl-1">
                    {chapterSlides.map((slide) => {
                      const actualIndex = slides.findIndex((s) => s.id === slide.id);
                      const isActive = actualIndex === activeSlideIndex;

                      return (
                        <button
                          key={slide.id}
                          onClick={() => {
                            onSelectSlide(actualIndex);
                            onClose();
                          }}
                          className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                            isActive
                              ? 'bg-gml-green-50 border-gml-green-400 shadow-sm ring-1 ring-gml-green-400'
                              : 'bg-white border-gray-100 hover:border-gml-green-200 hover:bg-gray-50/80'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                                isActive
                                  ? 'bg-gml-green-600 text-white shadow-2xs'
                                  : 'bg-gray-100 text-gray-600 group-hover:bg-gml-green-100 group-hover:text-gml-green-700'
                              }`}
                            >
                              {slide.number === 0 ? 'Úvod' : slide.number}
                            </span>
                            <span
                              className={`text-xs sm:text-sm font-bold truncate max-w-[240px] ${
                                isActive ? 'text-gml-green-950 font-extrabold' : 'text-gml-slate-800'
                              }`}
                            >
                              {slide.title}
                            </span>
                          </div>

                          {isActive && <CheckCircle className="w-4 h-4 text-gml-green-600 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-3.5 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500 font-medium">
            Gymnázium Matyáše Lercha • 25. 8. 2026
          </div>
        </div>
      </div>
    </div>
  );
};
