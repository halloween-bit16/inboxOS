"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  AlertTriangle,
  User,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Thread {
  id: string;
  subject: string;
  status: string;
  urgency_score: number;
  category: string;
  priority: string;
  pending_action: string;
  stakeholders: string[];
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

interface ThreadCardProps {
  thread: Thread;
  aiSummary?: string;
  senderName?: string;
  lastActivity?: string;
}

const categoryColors: Record<string, string> = {
  approval: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  compliance: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  vendor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  architecture: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  fire_safety: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const priorityColors: Record<string, string> = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-gray-400 text-white",
};

const statusColors: Record<string, string> = {
  urgent: "border-red-500",
  pending: "border-gray-300",
  escalated: "border-orange-500",
  resolved: "border-green-500",
};

export function ThreadCard({ thread, aiSummary, senderName, lastActivity }: ThreadCardProps) {
  const urgencyScore = thread.urgency_score;
  const urgencyColor =
    urgencyScore >= 85
      ? "text-red-600 dark:text-red-400"
      : urgencyScore >= 70
      ? "text-orange-600 dark:text-orange-400"
      : "text-slate-600 dark:text-slate-400";

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4 ${statusColors[thread.status]} bg-white dark:bg-slate-800`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-base font-semibold line-clamp-2 text-slate-900 dark:text-white">
              {thread.subject}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <User className="h-4 w-4" />
              <span>{senderName || "External Contact"}</span>
              <span className="text-xs">•</span>
              <MessageSquare className="h-4 w-4" />
              <span>{lastActivity || "Recent activity"}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={priorityColors[thread.priority]}>
              {thread.priority}
            </Badge>
            <Badge className={categoryColors[thread.category] || ""}>
              {thread.category.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Summary */}
        {aiSummary && (
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
            {aiSummary}
          </p>
        )}

        {/* Pending Action */}
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1">
            {thread.pending_action}
          </p>
        </div>

        {/* Urgency Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Urgency Score:
            </span>
            <div className="flex items-center gap-1">
              <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    urgencyScore >= 85
                      ? "bg-red-500"
                      : urgencyScore >= 70
                      ? "bg-orange-500"
                      : "bg-cyan-500"
                  }`}
                  style={{ width: `${urgencyScore}%` }}
                />
              </div>
              <span className={`text-sm font-semibold ${urgencyColor}`}>
                {urgencyScore}
              </span>
            </div>
          </div>

          {/* Deadline */}
          {thread.deadline && (
            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span>
                Due {formatDistanceToNow(new Date(thread.deadline), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Link href={`/dashboard/thread/${thread.id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">
              View Thread
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="flex-1">
            Draft Reply
          </Button>
          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
            Escalate
          </Button>
          <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700">
            Follow Up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
