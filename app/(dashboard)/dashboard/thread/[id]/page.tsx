"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Send,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  content: string;
  message_type: string;
  created_at: string;
  is_external: boolean;
}

interface AISummary {
  content: string;
  suggested_actions: any[];
  confidence_score: number;
}

interface Approval {
  id: string;
  approver_name: string;
  approval_type: string;
  status: string;
  due_date: string | null;
}

interface Document {
  id: string;
  document_name: string;
  document_type: string;
  status: string;
  required: boolean;
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

export default function ThreadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = params.id as string;

  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (threadId) {
      fetchThreadData();
    }
  }, [threadId]);

  const fetchThreadData = async () => {
    try {
      // Fetch thread
      const { data: threadData, error: threadError } = await supabase
        .from("threads")
        .select("*")
        .eq("id", threadId)
        .single();

      if (threadError) throw threadError;
      setThread(threadData);

      // Fetch messages
      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      setMessages(messagesData || []);

      // Fetch AI summary
      const { data: summaryData } = await supabase
        .from("ai_summaries")
        .select("*")
        .eq("thread_id", threadId)
        .maybeSingle();

      if (summaryData) {
        setAiSummary({
          content: summaryData.content,
          suggested_actions: summaryData.suggested_actions || [],
          confidence_score: summaryData.confidence_score,
        });
      }

      // Fetch approvals
      const { data: approvalsData } = await supabase
        .from("approvals")
        .select("*")
        .eq("thread_id", threadId);

      setApprovals(approvalsData || []);

      // Fetch documents
      const { data: documentsData } = await supabase
        .from("documents")
        .select("*")
        .eq("thread_id", threadId);

      setDocuments(documentsData || []);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching thread data:", error);
      setLoading(false);
    }
  };

  const handleMarkResolved = async () => {
    const { error } = await supabase
      .from("threads")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", threadId);

    if (!error) {
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-slate-500">Thread not found</p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {thread.subject}
            </h1>
            <div className="flex items-center gap-2">
              <Badge className={priorityColors[thread.priority]}>
                {thread.priority}
              </Badge>
              <Badge className={categoryColors[thread.category] || ""}>
                {thread.category.replace("_", " ")}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span>Created {format(new Date(thread.created_at), "MMM d, yyyy")}</span>
            {thread.deadline && (
              <>
                <ChevronRight className="h-4 w-4" />
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Calendar className="h-4 w-4" />
                  <span>Due {format(new Date(thread.deadline), "MMM d, yyyy")}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary */}
          {aiSummary && (
            <Card className="border-cyan-200 dark:border-cyan-800 bg-cyan-50/50 dark:bg-cyan-950/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {aiSummary.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400">
                  <span>Confidence: {Math.round(aiSummary.confidence_score * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Thread Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thread Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.map((message, index) => (
                <div key={message.id} className="space-y-2">
                  {index > 0 && <Separator />}
                  <div
                    className={`p-4 rounded-lg ${
                      message.is_external
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "bg-cyan-50 dark:bg-cyan-900/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {message.sender_name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {message.sender_email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {message.is_external && (
                          <Badge variant="outline" className="text-xs">
                            External
                          </Badge>
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {format(new Date(message.created_at), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="default">
                <Send className="h-4 w-4 mr-2" />
                Draft Reply
              </Button>
              <Button className="w-full" variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Follow-up
              </Button>
              <Button className="w-full" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Escalate Thread
              </Button>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleMarkResolved}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Resolved
              </Button>
            </CardContent>
          </Card>

          {/* Stakeholders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stakeholders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {thread.stakeholders.map((stakeholder, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <User className="h-3 w-3" />
                  </div>
                  <span>{stakeholder}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Suggested Actions */}
          {aiSummary && aiSummary.suggested_actions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-500" />
                  Suggested Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSummary.suggested_actions.map((action: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm"
                  >
                    <p className="font-medium text-slate-900 dark:text-white">
                      {action.type?.replace("_", " ").replace(/^\w/, (c: string) => c.toUpperCase())}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      {action.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Approvals */}
          {approvals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {approvals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {approval.approver_name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {approval.approval_type}
                      </p>
                    </div>
                    <Badge
                      variant={approval.status === "pending" ? "outline" : "default"}
                      className={
                        approval.status === "approved"
                          ? "bg-green-500"
                          : approval.status === "rejected"
                          ? "bg-red-500"
                          : ""
                      }
                    >
                      {approval.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <FileText className="h-5 w-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {doc.document_name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {doc.document_type}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        doc.status === "missing"
                          ? "text-red-600 border-red-300"
                          : doc.status === "under_review"
                          ? "text-amber-600 border-amber-300"
                          : "text-green-600 border-green-300"
                      }
                    >
                      {doc.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
