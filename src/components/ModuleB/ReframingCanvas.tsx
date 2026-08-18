import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { EditableText } from '../../context/AdminEditContext';

export const ReframingCanvas: React.FC = () => {
  const [isSunny, setIsSunny] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle floating particles canvas (Rain drops or Sun motes / Dandelion seeds)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isMounted = true;

    const updateSize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    updateSize();

    // Rain particles
    const rainDrops = Array.from({ length: 60 }, () => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 700),
      len: Math.random() * 20 + 10,
      speed: Math.random() * 4.5 + 3,
      alpha: Math.random() * 0.35 + 0.15,
    }));

    // Floating sunny pollen / seeds
    const sunSeeds = Array.from({ length: 40 }, () => ({
      x: Math.random() * (canvas.width || 1200),
      y: Math.random() * (canvas.height || 700),
      radius: Math.random() * 2.5 + 1.2,
      vx: Math.random() * 0.6 + 0.25,
      vy: -(Math.random() * 0.5 + 0.2),
      alpha: Math.random() * 0.55 + 0.2,
    }));

    const render = () => {
      if (!isMounted) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isSunny) {
        // Draw gentle rain streaks
        ctx.lineWidth = 1.2;
        rainDrops.forEach((d) => {
          ctx.strokeStyle = `rgba(100, 116, 139, ${d.alpha})`;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 3, d.y + d.len);
          ctx.stroke();

          d.y += d.speed;
          d.x -= 0.6;
          if (d.y > canvas.height) {
            d.y = -20;
            d.x = Math.random() * canvas.width;
          }
        });
      } else {
        // Draw golden drifting dandelion motes
        sunSeeds.forEach((s) => {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(234, 179, 8, ${s.alpha})`;
          ctx.fill();

          s.x += s.vx;
          s.y += s.vy;
          if (s.y < -10) s.y = canvas.height + 10;
          if (s.x > canvas.width + 10) s.x = -10;
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    window.addEventListener('resize', updateSize);
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
    };
  }, [isSunny]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none relative bg-white overflow-hidden max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 z-20">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
            <EditableText id="s5_title" defaultText="Přerámování obav" />
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            <EditableText
              id="s5_subtitle"
              defaultText="Kliknutím na obraz proměníte atmosféru – od deštivé skepse k rozkvetlé příležitosti"
            />
          </p>
        </div>

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsSunny(!isSunny)}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer border shrink-0 self-start sm:self-auto ${
            isSunny
              ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              : 'bg-gml-green-600 text-white border-gml-green-700 hover:bg-gml-green-700'
          }`}
        >
          {isSunny ? (
            <>
              <RefreshCcw className="w-4 h-4 text-amber-700" /> Vrátit déšť
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Rozsvítit slunce
            </>
          )}
        </button>
      </div>

      {/* Main Pure Interactive Picture Frame - Expands for Large Screens */}
      <div className="relative flex-1 w-full my-auto flex items-center justify-center py-4 z-10">
        <div
          onClick={() => setIsSunny(!isSunny)}
          className={`group relative w-full max-w-6xl h-[420px] sm:h-[500px] lg:h-[580px] rounded-3xl p-4 cursor-pointer transition-all duration-1000 flex items-center justify-center overflow-hidden border shadow-lg hover:shadow-xl ${
            isSunny
              ? 'bg-gradient-to-b from-amber-50/40 via-white to-gml-green-50/30 border-amber-200/80 shadow-amber-500/10'
              : 'bg-gradient-to-b from-slate-50 via-white to-slate-100/50 border-slate-200 shadow-slate-900/5'
          }`}
        >
          {/* Canvas Floating Particle Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* Line Art Drawings Crossfade (Pure Art) */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 pointer-events-none">
            {/* Rainy Meadow Line Art */}
            <img
              src="/images/reframing_rain.png"
              alt="Louka v dešti"
              className={`w-full h-full object-contain transition-all duration-1000 ${
                isSunny ? 'opacity-0 scale-95' : 'opacity-90 scale-100'
              }`}
            />
            {/* Sunny Blooming Meadow Line Art */}
            <img
              src="/images/reframing_sun.png"
              alt="Rozkvetlá louka v záři slunce"
              className={`absolute inset-0 w-full h-full object-contain p-4 md:p-8 transition-all duration-1000 ${
                isSunny ? 'opacity-95 scale-100' : 'opacity-0 scale-105'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
