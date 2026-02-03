// app/api/pi/buyer-entry/create/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthedUserId } from "@/lib/getAuthedUserId";
import { piCreatePayment } from "@/lib/piApi";

export async function POST(req: Request) {
  try {
    const uid = await getAuthedUserId(req);
    if (!uid) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const admin = supabaseAdmin();

    // Buyer giriş ücreti (tek sefer)
    const amount = 0.1;
    const memo = "Buyer entry fee (one-time)";

    const pi = await piCreatePayment({
      amount,
      memo,
      purpose: "buyer_entry",
      metadata: { uid, plan: "buyer_entry_0_1pi" },
    });

    // pi artık normalized dönüyor: { payment_id, status, raw }
    const payment_id = pi.payment_id;

    const { data, error } = await admin
      .from("pi_payments")
      .insert({
        payment_id,
        user_id: uid,
        purpose: "buyer_entry",
        amount,
        status: "created",
        memo,
        raw: pi.raw,
      })
      .select("id, payment_id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      payment_id: data.payment_id,
      pi_raw: pi.raw,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "UNKNOWN_ERROR" },
      { status: 500 }
    );
  }
}
