export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function piApprove(paymentId: string) {
  const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${process.env.PI_API_KEY}`,
    },
  });
  const text = await r.text();
  if (!r.ok) throw new Error(text);
  return text;
}

export async function POST(req: Request) {
  const { paymentId } = await req.json();
  if (!paymentId) return NextResponse.json({ error: "paymentId required" }, { status: 400 });

  // DB'de var mı?
  const { data: p, error } = await supabaseAdmin
    .from("pi_payments")
    .select("payment_id, purpose, status")
    .eq("payment_id", paymentId)
    .maybeSingle();

  if (error || !p) return NextResponse.json({ error: "payment not found" }, { status: 404 });
  if (p.purpose !== "membership") return NextResponse.json({ error: "wrong purpose" }, { status: 400 });

  // Pi approve
  try {
    await piApprove(paymentId);
  } catch (e: any) {
    return NextResponse.json({ error: "pi_approve_failed", detail: String(e?.message ?? e) }, { status: 400 });
  }

  await supabaseAdmin.from("pi_payments").update({ status: "server_approved" }).eq("payment_id", paymentId);

  return NextResponse.json({ ok: true });
}
