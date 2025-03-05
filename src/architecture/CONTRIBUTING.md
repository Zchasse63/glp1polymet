
# Contributing Guide

This document provides guidelines for contributing to this project, following the CodeFarm Development Methodology.

## Development Process

### Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`

### Branch Naming Convention

Use the following format for branch names:
- `feature/`: For new features
- `fix/`: For bug fixes
- `refactor/`: For code refactoring
- `docs/`: For documentation changes
- `test/`: For test-related changes

Example: `feature/add-recommendation-sorting`

### Commit Message Format

Follow this format for commit messages:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Build process or tooling changes

Example: `feat(recommendations): add sorting by impact level`

## Code Style Guide

### TypeScript

- Use TypeScript for all new code
- Define interfaces for props and state
- Avoid using `any` type
- Use TypeScript's utility types when appropriate

### React Components

- Use functional components with hooks
- Define prop types using TypeScript interfaces
- Use descriptive names for components and props
- Break large components into smaller, focused ones
- Use custom hooks to extract complex logic

### File Organization

- Group related components in directories
- Use index.ts files for clean exports
- Follow the component module pattern defined in architecture docs

### CSS/Styling

- Use Tailwind CSS for styling
- Follow utility-first approach
- Group related classes together
- Use responsive design principles

## Testing Strategy

- Write unit tests for utilities and hooks
- Write component tests for UI components
- Test critical user flows with integration tests
- Use mock data for testing

## Documentation Requirements

- Add JSDoc comments to all components, hooks, and utilities
- Document complex logic with inline comments
- Update README.md with new features or changes
- Document architecture decisions in ADRs

## Accessibility Guidelines

- Ensure keyboard navigation works for all interactive elements
- Use semantic HTML elements
- Add appropriate ARIA attributes
- Maintain sufficient color contrast
- Support screen readers
- Test with accessibility tools

## Performance Considerations

- Use React.memo for expensive components
- Apply useCallback and useMemo appropriately
- Optimize rendering performance
- Monitor bundle size

## Review Process

- All code changes require a pull request
- At least one reviewer must approve changes
- Address all review comments before merging
- Ensure CI checks pass

Thank you for contributing to our project!
