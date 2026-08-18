import React, { useState, useEffect } from 'react';
import { SLIDES_REGISTRY } from './slides';
import { RiverProgressBar } from './components/Navigation/RiverProgressBar';
import { SlideDrawer } from './components/Navigation/SlideDrawer';
import { AdminEditProvider } from './context/AdminEditContext';
import { MobileVoteView } from './components/ModuleA/MobileVoteView';

export const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#/slide/')) {
        const slideNum = parseInt(hash.replace('#/slide/', ''), 10);
        if (!isNaN(slideNum) && slideNum >= 0 && slideNum < SLIDES_REGISTRY.length) {
          return slideNum;
        }
      }
    }
    return 0;
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMobileVoteRoute, setIsMobileVoteRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash.startsWith('#/vote');
    }
    return false;
  });

  // Listen to hash changes for direct deep-linking & mobile voter route
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
        if (window.location.hash !== `#/slide/${currentSlideIndex}`) {
          window.history.replaceState(null, '', `#/slide/${currentSlideIndex}`);
        }
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
      const target = (e.target || document.activeElement) as HTMLElement;
      if (
        target &&
        (['INPUT', 'TEXTAREA'].includes(target.tagName) ||
          target.isContentEditable ||
          target.getAttribute('contenteditable') === 'true' ||
          target.closest('[contenteditable="true"]'))
      ) {
        return; // Ignore presentation shortcuts when user is typing text
      }

      if (
        e.key === 'ArrowRight' ||
        e.key === 'PageDown' ||
        e.key === 'ArrowDown' ||
        e.key === ' ' ||
        e.code === 'Space' ||
        e.key === 'Enter'
      ) {
        e.preventDefault();
        goToNextSlide();
      } else if (
        e.key === 'ArrowLeft' ||
        e.key === 'PageUp' ||
        e.key === 'ArrowUp'
      ) {
        e.preventDefault();
        goToPrevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(SLIDES_REGISTRY.length - 1);
      } else if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.altKey && !e.metaKey) {
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

        {/* Expansive Presentation Viewport - Sized for Widescreen Height */}
        <main className="flex-1 w-full min-h-[calc(100dvh-56px)] md:h-[calc(100dvh-60px)] pb-14 md:pb-16 relative flex items-center justify-center p-1.5 sm:p-3 md:p-4">
          <div className="w-full max-w-[1560px] h-full min-h-[600px] max-h-[960px] bg-white rounded-2xl md:rounded-3xl border border-gray-200/90 shadow-xl shadow-slate-900/5 overflow-y-auto md:overflow-hidden flex flex-col transition-all duration-300">
            <div className="w-full h-full flex-1 flex flex-col">
              <SlideComponent onNext={goToNextSlide} />
            </div>
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
          slides={SLIDES_REGISTRY}
          currentSlideIndex={currentSlideIndex}
          onSelectSlide={(index) => {
            goToSlide(index);
            setIsDrawerOpen(false);
          }}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>
    </AdminEditProvider>
  );
};
