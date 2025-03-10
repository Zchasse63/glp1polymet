
# Component Composition Patterns

This guide covers advanced patterns for component composition in our application, following the CodeFarm Development Methodology.

## Compound Components

The compound component pattern creates a set of components that work together to provide a cohesive user interface.

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

## Render Props Pattern

The render props pattern allows components to share code using a prop whose value is a function.

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

## Custom Hooks Pattern

Extract and share stateful logic between components using custom hooks.

```tsx
// Custom hook for form handling
const useForm = (initialValues, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
    } catch (err) {
      setErrors(err.errors);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};

// Usage
const FormComponent = () => {
  const { values, errors, isSubmitting, handleChange, handleSubmit } = 
    useForm({ name: '', email: '' }, submitToAPI);
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="name"
        value={values.name}
        onChange={handleChange}
      />
      {errors.name && <span>{errors.name}</span>}
      
      <input 
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      {errors.email && <span>{errors.email}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

By leveraging these component patterns, we can create more modular, reusable, and maintainable components throughout our application.
