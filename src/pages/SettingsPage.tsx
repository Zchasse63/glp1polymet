
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader, Breadcrumb } from "@/components/page";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BellIcon, Smartphone, GlobeIcon, UserIcon } from "lucide-react";

// Import tab components
import { ProfileTab } from "@/components/settings/ProfileTab";
import { AccountTab } from "@/components/settings/AccountTab";
import { AppearanceTab } from "@/components/settings/AppearanceTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import { DevicesTab } from "@/components/settings/DevicesTab";

/**
 * SettingsPage Component
 * 
 * Displays user settings with tabs for different setting categories.
 * Uses the Layout component for consistent page structure.
 */
const SettingsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("settings");
  const [activeTab, setActiveTab] = useState("profile");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Settings", href: "/settings", current: true },
  ];

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <PageHeader
          title="Settings"
          description="Manage your account settings and preferences."
        />
        
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        
        <Tabs 
          defaultValue={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="w-full sm:w-auto grid grid-cols-5 sm:inline-flex">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <GlobeIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Devices</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountTab />
          </TabsContent>
          
          <TabsContent value="appearance">
            <AppearanceTab />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
          
          <TabsContent value="devices">
            <DevicesTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
