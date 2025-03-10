
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader, Breadcrumb } from "@/components/page";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { BellIcon, BellOffIcon, DeviceIcon, GlobeIcon, UserIcon } from "lucide-react";

/**
 * SettingsPage Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Organized settings interface
 * - Sustainable Code: Follows established page patterns
 * - Holistic Development: Integrates well with overall application
 */

// Form schema for general settings
const generalSettingsSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  language: z.string(),
  timezone: z.string(),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;

// Form schema for notification settings
const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  medicationReminders: z.boolean(),
  weeklyReports: z.boolean(),
  healthInsights: z.boolean(),
});

type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;

const SettingsPage = () => {
  const [currentPage, setCurrentPage] = useState("settings");
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState("general");

  // General settings form
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      displayName: "John Doe",
      email: "john.doe@example.com",
      language: "English",
      timezone: "UTC-8 (Pacific Time)",
    },
  });

  // Notification settings form
  const notificationForm = useForm<NotificationSettingsValues>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      medicationReminders: true,
      weeklyReports: true,
      healthInsights: true,
    },
  });

  const onGeneralSubmit = (data: GeneralSettingsValues) => {
    console.log("General settings submitted:", data);
    toast({
      title: "Settings updated",
      description: "Your general settings have been saved successfully.",
    });
  };

  const onNotificationSubmit = (data: NotificationSettingsValues) => {
    console.log("Notification settings submitted:", data);
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved successfully.",
    });
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <PageHeader 
        title="Settings" 
        description="Manage your account settings and preferences"
      />

      <div className="p-4 space-y-6">
        <Breadcrumb
          items={[
            { label: "Settings", href: "/settings" }
          ]}
        />

        <Tabs defaultValue="general" value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-3 lg:w-auto">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <DeviceIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Devices</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                    <FormField
                      control={generalForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormDescription>
                            We'll use this email for notifications.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row gap-4">
                      <FormField
                        control={generalForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Language</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <GlobeIcon className="h-4 w-4 text-gray-500" />
                                <Input {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={generalForm.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Timezone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Theme</FormLabel>
                          <FormDescription>
                            Choose light or dark theme
                          </FormDescription>
                        </div>
                        <Switch 
                          checked={theme === 'dark'} 
                          onCheckedChange={toggleTheme} 
                          aria-label="Toggle theme"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Email Notifications</FormLabel>
                          <FormDescription>
                            Receive notifications via email
                          </FormDescription>
                        </div>
                        <FormField
                          control={notificationForm.control}
                          name="emailNotifications"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Push Notifications</FormLabel>
                          <FormDescription>
                            Receive notifications on your device
                          </FormDescription>
                        </div>
                        <FormField
                          control={notificationForm.control}
                          name="pushNotifications"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-4">Notification Types</h3>
                      <div className="space-y-4">
                        <FormField
                          control={notificationForm.control}
                          name="medicationReminders"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Medication Reminders</FormLabel>
                                <FormDescription>
                                  Reminders for your medication schedule
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationForm.control}
                          name="weeklyReports"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Weekly Reports</FormLabel>
                                <FormDescription>
                                  Summary of your weekly health progress
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={notificationForm.control}
                          name="healthInsights"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel>Health Insights</FormLabel>
                                <FormDescription>
                                  Personalized insights about your health trends
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Save Preferences</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Connected Devices</CardTitle>
                <CardDescription>
                  Manage devices connected to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                          <DeviceIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">iPhone 13</p>
                          <p className="text-sm text-gray-500">Last active: Today at 10:24 AM</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                          <DeviceIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">MacBook Pro</p>
                          <p className="text-sm text-gray-500">Last active: Yesterday at 3:15 PM</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button variant="outline">Revoke All Devices</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
