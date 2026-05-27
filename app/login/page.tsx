"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Logo */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
              <MessageSquare className="h-9 w-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome to InboxOS
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                AI-powered inbox operations dashboard
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cyan-500" />
              <span>AI-driven thread prioritization</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cyan-500" />
              <span>Smart workflow automation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cyan-500" />
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cyan-500" />
              <span>Real-time collaboration</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <Button
            onClick={signInWithGoogle}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg flex items-center justify-center gap-3 font-medium transition-all hover:shadow-md"
          >
            <Image
              src="https://www.google.com/favicon.ico"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            Continue with Google
          </Button>

          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
