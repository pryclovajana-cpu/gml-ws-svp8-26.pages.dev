import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, Users, CheckCircle2, FileText } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide13_TeamActivity: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'share'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 min
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const switchMode = (newMode: 'work' | 'share') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? 600 : 900);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 600 : 900);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-3 sm:pb-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
            Týmová aktivita s odpočtem
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
            <EditableText id="s13_title" defaultText="Práce v předmětových komisích" />
          </h2>
        </div>

        {/* Built-in Countdown Timer Controls */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white p-2.5 sm:p-3 rounded-3xl border border-gml-green-200 shadow-sm shrink-0 self-start md:self-auto">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => switchMode('work')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all cursor-pointer ${
                mode === 'work' ? 'bg-gml-green-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Práce (10 min)
            </button>
            <button
              onClick={() => switchMode('share')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all cursor-pointer ${
                mode === 'share' ? 'bg-gml-yellow-500 text-gml-slate-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sdílení (15 min)
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 font-mono font-extrabold text-xl sm:text-2xl text-gml-slate-900">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gml-green-600 animate-pulse" />
            {formatTime(timeLeft)}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2 rounded-xl text-white transition-all cursor-pointer ${
                isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gml-green-600 hover:bg-gml-green-700'
              }`}
              title={isRunning ? 'Pozastavit' : 'Spustit'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all cursor-pointer"
              title="Vynulovat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 my-auto py-2 sm:py-4">
        {/* Left Side: Zadání */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gml-green-300 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-gml-green-700">
            <FileText className="w-5 h-5" />
            <h3 className="font-display font-bold text-lg sm:text-xl text-gml-slate-900">
              Zadání pro předmětové komise
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-gray-700 font-medium">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-gml-green-100 text-gml-green-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <p>Zvolte 1 konkrétní klíčovou kompetenci či gramotnost z nového RVP ZV.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-gml-yellow-100 text-gml-yellow-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <p>Formulujte 1 ukázkový očekávaný výstup (OVU) pro kvartu (konec 9. ročníku).</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <p>Navrhněte 1 konkrétní badatelskou / tvůrčí aktivitu, kterou žák kompetenci prokáže.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Výstup */}
        <div className="bg-gradient-to-br from-gml-green-50 via-white to-gml-yellow-50/50 p-5 sm:p-6 rounded-3xl border border-gml-yellow-300 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-gml-yellow-800">
            <CheckCircle2 className="w-5 h-5 text-gml-yellow-600" />
            <h3 className="font-display font-bold text-lg sm:text-xl text-gml-slate-900">
              Očekávaný společný výstup
            </h3>
          </div>

          <div className="p-4 bg-white/90 rounded-2xl border border-gray-200 text-xs sm:text-sm text-gml-slate-800 space-y-2">
            <p className="font-bold text-gml-green-800">Krátká společná reflexe (1–2 min na komisi):</p>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              <li>Co se nám daří a na co chceme navázat?</li>
              <li>Kde vidíme největší příležitost pro mezipředmětové propojení?</li>
              <li>Co z toho zakotvíme přímo do nového ŠVP 8G?</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="p-3.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs sm:text-sm font-semibold text-gml-slate-800">
        Výstupy komisí poslouží jako přímý podklad pro koordinační tým ŠVP.
      </div>
    </div>
  );
};
