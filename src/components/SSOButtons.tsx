
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Github, Mail, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkProviderEnabled } from "@/lib/supabase";

/**
 * SSO Buttons Component
 * Implements the Adapter Pattern to provide a consistent
 * interface for different SSO providers
 */
export function SSOButtons() {
  const { loginWithSSO, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [enabledProviders, setEnabledProviders] = useState<Record<string, boolean>>({
    github: true,
    google: true
  });
  
  // Get the intended destination from location state, if any
  const from = location.state?.from?.pathname || "/";

  // Check which providers are enabled
  useEffect(() => {
    const checkProviders = async () => {
      const githubEnabled = await checkProviderEnabled("github");
      const googleEnabled = await checkProviderEnabled("google");
      
      setEnabledProviders({
        github: githubEnabled,
        google: googleEnabled
      });
    };
    
    checkProviders();
  }, []);

  const handleSSOLogin = async (provider: string) => {
    try {
      setIsLoading(provider);
      
      // Check if provider is enabled before attempting login
      if (!enabledProviders[provider]) {
        throw new Error(`${provider} login is not configured. Please check Supabase provider settings.`);
      }
      
      // For GitHub, open a new window for authentication to avoid X-Frame-Options issues
      if (provider === "github") {
        // Store the return URL in localStorage to redirect after auth
        localStorage.setItem("authRedirectPath", from);
        await loginWithSSO(provider);
      } else {
        await loginWithSSO(provider);
        
        toast({
          title: "Login successful",
          description: `Logged in with ${provider}`,
        });
        
        // Navigate to the intended destination
        navigate(from, { replace: true });
      }
    } catch (err) {
      let errorMessage = error || `Failed to login with ${provider}`;
      
      // Provide specific feedback for provider not enabled error
      if (err instanceof Error) {
        if (err.message.includes("not enabled") || err.message.includes("not configured")) {
          errorMessage = err.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      
      console.error("SSO login error:", err);
    } finally {
      setIsLoading(null);
    }
  };

  // Demo mode notice
  const isDemoMode = process.env.NODE_ENV === "development";

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      {isDemoMode && (
        <div className="text-xs text-amber-600 my-1 text-center">
          {!enabledProviders.github && !enabledProviders.google ? (
            "Social logins are not configured in Supabase"
          ) : (
            "For social logins to work, providers must be enabled in Supabase"
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button 
          variant="outline" 
          onClick={() => handleSSOLogin("github")}
          className="w-full"
          disabled={isLoading !== null || !enabledProviders.github}
        >
          {isLoading === "github" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          GitHub
          {!enabledProviders.github && isDemoMode && " (Disabled)"}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleSSOLogin("google")}
          className="w-full"
          disabled={isLoading !== null || !enabledProviders.google}
        >
          {isLoading === "google" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg 
              className="mr-2 h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Google
          {!enabledProviders.google && isDemoMode && " (Disabled)"}
        </Button>
      </div>
    </div>
  );
}
