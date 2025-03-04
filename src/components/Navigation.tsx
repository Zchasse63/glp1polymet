
import React from "react";
import { HomeIcon, PillIcon, BarChartIcon, ZapIcon } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const navItems = [
    { id: "dashboard", label: "Home", icon: HomeIcon },
    { id: "medication", label: "Medication", icon: PillIcon },
    { id: "progress", label: "Progress", icon: BarChartIcon },
    { id: "insights", label: "Insights", icon: ZapIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 max-w-md mx-auto shadow-lg">
      <div className="flex justify-around">
        {navItems.map((item, index) => (
          <button
            key={item.id}
            className={`flex flex-col items-center justify-center py-3 px-4 flex-1 transition-colors duration-200 ${
              currentPage === item.id
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setCurrentPage(item.id)}
          >
            <item.icon
              className={`h-6 w-6 ${
                currentPage === item.id
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <span className="text-xs mt-1 font-medium">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
