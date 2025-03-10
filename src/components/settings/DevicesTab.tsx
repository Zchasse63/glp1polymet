
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Device = {
  id: string;
  name: string;
  type: string;
  lastActive: string;
  current: boolean;
};

export const DevicesTab: React.FC = () => {
  const { toast } = useToast();
  const [devices] = React.useState<Device[]>([
    {
      id: "1",
      name: "iPhone 13",
      type: "Mobile",
      lastActive: "Active now",
      current: true,
    },
    {
      id: "2",
      name: "MacBook Pro",
      type: "Desktop",
      lastActive: "Last active 2 hours ago",
      current: false,
    },
  ]);

  const handleRevokeAccess = (deviceId: string) => {
    toast({
      title: "Device access revoked",
      description: "This device can no longer access your account.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
          <CardDescription>
            Manage devices that have access to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                      <Smartphone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {device.type} • {device.lastActive}
                      </p>
                    </div>
                  </div>
                  {!device.current && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRevokeAccess(device.id)}
                    >
                      Revoke Access
                    </Button>
                  )}
                  {device.current && (
                    <span className="text-sm text-muted-foreground">
                      Current Device
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
