import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, LANGUAGES } from '../translations/dictionary';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('travel_app_lang');
    return saved && translations[saved] ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('travel_app_lang', lang);
  }, [lang]);

  const t = (key) => {
    const dict = translations[lang] || translations['en'];
    return dict[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
