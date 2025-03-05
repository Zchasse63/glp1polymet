
/**
 * Internationalization types
 */

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
export interface I18nContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoaded: boolean;
  availableLanguages: Language[];
}
