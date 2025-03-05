
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

export { Language, languageNames } from './types';
export type { TranslationDict, I18nContextType } from './types';
export { I18nProvider } from './I18nProvider';
export { I18nContext } from './I18nContext';
export { useI18n } from './useI18n';
export { Trans } from './Trans';
export { defaultTranslations } from './defaultTranslations';
