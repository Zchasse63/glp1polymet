
import React from 'react';
import { useI18n } from './useI18n';

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
