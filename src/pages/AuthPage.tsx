
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { EnhancedErrorBoundary } from "@/utils/errorHandling/EnhancedErrorBoundary";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ErrorGroup } from "@/utils/errorHandling/types";

/**
 * Authentication Page Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Simplified authentication process
 * - Holistic Development: Comprehensive authentication options
 */
const AuthPage = () => {
  // Set document title
  useDocumentTitle("Sign In | Health Insights");
  
  // Router hooks for navigation
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, if any
  const from = location.state?.from?.pathname || "/";
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Handle successful authentication
  const handleAuthSuccess = () => {
    // Navigate to the intended destination or home
    navigate(from, { replace: true });
  };
  
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Health Insights
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your health metrics and get personalized insights
          </p>
        </div>
        
        <EnhancedErrorBoundary 
          name="AuthPage" 
          group={ErrorGroup.AUTH}
        >
          <Tabs 
            defaultValue="login" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardContent className="pt-4">
                  <LoginForm onSuccess={handleAuthSuccess} />
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center text-center">
                  <p className="mt-2 text-xs text-muted-foreground">
                    By logging in, you agree to our{" "}
                    <a href="#" className="underline underline-offset-2">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline underline-offset-2">
                      Privacy Policy
                    </a>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardContent className="pt-4">
                  <RegisterForm onSuccess={handleAuthSuccess} />
                </CardContent>
                <CardFooter className="flex flex-col items-center text-center">
                  <p className="mt-2 text-xs text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="underline underline-offset-2">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline underline-offset-2">
                      Privacy Policy
                    </a>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </EnhancedErrorBoundary>
        
        <p className="px-8 text-center text-sm text-muted-foreground">
          Demo credentials: <code>test@example.com</code> / <code>password</code>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
