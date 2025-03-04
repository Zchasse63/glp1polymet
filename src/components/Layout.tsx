
import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon, BellIcon, PlusIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/Navigation";
import { UserProfile } from "@/components/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
}

export function Layout({
  children,
  className,
  currentPage,
  setCurrentPage,
}: LayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Get theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
    >
      <div
        className={cn("max-w-md mx-auto bg-white dark:bg-gray-800 min-h-screen flex flex-col shadow-lg", className)}
      >
        {currentPage && setCurrentPage ? (
          <>
            <header
              className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 bg-white dark:bg-gray-800"
            >
              <UserProfile />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {theme === "light" ? (
                    <MoonIcon className="h-5 w-5" />
                  ) : (
                    <SunIcon className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                >
                  <BellIcon className="h-5 w-5" />
                  <span
                    className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"
                  ></span>
                </Button>
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOutIcon className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400"
                >
                  <PlusIcon className="h-5 w-5" />
                </Button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-16 animate-fade-in">
              {children}
            </main>

            <Navigation
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        ) : (
          <main className="flex-1 animate-fade-in">{children}</main>
        )}
      </div>
    </div>
  );
}
