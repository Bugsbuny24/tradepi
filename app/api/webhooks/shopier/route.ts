import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await req.json();
    
    console.log("📨 Shopier Webhook:", body);

    const { 
      platform_order_id,
      status,
      buyer_email,
      buyer_name,
      total_order_value,
      custom_field_1,
      custom_field_2,
    } = body;

    await supabase.from("provider_webhooks").insert({
      provider: "shopier",
      event_type: status || "unknown",
      provider_ref: platform_order_id,
      payload: body,
    });

    if (status === "success" || status === "completed") {
      const userId = custom_field_1;
      const packageCode = custom_field_2;

      if (!userId || !packageCode) {
        console.error("❌ Missing user_id or package_code");
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
      }

      const { data: intent, error: intentError } = await supabase
        .from("checkout_intents")
        .update({
          status: "completed",
          provider_ref: platform_order_id,
          decided_at: new Date().toISOString(),
          decision_note: "Payment successful via Shopier",
          raw: body,
        })
        .eq("user_id", userId)
        .eq("package_code", packageCode)
        .eq("status", "pending")
        .select()
        .single();

      if (intentError || !intent) {
        console.error("❌ Intent not found");
        return NextResponse.json({ ok: true, message: "Already processed" });
      }

      const { data: pkg } = await supabase
        .from("packages")
        .select("grants")
        .eq("code", packageCode)
        .single();

      if (pkg?.grants) {
        const grants = pkg.grants as any;

        if (grants.quota_add) {
          for (const [key, value] of Object.entries(grants.quota_add)) {
            await supabase.rpc("increment_user_quota", {
              p_user_id: userId,
              p_quota_key: key.replace("_remaining", ""),
              p_amount: value as number,
            });
          }
        }

        if (grants.credits) {
          await supabase.rpc("increment_user_quota", {
            p_user_id: userId,
            p_quota_key: "credits",
            p_amount: grants.credits,
          });
        }

        if (grants.views) {
          await supabase.rpc("increment_user_quota", {
            p_user_id: userId,
            p_quota_key: "embed_view",
            p_amount: grants.views,
          });
        }
      }

      console.log(`✅ Payment successful - User: ${userId}, Package: ${packageCode}`);
      return NextResponse.json({ ok: true, message: "Payment processed" });
    }

    if (status === "failed" || status === "cancelled") {
      const userId = custom_field_1;
      const packageCode = custom_field_2;

      if (userId && packageCode) {
        await supabase
          .from("checkout_intents")
          .update({
            status: "failed",
            decided_at: new Date().toISOString(),
            decision_note: `Payment ${status}`,
            raw: body,
          })
          .eq("user_id", userId)
          .eq("package_code", packageCode)
          .eq("status", "pending");
      }

      console.log("❌ Payment failed/cancelled");
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("❌ Shopier webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: "active",
    endpoint: "/api/webhooks/shopier",
    provider: "Shopier" 
  });
}
