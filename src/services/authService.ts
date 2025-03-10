
import { AuthUser } from "@/contexts/AuthContext";
import { generateId } from "@/lib/utils";

/**
 * Authentication Service
 * 
 * Handles all authentication-related operations following the
 * repository pattern to abstract the actual implementation.
 */

// Authentication response with standardized error handling
export interface AuthResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

// Generic service response type for consistent error handling
export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

// Auth credentials type
export interface AuthCredentials {
  email: string;
  password: string;
}

// Registration data type
export interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

/**
 * Authentication service class implementing the repository pattern
 * to abstract the authentication implementation details
 */
class AuthService {
  // Store the user in memory for the session
  private currentUser: AuthUser | null = null;
  
  constructor() {
    // Initialize by checking localStorage on service instantiation
    this.initializeFromStorage();
  }
  
  /**
   * Initialize the auth state from localStorage
   */
  private initializeFromStorage(): void {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      // Clear invalid storage data
      localStorage.removeItem("user");
    }
  }
  
  /**
   * Login with email and password
   */
  async login(credentials: AuthCredentials): Promise<ServiceResponse<AuthUser>> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock authentication logic for demonstration
      if (credentials.email.includes("test") && credentials.password === "password") {
        const user: AuthUser = {
          id: generateId(),
          username: credentials.email.split("@")[0],
          email: credentials.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`
        };
        
        // Persist user data
        localStorage.setItem("user", JSON.stringify(user));
        this.currentUser = user;
        
        return { data: user, error: null };
      }
      
      return { data: null, error: "Invalid credentials" };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return { data: null, error: errorMessage };
    }
  }
  
  /**
   * Login with SSO provider
   */
  async loginWithSSO(provider: string): Promise<ServiceResponse<AuthUser>> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock SSO authentication for demonstration
      const mockEmail = `user_${generateId()}@example.com`;
      const user: AuthUser = {
        id: generateId(),
        username: `user_${generateId()}`,
        email: mockEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${mockEmail}`,
        provider
      };
      
      // Persist user data
      localStorage.setItem("user", JSON.stringify(user));
      this.currentUser = user;
      
      return { data: user, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return { data: null, error: errorMessage };
    }
  }
  
  /**
   * Register a new user
   */
  async register(data: RegistrationData): Promise<ServiceResponse<AuthUser>> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock registration logic for demonstration
      const user: AuthUser = {
        id: generateId(),
        username: data.username,
        email: data.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`
      };
      
      // Persist user data
      localStorage.setItem("user", JSON.stringify(user));
      this.currentUser = user;
      
      return { data: user, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return { data: null, error: errorMessage };
    }
  }
  
  /**
   * Logout the current user
   */
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem("user");
  }
  
  /**
   * Get the current authenticated user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }
  
  /**
   * Check if a user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

// Create a singleton instance
const authService = new AuthService();

export default authService;
