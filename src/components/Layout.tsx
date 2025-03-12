
import React from "react";
import { MoonIcon, SunIcon, BellIcon, PlusIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/Navigation";
import { UserProfile } from "@/components/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();

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
              className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 bg-white dark:bg-gray-800 animate-fade-slide-down"
            >
              <UserProfile />
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-250 ease-out"
                  aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
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
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors duration-250 ease-out"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-5 w-5" />
                  <span
                    className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse-subtle"
                    aria-hidden="true"
                  ></span>
                </Button>
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-250 ease-out"
                    aria-label="Log out"
                  >
                    <LogOutIcon className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 transition-colors duration-250 ease-out"
                  aria-label="Add new"
                >
                  <PlusIcon className="h-5 w-5" />
                </Button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-16 animate-fade-slide-up custom-scrollbar">
              {children}
            </main>

            <Navigation
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        ) : (
          <main className="flex-1 animate-fade-slide-up">{children}</main>
        )}
      </div>
    </div>
  );
}
