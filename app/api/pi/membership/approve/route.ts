import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ error: "paymentId required" }, { status: 400 });
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "PI_API_KEY missing" }, { status: 500 });

    const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${apiKey}`,
      }
    });

    const text = await r.text();
    if (!r.ok) return new NextResponse(text, { status: 400 });

    // DB status güncelle
    await supabaseAdmin
      .from("pi_payments")
      .update({ status: "approved", raw: { approve_response: text } })
      .eq("payment_id", paymentId);

    return new NextResponse(text, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown error" }, { status: 500 });
  }
}
