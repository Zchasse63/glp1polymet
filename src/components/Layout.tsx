
import React, { useEffect } from "react";
import { UserProfile } from "@/components/UserProfile";
import { Navigation } from "@/components/Navigation";
import { MoonIcon, SunIcon, BellIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  currentPage?: string;
  setCurrentPage?: (page: string) => void;
}

export function Layout({
  children,
  className,
  currentPage = "dashboard",
  setCurrentPage = () => {},
}: LayoutProps) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  useEffect(() => {
    // Check system preference on initial load
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${theme}`}>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 min-h-screen flex flex-col shadow-lg">
        <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 bg-white dark:bg-gray-800">
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
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400"
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className={cn("flex-1 overflow-y-auto pb-16", className)}>
          {children}
        </main>

        <Navigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
