import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { I18nContext } from './i18n-context';
import zh from './zh';
import en from './en';
import type { Language } from './i18n-context';
import type { I18nKeys } from './zh';
import { useSSR } from '../hooks/use-ssr';

const i18n = { zh, en };

export type I18nProviderProps = {
  lang?: Language;
  children: React.ReactNode;
};

const I18nProvider = ({ lang: defaultLang, children }: I18nProviderProps) => {
  const { isServer } = useSSR();

  const [lang, setLang] = useState<Language>(() => {
    const lang = isServer ? 'zh' : localStorage.getItem('viewer-lang');
    return (lang ? lang : (defaultLang || 'zh')) as Language;
  });

  const changeLanguage = useCallback((lang: Language) => {
    setLang(lang);
    if (isServer) return;
    localStorage.setItem('viewer-lang', lang);
  }, []);

  const t = useCallback((label: I18nKeys) => i18n[lang][label], [lang]);

  useEffect(() => {
    if (!defaultLang) return;
    changeLanguage(defaultLang);
  }, [defaultLang]);

  const value = useMemo(() => ({
    t,
    lang,
    changeLanguage,
  }), [lang]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nProvider;
