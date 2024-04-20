import React from 'react';
import type { I18nKeys } from './zh';

export type Language = 'zh' | 'en';

export type I18nConfig = {
  lang: Language;
  changeLanguage: (lang: Language) => void;
  t: (label: I18nKeys) => string;
};

export const I18nContext = React.createContext<I18nConfig | undefined>(undefined);

export const useI18n = () => {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

