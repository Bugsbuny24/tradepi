import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { paymentId, intentId } = await req.json();
    const PI_API_KEY = process.env.PI_API_KEY;

    if (!PI_API_KEY) {
      return NextResponse.json({ ok: false, error: "PI_API_KEY not configured" }, { status: 500 });
    }

    const piRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      headers: { Authorization: `Key ${PI_API_KEY}` }
    });

    if (!piRes.ok) {
      return NextResponse.json({ ok: false, error: "Failed to fetch from Pi" }, { status: 500 });
    }

    const payment = await piRes.json();
    const supabase = createClient();
    
    const { data: intent } = await supabase
      .from("purchase_intents")
      .select("*")
      .eq("id", intentId)
      .single();

    if (!intent) {
      return NextResponse.json({ ok: false, error: "Intent not found" }, { status: 404 });
    }

    if (parseFloat(payment.amount) !== parseFloat(intent.amount_pi)) {
      return NextResponse.json({ ok: false, error: "Amount mismatch" }, { status: 400 });
    }

    const approveRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: { 
        Authorization: `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    if (!approveRes.ok) {
      return NextResponse.json({ ok: false, error: "Failed to approve" }, { status: 500 });
    }

    await supabase
      .from("purchase_intents")
      .update({ status: "approved" })
      .eq("id", intentId);

    return NextResponse.json({ ok: true, paymentId, status: "approved" });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
