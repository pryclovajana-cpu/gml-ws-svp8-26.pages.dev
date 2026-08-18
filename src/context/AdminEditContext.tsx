import React, { createContext, useContext, useState, useEffect } from 'react';
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

const AdminEditContext = createContext<AdminEditContextType | undefined>(undefined);

export const AdminEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

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
    setIsAdminMode((prev) => !prev);
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
  }, []);

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
