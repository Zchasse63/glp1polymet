
import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className={cn("min-h-screen w-full bg-background flex flex-col antialiased", className)}>
      <main className="flex-1 animate-fade-in">{children}</main>
    </div>
  );
}
