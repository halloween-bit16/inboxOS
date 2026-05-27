import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();

    const { threadId, reason, escalateTo } = body;

    if (!threadId) {
      return NextResponse.json(
        { error: "Missing threadId" },
        { status: 400 }
      );
    }

    // Update thread status
    const { data: thread, error: threadError } = await supabase
      .from("threads")
      .update({
        status: "escalated",
        updated_at: new Date().toISOString(),
        urgency_score: Math.min(100, (await supabase
          .from("threads")
          .select("urgency_score")
          .eq("id", threadId)
          .maybeSingle()).data?.urgency_score || 85) + 10,
      })
      .eq("id", threadId)
      .select()
      .maybeSingle();

    if (threadError) {
      console.error("Error escalating thread:", threadError);
      return NextResponse.json({ error: threadError.message }, { status: 500 });
    }

    // Log action
    await supabase.from("actions").insert({
      thread_id: threadId,
      action_type: "escalate",
      description: reason || "Thread escalated for attention",
      status: "completed",
      completed_at: new Date().toISOString(),
    });

    // Add system message
    await supabase.from("messages").insert({
      thread_id: threadId,
      sender_name: "System",
      sender_email: "system@inboxos.com",
      content: `Thread escalated${reason ? `: ${reason}` : ""}. ${escalateTo ? `Assigned to: ${escalateTo}` : ""}`,
      message_type: "system",
      is_external: false,
    });

    return NextResponse.json({ success: true, thread });
  } catch (error) {
    console.error("Error in escalate-thread:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
