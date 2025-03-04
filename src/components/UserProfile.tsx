
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  UserIcon, 
  SettingsIcon, 
  AppWindowIcon, 
  CreditCardIcon, 
  LogOutIcon 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export function UserProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };
  
  return (
    <div className="flex items-center gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700 ring-2 ring-blue-500/20 cursor-pointer hover:ring-blue-500/40 transition-all">
            <AvatarImage
              src="https://github.com/yusufhilmi.png"
              alt="User"
            />
            <AvatarFallback>EJ</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="end">
          <div className="space-y-1">
            <div className="px-2 py-1.5 text-sm font-semibold">
              My Account
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            
            <div className="grid gap-1 p-1">
              <button
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                onClick={() => toast({
                  title: "Profile",
                  description: "User profile section clicked",
                })}
              >
                <UserIcon className="h-4 w-4" />
                User Profile
              </button>
              <button
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                onClick={() => toast({
                  title: "Settings",
                  description: "App settings section clicked",
                })}
              >
                <SettingsIcon className="h-4 w-4" />
                App Settings
              </button>
              <button
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                onClick={() => toast({
                  title: "Integrations",
                  description: "App integrations section clicked",
                })}
              >
                <AppWindowIcon className="h-4 w-4" />
                App Integrations
              </button>
              <button
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                onClick={() => toast({
                  title: "Subscription",
                  description: "Subscription section clicked",
                })}
              >
                <CreditCardIcon className="h-4 w-4" />
                Subscription
              </button>
            </div>
            
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            
            <button
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left text-red-600 dark:text-red-400"
              onClick={handleLogout}
            >
              <LogOutIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-medium">
            Eric Johnson
          </h2>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
          >
            Pro
          </Badge>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Day 45 of GLP-1
        </p>
      </div>
    </div>
  );
}
