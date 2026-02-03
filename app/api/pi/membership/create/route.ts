// app/api/pi/membership/create/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthedUserId } from "@/lib/getAuthedUserId";
import { piCreatePayment } from "@/lib/piApi";

export async function POST(req: Request) {
  const uid = await getAuthedUserId(req);
  if (!uid) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const admin = supabaseAdmin();

  const amount = 100;
  const memo = "Seller membership (1 year)";

  const pi = await piCreatePayment({
    amount,
    memo,
    purpose: "seller_membership_yearly",
    metadata: { uid, plan: "seller_yearly_100pi" },
  });

  // lib/piApi.ts normalizes the response shape to `{ payment_id, status, raw }`
  const payment_id = pi.payment_id;

  const ins = await admin.from("pi_payments").insert({
    payment_id,
    user_id: uid,
    purpose: "seller_membership_yearly",
    amount,
    status: "created",
    memo,
    raw: pi.raw,
    updated_at: new Date().toISOString(),
  }).select("id,payment_id").single();

  if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 400 });

  return NextResponse.json({ ok: true, payment_id: ins.data.payment_id, pi_raw: pi.raw });
}
