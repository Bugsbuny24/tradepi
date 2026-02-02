// app/api/pi/buyer-entry/create/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthedUserId } from "@/lib/getAuthedUserId";
import { piCreatePayment } from "@/lib/piApi";

export async function POST(req: Request) {
  const uid = await getAuthedUserId(req);
  if (!uid) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const admin = supabaseAdmin();

  // tek sefer kontrolü
  const prof = await admin
    .from("profiles")
    .select("id,buyer_entry_paid_at")
    .eq("id", uid)
    .single();

  if (prof.error) return NextResponse.json({ error: prof.error.message }, { status: 400 });
  if (prof.data?.buyer_entry_paid_at) {
    return NextResponse.json({ error: "ALREADY_PAID" }, { status: 400 });
  }

  // Pi payment create
  const amount = 1.0;
  const memo = "Buyer entry fee (one-time)";

  const pi = await piCreatePayment({
    amount,
    memo,
    purpose: "buyer_entry",
    metadata: { uid },
  });

  // pi_payments kaydı
  // payment_id string, status enum: created/server_approved/completed/cancelled/failed
  const ins = await admin.from("pi_payments").insert({
    payment_id: pi.paymentId ?? pi.payment_id ?? pi.id, // pi response'a göre ayarla
    user_id: uid,
    purpose: "buyer_entry",
    amount,
    status: "created",
    memo,
    raw: pi,
  }).select("id,payment_id").single();

  if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 400 });

  return NextResponse.json({
    ok: true,
    payment_id: ins.data.payment_id,
    pi_raw: pi,
  });
}
