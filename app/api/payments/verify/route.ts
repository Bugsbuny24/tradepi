import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { paymentId, txid, intentId } = await req.json();
    const PI_API_KEY = process.env.PI_API_KEY;

    if (!PI_API_KEY) {
      return NextResponse.json({ ok: false, error: "PI_API_KEY not configured" }, { status: 500 });
    }

    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      headers: { Authorization: `Key ${PI_API_KEY}` }
    });

    if (!piRes.ok) {
      return NextResponse.json({ ok: false, error: "Failed to verify" }, { status: 500 });
    }

    const payment = await piRes.json();

    if (payment.transaction?.txid !== txid) {
      return NextResponse.json({ ok: false, error: "TXID mismatch" }, { status: 400 });
    }

    const completeRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });

    if (!completeRes.ok) {
      const errorText = await completeRes.text();
      if (!errorText.includes("already completed")) {
        return NextResponse.json({ ok: false, error: "Failed to complete" }, { status: 500 });
      }
    }

    const supabase = createClient();
    
    const { data: intent } = await supabase
      .from("purchase_intents")
      .select("*")
      .eq("id", intentId)
      .single();

    if (!intent) {
      return NextResponse.json({ ok: false, error: "Intent not found" }, { status: 404 });
    }

    await supabase.from("pi_purchases").insert({
      user_id: intent.user_id,
      package_code: intent.package_code,
      amount_pi: intent.amount_pi,
      quota_granted: 0,
      raw: payment
    });

    await supabase
      .from("purchase_intents")
      .update({ status: "completed", txid, decided_at: new Date().toISOString() })
      .eq("id", intentId);

    const { data: pkg } = await supabase
      .from("packages")
      .select("grants")
      .eq("code", intent.package_code)
      .single();

    if (pkg?.grants) {
      for (const [key, value] of Object.entries(pkg.grants)) {
        await supabase.rpc("increment_user_quota", {
          p_user_id: intent.user_id,
          p_quota_key: key,
          p_amount: value
        });
      }
    }

    await supabase.rpc("update_pi_wallet", {
      p_user_id: intent.user_id,
      p_amount: intent.amount_pi,
      p_type: "spent"
    });

    return NextResponse.json({ ok: true, paymentId, txid, status: "completed" });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
