import React, { useState, useEffect } from 'react';
import { SLIDES_REGISTRY } from './slides';
import { RiverProgressBar } from './components/Navigation/RiverProgressBar';
import { SlideDrawer } from './components/Navigation/SlideDrawer';
import { AdminEditProvider } from './context/AdminEditContext';
import { MobileVoteView } from './components/ModuleA/MobileVoteView';

export const App: React.FC = () => {
  // Check if mobile vote view route is active (/#/vote)
  const [isMobileVoteRoute, setIsMobileVoteRoute] = useState<boolean>(() => {
    return window.location.hash.startsWith('#/vote');
  });

  // Read initial slide from URL hash (e.g. #/slide/3) or localStorage
  const getInitialSlideIndex = (): number => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#/slide/')) {
        const slideNum = parseInt(hash.replace('#/slide/', ''), 10);
        if (!isNaN(slideNum) && slideNum >= 0 && slideNum < SLIDES_REGISTRY.length) {
          return slideNum;
        }
      }
      const saved = localStorage.getItem('gml_active_slide_index_v1');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < SLIDES_REGISTRY.length) {
          return parsed;
        }
      }
    } catch (e) {
      // Fallback to slide 0
    }
    return 0;
  };

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(getInitialSlideIndex);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/vote')) {
        setIsMobileVoteRoute(true);
        return;
      }
      setIsMobileVoteRoute(false);

      if (hash.startsWith('#/slide/')) {
        const slideNum = parseInt(hash.replace('#/slide/', ''), 10);
        if (!isNaN(slideNum) && slideNum >= 0 && slideNum < SLIDES_REGISTRY.length) {
          setCurrentSlideIndex(slideNum);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update localStorage and URL hash whenever active slide changes
  useEffect(() => {
    if (!isMobileVoteRoute) {
      try {
        localStorage.setItem('gml_active_slide_index_v1', currentSlideIndex.toString());
        window.location.hash = `#/slide/${currentSlideIndex}`;
      } catch (e) {
        // Ignore storage errors
      }
    }
  }, [currentSlideIndex, isMobileVoteRoute]);

  const currentSlide = SLIDES_REGISTRY[currentSlideIndex] || SLIDES_REGISTRY[0];

  const goToNextSlide = () => {
    if (currentSlideIndex < SLIDES_REGISTRY.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < SLIDES_REGISTRY.length) {
      setCurrentSlideIndex(index);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(SLIDES_REGISTRY.length - 1);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsDrawerOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  // If on mobile voter view route, render the stand-alone voter screen
  if (isMobileVoteRoute) {
    return <MobileVoteView />;
  }

  const SlideComponent = currentSlide.component;

  return (
    <AdminEditProvider>
      <div className="min-h-screen w-full bg-slate-100/70 text-gml-slate-900 flex flex-col font-sans relative overflow-x-hidden antialiased selection:bg-gml-green-100 selection:text-gml-green-900">
        {/* Soft Ambient Glow in Background */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-gml-green-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-gml-yellow-400/5 rounded-full blur-3xl" />
        </div>

        {/* Centered Presentation Viewport - Sized with Light Neutral Backdrop */}
        <main className="flex-1 w-full min-h-[calc(100dvh-64px)] md:h-[calc(100dvh-68px)] pb-18 md:pb-20 relative flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-[1440px] h-full max-h-[880px] bg-white rounded-2xl md:rounded-3xl border border-gray-200/90 shadow-xl shadow-slate-900/5 overflow-y-auto md:overflow-hidden flex flex-col transition-all duration-300">
            <SlideComponent onNext={goToNextSlide} />
          </div>
        </main>

        {/* Bottom River Navigation Bar */}
        <RiverProgressBar
          currentSlide={currentSlideIndex}
          totalSlides={SLIDES_REGISTRY.length}
          chapterTitle={currentSlide.chapter}
          slideTitle={currentSlide.title}
          onPrev={goToPrevSlide}
          onNext={goToNextSlide}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />

        {/* Slide Drawer Overview */}
        <SlideDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          slides={SLIDES_REGISTRY}
          currentSlide={currentSlideIndex}
          onSelectSlide={goToSlide}
        />
      </div>
    </AdminEditProvider>
  );
};
