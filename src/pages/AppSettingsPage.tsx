
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { useMetricPreferences } from "@/hooks/useMetricPreferences";
import { useMedicationPreferences } from "@/hooks/useMedicationPreferences";
import { useDashboardData } from "@/hooks/useDashboardData";

const AppSettingsPage = () => {
  const [currentPage, setCurrentPage] = useState("settings");
  const { theme, toggleTheme } = useTheme();
  const { selectedMetrics, toggleMetric, MAX_METRICS } = useMetricPreferences();
  const { selectedMedications, toggleMedication, MAX_MEDICATIONS } = useMedicationPreferences();
  const { healthMetrics, medications } = useDashboardData();

  // Handle save settings
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been saved successfully."
    });
  };

  // Create map of metrics for easy lookup
  const metricsMap = healthMetrics.reduce((acc, metric) => {
    acc[metric.id] = metric;
    return acc;
  }, {} as Record<string, any>);

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5 space-y-6">
        <h1 className="text-2xl font-bold">App Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Customize the appearance of the app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark mode for the app</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Health Metrics</CardTitle>
            <CardDescription>Select up to {MAX_METRICS} metrics to display on your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: metric.iconBgColor }}>
                      {React.createElement(metric.icon, { className: 'h-3 w-3 text-primary' })}
                    </div>
                    <span>{metric.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedMetrics.includes(metric.id) && (
                      <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                        Selected
                      </Badge>
                    )}
                    <Switch 
                      checked={selectedMetrics.includes(metric.id)}
                      onCheckedChange={() => toggleMetric(metric.id)}
                      disabled={!selectedMetrics.includes(metric.id) && selectedMetrics.length >= MAX_METRICS}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              {selectedMetrics.length}/{MAX_METRICS} metrics selected
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Medications</CardTitle>
            <CardDescription>Select up to {MAX_MEDICATIONS} medications to display on your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medications.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="flex items-center justify-center w-6 h-6 rounded-full" 
                      style={{ backgroundColor: `${medication.color}15` }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={medication.color} strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      </svg>
                    </div>
                    <span>{medication.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedMedications.includes(medication.id) && (
                      <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                        Selected
                      </Badge>
                    )}
                    <Switch 
                      checked={selectedMedications.includes(medication.id)}
                      onCheckedChange={() => toggleMedication(medication.id)}
                      disabled={!selectedMedications.includes(medication.id) && selectedMedications.length >= MAX_MEDICATIONS}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground mt-4">
              {selectedMedications.length}/{MAX_MEDICATIONS} medications selected
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="medication-reminder">Medication Reminders</Label>
                <p className="text-sm text-muted-foreground">Receive reminders to take your medication</p>
              </div>
              <Switch id="medication-reminder" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weight-updates">Weight Updates</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your weight progress</p>
              </div>
              <Switch id="weight-updates" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </Layout>
  );
};

export default AppSettingsPage;
