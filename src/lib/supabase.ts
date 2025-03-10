
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// The URL and key are still included directly since this is a demo application
// In a production environment, these would be environment variables
const supabaseUrl = 'https://xngupqmwtbncjkegbhys.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZ3VwcW13dGJuY2prZWdiaHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTUwNTEsImV4cCI6MjA1NjY5MTA1MX0.pziqAse7yC0cFl-8B1LUUpwdZY5xO-wAMDTMrCTHC3A';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Add a helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
  
  return user;
};

// Export a function to check if a user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return user !== null;
};
