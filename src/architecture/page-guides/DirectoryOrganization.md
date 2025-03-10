
# Directory Organization Guide

This guide outlines the recommended directory structure for organizing pages and their components in our application, following the CodeFarm Development Methodology.

## Page Directory Structure

Each page should follow this standard directory structure:

```
src/pages/
└── PageName/
    ├── index.tsx              # Main page component
    ├── PageName.test.tsx      # Page tests
    ├── components/            # Page-specific components
    │   ├── index.ts           # Re-exports for components
    │   ├── Header/            # Component directories
    │   │   ├── Header.tsx
    │   │   └── index.ts
    │   └── ...
    ├── hooks/                 # Page-specific hooks
    │   ├── index.ts           # Re-exports for hooks
    │   ├── usePageData.ts
    │   └── ...
    ├── utils/                 # Page-specific utilities
    │   ├── index.ts           # Re-exports for utilities
    │   ├── helpers.ts
    │   └── ...
    └── types.ts               # Page-specific type definitions
```

## Component Directory Structure

Each component should follow this standard directory structure:

```
ComponentName/
├── index.ts                   # Re-exports the component
├── ComponentName.tsx          # Main component implementation
├── ComponentName.test.tsx     # Component tests
├── ComponentName.module.css   # Component styles (if not using Tailwind)
└── types.ts                   # Component-specific types
```

## Best Practices

### Exporting Components

Use index.ts files to clean up imports:

```ts
// src/pages/Dashboard/components/index.ts
export { Header } from './Header';
export { MetricsPanel } from './MetricsPanel';
export { ActivityFeed } from './ActivityFeed';
```

This allows for cleaner imports in other files:

```tsx
// Before
import { Header } from './components/Header/Header';
import { MetricsPanel } from './components/MetricsPanel/MetricsPanel';

// After
import { Header, MetricsPanel } from './components';
```

### Component Co-location

- Keep related files together in the same directory
- Place component-specific tests, styles, and types in the component directory
- Co-locate hooks that are specific to a single component

### Module Boundaries

- Export only what's necessary from each module
- Hide implementation details by not exporting internal functions
- Use barrel exports (index.ts) to define the public API of a module

### Feature Folders

For larger features, consider a feature-based organization:

```
src/features/
└── Authentication/
    ├── pages/               # Feature-specific pages
    ├── components/          # Feature-specific components
    ├── hooks/               # Feature-specific hooks
    ├── utils/               # Feature-specific utilities
    ├── services/            # Feature-specific services
    ├── types.ts             # Feature-specific types
    └── index.ts             # Public API of the feature
```

By following these directory organization guidelines, we maintain a consistent, scalable, and maintainable codebase that's easy to navigate.
