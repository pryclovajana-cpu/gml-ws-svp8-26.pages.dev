import React, { useState } from 'react';
import { Lock, Unlock, RotateCcw, X, Edit2, ShieldAlert } from 'lucide-react';
import { useAdminEdit } from '../../context/AdminEditContext';

export const AdminToolbar: React.FC = () => {
  const { isAdminMode, setAdminMode, resetAllEditableTexts } = useAdminEdit();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '2026' || pinInput.trim().toLowerCase() === 'gml') {
      setAdminMode(true);
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <>
      {/* Floating Hidden Pin / Admin Toggle Button Top-Right */}
      <div className="fixed top-3 right-3 z-40 flex items-center gap-2 select-none">
        {isAdminMode ? (
          <div className="flex items-center gap-2 bg-gml-yellow-400 text-gml-slate-900 px-3 py-1.5 rounded-2xl shadow-md border border-gml-yellow-500 text-xs font-extrabold animate-pulse">
            <Edit2 className="w-4 h-4" />
            <span>Režim úprav aktivní (Ctrl+Shift+E)</span>
            <button
              onClick={resetAllEditableTexts}
              className="ml-2 px-2 py-0.5 bg-white/80 hover:bg-white text-gray-800 rounded-lg text-[10px] font-bold"
              title="Obnovit původní texty"
            >
              <RotateCcw className="w-3 h-3 inline mr-1" /> Reset
            </button>
            <button
              onClick={() => setAdminMode(false)}
              className="p-1 hover:bg-gml-yellow-500 rounded-lg"
              title="Zamknout režim"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPinModal(true)}
            className="p-2 bg-white/60 hover:bg-white text-gray-400 hover:text-gml-green-700 rounded-xl transition-all border border-gray-200/50 shadow-2xs backdrop-blur-xs opacity-40 hover:opacity-100"
            title="Přihlášení prezentujícího (PIN)"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* PIN Unlock Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gml-slate-900/40 backdrop-blur-sm select-none">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-gml-green-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gml-green-700">
                <Unlock className="w-5 h-5" />
                <h3 className="font-display font-bold text-lg text-gml-slate-900">
                  Režim úprav (Inline Admin)
                </h3>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Zadejte PIN prezentujícího pro zapnutí přímé editace textů na slidech (Výchozí PIN: <code className="bg-gray-100 px-1 rounded text-gml-green-700 font-bold">2026</code> nebo <code className="bg-gray-100 px-1 rounded text-gml-green-700 font-bold">gml</code>).
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                placeholder="Zadejte PIN (např. 2026)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                autoFocus
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gml-green-500 font-mono text-center tracking-widest"
              />

              {pinError && (
                <div className="p-2 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-1 font-semibold justify-center">
                  <ShieldAlert className="w-4 h-4" /> Nesprávný PIN. Zkuste 2026.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gml-green-600 text-white font-bold text-xs rounded-2xl hover:bg-gml-green-700 transition-all shadow-md"
              >
                Odemknout editaci
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
