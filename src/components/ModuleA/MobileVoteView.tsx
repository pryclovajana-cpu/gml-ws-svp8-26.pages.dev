import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Sparkles, Sliders, MessageSquarePlus, RefreshCw } from 'lucide-react';
import { realtimeService } from '../../services/realtimeService';
import { GmlLogo } from '../GmlLogo';

export const MobileVoteView: React.FC = () => {
  const [pollId, setPollId] = useState<'poll1' | 'poll2' | 'leadership'>('leadership');
  const [textVote, setTextVote] = useState('');
  const [scaleVote, setScaleVote] = useState<number>(65);
  const [submittedText, setSubmittedText] = useState(false);
  const [submittedScale, setSubmittedScale] = useState(false);

  // Read URL query parameter or hash if pollId specified
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href.toLowerCase();
      if (fullUrl.includes('poll=leadership') || fullUrl.includes('poll=vedeni') || fullUrl.includes('leadership')) {
        setPollId('leadership');
      } else if (fullUrl.includes('poll=poll2') || fullUrl.includes('poll2')) {
        setPollId('poll2');
      } else if (fullUrl.includes('poll=poll1') || fullUrl.includes('poll1')) {
        setPollId('poll1');
      }
    }
  }, []);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textVote.trim()) return;
    realtimeService.addTextVote(pollId, textVote);
    setSubmittedText(true);
    setTextVote('');
    setTimeout(() => {
      setSubmittedText(false);
    }, 4000);
  };

  const handleSendScale = (e: React.FormEvent) => {
    e.preventDefault();
    realtimeService.addScaleVote(pollId, scaleVote);
    setSubmittedScale(true);
  };

  const isLeadership = pollId === 'leadership';

  const getQuestionTitle = () => {
    if (pollId === 'leadership') {
      return 'Co bych já konkrétně potřeboval/a od vedení za podporu při práci na novém ŠVP?';
    }
    if (pollId === 'poll1') {
      return '1. Jak na Vás zkratky působí a jak jim rozumíte?';
    }
    return '1. Vaše závěrečné postřehy a zpětná vazba';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gml-green-50 via-white to-gml-yellow-50 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Header */}
      <header className="flex flex-col items-center justify-center text-center pt-2 pb-4 border-b border-gml-green-100">
        <GmlLogo size="sm" showText={false} />
        <h1 className="text-xl font-extrabold font-display text-gml-slate-900 mt-2">
          {isLeadership ? 'Podnět pro vedení GML' : 'Živé hlasování z mobilu'}
        </h1>
        <p className="text-xs text-gml-green-700 font-semibold mt-0.5">
          Gymnázium Matyáše Lercha • Workshop 2026
        </p>

        {/* Poll Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 bg-white p-1 rounded-xl border border-gray-200 shadow-sm text-xs font-bold">
          <button
            onClick={() => { setPollId('leadership'); setSubmittedText(false); setSubmittedScale(false); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pollId === 'leadership'
                ? 'bg-gml-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Podnět vedení
          </button>
          <button
            onClick={() => { setPollId('poll1'); setSubmittedText(false); setSubmittedScale(false); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pollId === 'poll1'
                ? 'bg-gml-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Anketa 1 (Úvod)
          </button>
          <button
            onClick={() => { setPollId('poll2'); setSubmittedText(false); setSubmittedScale(false); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              pollId === 'poll2'
                ? 'bg-gml-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Anketa 2 (Závěr)
          </button>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="max-w-md w-full mx-auto my-auto space-y-5 py-4">
        {/* Section 1: Open Text Answer */}
        <div className="bg-white p-5 rounded-3xl border border-gml-green-200 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-gml-green-700">
            <MessageSquarePlus className="w-5 h-5 shrink-0" />
            <h2 className="font-display font-bold text-sm sm:text-base text-gml-slate-900 leading-snug">
              {getQuestionTitle()}
            </h2>
          </div>

          {isLeadership && (
            <p className="text-xs text-gray-500 font-medium">
              Zadejte konkrétní požadavek nebo přání k podpoře pro pana ředitele a vedení GML.
            </p>
          )}

          {submittedText && (
            <div className="p-3.5 bg-gml-green-50 rounded-2xl text-center border border-gml-green-300 animate-fade-in flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-gml-green-600 shrink-0" />
              <span className="text-xs font-bold text-gml-green-900">
                Podnět byl úspěšně odeslán na plátno! Můžete poslat další.
              </span>
            </div>
          )}

          <form onSubmit={handleSendText} className="space-y-3">
            <textarea
              value={textVote}
              onChange={(e) => setTextVote(e.target.value)}
              placeholder={isLeadership ? "Např. Čas na hospitace, školení k AI, didaktické materiály..." : "Napište svůj postřeh..."}
              rows={3}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gml-green-500 focus:bg-white transition-all resize-none font-medium"
            />
            <button
              type="submit"
              disabled={!textVote.trim()}
              className="w-full py-3 bg-gml-green-600 hover:bg-gml-green-700 active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Odeslat na plátno</span>
            </button>
          </form>
        </div>

        {/* Section 2: Numerical Scale (Only for poll1 & poll2) */}
        {!isLeadership && (
          <div className="bg-white p-5 rounded-3xl border border-gml-green-200 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-gml-green-700">
              <Sliders className="w-5 h-5 shrink-0" />
              <h2 className="font-display font-bold text-sm sm:text-base text-gml-slate-900">
                {pollId === 'poll1'
                  ? '2. Vaše důvěra v revizi ŠVP (1–100 %)'
                  : '2. Závěrečná důvěra po workshopu (1–100 %)'}
              </h2>
            </div>

            {submittedScale ? (
              <div className="p-4 bg-gml-green-50 rounded-2xl text-center border border-gml-green-200">
                <CheckCircle2 className="w-8 h-8 text-gml-green-600 mx-auto mb-1" />
                <span className="text-sm font-bold text-gml-green-900 block">
                  Hodnocení uloženo! ({scaleVote} %)
                </span>
                <p className="text-xs text-gml-green-700 mt-1">
                  Vaše hodnocení se ihned promítlo do Gaussovy křivky na projekčním plátně.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendScale} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>1 % (Skepticismus)</span>
                    <span className="text-lg font-extrabold text-gml-green-700 font-mono">
                      {scaleVote} %
                    </span>
                    <span>100 % (Velká důvěra)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={scaleVote}
                    onChange={(e) => setScaleVote(Number(e.target.value))}
                    className="w-full accent-gml-green-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gml-green-600 hover:bg-gml-green-700 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Odeslat hodnocení ({scaleVote} %)</span>
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-100">
        Výsledky jsou v reálném čase přenášeny na prezentační plátno workshopu.
      </footer>
    </div>
  );
};
