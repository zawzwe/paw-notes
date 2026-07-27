import { NextRequest, NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locale } = body;

    const supabase = await createApiClient();
    const { data: authData } = await supabase.auth.getClaims();
    const userId = authData?.claims?.sub;

    if (!userId) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const apiKey = process.env.CREEM_API_KEY;
    const productId = process.env.CREEM_PRODUCT_ID;
    if (!apiKey || !productId) {
      return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch("https://api.creem.io/v1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        product_id: productId,
        request_id: `order_${userId}_${Date.now()}`,
        success_url: `${baseUrl}/payment/success?locale=${locale || "zh"}`,
        customer: {
          email: authData.claims.email,
        },
        metadata: {
          userId,
          locale: locale || "zh",
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Creem checkout error:", err);
      return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ url: data.checkout_url });
  } catch (err) {
    console.error("Checkout API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
