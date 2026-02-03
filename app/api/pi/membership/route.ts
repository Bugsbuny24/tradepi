// app/api/pi/membership/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Legacy endpoint: approves on Pi + marks DB status.
// (If you don't use this endpoint, it still must compile for Vercel build.)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payment_id: string | undefined = body.payment_id ?? body.paymentId;

    if (!payment_id) {
      return NextResponse.json({ error: "payment_id required" }, { status: 400 });
    }

    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) throw new Error("Missing PI_API_KEY");

    const r = await fetch(`https://api.minepi.com/v2/payments/${payment_id}/approve`, {
      method: "POST",
      headers: { Authorization: `Key ${PI_API_KEY}` },
    });

    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: "Pi approve failed", detail: data }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const upd = await admin
      .from("pi_payments")
      .update({
        status: "server_approved",
        raw: data,
        updated_at: new Date().toISOString(),
      })
      .eq("payment_id", payment_id);

    if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 400 });

    return NextResponse.json({ ok: true, payment_id, pi_raw: data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "membership approve failed" }, { status: 400 });
  }
}
