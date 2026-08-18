import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MessageSquare, Users, TrendingUp, ExternalLink, RefreshCw, Award, Sparkles } from 'lucide-react';
import { realtimeService } from '../../services/realtimeService';
import { PollState } from '../../types';

interface LivePollingSlideProps {
  pollId: 'poll1' | 'poll2';
  questionText: string;
  isComparisonSlide?: boolean;
}

export const LivePollingSlide: React.FC<LivePollingSlideProps> = ({
  pollId,
  questionText,
  isComparisonSlide = false,
}) => {
  const [pollState, setPollState] = useState<PollState>(() => realtimeService.getPollState(pollId));
  const [poll1StateForComparison, setPoll1StateForComparison] = useState<PollState>(() =>
    isComparisonSlide ? realtimeService.getPollState('poll1') : { textResponses: [], scaleResponses: [] }
  );
  const [showComparison, setShowComparison] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = realtimeService.subscribe(pollId, (newState) => {
      setPollState(newState);
    });

    let unsubscribePoll1: (() => void) | undefined;
    if (isComparisonSlide) {
      unsubscribePoll1 = realtimeService.subscribe('poll1', (state) => {
        setPoll1StateForComparison(state);
      });
    }

    return () => {
      unsubscribe();
      if (unsubscribePoll1) unsubscribePoll1();
    };
  }, [pollId, isComparisonSlide]);

  const pollRoute = pollId === 'poll1' ? 'anketa1' : 'anketa2';
  const voteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#/vote/${pollRoute}`
    : `https://gml-ws-svp8-26.pages.dev/#/vote/${pollRoute}`;

  const scaleValues = pollState.scaleResponses.map((r) => r.value);
  const stats = realtimeService.calculateGaussian(scaleValues);

  const poll1ScaleValues = poll1StateForComparison.scaleResponses.map((r) => r.value);
  const statsPoll1 = realtimeService.calculateGaussian(poll1ScaleValues);

  const handleReset = () => {
    if (window.confirm('Opravdu chcete vynulovat všechny odpovědi v této anketě?')) {
      realtimeService.resetVotes(pollId);
    }
  };

  const feedTitle = pollId === 'poll2'
    ? `Závěrečné postřehy & zpětná vazba (${pollState.textResponses.length})`
    : `Jak na Vás zkratky působí a jak jim rozumíte? (${pollState.textResponses.length})`;

  const scaleTitle = pollId === 'poll2'
    ? 'Výstupní hodnocení důvěry v nový ŠVP (1–100)'
    : 'Jakou důvěru na škále 1–100 máte v to, že nový ŠVP pomůže ke kvalitnějšímu vzdělávání na GML?';

  // Format SVG path string safely
  const currentPathD = stats.points && stats.points.length > 0
    ? `M 0,100 ${stats.points.map((p) => `L ${p.x.toFixed(1)},${(100 - (p.y || 0) * 0.75).toFixed(1)}`).join(' ')} L 100,100 Z`
    : '';

  const currentStrokeD = stats.points && stats.points.length > 0
    ? `M 0,100 ${stats.points.map((p) => `L ${p.x.toFixed(1)},${(100 - (p.y || 0) * 0.75).toFixed(1)}`).join(' ')}`
    : '';

  const compPathD = statsPoll1.points && statsPoll1.points.length > 0
    ? `M 0,100 ${statsPoll1.points.map((p) => `L ${p.x.toFixed(1)},${(100 - (p.y || 0) * 0.70).toFixed(1)}`).join(' ')} L 100,100 Z`
    : '';

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-6 md:p-8 space-y-4 select-none bg-white">
      {/* Top Header & Large Prominent Voting QR Code Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-3xl border border-gml-green-100 shadow-sm">
        <div className="flex-1 space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gml-yellow-100 text-gml-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" /> Živé hlasování
          </div>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold font-display text-gml-slate-900 leading-snug">
            {questionText}
          </h2>
        </div>

        {/* Scaled QR Code & High-Visibility Scan Box */}
        <div className="flex items-center gap-3 sm:gap-5 bg-gradient-to-r from-gml-green-50 to-white p-3 sm:p-3.5 rounded-3xl border border-gml-green-200 shadow-sm shrink-0">
          <div className="bg-white p-2 rounded-2xl shadow-md border border-gml-green-100 shrink-0">
            <QRCodeSVG value={voteUrl} size={90} className="sm:w-[115px] sm:h-[115px]" level="M" />
          </div>
          <div className="flex flex-col text-left space-y-0.5 sm:space-y-1">
            <span className="text-[11px] sm:text-xs font-black text-gml-green-800 uppercase tracking-wider">
              Naskenujte telefonem
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-gml-slate-900 font-mono truncate max-w-[220px] sm:max-w-none">
              gml-ws-svp8-26.pages.dev/#/vote/{pollRoute}
            </span>
            <a
              href={voteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] sm:text-xs text-gml-green-700 hover:text-gml-green-900 font-bold underline inline-flex items-center gap-1 pt-0.5"
            >
              Hlasovat v okně <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Live Feed & Gaussian Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 flex-1 my-auto">
        {/* Left Column: Real-time Qualitative Feed */}
        <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-3xl border border-gml-green-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 sm:mb-4 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gml-green-600" />
              <h3 className="font-display font-bold text-gml-slate-900 text-sm sm:text-base">
                {feedTitle}
              </h3>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-gml-green-100 text-gml-green-800 animate-pulse">
              Live přenos
            </span>
          </div>

          {/* Scrolling Feed Container */}
          <div className="flex-1 overflow-y-auto space-y-2.5 sm:space-y-3 max-h-[220px] sm:max-h-[300px] md:max-h-[340px] pr-1.5">
            {pollState.textResponses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center p-6 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <MessageSquare className="w-8 h-8 mb-2 opacity-30 text-gml-green-600" />
                <p className="text-xs sm:text-sm font-semibold text-gray-600">Zatím žádné odpovědi</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Odpovědi účastníků z mobilů se zde zobrazí živě.</p>
              </div>
            ) : (
              pollState.textResponses.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-gml-green-50/50 via-white to-gml-yellow-50/30 border border-gml-green-100/80 shadow-sm transition-all hover:shadow-md animate-float-slow"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  <p className="text-xs sm:text-sm text-gml-slate-800 font-medium leading-relaxed">
                    "{item.text}"
                  </p>
                  <span className="text-[10px] text-gray-400 font-mono mt-1.5 block">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Scale Density Curve */}
        <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-3xl border border-gml-green-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-start gap-2 flex-1">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gml-green-600 shrink-0 mt-0.5" />
              <h3 className="font-display font-bold text-gml-slate-900 text-xs sm:text-sm md:text-base leading-snug">
                {scaleTitle}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {isComparisonSlide && (
                <button
                  type="button"
                  onClick={() => setShowComparison(!showComparison)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    showComparison
                      ? 'bg-gml-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{showComparison ? 'Skrýt porovnání' : 'Porovnat'}</span>
                </button>
              )}

              {/* Direct Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs border border-gray-200"
                title="Vynulovat všechny odpovědi v této anketě"
              >
                <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline sm:inline">Vynulovat</span>
              </button>
            </div>
          </div>

          {/* Statistics Pill Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-gml-green-50/60 p-2 sm:p-3 rounded-2xl text-center border border-gml-green-100">
              <span className="text-[9px] sm:text-[10px] font-bold text-gml-green-700 uppercase block truncate">Hlasů</span>
              <span className="text-lg sm:text-2xl font-extrabold text-gml-slate-900 font-display">
                {pollState.scaleResponses.length}
              </span>
            </div>
            <div className="bg-gml-yellow-50/60 p-2 sm:p-3 rounded-2xl text-center border border-gml-yellow-200">
              <span className="text-[9px] sm:text-[10px] font-bold text-gml-yellow-700 uppercase block truncate">Průměr (μ)</span>
              <span className="text-lg sm:text-2xl font-extrabold text-gml-slate-900 font-display">
                {stats.hasData ? `${stats.mean}` : '–'}
              </span>
            </div>
            <div className="bg-blue-50/60 p-2 sm:p-3 rounded-2xl text-center border border-blue-100">
              <span className="text-[9px] sm:text-[10px] font-bold text-blue-700 uppercase block truncate">Odchylka (σ)</span>
              <span className="text-lg sm:text-2xl font-extrabold text-gml-slate-900 font-display">
                {stats.hasData ? `±${stats.stdDev}` : '–'}
              </span>
            </div>
          </div>

          {/* SVG Gaussian Bell Curve & Histogram */}
          <div className="relative w-full h-44 sm:h-52 md:h-60 bg-gradient-to-b from-gml-green-50/20 via-white to-gray-50 rounded-2xl border border-gray-100 p-2 flex flex-col justify-end overflow-hidden">
            {!stats.hasData ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-gray-400">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mb-1.5 opacity-30 text-gml-green-600" />
                <p className="text-xs sm:text-sm font-semibold text-gray-600">Čekáme na první hlasy účastníků</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Naskenujte QR kód a zvolte hodnotu na škále 1–100</p>
              </div>
            ) : (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="gaussianGradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#16a34a" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide lines */}
                <line x1="0" y1="25" x2="100" y2="25" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />

                {/* Comparison curve overlay (if active) */}
                {isComparisonSlide && showComparison && statsPoll1.hasData && compPathD && (
                  <g opacity="0.45">
                    <path d={compPathD} fill="#cbd5e1" />
                    <path
                      d={`M 0,100 ${statsPoll1.points.map((p) => `L ${p.x.toFixed(1)},${(100 - (p.y || 0) * 0.70).toFixed(1)}`).join(' ')}`}
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="2"
                      strokeDasharray="2,2"
                    />
                  </g>
                )}

                {/* Current Poll Gaussian Area (Bold Emerald Gradient) */}
                {currentPathD && (
                  <path d={currentPathD} fill="url(#gaussianGradientFill)" />
                )}

                {/* Current Gaussian Solid Curve Outline */}
                {currentStrokeD && (
                  <path
                    d={currentStrokeD}
                    fill="none"
                    stroke="#15803d"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Individual Participant Vote Dots on the baseline */}
                {pollState.scaleResponses.map((resp, rIdx) => (
                  <circle
                    key={resp.id || rIdx}
                    cx={resp.value}
                    cy={94}
                    r={3}
                    className="fill-gml-green-600 stroke-white stroke-1 opacity-90 animate-pulse"
                  />
                ))}

                {/* Mean vertical indicator line */}
                <line
                  x1={stats.mean}
                  y1="10"
                  x2={stats.mean}
                  y2="98"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />

                {/* Peak point indicator dot */}
                <circle
                  cx={stats.mean}
                  cy={25}
                  r={3.5}
                  className="fill-amber-500 stroke-white stroke-2 shadow-md"
                />
              </svg>
            )}

            {/* X-Axis Scale labels (1 - 100) */}
            <div className="flex justify-between items-center px-1 text-[10px] sm:text-[11px] font-bold text-gray-500 mt-1 sm:mt-2 border-t border-gray-200 pt-1">
              <span>1 (Nízká)</span>
              <span>25</span>
              <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {stats.hasData ? `Průměr: ${stats.mean}` : 'Čeká se'}
              </span>
              <span>75</span>
              <span>100 (Vysoká)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
