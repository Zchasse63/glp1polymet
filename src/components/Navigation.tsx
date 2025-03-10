
import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, PillIcon, HeartPulseIcon, ZapIcon } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Home", icon: HomeIcon, path: "/" },
    { id: "medication", label: "Medication", icon: PillIcon, path: "/medications" },
    { id: "health", label: "Health", icon: HeartPulseIcon, path: "/health" },
    { id: "insights", label: "Insights", icon: ZapIcon, path: "/insights" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 max-w-md mx-auto shadow-lg">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center justify-center py-3 px-4 flex-1 transition-colors duration-200 ${
              currentPage === item.id
                ? "text-primary dark:text-primary"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setCurrentPage(item.id)}
            aria-current={currentPage === item.id ? "page" : undefined}
          >
            <item.icon
              className={`h-6 w-6 ${
                currentPage === item.id
                  ? "text-primary dark:text-primary"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              aria-hidden="true"
            />
            <span className="text-xs mt-1 font-medium">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
