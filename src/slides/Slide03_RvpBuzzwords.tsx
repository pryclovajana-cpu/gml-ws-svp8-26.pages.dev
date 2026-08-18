import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, Music, Volume2 } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

const ACRONYMS_LIST = [
  'DČD', 'IVP', 'KK', 'MDÚ', 'MŠMT', 'OVU', 'PLPP', 'PT', 'RUP', 'RVP', 'RVP ZV',
  'SŠ', 'SVP', 'ŠPZ', 'ŠVP', 'ŠZ', 'ZG', 'ZŠ', 'ZGC', 'ZGM',
  'KKU', 'KKK', 'KOS', 'KOB', 'KPP', 'KRP', 'KKT', 'KDI',
  'PTP', 'PTS', 'PTU', 'JJK', 'MAT', 'INF', 'CJS', 'CAS', 'GEO', 'CAP', 'UAK', 'CZB', 'CSP'
];

const YOUTUBE_VIDEO_ID = '7TDjW-3Chgs'; // Pokáč - Máme velkou hromadu

interface Point {
  x: number;
  y: number;
}

interface StoneItem {
  id: number;
  text: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vy: number;
  angle: number;
  targetAngle: number;
  w: number;
  h: number;
  settled: boolean;
  colorTop: string;
  colorBottom: string;
  borderColor: string;
  textColor: string;
  isCrown: boolean;
  isDragging?: boolean;
  vertices: Point[]; // Jagged rock polygon vertices
  facets: Point[][];  // Inner chiseled crack lines
}

// Generate realistic jagged stone polygon vertices
const generateStoneShape = (w: number, h: number, seed: number): { vertices: Point[]; facets: Point[][] } => {
  const hw = w / 2;
  const hh = h / 2;
  
  // Deterministic pseudo-random based on seed
  const prng = (offset: number) => {
    const sin = Math.sin(seed * 997 + offset * 1337);
    return sin - Math.floor(sin);
  };

  // 8 natural chipped boulder corners/edges
  const v: Point[] = [
    { x: -hw + prng(1) * 6, y: -hh + prng(2) * 5 + 3 },      // Top-left chipped
    { x: -hw * 0.3 + prng(3) * 6, y: -hh - prng(4) * 4 },    // Top-left-mid
    { x: hw * 0.4 + prng(5) * 6, y: -hh - prng(6) * 3 },     // Top-right-mid
    { x: hw - prng(7) * 6, y: -hh + prng(8) * 5 + 3 },       // Top-right chipped
    { x: hw + prng(9) * 4, y: hh * 0.2 + prng(10) * 4 },     // Right-mid
    { x: hw - prng(11) * 7, y: hh - prng(12) * 4 },          // Bottom-right chipped
    { x: -hw * 0.2 + prng(13) * 6, y: hh + prng(14) * 3 },   // Bottom-mid
    { x: -hw + prng(15) * 6, y: hh - prng(16) * 4 },         // Bottom-left chipped
    { x: -hw - prng(17) * 4, y: -hh * 0.1 + prng(18) * 4 },  // Left-mid
  ];

  // Inner chiseled facet lines giving 3D rock depth
  const facets: Point[][] = [
    [
      { x: v[0].x * 0.7, y: v[0].y * 0.7 },
      { x: v[2].x * 0.6, y: v[2].y * 0.6 },
    ],
    [
      { x: v[3].x * 0.8, y: v[3].y * 0.7 },
      { x: v[5].x * 0.7, y: v[5].y * 0.7 },
    ],
  ];

  return { vertices: v, facets };
};

