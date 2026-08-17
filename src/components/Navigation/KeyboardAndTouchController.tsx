import React, { useEffect, useRef } from 'react';

interface KeyboardAndTouchControllerProps {
  onPrev: () => void;
  onNext: () => void;
  onToggleDrawer?: () => void;
  onCloseDrawer?: () => void;
  children: React.ReactNode;
}

export const KeyboardAndTouchController: React.FC<KeyboardAndTouchControllerProps> = ({
  onPrev,
  onNext,
  onToggleDrawer,
  onCloseDrawer,
  children,
}) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore navigation key triggers if user is actively typing inside an input/textarea
      const target = e.target as HTMLElement;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.getAttribute('contenteditable') === 'true');

      if (isTyping) {
        // If Escape is pressed while typing, blur out
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      // Next slide shortcuts: ArrowRight, ArrowDown, Space, PageDown, Enter
      if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        e.key === ' ' ||
        e.code === 'Space' ||
        e.key === 'PageDown'
      ) {
        e.preventDefault();
        onNext();
      }
      // Previous slide shortcuts: ArrowLeft, ArrowUp, PageUp, Backspace
      else if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp' ||
        e.key === 'PageUp' ||
        e.key === 'Backspace'
      ) {
        e.preventDefault();
        onPrev();
      }
      // Drawer / Menu toggle shortcut: 'm' or 'M'
      else if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        onToggleDrawer?.();
      }
      // Close drawer shortcut: Escape
      else if (e.key === 'Escape') {
        onCloseDrawer?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [onNext, onPrev, onToggleDrawer, onCloseDrawer]);

  // Touch Swipe Handlers for mobile & interactive touch monitors
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Ensure horizontal swipe is dominant and above threshold (40px)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        onNext(); // Swiped left -> Go next slide
      } else {
        onPrev(); // Swiped right -> Go prev slide
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full"
    >
      {children}
    </div>
  );
};
