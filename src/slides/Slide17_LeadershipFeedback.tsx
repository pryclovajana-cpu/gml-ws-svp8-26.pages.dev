import React, { useState, useEffect } from 'react';
import { Send, MessageSquarePlus, ShieldCheck, ExternalLink, Trash2, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { realtimeService } from '../services/realtimeService';
import { TextResponse } from '../types';
import { EditableText } from '../context/AdminEditContext';

export const Slide17_LeadershipFeedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<TextResponse[]>(() => {
    const state = realtimeService.getPollState('leadership');
    return state.textResponses;
  });

  const [inputVal, setInputVal] = useState('');

  // Subscribe to real-time live submissions (from mobile phones & cross-tab)
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe('leadership', (newState) => {
      setFeedbackList(newState.textResponses);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    realtimeService.addTextVote('leadership', inputVal.trim());
    setInputVal('');
  };

  const handleReset = () => {
    if (window.confirm('Opravdu chcete smazat všechny podněty a vyčistit plochu?')) {
      realtimeService.resetVotes('leadership');
    }
  };

  const handleDeleteItem = (id: string) => {
    realtimeService.deleteTextVote('leadership', id);
  };

  const voteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#/vote?poll=leadership`
    : 'https://gml-ws-svp8-26.pages.dev/#/vote?poll=leadership';

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-yellow-700 block">
          <EditableText id="s17_badge" defaultText="ZPĚTNÁ VAZBA PRO VEDENÍ" />
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display text-gml-slate-900 leading-snug">
          <EditableText
            id="s17_title"
            defaultText="Co bych já konkrétně potřeboval/a od vedení za podporu při práci na novém ŠVP?"
          />
        </h2>
      </div>

      {/* Main Grid: Left QR & Input, Right Live Submissions Board */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 my-auto py-2 sm:py-4">
        {/* Left Column: QR Code + Quick Direct Input */}
        <div className="md:col-span-5 bg-white p-4 sm:p-6 rounded-3xl border border-gml-green-200 shadow-sm flex flex-col justify-between space-y-3 sm:space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-gml-green-700">
              <MessageSquarePlus className="w-5 h-5" />
              <h3 className="font-display font-bold text-base sm:text-lg text-gml-slate-900">
                <EditableText id="s17_left_title" defaultText="Podnět pro vedení" />
              </h3>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              <EditableText
                id="s17_left_desc"
                defaultText="Zadejte konkrétní požadavek nebo přání k podpoře pro pana ředitele a vedení GML."
              />
            </p>
          </div>

          {/* Prominent QR Code for Mobile Scanning */}
          <div className="flex items-center gap-3 sm:gap-4 p-3 bg-gradient-to-r from-gml-green-50 to-white rounded-2xl border border-gml-green-200 shadow-2xs">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gml-green-100 shrink-0">
              <QRCodeSVG value={voteUrl} size={84} className="sm:w-[94px] sm:h-[94px]" level="M" />
            </div>
            <div className="flex flex-col text-left space-y-0.5 min-w-0">
              <span className="text-[11px] font-black text-gml-green-800 uppercase tracking-wider">
                Naskenujte telefonem
              </span>
              <span className="text-xs font-bold text-gml-slate-900 font-mono truncate">
                gml-ws-svp8-26.pages.dev/#/vote
              </span>
              <a
                href={voteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-gml-green-700 hover:text-gml-green-900 font-bold underline inline-flex items-center gap-1 pt-0.5"
              >
                Otevřít formulář <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Direct Input Form on Presenter Screen */}
          <form onSubmit={handleAddFeedback} className="space-y-2.5 pt-1">
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Nebo napište přímo: Čas na hospitace, školení k AI, metodika..."
              rows={2}
              className="w-full p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gml-green-500 focus:bg-white transition-all resize-none"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-full py-2 sm:py-2.5 bg-gml-green-600 text-white font-bold text-xs rounded-xl hover:bg-gml-green-700 disabled:opacity-40 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Přidat podnět na board
            </button>
          </form>
        </div>

        {/* Right Column: Live Dynamic Submissions Collection Board */}
        <div className="md:col-span-7 bg-gradient-to-br from-gml-yellow-50/70 via-white to-gml-green-50/50 p-4 sm:p-6 rounded-3xl border border-gml-yellow-300 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-gml-yellow-200/60 pb-2.5">
            <h3 className="font-display font-bold text-gml-slate-900 text-sm sm:text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-gml-yellow-600 shrink-0" />
              <span>Sběrná plocha podnětů ({feedbackList.length})</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gml-green-800 bg-gml-green-100 px-2 py-0.5 rounded-full uppercase animate-pulse">
                Živý příjem
              </span>
              {feedbackList.length > 0 && (
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200 transition-all flex items-center gap-1 cursor-pointer"
                  title="Smazat všechny podněty a vyčistit plochu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Smazat vše</span>
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Real-time List of Submitted Teacher Feedback */}
          <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-2.5 max-h-[260px] sm:max-h-[320px] md:max-h-[360px] pr-1">
            {feedbackList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-52 text-center p-6 text-gray-400 bg-white/70 rounded-2xl border-2 border-dashed border-gml-yellow-200">
                <MessageSquarePlus className="w-10 h-10 mb-2.5 text-gml-yellow-600/50 animate-bounce" />
                <p className="text-sm font-bold text-gml-slate-900">Plocha je připravena pro podněty ze sborovny</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  Naskenujte QR kód vlevo a odešlete svůj požadavek. Podněty se zde ihned zobrazí v reálném čase.
                </p>
              </div>
            ) : (
              feedbackList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 sm:p-3.5 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-2.5 group animate-fade-in"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gml-yellow-100 text-gml-yellow-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      #{idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-gml-slate-800 font-medium leading-relaxed break-words">
                      {item.text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1 shrink-0 cursor-pointer rounded-lg hover:bg-red-50"
                    title="Smazat tento podnět"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="p-3.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs sm:text-sm font-semibold text-gml-slate-800">
        <EditableText
          id="s17_bottom_hint"
          defaultText="Všechny podněty budou shrnuty a předány vedení školy k další práci."
        />
      </div>
    </div>
  );
};
