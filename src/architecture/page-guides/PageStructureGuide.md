
# Page Structure Guide

This guide outlines the standard structure for pages in our application, following the CodeFarm Development Methodology.

## Page Development Workflow

### 1. Page Planning

- Define the page's purpose and user goals
- Identify required data and API integrations
- Map user journeys and interaction flows
- Determine necessary components and layouts

### 2. Common Page Structure

Every page should include these key elements:

#### Page Container

```tsx
const PageName = () => {
  const [currentPage, setCurrentPage] = useState("pageName");
  
  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {/* Page Content */}
    </Layout>
  );
};
```

#### Page Header

```tsx
<PageHeader 
  title="Page Title" 
  description="Optional page description"
  actions={[/* Primary/secondary actions */]} 
/>
```

#### Breadcrumb Navigation (when needed)

```tsx
<Breadcrumb items={[
  { label: "Home", href: "/" },
  { label: "Section", href: "/section" },
  { label: "Current Page", href: "/section/page", current: true }
]} />
```

#### Content Wrapper

```tsx
<div className="p-4 space-y-4">
  {/* Page content goes here */}
</div>
```

### 3. Data State Handling

All pages should handle these data states:

#### Loading State

```tsx
{isLoading && <LoadingComponent />}
```

#### Error State

```tsx
{error && <ErrorDisplay error={error} />}
```

#### Empty State

```tsx
{!isLoading && !error && (!data || data.length === 0) && (
  <EmptyState 
    title="No data available"
    description="Description of empty state"
    action={/* Optional action */}
  />
)}
```

#### Main Content

```tsx
{!isLoading && !error && data && (
  <MainContent data={data} />
)}
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

## File Organization

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

By following this structure, we ensure consistent, maintainable pages that provide excellent user experiences.
