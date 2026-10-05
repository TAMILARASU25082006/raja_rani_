'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../i18n/translations';
import { clientStorage } from '../lib/client/storage';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = clientStorage.getLanguage();
    setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    clientStorage.setLanguage(lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
