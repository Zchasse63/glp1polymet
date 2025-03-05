
# Utility Function Pattern

Utility functions should be pure, well-typed, and documented:

```ts
/**
 * Function description
 * @param param1 Description of param1
 * @param param2 Description of param2
 * @returns Description of return value
 */
export const utilityFunction = (
  param1: Type1, 
  param2: Type2
): ReturnType => {
  // Function implementation
  return result;
};
```

## Characteristics of Good Utility Functions

1. **Pure Functions**: No side effects, same output for same input
2. **Single Responsibility**: Each function should do one thing well
3. **Strong Typing**: Use TypeScript to define parameter and return types
4. **Documentation**: Include JSDoc comments explaining purpose and parameters
5. **Testing**: Easy to test due to their pure nature

## Organization

Group related utility functions in dedicated files based on their domain or purpose. For example:

- `dateUtils.ts` - Functions for date manipulation
- `stringUtils.ts` - Functions for string operations
- `mathUtils.ts` - Functions for mathematical operations
