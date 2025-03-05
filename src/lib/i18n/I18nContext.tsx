
import { createContext } from 'react';
import { I18nContextType } from './types';

// Create the context
export const I18nContext = createContext<I18nContextType | null>(null);
