
import { supabase } from "@/lib/supabase";
import { OpenAIEmbeddings } from "@/lib/openai";

// Types for integration data
export interface IntegrationConnection {
  id: string;
  user_id: string;
  provider: string; // e.g., "whoop", "oura", "apple_health"
  status: "active" | "disconnected";
  last_synced: string; // ISO date string
  metadata: Record<string, any>; // Provider-specific data (tokens, user IDs, etc.)
  created_at: string;
  updated_at: string;
}

export interface IntegrationData {
  id: string;
  user_id: string;
  integration_id: string;
  provider: string; // Which integration provided this data
  data_type: string; // e.g., "weight", "sleep", "activity", "nutrition"
  timestamp: string; // When this data point was recorded
  data: Record<string, any>; // The actual data, structure depends on data_type
  created_at: string;
}

// Database schema reference (would be implemented in Supabase)
/*
-- Table for tracking which integrations a user has connected
CREATE TABLE integration_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  provider VARCHAR NOT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('active', 'disconnected')),
  last_synced TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing data from integrations
CREATE TABLE integration_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  integration_id UUID NOT NULL REFERENCES integration_connections(id),
  provider VARCHAR NOT NULL,
  data_type VARCHAR NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster querying
CREATE INDEX idx_integration_data_user_type ON integration_data(user_id, data_type);
CREATE INDEX idx_integration_data_timestamp ON integration_data(timestamp);
*/

/**
 * Fetches active integrations for a user
 */
export const fetchUserIntegrations = async (userId: string): Promise<IntegrationConnection[]> => {
  const { data, error } = await supabase
    .from('integration_connections')
    .select('*')
    .eq('user_id', userId)
    .order('provider');
    
  if (error) {
    console.error("Error fetching user integrations:", error);
    return [];
  }
  
  return data || [];
};

/**
 * Fetches health data from integrations with optional filtering by provider
 */
