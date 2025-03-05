
/**
 * Application State Hook
 * 
 * Following CodeFarm Development Methodology:
 * - Modular Architecture: Centralized application state management
 * - Sustainable Code: Type-safe state with persistence
 * - Continuous Learning: Adaptive to changing requirements
 * 
 * This hook provides a centralized way to manage application state
 * with type safety, persistence options, and change tracking.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { safeJsonParse } from '@/lib/utils';
import analytics, { EventCategory } from '@/utils/eventTracking';

// Persistence type options
export enum PersistenceType {
  LOCAL = 'localStorage',
  SESSION = 'sessionStorage',
  NONE = 'none'
}

// Options for state initialization
export interface StateOptions<T> {
  initialState: T;
  key?: string;
  persistence?: PersistenceType;
  version?: number;
  onStateChange?: (newState: T, prevState: T) => void;
  migrate?: (oldState: any, oldVersion: number) => T;
}

// State with metadata
interface PersistedState<T> {
  data: T;
  version: number;
  timestamp: number;
}

/**
 * Hook for managing application state with persistence
 */
export function useApplicationState<T>({
  initialState,
  key,
  persistence = PersistenceType.NONE,
  version = 1,
  onStateChange,
  migrate
}: StateOptions<T>) {
  // Refs for tracking previous state and initialization
  const prevStateRef = useRef<T>(initialState);
  const isInitializedRef = useRef(false);
  
  // Initialize state with persisted data if available
  const getInitialState = useCallback((): T => {
    if (!key || persistence === PersistenceType.NONE) {
      return initialState;
    }
    
    const storageType = persistence === PersistenceType.LOCAL 
      ? localStorage 
      : sessionStorage;
    
    const storedValue = storageType.getItem(key);
    
    if (!storedValue) {
      return initialState;
    }
    
    try {
      const parsedValue = safeJsonParse<PersistedState<any>>(
        storedValue, 
        { data: initialState, version: version, timestamp: Date.now() }
      );
      
      // Check if migration is needed
      if (parsedValue.version < version) {
        if (migrate) {
          // Migrate old state to new version
          const migratedData = migrate(parsedValue.data, parsedValue.version);
          return migratedData;
        } else {
          // If no migration function, use initial state
          console.warn(`State version mismatch for key "${key}". Using initial state.`);
          return initialState;
        }
      }
      
      return parsedValue.data;
    } catch (error) {
      console.error(`Error parsing stored state for key "${key}":`, error);
      return initialState;
    }
  }, [initialState, key, persistence, version, migrate]);
  
  // State using the initial state getter
  const [state, setState] = useState<T>(getInitialState);
  
  // Persist state when it changes
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }
    
    // Notify on state change
    if (onStateChange && prevStateRef.current !== state) {
      onStateChange(state, prevStateRef.current);
    }
    
    // Update previous state ref
    prevStateRef.current = state;
    
    // Persist state if needed
    if (key && persistence !== PersistenceType.NONE) {
      const stateWithMetadata: PersistedState<T> = {
        data: state,
        version,
        timestamp: Date.now()
      };
      
      const storageType = persistence === PersistenceType.LOCAL 
        ? localStorage 
        : sessionStorage;
      
      try {
        storageType.setItem(key, JSON.stringify(stateWithMetadata));
      } catch (error) {
        console.error(`Error storing state for key "${key}":`, error);
        
        // Track storage errors
        analytics.trackEvent({
          name: 'storage_error',
          category: EventCategory.ERROR,
          properties: {
            key,
            error: error instanceof Error ? error.message : 'Unknown error',
            storageType: persistence
          }
        });
      }
    }
  }, [state, key, persistence, version, onStateChange]);
  
  // Function to update state with partial data
  const updateState = useCallback((updater: Partial<T> | ((prevState: T) => T)) => {
    setState(prevState => {
      if (typeof updater === 'function') {
        return updater(prevState);
      } else {
        return { ...prevState, ...updater };
      }
    });
  }, []);
  
  // Function to reset state to initial
  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);
  
  // Function to clear persisted state
  const clearPersistedState = useCallback(() => {
    if (key && persistence !== PersistenceType.NONE) {
      const storageType = persistence === PersistenceType.LOCAL 
        ? localStorage 
        : sessionStorage;
      
      storageType.removeItem(key);
    }
  }, [key, persistence]);
  
  return {
    state,
    setState,
    updateState,
    resetState,
    clearPersistedState
  };
}
