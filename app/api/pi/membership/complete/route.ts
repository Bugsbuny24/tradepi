// app/api/pi/membership/complete/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { piGetPayment } from "@/lib/piApi";

function addOneYear(baseIso: string) {
  const d = new Date(baseIso);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
}

export async function POST(req: Request) {
  const { payment_id } = await req.json().catch(() => ({}));
  if (!payment_id) return NextResponse.json({ error: "payment_id required" }, { status: 400 });

  const admin = supabaseAdmin();
  const p = await piGetPayment(payment_id);

  const status = (p.status ?? "").toLowerCase();
  if (!["completed", "complete", "paid"].includes(status)) {
    return NextResponse.json({ error: "NOT_COMPLETED", pi_status: p.status }, { status: 400 });
  }

  const row = await admin
    .from("pi_payments")
    .select("user_id,purpose,amount")
    .eq("payment_id", payment_id)
    .single();

  if (row.error) return NextResponse.json({ error: row.error.message }, { status: 400 });
  if (row.data.purpose !== "seller_membership_yearly") {
    return NextResponse.json({ error: "WRONG_PURPOSE" }, { status: 400 });
  }

  const uid = row.data.user_id;
  if (!uid) return NextResponse.json({ error: "NO_USER" }, { status: 400 });

  // pi_payments update
  await admin.from("pi_payments").update({
    status: "completed",
    txid: p.txid ?? p.transaction?.txid ?? null,
    raw: p,
    updated_at: new Date().toISOString(),
  }).eq("payment_id", payment_id);

  // profile: uzatma mantığı
  const prof = await admin
    .from("profiles")
    .select("membership_expires_at,membership_started_at")
    .eq("id", uid)
    .single();

  if (prof.error) return NextResponse.json({ error: prof.error.message }, { status: 400 });

  const nowIso = new Date().toISOString();
  const currentExp = prof.data.membership_expires_at;
  const base = currentExp && new Date(currentExp) > new Date() ? currentExp : nowIso;
  const newExp = addOneYear(base);

  const upd = await admin.from("profiles").update({
    is_seller: true,
    is_member: true,
    membership_plan: "seller_yearly_100pi",
    membership_started_at: prof.data.membership_started_at ?? nowIso,
    membership_expires_at: newExp,
  }).eq("id", uid);

  if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 400 });

  return NextResponse.json({ ok: true, membership_expires_at: newExp });
}
