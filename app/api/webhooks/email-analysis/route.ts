import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const body = await request.json();

    const { threadId, analysis } = body;

    if (!threadId || !analysis) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create or update AI summary
    const { data, error } = await supabase
      .from("ai_summaries")
      .upsert({
        thread_id: threadId,
        content: analysis.summary,
        suggested_actions: analysis.suggestedActions || [],
        confidence_score: analysis.confidence || 0.85,
        summary_type: "thread",
        updated_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error creating AI summary:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in email-analysis webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
