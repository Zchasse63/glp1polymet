
import { useContext } from 'react';
import { I18nContext } from './I18nContext';

// Hook for using i18n in components
export const useI18n = () => {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  
  return context;
};
