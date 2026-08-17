import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lock, X, Check, KeyRound } from 'lucide-react';
import { EditableContentMap } from '../types';

interface AdminEditContextType {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  setAdminMode: (active: boolean) => void;
  getEditableText: (id: string, defaultText: string) => string;
  updateEditableText: (id: string, newText: string) => void;
  resetAllEditableTexts: () => void;
}

const STORAGE_KEY = 'gml_slide_text_edits_v1';
const ADMIN_PASSWORD = 'admin';

const AdminEditContext = createContext<AdminEditContextType | undefined>(undefined);

export const AdminEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const [textMap, setTextMap] = useState<EditableContentMap>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved slide text edits', e);
        }
      }
    }
    return {};
  });

  const requestToggle = () => {
    if (isAdminMode) {
      // Exit admin mode without password
      setIsAdminMode(false);
    } else {
      // Prompt for password
      setPasswordInput('');
      setPasswordError(false);
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminMode(true);
      setShowPasswordModal(false);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  // Global shortcut handler: Ctrl + Shift + E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        requestToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminMode]);

  // Sync to body class for CSS highlighting
  useEffect(() => {
    if (isAdminMode) {
      document.body.classList.add('admin-editable-active');
    } else {
      document.body.classList.remove('admin-editable-active');
    }
  }, [isAdminMode]);

  const getEditableText = (id: string, defaultText: string): string => {
    return textMap[id] !== undefined ? textMap[id] : defaultText;
  };

  const updateEditableText = (id: string, newText: string) => {
    setTextMap((prev) => {
      const updated = { ...prev, [id]: newText };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const resetAllEditableTexts = () => {
    setTextMap({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AdminEditContext.Provider
      value={{
        isAdminMode,
        toggleAdminMode: requestToggle,
        setAdminMode: setIsAdminMode,
        getEditableText,
        updateEditableText,
        resetAllEditableTexts,
      }}
    >
      {children}

      {/* Admin Password Protected Modal Dialog */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none animate-fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl shadow-2xl border border-gml-green-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold font-display text-gml-slate-900">
                  Režim úprav prezentace
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 block">
                  Zadejte administrátorské heslo:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    autoFocus
                    placeholder="Heslo (admin)"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError(false);
                    }}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-2xl text-sm focus:outline-none focus:bg-white transition-all ${
                      passwordError
                        ? 'border-red-400 ring-2 ring-red-200 bg-red-50/50'
                        : 'border-gray-200 focus:ring-2 focus:ring-gml-green-500'
                    }`}
                  />
                </div>
                {passwordError && (
                  <p className="text-xs font-bold text-red-600 pt-0.5 animate-bounce">
                    Nesprávné heslo. Zkuste to znovu.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gml-green-600 hover:bg-gml-green-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Odemknout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminEditContext.Provider>
  );
};

export const useAdminEdit = () => {
  const context = useContext(AdminEditContext);
  if (!context) {
    throw new Error('useAdminEdit must be used within an AdminEditProvider');
  }
  return context;
};

// Helper component for editable text elements
export const EditableText: React.FC<{
  id: string;
  defaultText: string;
  className?: string;
  as?: React.ElementType;
}> = ({ id, defaultText, className = '', as: Component = 'span' }) => {
  const { isAdminMode, getEditableText, updateEditableText } = useAdminEdit();
  const currentText = getEditableText(id, defaultText);

  if (!isAdminMode) {
    return <Component className={className}>{currentText}</Component>;
  }

  return (
    <Component
      contentEditable
      suppressContentEditableWarning
      className={`${className} outline-none border-b-2 border-dashed border-amber-400 bg-amber-50/70 hover:bg-amber-100/90 rounded px-1 transition-all cursor-text focus:border-amber-600 focus:bg-amber-100`}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const newText = e.currentTarget.innerText.trim();
        if (newText && newText !== currentText) {
          updateEditableText(id, newText);
        }
      }}
      dangerouslySetInnerHTML={{ __html: currentText }}
    />
  );
};
