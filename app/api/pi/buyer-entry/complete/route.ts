// app/api/pi/buyer-entry/complete/route.ts

import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { piGetPayment, piCompletePayment } from "@/lib/piApi";

export async function POST(req: Request) {
  const { payment_id } = await req.json();

  if (!payment_id) {
    return NextResponse.json(
      { error: "payment_id required" },
      { status: 400 }
    );
  }

  const admin = supabaseAdmin();

  // 1️⃣ Pi’den payment durumunu çek
  const p = await piGetPayment(payment_id);

  // 2️⃣ Eğer Pi tarafında completed değilse tamamla
  if (p.status !== "completed") {
    await piCompletePayment(payment_id, p.txid ?? undefined);
  }

  // 3️⃣ DB güncelle (🔥 transaction YOK, sadece p.txid)
  const { error } = await admin
    .from("pi_payments")
    .update({
      status: "completed",
      txid: p.txid ?? null,
      raw: p.raw,
      updated_at: new Date().toISOString(),
    })
    .eq("payment_id", payment_id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    payment_id,
    txid: p.txid ?? null,
  });
}
