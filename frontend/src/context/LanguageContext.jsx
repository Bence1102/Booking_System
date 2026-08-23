import { createContext, useContext, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    localStorage.getItem('language') || 'hu'
  );

  function setLanguage(lang) {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  }

  function t(key) {
    const parts = key.split('.');
    let value = translations[language];
    for (const part of parts) {
      value = value?.[part];
    }
    return value ?? key;
  }

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage csak LanguageProvider-en belül használható');
  }
  return context;
}