
# Component Structure Guide

This guide outlines the recommended structure for page-specific components in our application, following the CodeFarm Development Methodology.

## Component Organization

### Directory Structure

For each page, organize components following this structure:

```
src/pages/PageName/
├── index.tsx                  # Main page component
├── components/                # Page-specific components
│   ├── MainContent.tsx        # Main content container
│   ├── SectionOne.tsx         # Content section components
│   ├── SectionTwo.tsx
│   ├── forms/                 # Form-related components
│   │   ├── CreateForm.tsx
│   │   └── FilterForm.tsx
│   └── items/                 # Item display components
│       ├── ItemList.tsx
│       └── ItemCard.tsx
├── hooks/                     # Page-specific hooks
│   ├── usePageData.ts
│   └── useFormHandling.ts
└── utils/                     # Page-specific utilities
    └── dataTransformers.ts
```

### Component Responsibility Separation

Each component should have a single responsibility:

- **Container Components**: Manage data fetching and state
- **Presentation Components**: Focus on rendering UI based on props
- **Form Components**: Handle form state and validation
- **List Components**: Render collections of items
- **Detail Components**: Display detailed information about a single item

## Component Implementation

### Basic Component Template

```tsx
import React from 'react';
import { ComponentProps } from './types';

/**
 * ComponentName
 * 
 * Description of what this component does.
 */
export const ComponentName: React.FC<ComponentProps> = ({ 
  propOne, 
  propTwo,
  children 
}) => {
  // Component logic here
  
  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  );
};
```

### Component with Internal State

```tsx
import React, { useState, useEffect } from 'react';
import { ComponentProps } from './types';

/**
 * StatefulComponent
 * 
 * A component that manages internal state.
 */
export const StatefulComponent: React.FC<ComponentProps> = ({ initialData }) => {
  // State definitions
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  
  // Effect hooks
  useEffect(() => {
    // Effect logic
    
    return () => {
      // Cleanup logic
    };
  }, [dependencies]);
  
  // Event handlers
  const handleAction = () => {
    // Handler logic
  };
  
  return (
    <div className="component-container">
      {/* Component JSX using state and handlers */}
    </div>
  );
};
```

### Optimized Component Example

```tsx
import React, { useMemo, useCallback } from 'react';
import { ComponentProps } from './types';

/**
 * OptimizedComponent
 * 
 * A performance-optimized component.
 */
export const OptimizedComponent: React.FC<ComponentProps> = ({ 
  expensiveData,
  onAction 
}) => {
  // Memoized calculation
  const processedData = useMemo(() => {
    return expensiveData.map(item => transformItem(item));
  }, [expensiveData]);
  
  // Memoized callback
  const handleAction = useCallback((id: string) => {
    // Handler logic
    onAction(id);
  }, [onAction]);
  
  return (
    <div className="component-container">
      {processedData.map(item => (
        <ChildComponent 
          key={item.id}
          data={item}
          onAction={handleAction}
        />
      ))}
    </div>
  );
};

// Use React.memo for the child component to prevent unnecessary re-renders
const ChildComponent = React.memo(({ data, onAction }) => {
  return (
    <div onClick={() => onAction(data.id)}>
      {/* Child component content */}
    </div>
  );
});
```

For more advanced component patterns, see [Component Patterns](./ComponentPatterns.md).
