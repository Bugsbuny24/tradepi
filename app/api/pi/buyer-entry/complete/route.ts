// app/api/pi/buyer-entry/complete/route.ts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { piGetPayment, piCompletePayment } from "@/lib/piApi";

export async function POST(req: Request) {
  try {
    const { payment_id } = await req.json();

    if (!payment_id) {
      return NextResponse.json(
        { error: "payment_id required" },
        { status: 400 }
      );
    }

    const admin = supabaseAdmin();

    // 1) Pi'den ödeme durumunu çek
    const p = await piGetPayment(payment_id);

    // 2) Pi tarafında completed değilse complete çağır
    if (p.status !== "completed") {
      await piCompletePayment(payment_id, (p.raw as any)?.txid ?? undefined);
    }

    // 3) DB güncelle
    const txid =
      (p.raw as any)?.txid ??
      (p.raw as any)?.transaction?.txid ??
      null;

    const { error } = await admin
      .from("pi_payments")
      .update({
        status: "completed",
        txid,
        raw: p.raw,
        updated_at: new Date().toISOString(),
      })
      .eq("payment_id", payment_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      payment_id,
      txid,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "UNKNOWN_ERROR" },
      { status: 500 }
    );
  }
}
