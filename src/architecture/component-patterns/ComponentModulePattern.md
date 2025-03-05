
# Component Module Pattern

Every component should follow this standard organization:

```
ComponentName/
├── ComponentName.tsx      # Main component implementation
├── ComponentName.test.tsx # Component tests
├── index.ts               # Re-export main component
└── types.ts               # Component-specific types (if needed)
```

## File Purposes

- **ComponentName.tsx**: Contains the main component implementation
- **ComponentName.test.tsx**: Contains tests for the component
- **index.ts**: Re-exports the component to simplify imports
- **types.ts**: Contains types specific to this component

## Example

For a `Button` component, the file structure would be:

```
Button/
├── Button.tsx
├── Button.test.tsx
├── index.ts
└── types.ts
```

This structure keeps components self-contained and makes it easier to find related files.
