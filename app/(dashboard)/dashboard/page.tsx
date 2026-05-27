"use client";

import React, { useEffect, useState } from "react";
import { ThreadCard } from "@/components/thread-card";
import { AICommandBar } from "@/components/ai-command-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Clock,
  Zap,
  Calendar,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

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

interface AISummary {
  thread_id: string;
  content: string;
}

export default function DashboardPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [aiSummaries, setAiSummaries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch threads
      const { data: threadsData, error: threadsError } = await supabase
        .from("threads")
        .select("*")
        .order("urgency_score", { ascending: false });

      if (threadsError) throw threadsError;
      setThreads(threadsData || []);

      // Fetch AI summaries
      const { data: summariesData, error: summariesError } = await supabase
        .from("ai_summaries")
        .select("thread_id, content");

      if (summariesError) throw summariesError;

      const summariesMap: Record<string, string> = {};
      summariesData?.forEach((summary) => {
        summariesMap[summary.thread_id] = summary.content;
      });
      setAiSummaries(summariesMap);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const urgentThreads = threads.filter((t) => t.status === "urgent" || t.urgency_score >= 85).slice(0, 5);
  const escalatedThreads = threads.filter((t) => t.status === "escalated").slice(0, 3);
  const deadlineThreads = threads.filter((t) => t.deadline).slice(0, 5);
  const otherThreads = threads.filter(
    (t) => !urgentThreads.includes(t) && !escalatedThreads.includes(t)
  );

  // Stats
  const stats = {
    urgent: threads.filter((t) => t.status === "urgent").length,
    pending: threads.filter((t) => t.status === "pending").length,
    escalated: threads.filter((t) => t.status === "escalated").length,
    resolved: threads.filter((t) => t.status === "resolved").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* AI Command Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <AICommandBar />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Urgent Threads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {stats.urgent}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Immediate action required</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats.pending}
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Awaiting action</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Escalations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.escalated}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Manager attention needed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.resolved}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Threads Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Urgent Threads
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            ({urgentThreads.length} items)
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {urgentThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              aiSummary={aiSummaries[thread.id]}
            />
          ))}
        </div>
      </section>

      {/* Escalations Needed */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-600" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Escalations Needed
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            ({escalatedThreads.length} items)
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {escalatedThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              aiSummary={aiSummaries[thread.id]}
            />
          ))}
        </div>
      </section>

      {/* Upcoming Deadlines */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-cyan-600" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Upcoming Deadlines
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            ({deadlineThreads.length} items)
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deadlineThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              aiSummary={aiSummaries[thread.id]}
            />
          ))}
        </div>
      </section>

      {/* All Other Threads */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-slate-600" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            All Threads
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            ({otherThreads.length} items)
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {otherThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              aiSummary={aiSummaries[thread.id]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
