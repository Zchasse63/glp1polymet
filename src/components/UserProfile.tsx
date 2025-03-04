
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function UserProfile() {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        className="h-10 w-10 border border-gray-200 dark:border-gray-700 ring-2 ring-blue-500/20"
      >
        <AvatarImage
          src="https://github.com/yusufhilmi.png"
          alt="User"
        />
        <AvatarFallback>EJ</AvatarFallback>
      </Avatar>
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
