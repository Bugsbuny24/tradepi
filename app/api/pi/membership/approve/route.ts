// app/api/pi/membership/approve/route.ts
import { NextResponse } from "next/server";

import { getAuthedUserId } from "@/lib/getAuthedUserId";
import { piApprovePayment } from "@/lib/piApi";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const uid = await getAuthedUserId(req);
    if (!uid) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const { payment_id } = await req.json();
    if (!payment_id) {
      return NextResponse.json({ error: "payment_id required" }, { status: 400 });
    }

    const admin = supabaseAdmin();

    // DB kaydı kontrol
    const rowRes = await admin
      .from("pi_payments")
      .select("id,status,payment_id")
      .eq("payment_id", payment_id)
      .single();

    if (rowRes.error) {
      return NextResponse.json({ error: rowRes.error.message }, { status: 400 });
    }

    const row = rowRes.data;

    // Idempotency
    if (["completed", "cancelled", "failed", "server_approved"].includes(row.status)) {
      return NextResponse.json({ ok: true, status: row.status, already: true });
    }

    // Pi approve
    const pi = await piApprovePayment(payment_id);

    // DB güncelle (server_approved)
    const upd = await admin
      .from("pi_payments")
      .update({
        status: "server_approved",
        raw: pi.raw,
        updated_at: new Date().toISOString(),
      })
      .eq("payment_id", payment_id);

    if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 400 });

    return NextResponse.json({ ok: true, payment_id, pi_raw: pi.raw });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "approve failed" }, { status: 400 });
  }
}
