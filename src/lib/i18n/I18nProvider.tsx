
import React, { useState, useEffect, ReactNode } from 'react';
import { useApplicationState, PersistenceType } from '@/hooks/useApplicationState';
import { I18nContext } from './I18nContext';
import { Language, I18nContextType, TranslationDict } from './types';
import { defaultTranslations } from './defaultTranslations';

// Provider component for i18n context
export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [translations, setTranslations] = useState<Record<Language, TranslationDict>>(defaultTranslations);
  const [isLoaded, setIsLoaded] = useState(true);
  
  // Use application state for language preference
  const { state: currentLanguage, setState: setLanguageState } = useApplicationState<Language>({
    initialState: Language.EN,
    key: 'app_language',
    persistence: PersistenceType.LOCAL,
  });
  
  // Load language based on browser settings on mount
  useEffect(() => {
    const detectBrowserLanguage = (): Language => {
      const browserLang = navigator.language.split('-')[0];
      
      // Map browser language to supported language
      switch (browserLang) {
        case 'es': return Language.ES;
        case 'fr': return Language.FR;
        case 'de': return Language.DE;
        case 'ja': return Language.JA;
        default: return Language.EN;
      }
    };
    
    // Only set language if not already set in localStorage
    if (!localStorage.getItem('app_language')) {
      setLanguageState(detectBrowserLanguage());
    }
  }, [setLanguageState]);
  
  // Set HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);
  
  // Function to set language
  const setLanguage = (language: Language) => {
    setLanguageState(language);
  };
  
  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    const languageDict = translations[currentLanguage] || translations[Language.EN];
    
    // Traverse the nested translation object
    let result: any = languageDict;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) break;
    }
    
    // Fallback to English if translation not found
    if (result === undefined && currentLanguage !== Language.EN) {
      result = translations[Language.EN];
      for (const k of keys) {
        result = result?.[k];
        if (result === undefined) break;
      }
    }
    
    // Fallback to key if no translation found
    if (typeof result !== 'string') {
      return key;
    }
    
    // Replace parameters in the translation
    if (params) {
      return Object.entries(params).reduce(
        (str, [paramKey, paramValue]) => 
          str.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue)),
        result
      );
    }
    
    return result;
  };
  
  // Context value
  const contextValue: I18nContextType = {
    currentLanguage,
    setLanguage,
    t,
    isLoaded,
    availableLanguages: Object.values(Language)
  };
  
  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};
