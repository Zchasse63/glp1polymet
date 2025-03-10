
# Page Implementation Patterns

This guide provides standard implementation patterns for different page types in our application, following the CodeFarm Development Methodology.

## Common Page Implementation

### Basic Page Structure with Data Fetching

```tsx
const PageName = () => {
  const [currentPage, setCurrentPage] = useState("pageName");
  
  // 1. Data fetching with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['resourceName'],
    queryFn: fetchResourceData
  });

  // 2. Page-specific state and effects
  
  // 3. Event handlers
  
  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <PageHeader 
        title="Page Title" 
        description="Optional page description"
        actions={[/* Primary/secondary actions */]} 
      />
      
      <div className="p-4 space-y-4">
        {/* Loading State */}
        {isLoading && <LoadingComponent />}
        
        {/* Error State */}
        {error && <ErrorDisplay error={error} />}
        
        {/* Empty State */}
        {!isLoading && !error && (!data || data.length === 0) && (
          <EmptyState 
            title="No data available"
            description="Description of empty state"
            action={/* Optional action */}
          />
        )}
        
        {/* Main Content */}
        {!isLoading && !error && data && (
          <MainContent data={data} />
        )}
      </div>
    </Layout>
  );
};
```

## Page Type Templates

### List/Index Pages

```tsx
const ListPage = () => {
  // Implementation details...
  
  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <PageHeader 
        title="List Title" 
        actions={[<Button>Add New</Button>]} 
      />
      
      <div className="p-4 space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchInput onChange={handleSearch} />
          <FilterDropdown options={filterOptions} onChange={handleFilter} />
        </div>
        
        {/* List Content */}
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorDisplay error={error} />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <ItemList items={items} onItemClick={handleItemClick} />
        )}
        
        {/* Pagination */}
        <Pagination 
          currentPage={page} 
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      </div>
    </Layout>
  );
};
```

### Detail Pages

```tsx
const DetailPage = () => {
  // Implementation details...
  
  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <PageHeader 
        title={item.title}
        description={item.description}
        actions={[
          <Button variant="outline">Edit</Button>,
          <Button variant="destructive">Delete</Button>
        ]} 
      />
      
      <div className="p-4 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Main Content Sections */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Main Information</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Detail content */}
          </CardContent>
        </Card>
        
        {/* Related Information */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Related Items</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Related items list */}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
```

### Form Pages

```tsx
const FormPage = () => {
  // Implementation details...
  
  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <PageHeader 
        title={isEditing ? "Edit Item" : "Create New Item"}
      />
      
      <div className="p-4">
        <Form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="field1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field 1</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* More form fields */}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};
```

### Error Handling Implementation

```tsx
// Error handling for API calls
const handleApiCall = async () => {
  try {
    await apiFunction();
    // Success handling
  } catch (error) {
    // Use centralized error handling
    const formattedError = formatApiError(error);
    toast({
      title: "Operation Failed",
      description: formattedError.message,
      variant: "destructive",
    });
    
    // Log error for monitoring
    ErrorLogger.logError(error, {
      context: "PageName",
      operation: "apiFunction",
      severity: "error"
    });
  }
};
```

### Performance Optimization Techniques

```tsx
// Memoize expensive components
const MemoizedComponent = React.memo(ExpensiveComponent);

// Memoize callback functions
const handleClick = useCallback(() => {
  // Function logic
}, [dependencies]);

// Memoize computed values
const computedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// Track component performance
useComponentPerformance('ComponentName');
```

By following these implementation patterns, we ensure consistent, high-quality pages with proper error handling and performance optimization.
