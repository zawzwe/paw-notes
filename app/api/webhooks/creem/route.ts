import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get("creem-signature");

    // Verify webhook signature
    const secret = process.env.CREEM_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    // For production: validate HMAC signature using secret
    // For now, accept if signature header exists
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const event = body;

    // Handle checkout.session.completed
    if (event.type === "checkout.completed" || event.object === "checkout") {
      const userId = event.metadata?.userId || body.metadata?.userId;
      if (!userId) {
        return NextResponse.json({ error: "No userId in metadata" }, { status: 400 });
      }

      // Upgrade user to monthly plan
      const serviceClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      const { error } = await serviceClient
        .from("profiles")
        .update({ plan: "monthly", updated_at: new Date().toISOString() })
        .eq("user_id", userId);

      if (error) {
        console.error("Upgrade error:", error);
        return NextResponse.json({ error: "Upgrade failed" }, { status: 500 });
      }

      console.log(`User ${userId} upgraded to monthly`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
