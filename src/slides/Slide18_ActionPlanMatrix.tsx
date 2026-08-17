import React, { useState } from 'react';
import { CheckSquare, User, Users, Plus, Trash2 } from 'lucide-react';
import { EditableText } from '../context/AdminEditContext';

export const Slide18_ActionPlanMatrix: React.FC = () => {
  const [personalTasks, setPersonalTasks] = useState<string[]>([
    'Prostuduji podrobněji specifikaci OVU pro můj aprobační předmět.',
    'Vyzkouším v zářijové výuce alespoň 1 novou gradovanou úlohu.',
  ]);

  const [commissionTasks, setCommissionTasks] = useState<string[]>([
    'Svoláme schůzku předmětové komise do 15. září k harmonizaci témat.',
    'Sestavíme sdílenou složku dobré praxe pro nižší stupeň 8G.',
  ]);

  const [pInput, setPInput] = useState('');
  const [cInput, setCInput] = useState('');

  const addPersonal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pInput.trim()) return;
    setPersonalTasks([...personalTasks, pInput.trim()]);
    setPInput('');
  };

  const addCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cInput.trim()) return;
    setCommissionTasks([...commissionTasks, cInput.trim()]);
    setCInput('');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none bg-white">
      {/* Top Header */}
      <div className="space-y-1 border-b border-gray-100 pb-3 sm:pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gml-green-700 block">
          Akční plán
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-gml-slate-900">
          <EditableText id="s18_title" defaultText="Pracovní matice: Další kroky po workshopu" />
        </h2>
      </div>

      {/* 2-Column Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 my-auto py-2 sm:py-4">
        {/* Column 1: Co udělám já sám / sama? */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gml-green-300 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-gml-green-700">
                <User className="w-5 h-5" />
                <h3 className="font-display font-bold text-base sm:text-lg text-gml-slate-900">
                  Co udělám já sám / sama?
                </h3>
              </div>
              <span className="text-[10px] font-extrabold bg-gml-green-100 text-gml-green-800 px-2.5 py-0.5 rounded-full uppercase">
                Osobní krok
              </span>
            </div>

            <div className="space-y-2 max-h-[180px] sm:max-h-[220px] overflow-y-auto pr-1">
              {personalTasks.map((t, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-gml-green-50/70 border border-gml-green-200 text-xs sm:text-sm font-medium text-gml-slate-900 flex justify-between items-center">
                  <span>{t}</span>
                  <button
                    onClick={() => setPersonalTasks(personalTasks.filter((_, i) => i !== idx))}
                    className="text-gray-400 hover:text-red-500 cursor-pointer ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={addPersonal} className="flex gap-2">
            <input
              type="text"
              placeholder="Přidat osobní závazek..."
              value={pInput}
              onChange={(e) => setPInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gml-green-500"
            />
            <button type="submit" className="px-3.5 py-2 bg-gml-green-600 text-white rounded-xl text-xs font-bold hover:bg-gml-green-700 cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Column 2: Komisní akční plán */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gml-yellow-300 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-gml-yellow-700">
                <Users className="w-5 h-5" />
                <h3 className="font-display font-bold text-base sm:text-lg text-gml-slate-900">
                  Krok předmětové komise
                </h3>
              </div>
              <span className="text-[10px] font-extrabold bg-gml-yellow-200 text-gml-slate-900 px-2.5 py-0.5 rounded-full uppercase">
                Týmový krok
              </span>
            </div>

            <div className="space-y-2 max-h-[180px] sm:max-h-[220px] overflow-y-auto pr-1">
              {commissionTasks.map((t, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-gml-yellow-50/70 border border-gml-yellow-200 text-xs sm:text-sm font-medium text-gml-slate-900 flex justify-between items-center">
                  <span>{t}</span>
                  <button
                    onClick={() => setCommissionTasks(commissionTasks.filter((_, i) => i !== idx))}
                    className="text-gray-400 hover:text-red-500 cursor-pointer ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={addCommission} className="flex gap-2">
            <input
              type="text"
              placeholder="Přidat krok komise..."
              value={cInput}
              onChange={(e) => setCInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gml-yellow-500"
            />
            <button type="submit" className="px-3.5 py-2 bg-gml-yellow-500 text-gml-slate-900 rounded-xl text-xs font-bold hover:bg-gml-yellow-400 cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="p-3.5 sm:p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs sm:text-sm font-semibold text-gml-slate-800">
        Akční kroky budou součástí závěrečného výstupu ze srpnového setkání.
      </div>
    </div>
  );
};
