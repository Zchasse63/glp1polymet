
import React, { createContext, useContext, useState, useEffect } from "react";
import authService, { AuthCredentials, RegistrationData, ServiceResponse } from "@/services/authService";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithSSO: (provider: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  /**
   * Standardized error handler for auth operations
   */
  const handleAuthResponse = async <T,>(
    authOperation: () => Promise<ServiceResponse<T>>
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authOperation();
      
      if (response.error) {
        setError(response.error);
        throw new Error(response.error);
      }
      
      if (!response.data) {
        const genericError = "Operation failed with no data returned";
        setError(genericError);
        throw new Error(genericError);
      }
      
      return response.data;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    return handleAuthResponse(async () => {
      const credentials: AuthCredentials = { email, password };
      const response = await authService.login(credentials);
      
      if (response.data) {
        setUser(response.data);
      }
      
      return response;
    });
  };

  const loginWithSSO = async (provider: string): Promise<User> => {
    return handleAuthResponse(async () => {
      const response = await authService.loginWithSSO(provider);
      
      if (response.data) {
        setUser(response.data);
      }
      
      return response;
    });
  };

  const register = async (username: string, email: string, password: string): Promise<User> => {
    return handleAuthResponse(async () => {
      const registrationData: RegistrationData = { username, email, password };
      const response = await authService.register(registrationData);
      
      if (response.data) {
        setUser(response.data);
      }
      
      return response;
    });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
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
