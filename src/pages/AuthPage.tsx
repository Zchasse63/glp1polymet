
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { SSOButtons } from "@/components/SSOButtons";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state if still determining auth status
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center p-6 h-full">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome</h1>
            <p className="text-muted-foreground">
              {activeTab === "login" 
                ? "Sign in to continue to your health journey" 
                : "Create an account to start your health journey"}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6">
              <LoginForm />
              <div className="mt-6">
                <SSOButtons />
              </div>
            </TabsContent>
            <TabsContent value="register" className="mt-6">
              <RegisterForm />
              <div className="mt-6">
                <SSOButtons />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
