
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      lastSynced: "Yesterday, 11:30 PM",
      bgColor: "bg-purple-100 dark:bg-purple-900/40"
    },
    {
      name: "Oura Ring",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#F97316" strokeWidth="2" />
          <path d="M12 6V18" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 12H18" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      lastSynced: "2 days ago",
      bgColor: "bg-orange-100 dark:bg-orange-900/40"
    },
    {
      name: "Apple Health",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5 12.5722C19.5 11.9361 19.4194 11.3306 19.2582 10.7551C18.4137 7.41255 15.3856 5 11.75 5C8.11436 5 5.08631 7.41255 4.24182 10.7551C4.08055 11.3306 4 11.9361 4 12.5722C4 12.8353 4.01674 13.0937 4.04919 13.3464C4.18126 14.444 4.55388 15.4605 5.12846 16.3281C5.5083 16.9092 5.97749 17.412 6.51453 17.8137C7.6405 18.6553 9.07708 19.1579 10.6445 19.1579C11.4903 19.1579 12.2990 19.0199 13.0465 18.7739C13.7576 18.5408 14.4088 18.2139 14.9823 17.8137C15.5194 17.412 15.9886 16.9092 16.3684 16.3281C16.9424 15.4617 17.3146 14.4466 17.4472 13.3507C17.48 13.0955 17.4969 12.8354 17.4969 12.5722H19.5Z" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.5 14C13.5 15.1046 12.6046 16 11.5 16C10.3954 16 9.5 15.1046 9.5 14C9.5 12.8954 10.3954 12 11.5 12C12.6046 12 13.5 12.8954 13.5 14Z" fill="#FF3B30"/>
        </svg>
      ),
      lastSynced: "3 days ago",
      bgColor: "bg-red-100 dark:bg-red-900/40"
    },
    {
      name: "Fitbit",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="2" width="8" height="8" rx="2" stroke="#06B6D4" strokeWidth="2"/>
          <rect x="8" y="14" width="8" height="8" rx="2" stroke="#06B6D4" strokeWidth="2"/>
          <rect x="14" y="8" width="8" height="8" rx="2" stroke="#06B6D4" strokeWidth="2"/>
          <rect x="2" y="8" width="8" height="8" rx="2" stroke="#06B6D4" strokeWidth="2"/>
        </svg>
      ),
      lastSynced: "1 week ago",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/40"
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
          
          <div className="py-3 space-y-5">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Connected Services</CardTitle>
                <CardDescription className="text-xs">Manage your connected health and fitness apps</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 px-3 pb-4">
                <ScrollArea className="h-[270px] pr-3">
                  <div className="space-y-2">
                    {connectedServices.map((service, index) => (
                      <div
                        key={service.name}
                        className="flex items-center justify-between py-2 px-3 rounded-lg transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/30 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <div className={`w-9 h-9 rounded-full ${service.bgColor} flex items-center justify-center mr-3`}>
                            {service.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">
                              {service.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Last synced: {service.lastSynced}
                            </p>
                          </div>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <Button
                  variant="outline"
                  className="w-full mt-4 border-dashed text-sm"
                  onClick={() => toast({
                    title: "Add New Integration",
                    description: "Add new integration clicked",
                  })}
                >
                  + Add New Integration
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">API Access</CardTitle>
                <CardDescription className="text-xs">Manage developer API keys and access</CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Developer API Key</p>
                    <p className="text-xs text-muted-foreground">For integrating with your own apps</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => toast({
                      title: "API Key Generated",
                      description: "Your new API key has been generated"
                    })}
                  >
                    Generate Key
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Data Permissions</CardTitle>
                <CardDescription className="text-xs">Control what data is shared with connected apps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Share Weight Data</p>
                    <p className="text-xs text-muted-foreground">Allow apps to access your weight logs</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => toast({
                      title: "Permission Updated",
                      description: "Weight data sharing permission updated"
                    })}
                  >
                    Manage
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Share Medication Data</p>
                    <p className="text-xs text-muted-foreground">Allow apps to access your medication info</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => toast({
                      title: "Permission Updated",
                      description: "Medication data sharing permission updated"
                    })}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
