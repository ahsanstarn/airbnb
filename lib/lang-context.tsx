'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from './translations';

export type Lang = 'EN' | 'KA' | 'RU';

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({
  lang: 'EN',
  setLang: () => {},
  t: (key: string) => key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('EN');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kaya_lang') as Lang | null;
    if (saved && ['EN', 'KA', 'RU'].includes(saved)) {
      setLangState(saved);
    }
    setReady(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('kaya_lang', l);
  };

  const t = (key: string): string => {
    const dict = translations[lang];
    if (!dict) return key.split('.').pop() || key;
    return dict[key] || key.split('.').pop() || key;
  };

  if (!ready) return <>{children}</>;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
