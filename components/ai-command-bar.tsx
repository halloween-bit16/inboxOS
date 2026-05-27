"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AICommandBarProps {
  onCommand?: (command: string) => void;
}

const suggestedCommands = [
  "Follow up on approvals pending over 5 days",
  "Show urgent vendor escalations",
  "Draft reminders for unanswered threads",
  "What needs my attention today?",
];

export function AICommandBar({ onCommand }: AICommandBarProps) {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsProcessing(true);
    setResponse(null);

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      if (command.includes("urgent") || command.includes("escalation")) {
        setResponse("Found 3 urgent escalations requiring immediate attention. Top priority: Cloud Provider SLA Violation with urgency score 90.");
      } else if (command.includes("approval")) {
        setResponse("5 approvals are pending over 5 days. Recommendation: Prioritize GDPR Compliance Audit response due to 48-hour deadline.");
      } else if (command.includes("reminder")) {
        setResponse("I've identified 7 threads without follow-up in the last 3 days. Would you like me to draft reminders?");
      } else {
        setResponse("Based on current priorities, I recommend focusing on: GDPR Audit findings (critical), Cloud Provider SLA breach, and Fire Safety inspection. Total impact: 3 critical items requiring action within 72 hours.");
      }
      onCommand?.(command);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Command Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Sparkles className="h-5 w-5 text-cyan-500" />
        </div>
        <Input
          type="text"
          placeholder="What needs my attention today?"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="pl-12 h-12 text-base bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!command.trim() || isProcessing}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-700"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Ask"
          )}
        </Button>
      </form>

      {/* Suggested Commands */}
      <div className="flex flex-wrap gap-2">
        {suggestedCommands.map((cmd) => (
          <Badge
            key={cmd}
            variant="outline"
            className="cursor-pointer hover:bg-cyan-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5"
            onClick={() => {
              setCommand(cmd);
            }}
          >
            {cmd}
          </Badge>
        ))}
      </div>

      {/* AI Response */}
      {response && (
        <Card className="border-cyan-200 dark:border-cyan-800 bg-cyan-50/50 dark:bg-cyan-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {response}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
