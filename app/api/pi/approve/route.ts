import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) return NextResponse.json({ error: "paymentId required" }, { status: 400 });

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "PI_API_KEY missing" }, { status: 500 });

    // Pi server approve
    const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Key ${apiKey}` },
    });

    const rawText = await r.text();
    if (!r.ok) return new NextResponse(rawText, { status: 400 });

    // DB log: status = server_approved (upsert by payment_id)
    await supabaseAdmin.from("pi_payments").upsert(
      {
        payment_id: paymentId,
        status: "server_approved",
        purpose: "membership",
        amount: 100,
        raw: { approve_response: rawText },
      },
      { onConflict: "payment_id" }
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "error" }, { status: 500 });
  }
      }
