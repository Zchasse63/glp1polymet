
import React, { useState } from "react";
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
  LogOutIcon,
  ChevronRightIcon 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

export function UserProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };
  
  const handleOpenDialog = (dialogName: string) => {
    setOpenDialog(dialogName);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };
  
  // Connected services data from the dashboard
  const connectedServices = [
    {
      name: "MyFitnessPal",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 11.5C21 17.0228 16.5228 21.5 11 21.5C5.47715 21.5 1 17.0228 1 11.5C1 5.97715 5.47715 1.5 11 1.5C16.5228 1.5 21 5.97715 21 11.5Z" stroke="#22C55E" strokeWidth="2" />
          <path d="M21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12Z" stroke="#22C55E" strokeWidth="2" />
          <path d="M8.5 11.5L10.5 13.5L15.5 8.5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      lastSynced: "Today, 9:41 AM",
      bgColor: "bg-green-100 dark:bg-green-900/40"
    },
    {
      name: "Withings Scale",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="hsl(var(--chart-1))" strokeWidth="2" />
          <path d="M12 6V12L16 14" stroke="hsl(var(--chart-1))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      lastSynced: "Today, 7:15 AM",
      bgColor: "bg-blue-100 dark:bg-blue-900/40"
    },
    {
      name: "Whoop",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      lastSynced: "Yesterday, 11:30 PM",
      bgColor: "bg-purple-100 dark:bg-purple-900/40"
    }
  ];
  
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
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
              >
                <UserIcon className="h-4 w-4" />
                User Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
              >
                <SettingsIcon className="h-4 w-4" />
                App Settings
              </Link>
              <button
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                onClick={() => handleOpenDialog("integrations")}
              >
                <AppWindowIcon className="h-4 w-4" />
                App Integrations
              </button>
              <Link
                to="/subscription"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
              >
                <CreditCardIcon className="h-4 w-4" />
                Subscription
              </Link>
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

      {/* App Integrations Dialog */}
      <Dialog open={openDialog === "integrations"} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">App Integrations</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Connected Services</h3>
              <button 
                className="text-sm text-primary flex items-center"
                onClick={() => toast({
                  title: "Connected Services",
                  description: "Manage connected services clicked",
                })}
              >
                Manage <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-3">
              {connectedServices.map((service, index) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between py-3 px-3 rounded-xl transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/30 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full ${service.bgColor} flex items-center justify-center mr-4`}>
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last synced: {service.lastSynced}
                      </p>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
            
            <div className="pt-2">
              <button
                className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                onClick={() => toast({
                  title: "Add New Integration",
                  description: "Add new integration clicked",
                })}
              >
                + Add New Integration
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
