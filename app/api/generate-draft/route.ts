import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();

    const { threadId, context, recipient } = body;

    if (!threadId) {
      return NextResponse.json(
        { error: "Missing threadId" },
        { status: 400 }
      );
    }

    // Fetch thread context
    const { data: thread } = await supabase
      .from("threads")
      .select("*")
      .eq("id", threadId)
      .maybeSingle();

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Fetch messages for context
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true })
      .limit(10);

    // Generate draft (simulated for demo)
    const lastMessage = messages?.[messages.length - 1];
    const draft = {
      subject: `Re: ${thread.subject}`,
      content: `Dear ${recipient || lastMessage?.sender_name || "Team"},\n\nThank you for your message regarding "${thread.subject}". We have reviewed your request and are working on the necessary actions.\n\n${context || ""}\n\nPlease let us know if you require any additional information.\n\nBest regards`,
      thread_id: threadId,
      created_at: new Date().toISOString(),
    };

    // Log action
    await supabase.from("actions").insert({
      thread_id: threadId,
      action_type: "draft_reply",
      description: "Draft reply generated",
      status: "pending",
    });

    return NextResponse.json({ success: true, draft });
  } catch (error) {
    console.error("Error generating draft:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
