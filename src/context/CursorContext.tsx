import React, { createContext, useContext, useState } from 'react';

interface CursorContextType {
  cursorType: 'default' | 'drag' | 'view' | 'hover';
  cursorText: string;
  setCursor: (type: 'default' | 'drag' | 'view' | 'hover', text?: string) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorType: 'default',
  cursorText: '',
  setCursor: () => {},
  resetCursor: () => {},
});

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursorType, setCursorType] = useState<'default' | 'drag' | 'view' | 'hover'>('default');
  const [cursorText, setCursorText] = useState<string>('');

  const setCursor = (type: 'default' | 'drag' | 'view' | 'hover', text = '') => {
    setCursorType(type);
    setCursorText(text);
  };

  const resetCursor = () => {
    setCursorType('default');
    setCursorText('');
  };

  return (
    <CursorContext.Provider value={{ cursorType, cursorText, setCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
