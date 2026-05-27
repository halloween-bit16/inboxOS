import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();

    const { subject, sender, content, category, priority, stakeholders } = body;

    if (!subject || !sender || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate urgency score (simplified for demo)
    let urgencyScore = 50;
    if (priority === "critical") urgencyScore = 90;
    else if (priority === "high") urgencyScore = 70;
    else if (priority === "medium") urgencyScore = 50;
    else urgencyScore = 30;

    if (category === "compliance" || category === "fire_safety") {
      urgencyScore = Math.min(100, urgencyScore + 20);
    }

    // Create thread
    const { data: thread, error: threadError } = await supabase
      .from("threads")
      .insert({
        subject,
        status: urgencyScore >= 85 ? "urgent" : "pending",
        urgency_score: urgencyScore,
        category: category || "approval",
        priority: priority || "medium",
        pending_action: "Review and respond to new thread",
        stakeholders: stakeholders || [],
      })
      .select()
      .maybeSingle();

    if (threadError || !thread) {
      console.error("Error creating thread:", threadError);
      return NextResponse.json({ error: threadError?.message }, { status: 500 });
    }

    // Create initial message
    const { error: messageError } = await supabase.from("messages").insert({
      thread_id: thread.id,
      sender_name: sender.name || "Unknown",
      sender_email: sender.email || "unknown@email.com",
      content,
      message_type: "email",
      is_external: true,
    });

    if (messageError) {
      console.error("Error creating message:", messageError);
    }

    // Create AI summary
    await supabase.from("ai_summaries").insert({
      thread_id: thread.id,
      content: "New thread received. AI analysis in progress.",
      suggested_actions: [
        { type: "draft_reply", description: "Review and prepare response" },
      ],
      confidence_score: 0.80,
      summary_type: "thread",
    });

    return NextResponse.json({ success: true, thread });
  } catch (error) {
    console.error("Error in new-thread webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