export const Slide03_RvpBuzzwords: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [replayKey, setReplayKey] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Store stones in ref so mouse handlers and render loop can access live state smoothly
  const stonesRef = useRef<StoneItem[]>([]);
  const draggedStoneRef = useRef<{
    stone: StoneItem;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const isHoveringStoneRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isMounted = true;

    // Canvas sizing with DPR
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateSize();
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const floorY = height - 36;
    const centerX = width / 2;

    // Responsive scaling factor for mobile vs desktop displays
    const responsiveScale = Math.min(1, Math.max(0.52, width / 720));

    // Authentic mineral rock palettes (Granite, Basalt, Slate, Sandstone, Quartz, Limestone)
    const rockPalettes = [
      { top: '#e2e8f0', bottom: '#94a3b8', border: '#475569', text: '#1e293b' }, // Granite Slate
      { top: '#f1f5f9', bottom: '#cbd5e1', border: '#64748b', text: '#0f172a' }, // Limestone
      { top: '#e7e5e4', bottom: '#a8a29e', border: '#57534e', text: '#292524' }, // River Pebble
      { top: '#f5f5f4', bottom: '#d6d3d1', border: '#78716c', text: '#1c1917' }, // Gray Quartz
      { top: '#fef3c7', bottom: '#d97706', border: '#78350f', text: '#451a03' }, // Sandstone
      { top: '#e0f2fe', bottom: '#7dd3fc', border: '#0369a1', text: '#082f49' }, // Blue Slate
      { top: '#dcfce7', bottom: '#86efac', border: '#15803d', text: '#052e16' }, // Mossy Granite
      { top: '#fed7aa', bottom: '#fb923c', border: '#9a3412', text: '#431407' }, // Earth Rock
      { top: '#f3e8ff', bottom: '#c084fc', border: '#6b21a8', text: '#3b0764' }, // Amethyst Slate
    ];

    // Build mountain pyramid layers
    const layerCounts = [8, 7, 6, 6, 5, 4, 3, 2];
    const stoneH = 34 * responsiveScale;
    const rowSpacing = 35 * responsiveScale;
    const colSpacing = 82 * responsiveScale;

    const items: StoneItem[] = [];
    let acronymIdx = 0;

    layerCounts.forEach((countInLayer, layerIdx) => {
      const yPos = floorY - stoneH / 2 - layerIdx * rowSpacing;
      const layerWidth = countInLayer * colSpacing;
      const startX = centerX - layerWidth / 2 + colSpacing / 2;

      for (let c = 0; c < countInLayer; c++) {
        if (acronymIdx >= ACRONYMS_LIST.length) break;

        const text = ACRONYMS_LIST[acronymIdx];
        const pal = rockPalettes[acronymIdx % rockPalettes.length];
        const targetX = startX + c * colSpacing + (Math.random() - 0.5) * 10 * responsiveScale;
        const targetY = yPos + (Math.random() - 0.5) * 4 * responsiveScale;
        const targetAngle = (Math.random() - 0.5) * 0.28;
        const w = Math.max(54, text.length * 11 + 24) * responsiveScale;
        const h = stoneH + (Math.random() - 0.5) * 5 * responsiveScale;

        const shape = generateStoneShape(w, h, acronymIdx + 1);

        items.push({
          id: acronymIdx,
          text,
          x: targetX + (Math.random() - 0.5) * 40 * responsiveScale,
          y: -80 - acronymIdx * 18, // Staggered drop sequence
          targetX,
          targetY,
          vy: 0,
          angle: (Math.random() - 0.5) * 0.6,
          targetAngle,
          w,
          h,
          settled: false,
          colorTop: pal.top,
          colorBottom: pal.bottom,
          borderColor: pal.border,
          textColor: pal.text,
          isCrown: false,
          vertices: shape.vertices,
          facets: shape.facets,
        });

        acronymIdx++;
      }
    });

    // Top Crowning 2x Mega Monolith Stone 'ŠVP' (Emerald/Green Granite Monolith)
    const crownLayerIdx = layerCounts.length;
    const crownTargetY = floorY - stoneH / 2 - crownLayerIdx * rowSpacing - 12 * responsiveScale;
    const crownW = 175 * responsiveScale;
    const crownH = 62 * responsiveScale;
    const crownShape = generateStoneShape(crownW, crownH, 9999);

    items.push({
      id: 9999,
      text: 'ŠVP',
      x: centerX,
      y: -100 - items.length * 18,
      targetX: centerX,
      targetY: crownTargetY,
      vy: 0,
      angle: (Math.random() - 0.5) * 0.4,
      targetAngle: 0,
      w: crownW,
      h: crownH,
      settled: false,
      colorTop: '#22c55e',   // Emerald Green Light
      colorBottom: '#15803d',// Deep Forest Granite
      borderColor: '#14532d',// Chiseled dark stone rim
      textColor: '#ffffff',
      isCrown: true,
      vertices: crownShape.vertices,
      facets: crownShape.facets,
    });

    stonesRef.current = items;

    const gravity = 0.42;

    const render = () => {
      if (!isMounted) return;

      ctx.clearRect(0, 0, width, height);

      // Ground baseline rock bed
      ctx.beginPath();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      const groundHalf = Math.min(centerX - 10, 440 * responsiveScale);
      ctx.moveTo(centerX - groundHalf, floorY + 4);
      ctx.lineTo(centerX + groundHalf, floorY + 4);
      ctx.stroke();

      // Update physics for falling stones
      for (const item of stonesRef.current) {
        if (!item.settled && !item.isDragging) {
          item.vy += gravity;
          item.y += item.vy;
          item.angle += (item.targetAngle - item.angle) * 0.08;

          if (item.y >= item.targetY) {
            item.y = item.targetY;
            item.vy = -item.vy * 0.18; // gentle stone impact bounce
            if (Math.abs(item.vy) < 0.6) {
              item.settled = true;
              item.y = item.targetY;
              item.angle = item.targetAngle;
            }
          }
        }

        // Draw Chiseled Natural Stone
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.angle);

        // Realistic Rock Shadow
        if (item.isDragging) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
          ctx.shadowBlur = 24 * responsiveScale;
          ctx.shadowOffsetY = 14 * responsiveScale;
        } else if (item.isCrown) {
          ctx.shadowColor = 'rgba(21, 128, 61, 0.45)';
          ctx.shadowBlur = 20 * responsiveScale;
          ctx.shadowOffsetY = 8 * responsiveScale;
        } else {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.14)';
          ctx.shadowBlur = 8 * responsiveScale;
          ctx.shadowOffsetY = 3 * responsiveScale;
        }

        // 1. Draw Jagged Stone Polygon
        ctx.beginPath();
        const v = item.vertices;
        ctx.moveTo(v[0].x, v[0].y);
        for (let i = 1; i < v.length; i++) {
          ctx.lineTo(v[i].x, v[i].y);
        }
        ctx.closePath();

        // 2. Chiseled 3D Rock Gradient Fill (Sunlight from top-left)
        const grad = ctx.createLinearGradient(-item.w / 2, -item.h / 2, item.w / 2, item.h / 2);
        if (item.isDragging) {
          grad.addColorStop(0, '#fef08a');
          grad.addColorStop(1, '#ca8a04');
        } else {
          grad.addColorStop(0, item.colorTop);
          grad.addColorStop(1, item.colorBottom);
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // 3. Chiseled Outer Rock Edge
        ctx.lineWidth = item.isCrown ? 3.5 * responsiveScale : (item.isDragging ? 2.5 * responsiveScale : 2 * responsiveScale);
        ctx.strokeStyle = item.isDragging ? '#a16207' : item.borderColor;
        ctx.lineJoin = 'miter';
        ctx.stroke();

        // 4. Subtle Inner Rock Chisel & Crack Facets
        ctx.shadowColor = 'transparent';
        ctx.lineWidth = 1 * responsiveScale;
        ctx.strokeStyle = item.isCrown ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)';
        item.facets.forEach((f) => {
          ctx.beginPath();
          ctx.moveTo(f[0].x, f[0].y);
          ctx.lineTo(f[1].x, f[1].y);
          ctx.stroke();
        });

        // 5. Engraved Stone Typography (Carved Inset Effect)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (item.isCrown) {
          // Monolith Stone Crown Text
          const crownFontSize = Math.round(28 * responsiveScale);
          ctx.font = `900 ${crownFontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.fillText(item.text, 0, 3 * responsiveScale);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(item.text, 0, 1 * responsiveScale);
        } else {
          // Natural Carved Acronym on Rock
          const fontSize = Math.round(12 * responsiveScale);
          ctx.font = `800 ${fontSize}px "JetBrains Mono", monospace`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.fillText(item.text, 0, 2 * responsiveScale);
          ctx.fillStyle = item.isDragging ? '#713f12' : item.textColor;
          ctx.fillText(item.text, 0, 1 * responsiveScale);
        }

        ctx.restore();
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
  }, [replayKey]);

  // Hit test to find which stone is under cursor
  const getStoneAtPos = (clientX: number, clientY: number): StoneItem | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.x;
    const y = clientY - rect.y;

    const list = stonesRef.current;
    for (let i = list.length - 1; i >= 0; i--) {
      const s = list[i];
      const halfW = s.w / 2 + 8;
      const halfH = s.h / 2 + 8;

      const cos = Math.cos(-s.angle);
      const sin = Math.sin(-s.angle);
      const dx = x - s.x;
      const dy = y - s.y;
      const localX = dx * cos - dy * sin;
      const localY = dx * sin + dy * cos;

      if (Math.abs(localX) <= halfW && Math.abs(localY) <= halfH) {
        return s;
      }
    }
    return null;
  };

  // Mouse & Touch Drag and Drop Handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    const stone = getStoneAtPos(clientX, clientY);
    if (!stone) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.x;
    const y = clientY - rect.y;

    stone.settled = true;
    stone.isDragging = true;
    draggedStoneRef.current = {
      stone,
      offsetX: x - stone.x,
      offsetY: y - stone.y,
    };

    stonesRef.current = [
      ...stonesRef.current.filter((s) => s !== stone),
      stone,
    ];
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.x;
    const y = clientY - rect.y;

    if (draggedStoneRef.current) {
      const { stone, offsetX, offsetY } = draggedStoneRef.current;
      stone.x = x - offsetX;
      stone.y = y - offsetY;
      stone.angle = 0;
    } else {
      const hoverStone = getStoneAtPos(clientX, clientY);
      isHoveringStoneRef.current = !!hoverStone;
      canvas.style.cursor = hoverStone ? 'grab' : 'default';
    }
  };

  const handlePointerUp = () => {
    if (draggedStoneRef.current) {
      draggedStoneRef.current.stone.isDragging = false;
      draggedStoneRef.current = null;
    }
    if (canvasRef.current) {
      canvasRef.current.style.cursor = isHoveringStoneRef.current ? 'grab' : 'default';
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none relative bg-white overflow-hidden">
      {/* Hidden YouTube Audio Player for Pokáč */}
      {isPlayingMusic && (
        <div className="hidden">
          <iframe
            title="Pokáč - Máme velkou hromadu"
            width="200"
            height="200"
            src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&enablejsapi=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {/* Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4 z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s3_title" defaultText="Záplava pojmů a zkratek nového RVP ZV" />
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          <EditableText
            id="s3_subtitle"
            defaultText="Máme velkou hromadu hop hop hop..."
          />
        </p>
      </div>

      {/* Falling & Drag Natural Stones Canvas Area */}
      <div className="relative flex-1 w-full h-full my-auto flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <canvas
          ref={canvasRef}
          className="w-full h-full max-h-[520px] block touch-none"
          onMouseDown={(e) => {
            handlePointerDown(e.clientX, e.clientY);
            if (canvasRef.current && draggedStoneRef.current) {
              canvasRef.current.style.cursor = 'grabbing';
            }
          }}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            handlePointerDown(touch.clientX, touch.clientY);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            handlePointerMove(touch.clientX, touch.clientY);
          }}
          onTouchEnd={handlePointerUp}
        />

        {/* Subtle Musical Note Icon */}
        <div className="absolute right-3 sm:right-6 bottom-4 sm:bottom-10 z-20">
          <button
            type="button"
            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            title={isPlayingMusic ? 'Zastavit hudbu' : 'Pustit hudbu (Pokáč – Máme velkou hromadu)'}
            className={`group flex items-center gap-2 p-2.5 sm:p-3 rounded-2xl transition-all shadow-sm cursor-pointer border ${
              isPlayingMusic
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-md animate-pulse'
                : 'bg-white/80 hover:bg-amber-50 text-gray-400 hover:text-amber-700 border-gray-200 hover:border-amber-200 backdrop-blur-xs'
            }`}
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 animate-bounce" />
                <span className="text-[11px] sm:text-xs font-bold text-amber-800 pr-1">Pokáč: Máme velkou hromadu 🎵</span>
              </>
            ) : (
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-end z-10">
        <button
          onClick={() => setReplayKey((prev) => prev + 1)}
          className="px-3.5 sm:px-4 py-2 bg-gml-green-50 hover:bg-gml-green-100 text-gml-green-800 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Spustit pád znovu
        </button>
      </div>
    </div>
  );
};
