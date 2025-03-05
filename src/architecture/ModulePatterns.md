# Module Patterns Guide

This document outlines the standard patterns for creating and organizing modules in the application.

## Component Module Pattern

Every component should follow this standard organization:

```
ComponentName/
├── ComponentName.tsx      # Main component implementation
├── ComponentName.test.tsx # Component tests
├── index.ts               # Re-export main component
└── types.ts               # Component-specific types (if needed)
```

### Component Implementation Pattern

```tsx
// Import dependencies
import React from 'react';
import { useComponentHook } from './hooks/useComponentHook';
import { ComponentProps } from './types';

// Define component
export const ComponentName: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2, 
  children 
}) => {
  // Use hooks
  const { data, loading, error } = useComponentHook();
  
  // Handle loading state
  if (loading) return <LoadingState />;
  
  // Handle error state
  if (error) return <ErrorState error={error} />;
  
  // Render component
  return (
    <div className="component-wrapper">
      {/* Component implementation */}
    </div>
  );
};

// Default props (if needed)
ComponentName.defaultProps = {
  prop1: 'default value',
};
```

### Index Export Pattern

```ts
// Export main component as default
export { ComponentName } from './ComponentName';
export type { ComponentProps } from './types';
```

## Custom Hook Pattern

Custom hooks should be organized in a hooks directory and follow this pattern:

```tsx
import { useState, useEffect } from 'react';

export const useCustomHook = (param1: Type1, param2: Type2) => {
  // State
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch or compute data
        const result = await someAsyncOperation(param1, param2);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [param1, param2]);
  
  // Return values and functions
  return { 
    data, 
    loading, 
    error,
    refetch: () => { /* Implementation */ }
  };
};
```

## Context Provider Pattern

Context providers should follow this standard pattern:

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define context type
interface ContextType {
  value: ValueType;
  updateValue: (newValue: ValueType) => void;
}

// Create context with default values
const MyContext = createContext<ContextType | undefined>(undefined);

// Provider component
export const MyProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [value, setValue] = useState<ValueType>(initialValue);
  
  // Methods
  const updateValue = (newValue: ValueType) => {
    setValue(newValue);
  };
  
  // Effects for initialization
  useEffect(() => {
    // Initialization logic
  }, []);
  
  // Context value
  const contextValue: ContextType = {
    value,
    updateValue,
  };
  
  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook for using this context
export const useMyContext = (): ContextType => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
```

## Utility Function Pattern

Utility functions should be pure, well-typed, and documented:

```ts
/**
 * Function description
 * @param param1 Description of param1
 * @param param2 Description of param2
 * @returns Description of return value
 */
export const utilityFunction = (
  param1: Type1, 
  param2: Type2
): ReturnType => {
  // Function implementation
  return result;
};
```

## API Integration Pattern

API integrations should follow this pattern:

```ts
/**
 * API client for resource
 */
export const resourceApi = {
  /**
   * Get all resources
   */
  getAll: async (options?: QueryOptions): Promise<Resource[]> => {
    try {
      // Implementation
      return resources;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Get resource by ID
   */
  getById: async (id: string): Promise<Resource> => {
    try {
      // Implementation
      return resource;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Other methods: create, update, delete, etc.
};
```
