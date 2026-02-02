// app/api/pi/buyer-entry/complete/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { piGetPayment } from "@/lib/piApi";

export async function POST(req: Request) {
  const { payment_id } = await req.json().catch(() => ({}));
  if (!payment_id) return NextResponse.json({ error: "payment_id required" }, { status: 400 });

  const admin = supabaseAdmin();

  // Pi'den doğrula
  const p = await piGetPayment(payment_id);

  // TODO: p.status alanını Pi formatına göre kontrol et
  const status = (p.status ?? "").toLowerCase();
  if (!["completed", "complete", "paid"].includes(status)) {
    return NextResponse.json({ error: "NOT_COMPLETED", pi_status: p.status }, { status: 400 });
  }

  // DB: pi_payments update
  const payRow = await admin
    .from("pi_payments")
    .select("id,user_id,purpose")
    .eq("payment_id", payment_id)
    .single();

  if (payRow.error) return NextResponse.json({ error: payRow.error.message }, { status: 400 });
  if (payRow.data.purpose !== "buyer_entry") {
    return NextResponse.json({ error: "WRONG_PURPOSE" }, { status: 400 });
  }

  const uid = payRow.data.user_id;
  if (!uid) return NextResponse.json({ error: "NO_USER" }, { status: 400 });

  await admin.from("pi_payments").update({
    status: "completed",
    txid: p.txid ?? p.transaction?.txid ?? null,
    raw: p,
    updated_at: new Date().toISOString(),
  }).eq("payment_id", payment_id);

  // profile işaretle
  const upd = await admin.from("profiles").update({
    buyer_entry_paid_at: new Date().toISOString(),
  }).eq("id", uid);

  if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
