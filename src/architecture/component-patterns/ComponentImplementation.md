
# Component Implementation Pattern

When implementing a component, follow this standard pattern:

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

## Index Export Pattern

The index.ts file should export the component as follows:

```ts
// Export main component as default
export { ComponentName } from './ComponentName';
export type { ComponentProps } from './types';
```

## Best Practices

1. Use descriptive prop names
2. Handle loading and error states consistently
3. Use TypeScript for type safety
4. Keep components focused on a single responsibility
5. Consider extracting complex logic to custom hooks
6. Use consistent naming conventions
