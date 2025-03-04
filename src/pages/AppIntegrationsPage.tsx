
import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRightIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AppIntegrationsPage = () => {
  const [currentPage, setCurrentPage] = React.useState("dashboard");

  // Connected services data
  const connectedServices = [
    {
      name: "MyFitnessPal",
      icon: "green-circle",
      lastSynced: "Today, 9:41 AM",
      bgColor: "bg-green-100 dark:bg-green-900/40"
    },
    {
      name: "Withings Scale",
      icon: "blue-circle",
      lastSynced: "Today, 7:15 AM",
      bgColor: "bg-blue-100 dark:bg-blue-900/40"
    },
    {
      name: "Whoop",
      icon: "purple-line",
      lastSynced: "Yesterday, 11:30 PM",
      bgColor: "bg-purple-100 dark:bg-purple-900/40"
    },
    {
      name: "Oura Ring",
      icon: "orange-circle",
      lastSynced: "2 days ago",
      bgColor: "bg-orange-100 dark:bg-orange-900/40"
    },
    {
      name: "Apple Health",
      icon: "red-heart",
      lastSynced: "3 days ago",
      bgColor: "bg-red-100 dark:bg-red-900/40"
    },
    {
      name: "Fitbit",
      icon: "cyan-square",
      lastSynced: "1 week ago",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/40"
    }
  ];

  // Render service icon based on type
  const renderServiceIcon = (iconType: string) => {
    switch (iconType) {
      case "green-circle":
        return <div className="w-3 h-3 rounded-full bg-green-500"></div>;
      case "blue-circle":
        return <div className="w-3 h-3 rounded-full bg-blue-500"></div>;
      case "purple-line":
        return <div className="w-3 h-3 bg-purple-500 rounded"></div>;
      case "orange-circle":
        return <div className="w-3 h-3 rounded-full bg-orange-500"></div>;
      case "red-heart":
        return <div className="w-3 h-3 rounded-full bg-red-500"></div>;
      case "cyan-square":
        return <div className="w-3 h-3 rounded bg-cyan-500"></div>;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-500"></div>;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5 space-y-6">
        <h1 className="text-2xl font-bold">App Integrations</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Connected Services</CardTitle>
            <CardDescription>Manage your connected health and fitness applications</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              <div className="space-y-1">
                {connectedServices.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/30 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full ${service.bgColor} flex items-center justify-center mr-2`}>
                        {renderServiceIcon(service.icon)}
                      </div>
                      <div>
                        <h3 className="text-xs font-medium">
                          {service.name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground">
                          Last synced: {service.lastSynced}
                        </p>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-3 w-3 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <Button
              variant="outline"
              className="w-full mt-3 border-dashed text-xs h-8"
              onClick={() => toast({
                title: "Add New Integration",
                description: "Add new integration feature coming soon."
              })}
            >
              + Add New Integration
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>API Access</CardTitle>
            <CardDescription>Manage developer API keys and access</CardDescription>
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
                className="text-xs h-8"
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
          <CardHeader>
            <CardTitle>Data Permissions</CardTitle>
            <CardDescription>Control what data is shared with connected apps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Share Weight Data</p>
                <p className="text-xs text-muted-foreground">Allow apps to access your weight logs</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs h-8"
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
                className="text-xs h-8"
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
    </Layout>
  );
};

export default AppIntegrationsPage;
