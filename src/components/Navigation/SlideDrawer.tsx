import React, { useState } from 'react';
import { X, Search, CheckCircle, Sparkles } from 'lucide-react';
import { SlideData } from '../../types';

interface SlideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideData[];
  currentSlide: number;
  onSelectSlide: (index: number) => void;
}

export const SlideDrawer: React.FC<SlideDrawerProps> = ({
  isOpen,
  onClose,
  slides,
  currentSlide,
  onSelectSlide,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredSlides = slides.filter(
    (slide) =>
      slide.title.toLowerCase().includes(search.toLowerCase()) ||
      slide.chapter.toLowerCase().includes(search.toLowerCase()) ||
      `slide ${slide.number}`.includes(search.toLowerCase())
  );

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
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Hledat v tématech a slidech..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gml-green-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Slide list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredSlides.map((slide, index) => {
              const actualIndex = slides.findIndex((s) => s.id === slide.id);
              const isActive = actualIndex === currentSlide;

              return (
                <button
                  key={slide.id}
                  onClick={() => {
                    onSelectSlide(actualIndex);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-gml-green-50 border-gml-green-300 shadow-sm'
                      : 'bg-white border-gray-100 hover:border-gml-green-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isActive
                          ? 'bg-gml-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gml-green-100 group-hover:text-gml-green-700'
                      }`}
                    >
                      {slide.number === 0 ? 'Úvod' : slide.number}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gml-green-700 uppercase tracking-wider">
                        {slide.chapter}
                      </span>
                      <span
                        className={`text-sm font-semibold truncate max-w-[240px] ${
                          isActive ? 'text-gml-green-900' : 'text-gml-slate-800'
                        }`}
                      >
                        {slide.title}
                      </span>
                    </div>
                  </div>

                  {isActive && <CheckCircle className="w-5 h-5 text-gml-green-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
            Gymnázium Matyáše Lercha • 25. 8. 2026
          </div>
        </div>
      </div>
    </div>
  );
};
