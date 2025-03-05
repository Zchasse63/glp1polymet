
# Custom Hook Pattern

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

## Key Elements

1. **Consistent Return Structure**: Return objects with `data`, `loading`, and `error` properties
2. **Error Handling**: Properly catch and handle errors
3. **Cleanup**: Implement cleanup functions when necessary
4. **Dependency Array**: Carefully manage dependencies in useEffect
5. **Action Functions**: Return functions for user interactions (e.g., refetch)

## Organization

Place hooks in a dedicated `hooks` directory, either at the application level for shared hooks or within component directories for component-specific hooks.
