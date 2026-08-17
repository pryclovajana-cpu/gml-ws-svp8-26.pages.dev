import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Sliders, MessageSquarePlus } from 'lucide-react';
import { realtimeService } from '../../services/realtimeService';
import { GmlLogo } from '../GmlLogo';

export const MobileVoteView: React.FC = () => {
  const [pollId, setPollId] = useState<'poll1' | 'poll2'>('poll1');
  const [textVote, setTextVote] = useState('');
  const [scaleVote, setScaleVote] = useState<number>(65);
  const [submittedText, setSubmittedText] = useState(false);
  const [submittedScale, setSubmittedScale] = useState(false);

  // Read URL query parameter if pollId specified
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.includes('poll=poll2')) {
        setPollId('poll2');
      }
    }
  }, []);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textVote.trim()) return;
    realtimeService.addTextVote(pollId, textVote);
    setSubmittedText(true);
    setTimeout(() => {
      setTextVote('');
    }, 500);
  };

  const handleSendScale = (e: React.FormEvent) => {
    e.preventDefault();
    realtimeService.addScaleVote(pollId, scaleVote);
    setSubmittedScale(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gml-green-50 via-white to-gml-yellow-50 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Header */}
      <header className="flex flex-col items-center justify-center text-center pt-2 pb-4 border-b border-gml-green-100">
        <GmlLogo size="sm" showText={false} />
        <h1 className="text-xl font-extrabold font-display text-gml-slate-900 mt-2">
          Živé hlasování z mobilu
        </h1>
        <p className="text-xs text-gml-green-700 font-semibold mt-0.5">
          Gymnázium Matyáše Lercha • Workshop 2026
        </p>

        {/* Poll Switcher */}
        <div className="flex items-center gap-2 mt-3 bg-white p-1 rounded-xl border border-gray-200 shadow-sm text-xs font-bold">
          <button
            onClick={() => { setPollId('poll1'); setSubmittedText(false); setSubmittedScale(false); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pollId === 'poll1'
                ? 'bg-gml-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Anketa 1 (Úvodní)
          </button>
          <button
            onClick={() => { setPollId('poll2'); setSubmittedText(false); setSubmittedScale(false); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pollId === 'poll2'
                ? 'bg-gml-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Anketa 2 (Výstupní)
          </button>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="max-w-md w-full mx-auto my-auto space-y-6 py-4">
        {/* Section 1: Open Text Answer */}
        <div className="bg-white p-5 rounded-3xl border border-gml-green-100 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-gml-green-700">
            <MessageSquarePlus className="w-5 h-5" />
            <h2 className="font-display font-bold text-base text-gml-slate-900">
              {pollId === 'poll1'
                ? '1. Jak na Vás zkratky působí a jak jim rozumíte?'
                : '1. Vaše závěrečné postřehy a zpětná vazba'}
            </h2>
          </div>

          {submittedText ? (
            <div className="p-4 bg-gml-green-50 rounded-2xl text-center border border-gml-green-200 animate-pulse">
              <CheckCircle2 className="w-8 h-8 text-gml-green-600 mx-auto mb-1" />
              <span className="text-sm font-bold text-gml-green-900 block">
                Odpověď byla v pořádku odeslána na plátno!
              </span>
              <button
                onClick={() => setSubmittedText(false)}
                className="mt-3 text-xs text-gml-green-700 underline font-semibold"
              >
                + Odeslat další názor
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendText} className="space-y-3">
              <textarea
                value={textVote}
                onChange={(e) => setTextVote(e.target.value)}
                placeholder="Napište stručně vaše dojmy či otázku..."
                rows={3}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gml-green-500 focus:bg-white transition-all resize-none"
              />
              <button
                type="submit"
                disabled={!textVote.trim()}
                className="w-full py-3 bg-gml-green-600 text-white font-bold text-sm rounded-2xl hover:bg-gml-green-700 disabled:opacity-40 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Odeslat odpověď
              </button>
            </form>
          )}
        </div>

        {/* Section 2: Scale 1-100 Slider */}
        <div className="bg-white p-5 rounded-3xl border border-gml-yellow-200 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gml-yellow-700">
              <Sliders className="w-5 h-5" />
              <h2 className="font-display font-bold text-base text-gml-slate-900">
                2. Důvěra na škále 1–100
              </h2>
            </div>
            <span className="text-xl font-extrabold text-gml-yellow-600 font-display bg-gml-yellow-100 px-3 py-1 rounded-xl">
              {scaleVote}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Jakou máte důvěru v to, že nový ŠVP pomůže ke kvalitnějšímu vzdělávání na GML?
          </p>

          <form onSubmit={handleSendScale} className="space-y-4">
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="100"
                value={scaleVote}
                onChange={(e) => setScaleVote(Number(e.target.value))}
                className="w-full h-3 bg-gml-yellow-100 rounded-lg appearance-none cursor-pointer accent-gml-green-600"
              />
              <div className="flex justify-between text-[11px] font-bold text-gray-400">
                <span>1 (Nízká)</span>
                <span>50</span>
                <span>100 (Vysoká)</span>
              </div>
            </div>

            {submittedScale ? (
              <div className="p-3 bg-gml-yellow-50 rounded-2xl text-center border border-gml-yellow-300">
                <CheckCircle2 className="w-6 h-6 text-gml-yellow-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-gml-slate-800 block">
                  Hlas {scaleVote}/100 zaznamenán na plátně!
                </span>
                <button
                  type="submit"
                  className="mt-2 text-[11px] text-gml-yellow-700 underline font-semibold"
                >
                  Aktualizovat můj hlas
                </button>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 bg-gml-yellow-500 text-gml-slate-900 font-bold text-sm rounded-2xl hover:bg-gml-yellow-400 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Odeslat hodnocení ({scaleVote}/100)
              </button>
            )}
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-gray-400 py-2">
        Anonymní bezregistrační přístup • GML 2026
      </footer>
    </div>
  );
};
