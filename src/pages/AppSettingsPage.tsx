
import React from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoonIcon, SunIcon, BellIcon, GlobeIcon, ClockIcon, LanguagesIcon, GridIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMetricPreferences } from "@/hooks/useMetricPreferences";

const AppSettingsPage = () => {
  const [currentPage, setCurrentPage] = React.useState("dashboard");
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const { availableMetrics, selectedMetrics, toggleMetric } = useMetricPreferences();
  
  React.useEffect(() => {
    // Get theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
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
    
    toast({
      title: "Theme updated",
      description: `Changed to ${newTheme} theme.`
    });
  };

  const handleNotificationToggle = () => {
    toast({
      title: "Notifications updated",
      description: "Your notification preferences have been saved."
    });
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5 space-y-6">
        <h1 className="text-2xl font-bold">App Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Metrics</CardTitle>
            <CardDescription>Choose which metrics to display on your home screen (max 4)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`metric-${metric.id}`} 
                    checked={selectedMetrics.includes(metric.id)}
                    disabled={!selectedMetrics.includes(metric.id) && selectedMetrics.length >= 4}
                    onCheckedChange={() => {
                      toggleMetric(metric.id);
                      toast({
                        title: selectedMetrics.includes(metric.id) ? "Metric removed" : "Metric added",
                        description: selectedMetrics.includes(metric.id) 
                          ? `${metric.title} removed from dashboard.` 
                          : `${metric.title} added to dashboard.`
                      });
                    }}
                  />
                  <Label 
                    htmlFor={`metric-${metric.id}`}
                    className="font-medium"
                  >
                    {metric.title}
                  </Label>
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-4">
                {selectedMetrics.length} of 4 metrics selected. All metrics are always available on the Health page.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks and feels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {theme === "light" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <GlobeIcon className="h-5 w-5" />
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">Select your preferred language</p>
                </div>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <BellIcon className="h-5 w-5" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
              </div>
              <Switch defaultChecked onCheckedChange={handleNotificationToggle} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ClockIcon className="h-5 w-5" />
                <div>
                  <p className="font-medium">Medication Reminders</p>
                  <p className="text-sm text-muted-foreground">Receive reminders for medication schedules</p>
                </div>
              </div>
              <Switch defaultChecked onCheckedChange={handleNotificationToggle} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <LanguagesIcon className="h-5 w-5" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch onCheckedChange={handleNotificationToggle} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Export</p>
                <p className="text-sm text-muted-foreground">Download all your personal data</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => toast({
                  title: "Data export initiated",
                  description: "Your data will be emailed to you shortly."
                })}
              >
                Export Data
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Clear Local Data</p>
                <p className="text-sm text-muted-foreground">Delete all locally stored data</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => toast({
                  title: "Local data cleared",
                  description: "All locally stored data has been deleted."
                })}
              >
                Clear Data
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-500 dark:text-red-400">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button 
                variant="destructive"
                onClick={() => toast({
                  variant: "destructive",
                  title: "Account deletion",
                  description: "Please contact support to delete your account."
                })}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AppSettingsPage;
