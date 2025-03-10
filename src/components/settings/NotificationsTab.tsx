
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BellIcon, BellOffIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type NotificationType = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export const NotificationsTab: React.FC = () => {
  const { toast } = useToast();
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([
    {
      id: "all",
      title: "All Notifications",
      description: "Enable or disable all notifications for this application.",
      enabled: true,
    },
    {
      id: "email",
      title: "Email Notifications",
      description: "Receive email notifications for important updates.",
      enabled: true,
    },
    {
      id: "push",
      title: "Push Notifications",
      description: "Receive push notifications on your devices.",
      enabled: false,
    },
    {
      id: "updates",
      title: "Application Updates",
      description: "Receive notifications about application updates.",
      enabled: true,
    },
    {
      id: "promotions",
      title: "Promotional Content",
      description: "Receive marketing and promotional content.",
      enabled: false,
    },
  ]);

  const handleNotificationToggle = (id: string, enabled: boolean) => {
    setNotificationTypes(
      notificationTypes.map((type) =>
        type.id === id ? { ...type, enabled } : type
      )
    );

    toast({
      title: `${enabled ? "Enabled" : "Disabled"} ${
        notificationTypes.find((type) => type.id === id)?.title
      }`,
      description: `You will ${
        enabled ? "now receive" : "no longer receive"
      } these notifications.`,
    });
  };

  const disableAllNotifications = () => {
    setNotificationTypes(
      notificationTypes.map((type) => ({ ...type, enabled: false }))
    );
    
    toast({
      title: "All notifications disabled",
      description: "You will no longer receive any notifications.",
    });
  };

  const enableAllNotifications = () => {
    setNotificationTypes(
      notificationTypes.map((type) => ({ ...type, enabled: true }))
    );
    
    toast({
      title: "All notifications enabled",
      description: "You will now receive all notifications.",
    });
  };

  const allEnabled = notificationTypes.every((type) => type.enabled);
  const allDisabled = notificationTypes.every((type) => !type.enabled);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how we communicate with you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              {allDisabled ? (
                <Button 
                  variant="outline" 
                  onClick={enableAllNotifications}
                  className="flex items-center gap-2"
                >
                  <BellIcon className="h-4 w-4" />
                  Enable All
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={disableAllNotifications}
                  className="flex items-center gap-2"
                >
                  <BellOffIcon className="h-4 w-4" />
                  Disable All
                </Button>
              )}
            </div>
            
            {notificationTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <h3 className="font-medium">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </div>
                <Switch
                  checked={type.enabled}
                  onCheckedChange={(checked) => handleNotificationToggle(type.id, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
