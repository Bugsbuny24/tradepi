// app/api/pi/buyer-entry/create/route.ts
import { NextResponse } from "next/server";

import { getAuthedUserId } from "@/lib/getAuthedUserId";
import { piCreatePayment } from "@/lib/piApi";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const uid = await getAuthedUserId(req);
    if (!uid) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const admin = supabaseAdmin();

    const amount = 10;
    const memo = "Buyer entry fee";

    const pi = await piCreatePayment({
      amount,
      memo,
      purpose: "buyer_entry",
      metadata: { uid },
    });

    const payment_id = pi.payment_id;

    const ins = await admin
      .from("pi_payments")
      .insert({
        payment_id,
        user_id: uid,
        purpose: "buyer_entry",
        amount,
        status: "created",
        memo,
        raw: pi.raw,
        updated_at: new Date().toISOString(),
      })
      .select("id,payment_id")
      .single();

    if (ins.error) {
      return NextResponse.json({ error: ins.error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, payment_id: ins.data.payment_id, pi_raw: pi.raw });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "create failed" }, { status: 400 });
  }
}
