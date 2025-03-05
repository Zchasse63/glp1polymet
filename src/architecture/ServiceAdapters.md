# Service Adapters Pattern

This document describes the adapter pattern used for integrating with external services.

## Adapter Pattern

We use the adapter pattern to convert external service APIs into a consistent interface for our application. This allows us to:

1. Isolate the application from external API changes
2. Provide a consistent interface regardless of the data source
3. Handle service-specific error cases and data formats

## Health Data Adapter Interface

All health data adapters implement a common interface:

```typescript
interface HealthDataAdapter {
  // Connection methods
  connect(userId: string): Promise<ConnectionResult>;
  disconnect(userId: string): Promise<boolean>;
  isConnected(userId: string): Promise<boolean>;
  
  // Data methods
  fetchData(
    userId: string, 
    dataType: IntegrationDataType, 
    options: FetchOptions
  ): Promise<HealthData[]>;
  
  // Metadata methods
  getAvailableDataTypes(): IntegrationDataType[];
  getSupportedTimeRange(): { min: Date, max: Date } | null;
  getLastSyncTime(): Date | null;
}
```

## Adapter Implementation Example

```typescript
class FitbitAdapter implements HealthDataAdapter {
  private apiClient: FitbitApiClient;
  
  constructor() {
    this.apiClient = new FitbitApiClient();
  }
  
  async connect(userId: string): Promise<ConnectionResult> {
    try {
      // Implementation
    } catch (error) {
      // Handle error
    }
  }
  
  // Other method implementations
}
```

## Adapter Registry

The application uses an adapter registry to manage different service adapters:

```typescript
class AdapterRegistry {
  private adapters: Map<IntegrationProvider, HealthDataAdapter> = new Map();
  
  registerAdapter(provider: IntegrationProvider, adapter: HealthDataAdapter) {
    this.adapters.set(provider, adapter);
  }
  
  getAdapter(provider: IntegrationProvider): HealthDataAdapter | null {
    return this.adapters.get(provider) || null;
  }
  
  getAllAdapters(): Map<IntegrationProvider, HealthDataAdapter> {
    return new Map(this.adapters);
  }
}
```

## Using Adapters

Services use adapters to fetch data from different sources with a consistent interface:

```typescript
class HealthDataService {
  private adapterRegistry: AdapterRegistry;
  
  constructor(adapterRegistry: AdapterRegistry) {
    this.adapterRegistry = adapterRegistry;
  }
  
  async fetchUserData(
    userId: string,
    dataType: IntegrationDataType,
    provider: IntegrationProvider,
    options: FetchOptions
  ): Promise<HealthData[]> {
    const adapter = this.adapterRegistry.getAdapter(provider);
    
    if (!adapter) {
      throw new Error(`No adapter registered for provider: ${provider}`);
    }
    
    return adapter.fetchData(userId, dataType, options);
  }
  
  // Other methods
}
```

## Benefits of the Adapter Pattern

1. **Abstraction**: The application doesn't need to know the details of each service
2. **Flexibility**: New services can be added without changing the application code
3. **Testability**: Adapters can be mocked easily for testing
4. **Resilience**: Service-specific error handling
5. **Consistency**: Uniform interface regardless of data source
