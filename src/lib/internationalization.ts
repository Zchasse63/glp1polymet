
/**
 * Internationalization (i18n) System
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Support multiple languages
 * - Sustainable Code: Scalable localization framework
 * - Inclusive Design: Make application accessible to diverse users
 * 
 * This module provides a lightweight i18n system for managing
 * translations and localized content.
 */

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { useApplicationState, PersistenceType } from '@/hooks/useApplicationState';

// Available languages
export enum Language {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  JA = 'ja'
}

// Language display names
export const languageNames = {
  [Language.EN]: 'English',
  [Language.ES]: 'Español',
  [Language.FR]: 'Français',
  [Language.DE]: 'Deutsch',
  [Language.JA]: '日本語'
};

// Translation file type
export type TranslationDict = Record<string, string | Record<string, string>>;

// Interface for the i18n context
interface I18nContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoaded: boolean;
  availableLanguages: Language[];
}

// Create the context
const I18nContext = createContext<I18nContextType | null>(null);

// Default translations for fallback
const defaultTranslations: Record<Language, TranslationDict> = {
  [Language.EN]: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search'
    },
    insights: {
      title: 'Health Insights',
      correlations: 'Weight Loss Correlations',
      recommendations: 'Recommendations',
      timePeriod: 'Time Period',
      weeklyProgress: 'Weekly Progress'
    }
  },
  [Language.ES]: {
    common: {
      loading: 'Cargando...',
      error: 'Se produjo un error',
      retry: 'Reintentar',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
      search: 'Buscar'
    },
    insights: {
      title: 'Información de Salud',
      correlations: 'Correlaciones de Pérdida de Peso',
      recommendations: 'Recomendaciones',
      timePeriod: 'Período de Tiempo',
      weeklyProgress: 'Progreso Semanal'
    }
  },
  [Language.FR]: {
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      retry: 'Réessayer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      close: 'Fermer',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Afficher',
      search: 'Rechercher'
    },
    insights: {
      title: 'Informations sur la Santé',
      correlations: 'Corrélations de Perte de Poids',
      recommendations: 'Recommandations',
      timePeriod: 'Période',
      weeklyProgress: 'Progrès Hebdomadaire'
    }
  },
  [Language.DE]: {
    common: {
      loading: 'Wird geladen...',
      error: 'Ein Fehler ist aufgetreten',
      retry: 'Wiederholen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      close: 'Schließen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      view: 'Ansehen',
      search: 'Suchen'
    },
    insights: {
      title: 'Gesundheitseinblicke',
      correlations: 'Gewichtsverlust-Korrelationen',
      recommendations: 'Empfehlungen',
      timePeriod: 'Zeitraum',
      weeklyProgress: 'Wöchentlicher Fortschritt'
    }
  },
  [Language.JA]: {
    common: {
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      retry: '再試行',
      save: '保存',
      cancel: 'キャンセル',
      close: '閉じる',
      delete: '削除',
      edit: '編集',
      view: '表示',
      search: '検索'
    },
    insights: {
      title: '健康分析',
      correlations: '体重減少の相関関係',
      recommendations: '推奨事項',
      timePeriod: '期間',
      weeklyProgress: '週間進捗'
    }
  }
};

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

// Hook for using i18n in components
export const useI18n = () => {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  
  return context;
};

// React component for displaying translated text
export const Trans = ({ 
  id, 
  values,
  defaultText
}: { 
  id: string;
  values?: Record<string, string | number>;
  defaultText?: string;
}) => {
  const { t } = useI18n();
  
  // If translation contains HTML, use dangerouslySetInnerHTML
  // (only for trusted translations defined in our code)
  const translated = t(id, values);
  if (translated.includes('<') && translated.includes('>')) {
    return <span dangerouslySetInnerHTML={{ __html: translated }} />;
  }
  
  return <>{translated || defaultText || id}</>;
};
