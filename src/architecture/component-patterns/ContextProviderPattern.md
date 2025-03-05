
# Context Provider Pattern

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

## Key Components

1. **Context Type**: Define the shape of your context
2. **Provider Component**: Create a component that provides the context
3. **Custom Hook**: Create a hook that consumers can use to access the context
4. **Error Handling**: Ensure proper usage by checking if the hook is used within a provider

## Best Practices

1. Always provide a default value in createContext
2. Create a custom hook to access the context
3. Throw a helpful error if the context is used outside of its provider
4. Organize related state and functionality in the provider
