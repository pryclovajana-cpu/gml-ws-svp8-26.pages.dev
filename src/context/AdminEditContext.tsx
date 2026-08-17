import React, { createContext, useContext, useState, useEffect } from 'react';
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

const AdminEditContext = createContext<AdminEditContextType | undefined>(undefined);

export const AdminEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
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

  // Global shortcut handler: Ctrl + Shift + E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        setIsAdminMode((prev) => !prev);
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
        toggleAdminMode: () => setIsAdminMode((prev) => !prev),
        setAdminMode: setIsAdminMode,
        getEditableText,
        updateEditableText,
        resetAllEditableTexts,
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
  const text = getEditableText(id, defaultText);

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newText = e.currentTarget.textContent || '';
    if (newText !== text) {
      updateEditableText(id, newText);
    }
  };

  return (
    <Component
      contentEditable={isAdminMode}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      className={`${className} ${isAdminMode ? 'cursor-text hover:opacity-90' : ''}`}
    >
      {text}
    </Component>
  );
};
