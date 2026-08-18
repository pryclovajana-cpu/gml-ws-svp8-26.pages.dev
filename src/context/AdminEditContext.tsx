import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lock, X, Check, KeyRound, Eye, EyeOff } from 'lucide-react';
import { EditableContentMap } from '../types';

interface AdminEditContextType {
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  setAdminMode: (active: boolean) => void;
  getEditableText: (id: string, defaultText: string) => string;
  updateEditableText: (id: string, newText: string) => void;
  resetAllEditableTexts: () => void;
  getAllEditsJson: () => string;
  hasEdits: boolean;
}

const NTFY_TEXT_TOPIC = 'gml_ws_svp8_26_text_sync_v4';
const NTFY_TEXT_URL = `https://ntfy.sh/${NTFY_TEXT_TOPIC}`;

const ACCEPTED_PASSWORDS = ['admin', '2026', 'gml', 'lerch', '1234'];

// Helper to convert Czech keyboard number row (ěščřžýáíé) to standard digits
const normalizePassword = (input: string): string => {
  const czMap: Record<string, string> = {
    '+': '1', '1': '1',
    'ě': '2', '2': '2',
    'š': '3', '3': '3',
    'č': '4', '4': '4',
    'ř': '5', '5': '5',
    'ž': '6', '6': '6',
    'ý': '7', '7': '7',
    'á': '8', '8': '8',
    'í': '9', '9': '9',
    'é': '0', '0': '0',
  };
  const trimmed = input.trim().toLowerCase();
  const converted = trimmed.split('').map(ch => czMap[ch] || ch).join('');
  return converted;
};

const AdminEditContext = createContext<AdminEditContextType | undefined>(undefined);

export const AdminEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const [textMap, setTextMap] = useState<EditableContentMap>(() => {
    if (typeof window !== 'undefined') {
      let combined: EditableContentMap = {};
      try {
        const v1 = localStorage.getItem('gml_slide_text_edits_v1');
        if (v1) combined = { ...combined, ...JSON.parse(v1) };
      } catch (e) {}
      try {
        const v2 = localStorage.getItem('gml_slide_text_edits_v2');
        if (v2) combined = { ...combined, ...JSON.parse(v2) };
      } catch (e) {}
      return combined;
    }
    return {};
  });

  // Cross-device cloud sync: Automatically receive and broadcast custom texts across devices
  useEffect(() => {
    const fetchCloudEdits = async () => {
      try {
        const res = await fetch(`${NTFY_TEXT_URL}/json?poll=1&since=48h`);
        if (res.ok) {
          const text = await res.text();
          const lines = text.trim().split('\n');
          let merged: EditableContentMap = {};
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              if (data && data.message) {
                const msg = JSON.parse(data.message);
                if (msg && msg.textMap) {
                  merged = { ...merged, ...msg.textMap };
                }
              }
            } catch (e) {}
          }
          if (Object.keys(merged).length > 0) {
            setTextMap((prev) => ({ ...merged, ...prev }));
          }
        }
      } catch (e) {}
    };

    fetchCloudEdits();

    // Broadcast existing local edits to cloud on startup
    if (typeof window !== 'undefined' && Object.keys(textMap).length > 0) {
      try {
        fetch(NTFY_TEXT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ textMap, timestamp: Date.now() }),
        }).catch(() => {});
      } catch (e) {}
    }
  }, []);

  const broadcastEditsToCloud = (updated: EditableContentMap) => {
    try {
      fetch(NTFY_TEXT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textMap: updated, timestamp: Date.now() }),
      }).catch(() => {});
    } catch (e) {}
  };

  const requestToggle = () => {
    if (isAdminMode) {
      // Exit admin mode without asking for password
      setIsAdminMode(false);
    } else {
      // Open password modal
      setPasswordInput('');
      setPasswordError(false);
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const clean = passwordInput.trim().toLowerCase();
    const normalized = normalizePassword(passwordInput);

    if (
      ACCEPTED_PASSWORDS.includes(clean) ||
      ACCEPTED_PASSWORDS.includes(normalized)
    ) {
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
      try {
        localStorage.setItem('gml_slide_text_edits_v1', JSON.stringify(updated));
        localStorage.setItem('gml_slide_text_edits_v2', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save slide text edits', e);
      }
      broadcastEditsToCloud(updated);
      return updated;
    });
  };

  const resetAllEditableTexts = () => {
    setTextMap({});
    try {
      localStorage.removeItem('gml_slide_text_edits_v1');
      localStorage.removeItem('gml_slide_text_edits_v2');
    } catch (e) {}
    broadcastEditsToCloud({});
  };

  const getAllEditsJson = (): string => {
    return JSON.stringify(textMap, null, 2);
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
        getAllEditsJson,
        hasEdits: Object.keys(textMap).length > 0,
      }}
    >
      {children}

      {/* Password Modal Dialog */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm select-none animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPasswordModal(false);
            }
          }}
        >
          <div
            className="bg-white max-w-sm w-full rounded-3xl shadow-2xl border border-gml-green-200 p-6 space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowPasswordModal(false);
              }
            }}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gml-yellow-100 text-gml-yellow-900 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold font-display text-gml-slate-900 leading-tight">
                    Režim úprav prezentace
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">Zadejte heslo prezentujícího</p>
                </div>
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
                <label className="text-xs font-bold text-gray-700 block">
                  Heslo (např. <code className="bg-gray-100 px-1 py-0.5 rounded text-gml-green-800 font-mono">admin</code> nebo <code className="bg-gray-100 px-1 py-0.5 rounded text-gml-green-800 font-mono">2026</code>):
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoFocus
                    placeholder="Zadejte admin nebo 2026..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError(false);
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                    className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-2xl text-sm focus:outline-none focus:bg-white transition-all font-medium ${
                      passwordError
                        ? 'border-red-400 ring-2 ring-red-200 bg-red-50/50'
                        : 'border-gray-200 focus:ring-2 focus:ring-gml-green-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                    title={showPassword ? 'Skrýt heslo' : 'Zobrazit heslo'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs font-bold text-red-600 pt-0.5 animate-bounce">
                    Nesprávné heslo. Zadejte prosím <b>admin</b> nebo <b>2026</b>.
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
  const elRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (elRef.current) {
      if (document.activeElement !== elRef.current) {
        elRef.current.innerText = currentText;
      }
    }
  }, [currentText, isAdminMode]);

  if (!isAdminMode) {
    return <Component className={className}>{currentText}</Component>;
  }

  return (
    <Component
      ref={elRef}
      contentEditable="true"
      suppressContentEditableWarning
      tabIndex={0}
      dir="ltr"
      style={{ direction: 'ltr', unicodeBidi: 'plaintext' }}
      className={`${className} outline-none border-b-2 border-dashed border-amber-400 bg-amber-50/70 hover:bg-amber-100/90 rounded px-1 transition-all cursor-text focus:border-amber-600 focus:bg-amber-100 select-text`}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
      }}
      onKeyDown={(e: React.KeyboardEvent) => {
        e.stopPropagation();
      }}
      onInput={(e: React.FormEvent<HTMLElement>) => {
        const newText = e.currentTarget.innerText;
        updateEditableText(id, newText);
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const newText = e.currentTarget.innerText.trim();
        if (newText) {
          updateEditableText(id, newText);
        }
      }}
    />
  );
};
