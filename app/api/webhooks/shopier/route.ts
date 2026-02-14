import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log("📨 Shopier Webhook:", JSON.stringify(body, null, 2));

    const { 
      platform_order_id,
      status,
      custom_field_1, // user_id
      custom_field_2, // package_code
    } = body;

    // Log webhook
    await supabase.from("provider_webhooks").insert({
      provider: "shopier",
      event_type: status || "unknown",
      provider_ref: platform_order_id,
      payload: body,
    });

    // Process successful payments
    if (status === "success" || status === "completed") {
      const userId = custom_field_1;
      const packageCode = custom_field_2;

      if (!userId || !packageCode) {
        console.error("❌ Missing fields");
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      console.log(`🔍 User: ${userId}, Package: ${packageCode}`);

      // Update checkout intent
      await supabase
        .from("checkout_intents")
        .update({
          status: "completed",
          provider_ref: platform_order_id,
          decided_at: new Date().toISOString(),
          raw: body,
        })
        .eq("user_id", userId)
        .eq("package_code", packageCode)
        .eq("status", "pending");

      // Get package
      const { data: pkg } = await supabase
        .from("packages")
        .select("grants")
        .eq("code", packageCode)
        .single();

      if (!pkg) {
        console.error("❌ Package not found");
        return NextResponse.json({ error: "Package not found" }, { status: 404 });
      }

      const grants = pkg.grants as any;

      // Add credits
      if (grants.credits) {
        console.log(`💰 Adding ${grants.credits} credits`);
        await supabase.rpc("increment_user_quota", {
          p_user_id: userId,
          p_quota_key: "credits",
          p_amount: grants.credits,
        });
      }

      // Add views
      if (grants.views) {
        console.log(`👁️ Adding ${grants.views} views`);
        await supabase.rpc("increment_user_quota", {
          p_user_id: userId,
          p_quota_key: "views",
          p_amount: grants.views,
        });
      }

      console.log(`🎉 Payment processed for ${userId}`);
      
      return NextResponse.json({ 
        ok: true, 
        message: "Payment processed",
        user_id: userId,
        package_code: packageCode
      });
    }

    // Handle failed payments
    if (status === "failed" || status === "cancelled") {
      const userId = custom_field_1;
      const packageCode = custom_field_2;

      if (userId && packageCode) {
        await supabase
          .from("checkout_intents")
          .update({
            status: "failed",
            decided_at: new Date().toISOString(),
            raw: body,
          })
          .eq("user_id", userId)
          .eq("package_code", packageCode)
          .eq("status", "pending");

        console.log(`❌ Payment ${status}`);
      }
    }

    return NextResponse.json({ ok: true });
    
  } catch (error: any) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: "active",
    endpoint: "/api/webhooks/shopier",
    message: "Webhook ready" 
  });
}
