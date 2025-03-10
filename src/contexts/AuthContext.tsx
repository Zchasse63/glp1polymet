
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  provider?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  loginWithSSO: (provider: string) => Promise<AuthUser>;
  register: (username: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to transform Supabase User to our AuthUser type
const transformUser = (user: User): AuthUser => {
  return {
    id: user.id,
    username: user.email?.split('@')[0] || 'user',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
    provider: user.app_metadata?.provider || 'email'
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(transformUser(session.user));
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(transformUser(session.user));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, allow a special test user to bypass Supabase auth
      if (email.includes("test") && password === "password") {
        const mockUser: AuthUser = {
          id: "demo-user-id",
          username: email.split("@")[0],
          email: email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        setUser(mockUser);
        return mockUser;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.user) {
        throw new Error("No user returned from authentication");
      }
      
      const authUser = transformUser(data.user);
      setUser(authUser);
      return authUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSSO = async (provider: string): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, create a mock user
      if (process.env.NODE_ENV === "development" && provider.includes("mock")) {
        const mockUser: AuthUser = {
          id: "demo-user-id",
          username: `user_${Date.now()}`,
          email: `user_${Date.now()}@example.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
          provider
        };
        setUser(mockUser);
        return mockUser;
      }
      
      // Use Supabase's OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.url) {
        throw new Error("No redirect URL returned from authentication provider");
      }
      
      // Redirect to the OAuth provider's login page
      window.location.href = data.url;
      
      // Just for type safety, create a placeholder
      const placeholder: AuthUser = {
        id: "pending",
        username: "pending",
        email: "pending",
        provider
      };
      
      return placeholder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "SSO login failed";
      setError(errorMessage);
      throw err; // Pass the original error for more specific handling
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, create a mock user
      if (process.env.NODE_ENV === "development" && email.includes("test")) {
        const mockUser: AuthUser = {
          id: "demo-user-id",
          username,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        setUser(mockUser);
        return mockUser;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.user) {
        throw new Error("No user returned from registration");
      }
      
      const authUser = transformUser(data.user);
      setUser(authUser);
      return authUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithSSO,
        register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
