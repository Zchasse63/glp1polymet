# API Integration Pattern

API integrations should follow this pattern:

```ts
/**
 * API client for resource
 */
export const resourceApi = {
  /**
   * Get all resources
   */
  getAll: async (options?: QueryOptions): Promise<Resource[]> => {
    try {
      // Implementation
      return resources;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Get resource by ID
   */
  getById: async (id: string): Promise<Resource> => {
    try {
      // Implementation
      return resource;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Other methods: create, update, delete, etc.
};
```

## Key Characteristics

1. **Resource-Based Organization**: Group API calls by resource type
2. **Consistent Error Handling**: Use a centralized error handling mechanism
3. **Strong Typing**: Define types for parameters and responses
4. **Documentation**: Document each method with JSDoc comments
5. **Method Naming**: Use consistent method names across resources

## Best Practices

1. **Separation of Concerns**: Keep API logic separate from UI components
2. **Centralized Configuration**: Manage base URLs, headers, and auth in one place
3. **Retry Logic**: Implement retry logic for transient failures
4. **Response Transformation**: Transform API responses to match frontend needs
5. **Request Cancellation**: Support cancellation of in-flight requests
