
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// The URL and key are still included directly since this is a demo application
// In a production environment, these would be environment variables
const supabaseUrl = 'https://xngupqmwtbncjkegbhys.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZ3VwcW13dGJuY2prZWdiaHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTUwNTEsImV4cCI6MjA1NjY5MTA1MX0.pziqAse7yC0cFl-8B1LUUpwdZY5xO-wAMDTMrCTHC3A';

// Create Supabase client with custom error handling
export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce', // Use PKCE flow for more secure authentication
    },
  }
);

// Add a helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
    
    return user;
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    return null;
  }
};

// Export a function to check if a user is authenticated
export const isAuthenticated = async () => {
  try {
    const user = await getCurrentUser();
    return user !== null;
  } catch (err) {
    console.error('Error checking authentication:', err);
    return false;
  }
};

// Helper function to check if providers are configured
export const checkProviderEnabled = async (provider: string): Promise<boolean> => {
  try {
    // This is a simple check that will catch most issues but not all
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        skipBrowserRedirect: true,
      }
    });
    
    return Boolean(data?.url) && !error;
  } catch (err) {
    console.error(`Error checking if ${provider} is enabled:`, err);
    return false;
  }
};

// Listen for auth events from external auth providers
export const setupAuthListener = () => {
  // Check for auth redirect after returning from external provider
  const checkAuthRedirect = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      // If we have a session and there's a redirect path saved, redirect to it
      if (data?.session && !error) {
        const redirectPath = localStorage.getItem("authRedirectPath") || "/";
        localStorage.removeItem("authRedirectPath"); // Clean up
        
        if (window.location.pathname.includes('/auth')) {
          window.location.href = redirectPath;
        }
      }
    } catch (err) {
      console.error("Error handling auth redirect:", err);
    }
  };
  
  // Check immediately and whenever hash changes
  checkAuthRedirect();
  window.addEventListener('hashchange', checkAuthRedirect);
};

// Initialize the auth listener
setupAuthListener();
