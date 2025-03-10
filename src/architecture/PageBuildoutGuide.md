
# Universal Page Buildout Guide

This guide provides a standardized approach to building new pages in our application, aligned with the CodeFarm Development Methodology.

## Architectural Alignment

When building new pages, follow these foundational principles from our CodeFarm methodology:

- **Holistic Development**: Combine technical excellence with strategic thinking
- **User-Centric Design**: Prioritize end-user experience in every development stage
- **Sustainable Code**: Create maintainable, scalable, and efficient software solutions
- **Continuous Learning**: Embrace emerging technologies and methodologies

## Page Development Workflow

### 1. Page Planning

- Define the page's purpose and user goals
- Identify required data and API integrations
- Map user journeys and interaction flows
- Determine necessary components and layouts

### 2. Page Structure Implementation

#### Common Page Layout

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
      {/* Page Header Section */}
      <PageHeader 
        title="Page Title" 
        description="Optional page description"
        actions={[/* Primary/secondary actions */]} 
      />
      
      {/* Content Wrapper */}
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

export default PageName;
```

### 3. Component Organization

For each new page, follow this recommended file structure:

```
src/pages/
└── PageName/
    ├── index.tsx              # Main page component
    ├── components/            # Page-specific components
    │   ├── PageHeader.tsx
    │   ├── MainContent.tsx
    │   └── [other components]
    ├── hooks/                 # Page-specific hooks
    │   └── usePageData.ts
    └── utils/                 # Page-specific utilities
        └── pageHelpers.ts
```

### 4. Responsive Design Standards

All pages must be responsive, following these guidelines:

- Mobile-first implementation with progressive enhancement
- Consistent breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Single column layout for mobile, multi-column where appropriate for larger screens
- Touch-friendly targets (min 44px) for mobile interfaces

### 5. Accessibility Requirements

Every page must meet these accessibility standards:

- Semantic HTML structure with proper heading hierarchy
- ARIA attributes for interactive components
- Keyboard navigation support
- Color contrast ratio of at least 4.5:1 for text
- Focus states for all interactive elements
- Screen reader announcements for dynamic content

### 6. Error Handling Standards

Implement comprehensive error handling on all pages:

- Use the application's `ErrorBoundary` component
- Implement appropriate error states for API failures
- Use the `ErrorLogger` for consistent error tracking
- Provide user-friendly error messages with recovery options

### 7. Performance Guidelines

Optimize page performance by following these practices:

- Use React Query for efficient data fetching and caching
- Implement proper loading states
- Lazy-load off-screen content and heavy components
- Apply the `useComponentPerformance` hook for performance tracking

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

## Testing Checklist

Before finalizing any page, ensure it meets these requirements:

### Functional Testing
- [ ] All features work with valid inputs
- [ ] Edge cases are handled appropriately
- [ ] All interactions provide feedback
- [ ] Page integrates correctly with the rest of the app

### Responsive Testing
- [ ] Layout works at all screen sizes
- [ ] Content is accessible on mobile
- [ ] Touch targets are properly sized
- [ ] Layout adjusts when browser is resized

### Accessibility Testing
- [ ] Page is navigable by keyboard
- [ ] Screen readers can access all content
- [ ] Color contrast meets WCAG standards
- [ ] Focus states are clearly visible

### Performance Testing
- [ ] Page loads efficiently
- [ ] Interactions remain responsive
- [ ] Animations are smooth
- [ ] Memory usage remains stable

## Implementation Process

Follow this process for all new pages:

1. **Planning**
   - Review requirements
   - Identify components and data needs
   - Plan page structure

2. **Component Development**
   - Create/reuse components
   - Follow established patterns
   - Test components in isolation

3. **Page Integration**
   - Implement routing
   - Connect to APIs
   - Add state management
   - Implement error handling

4. **Testing & Refinement**
   - Verify functionality
   - Test edge cases
   - Optimize performance
   - Refine interactions

5. **Documentation**
   - Add code comments
   - Update documentation
   - Document limitations

By following this guide, we ensure consistent, high-quality pages that align with our CodeFarm methodology and provide excellent user experiences.
