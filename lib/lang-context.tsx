'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

type Language = 'EN' | 'KA' | 'RU';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('EN');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kaya-lang');
    if (saved === 'EN' || saved === 'KA' || saved === 'RU') {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('kaya-lang', newLang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = translations[lang] || translations['EN'];
    if (dict && dict[key]) return dict[key];
    if (dict && key.includes('.')) {
      const sub = key.split('.').pop()!;
      if (dict[sub]) return dict[sub];
    }
    // Fallback to EN dictionary if current lang is missing key
    const enDict = translations['EN'];
    if (enDict && enDict[key]) return enDict[key];
    if (enDict && key.includes('.')) {
      const sub = key.split('.').pop()!;
      if (enDict[sub]) return enDict[sub];
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
