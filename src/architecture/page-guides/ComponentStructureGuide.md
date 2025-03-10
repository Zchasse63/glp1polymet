
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

## Component Composition Patterns

### Compound Components

```tsx
import React, { createContext, useContext, useState } from 'react';

// Context for the compound component
const TabContext = createContext(null);

// Main container component
export const Tabs = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">
        {children}
      </div>
    </TabContext.Provider>
  );
};

// Tab list component
Tabs.List = ({ children }) => {
  return (
    <div className="tabs-list">
      {children}
    </div>
  );
};

// Individual tab component
Tabs.Tab = ({ id, children }) => {
  const { activeTab, setActiveTab } = useContext(TabContext);
  
  return (
    <button 
      className={`tab ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
};

// Tab content component
Tabs.Content = ({ id, children }) => {
  const { activeTab } = useContext(TabContext);
  
  if (activeTab !== id) return null;
  
  return (
    <div className="tab-content">
      {children}
    </div>
  );
};

// Usage example
const TabExample = () => (
  <Tabs defaultTab="tab1">
    <Tabs.List>
      <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
      <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
    </Tabs.List>
    <Tabs.Content id="tab1">Content for Tab 1</Tabs.Content>
    <Tabs.Content id="tab2">Content for Tab 2</Tabs.Content>
  </Tabs>
);
```

### Render Props Pattern

```tsx
import React, { useState } from 'react';

/**
 * DataProvider component using render props pattern
 */
export const DataProvider = ({ 
  fetchData, 
  children 
}: {
  fetchData: () => Promise<any>;
  children: (state: {
    data: any | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchDataAndUpdateState = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch
  React.useEffect(() => {
    fetchDataAndUpdateState();
  }, []);
  
  // Render using the render prop
  return children({
    data,
    isLoading,
    error,
    refetch: fetchDataAndUpdateState
  });
};

// Usage example
const DataConsumer = () => (
  <DataProvider fetchData={() => api.fetchItems()}>
    {({ data, isLoading, error, refetch }) => (
      <div>
        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay error={error} />}
        {data && <ItemList items={data} />}
        <button onClick={refetch}>Refresh</button>
      </div>
    )}
  </DataProvider>
);
```

By following these component structure guidelines, we ensure consistent, maintainable, and performant components throughout our application.
