"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Inbox,
  Clock,
  AlertTriangle,
  Zap,
  LogOut,
  MessageSquare,
  Layout,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Layout },
  { name: "Urgent Threads", href: "/dashboard?filter=urgent", icon: AlertTriangle },
  { name: "Pending Approvals", href: "/dashboard?filter=approvals", icon: Clock },
  { name: "Escalations", href: "/dashboard?filter=escalated", icon: Zap },
  { name: "All Threads", href: "/dashboard?filter=all", icon: Inbox },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 dark:bg-slate-950">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
          <MessageSquare className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">InboxOS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-800 p-3">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 text-slate-400 hover:bg-slate-800/50 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
