
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { SSOButtons } from "@/components/SSOButtons";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { SkipToContent } from "@/utils/accessibility/SkipToContent";
import { ErrorLogger } from "@/utils/errorHandling";

/**
 * Authentication Page
 * 
 * Implements the Facade Pattern to provide a simple interface
 * for the complex authentication subsystem
 * 
 * Following CodeFarm principles:
 * - User-Centric Design: Accessible auth forms
 * - Error Handling: Consistent error handling
 * - Security-First Approach: Secure authentication flow
 */
const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the intended destination from the location state, if any
  const from = location.state?.from?.pathname || "/";

  // Initialize the active tab based on URL parameters
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const tab = searchParams.get("tab");
      
      if (tab === "register" || tab === "login") {
        setActiveTab(tab);
      }
    } catch (error) {
      ErrorLogger.error(
        "Failed to parse URL parameters",
        "AUTH_PAGE_URL_ERROR",
        { url: location.search },
        error,
        false
      );
    }
  }, [location]);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  // Loading state component using Skeleton UI
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md space-y-8 p-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <Layout>
      {/* Skip to content link for keyboard users */}
      <SkipToContent contentId="auth-content" />
      
      <motion.div 
        id="auth-content"
        className="flex flex-col justify-center items-center p-6 min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md space-y-4" role="main">
          <div className="text-center mb-8">
            <motion.h1 
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome
            </motion.h1>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {activeTab === "login" 
                ? "Sign in to continue to your health journey" 
                : "Create an account to start your health journey"}
            </motion.p>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="login" className="mt-6">
                <LoginForm onSuccess={handleAuthSuccess} />
                <div className="mt-6">
                  <SSOButtons />
                </div>
              </TabsContent>
              <TabsContent value="register" className="mt-6">
                <RegisterForm onSuccess={handleAuthSuccess} />
                <div className="mt-6">
                  <SSOButtons />
                </div>
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AuthPage;
