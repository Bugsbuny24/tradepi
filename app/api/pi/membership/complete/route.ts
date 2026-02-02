// app/api/pi/membership/complete/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthedUserId } from "@/lib/getAuthedUserId";
import { piCompletePayment } from "@/lib/piApi";

function addYears(date: Date, years: number) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export async function POST(req: Request) {
  try {
    const uid = await getAuthedUserId(req);
    if (!uid) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const payment_id = body?.payment_id as string | undefined;
    const txid = body?.txid as string | undefined;

    if (!payment_id) return NextResponse.json({ error: "payment_id required" }, { status: 400 });

    const admin = supabaseAdmin();

    // 1) DB kaydı var mı + sahibini kontrol et
    const { data: row, error: rowErr } = await admin
      .from("pi_payments")
      .select("payment_id,user_id,purpose,status,amount")
      .eq("payment_id", payment_id)
      .single();

    if (rowErr || !row) return NextResponse.json({ error: "payment not found" }, { status: 404 });
    if (row.user_id !== uid) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    if (row.purpose !== "seller_membership_yearly")
      return NextResponse.json({ error: "invalid purpose" }, { status: 400 });

    // 2) Idempotency: zaten completed ise membership’i tekrar kurcalama
    if (row.status === "completed") {
      return NextResponse.json({ ok: true, status: "completed", already: true });
    }
    if (["cancelled", "failed"].includes(row.status)) {
      return NextResponse.json({ ok: false, status: row.status, error: "payment not completable" }, { status: 400 });
    }

    // 3) Pi API complete çağır
    const pi = await piCompletePayment(payment_id, txid);

    // 4) DB: payment status completed + raw + txid (varsa)
    const { error: upErr } = await admin
      .from("pi_payments")
      .update({ status: "completed", raw: pi.raw, txid: txid ?? null })
      .eq("payment_id", payment_id)
      .in("status", ["created", "server_approved"]); // idempotent geçiş

    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

    // 5) Profil: üyelik set et (idempotent)
    const now = new Date();
    const expires = addYears(now, 1);

    const { error: profErr } = await admin
      .from("profiles")
      .update({
        is_member: true,
        is_seller: true,
        membership_plan: "seller_yearly_100pi",
        membership_started_at: now.toISOString(),
        membership_expires_at: expires.toISOString(),
      })
      .eq("id", uid);

    if (profErr) return NextResponse.json({ error: profErr.message }, { status: 400 });

    return NextResponse.json({ ok: true, status: "completed", payment_id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "complete failed" }, { status: 400 });
  }
}