export const fetchIntegrationData = async (
  userId: string, 
  dataType: string,
  options: {
    provider?: string,
    startDate?: string,
    endDate?: string,
    limit?: number
  } = {}
): Promise<Record<string, any>[]> => {
  let query = supabase
    .from('integration_data')
    .select('*')
    .eq('user_id', userId)
    .eq('data_type', dataType);
    
  // Apply filters if provided
  if (options.provider) {
    query = query.eq('provider', options.provider);
  }
  
  if (options.startDate) {
    query = query.gte('timestamp', options.startDate);
  }
  
  if (options.endDate) {
    query = query.lte('timestamp', options.endDate);
  }
  
  // Order by timestamp descending and apply limit
  query = query.order('timestamp', { ascending: false });
  
  if (options.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
    
  if (error) {
    console.error(`Error fetching ${dataType} data:`, error);
    return [];
  }
  
  // Extract the actual data from the records
  return (data || []).map(record => ({
    id: record.id,
    timestamp: record.timestamp,
    provider: record.provider,
    ...record.data
  }));
};

/**
 * Normalizes data from different providers to a consistent format
 * This would be expanded for each data type and provider
 */
export const normalizeIntegrationData = (provider: string, dataType: string, rawData: any): Record<string, any> => {
  // Example normalization for weight data
  if (dataType === 'weight') {
    switch (provider) {
      case 'whoop':
        // Whoop might provide weight in kg
        return {
          weight: rawData.body_weight,
          unit: 'kg',
          // Convert to our preferred unit if needed
          weight_lbs: rawData.body_weight * 2.20462
        };
      case 'oura':
        // Oura might provide weight in different format
        return {
          weight: rawData.weight,
          unit: rawData.unit || 'kg',
          weight_lbs: rawData.unit === 'lbs' ? rawData.weight : rawData.weight * 2.20462
        };
      default:
        return rawData;
    }
  }
  
  // Example normalization for sleep data
  if (dataType === 'sleep') {
    switch (provider) {
      case 'whoop':
        return {
          duration_minutes: rawData.sleep_duration,
          deep_sleep_minutes: rawData.deep_sleep,
          rem_sleep_minutes: rawData.rem_sleep,
          light_sleep_minutes: rawData.light_sleep,
          quality_score: rawData.sleep_quality
        };
      case 'oura':
        return {
          duration_minutes: rawData.duration,
          deep_sleep_minutes: rawData.deep,
          rem_sleep_minutes: rawData.rem,
          light_sleep_minutes: rawData.light,
          quality_score: rawData.score
        };
      default:
        return rawData;
    }
  }
  
  // If no specific normalization, return as is
  return rawData;
};

/**
 * Stores data from an integration
 */
export const storeIntegrationData = async (
  userId: string,
  integrationId: string,
  provider: string,
  dataType: string,
  timestamp: string,
  data: Record<string, any>
): Promise<boolean> => {
  // Normalize the data first
  const normalizedData = normalizeIntegrationData(provider, dataType, data);
  
  const { error } = await supabase
    .from('integration_data')
    .insert({
      user_id: userId,
      integration_id: integrationId,
      provider,
      data_type: dataType,
      timestamp,
      data: normalizedData
    });
    
  if (error) {
    console.error(`Error storing ${dataType} data:`, error);
    return false;
  }
  
  return true;
};

/**
 * Updates the last_synced timestamp for an integration
 */
export const updateIntegrationLastSynced = async (
  integrationId: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('integration_connections')
    .update({ 
      last_synced: new Date().toISOString(),
      updated_at: new Date().toISOString() 
    })
    .eq('id', integrationId);
    
  if (error) {
    console.error("Error updating integration last_synced:", error);
    return false;
  }
  
  return true;
};

/**
 * Disconnects an integration
 * Note: This doesn't delete the data, just marks the integration as disconnected
 */
export const disconnectIntegration = async (
  userId: string,
  integrationId: string
): Promise<boolean> => {
  const { error } = await supabase
    .from('integration_connections')
    .update({ 
      status: 'disconnected',
      updated_at: new Date().toISOString() 
    })
    .eq('id', integrationId)
    .eq('user_id', userId);
    
  if (error) {
    console.error("Error disconnecting integration:", error);
    return false;
  }
  
  return true;
};

/**
 * Gets the most recent data points for different health metrics
 */
export const getLatestHealthMetrics = async (userId: string): Promise<Record<string, any>> => {
  // Define the metrics we want to fetch
  const metricTypes = ['weight', 'sleep', 'activity', 'nutrition', 'vitals'];
  const results: Record<string, any> = {};
  
  // Fetch the latest data point for each metric type
  for (const metricType of metricTypes) {
    const data = await fetchIntegrationData(userId, metricType, { limit: 1 });
    if (data.length > 0) {
      results[metricType] = data[0];
    }
  }
  
  return results;
};

// Mock function to simulate fetching data from a third-party API
// In a real implementation, this would make an actual API call
export const mockFetchFromProviderAPI = (
  provider: string,
  dataType: string,
  userId: string,
  startDate: string,
  endDate: string
): Promise<any[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate mock data based on provider and type
      const mockData: any[] = [];
      
      // Calculate number of days between start and end dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      // Generate a data point for each day
      for (let i = 0; i < daysDiff; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        
        if (dataType === 'weight') {
          // Weight fluctuates between 70-72kg
          mockData.push({
            timestamp: date.toISOString(),
            body_weight: 70 + Math.random() * 2,
            lean_mass: 55 + Math.random() * 1,
            fat_mass: 15 + Math.random() * 1
          });
        } else if (dataType === 'sleep') {
          // Sleep between 6-8 hours
          const sleepDuration = 360 + Math.random() * 120;
          mockData.push({
            timestamp: date.toISOString(),
            sleep_duration: sleepDuration,
            deep_sleep: sleepDuration * 0.2 + Math.random() * 30,
            rem_sleep: sleepDuration * 0.25 + Math.random() * 30,
            light_sleep: sleepDuration * 0.55 + Math.random() * 30,
            sleep_quality: 70 + Math.random() * 30
          });
        } else if (dataType === 'activity') {
          // Steps between 5000-10000
          mockData.push({
            timestamp: date.toISOString(),
            steps: 5000 + Math.random() * 5000,
            active_calories: 300 + Math.random() * 200,
            distance_km: 3 + Math.random() * 4,
            active_minutes: 30 + Math.random() * 60
          });
        }
      }
      
      resolve(mockData);
    }, 500); // Simulate 500ms API delay
  });
};
