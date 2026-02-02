// app/api/pi/membership/approve/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthedUserId } from "@/lib/getAuthedUserId";
import { piApprovePayment } from "@/lib/piApi";

export async function POST(req: Request) {
  try {
    const uid = await getAuthedUserId(req);
    if (!uid) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const payment_id = body?.payment_id as string | undefined;
    if (!payment_id) return NextResponse.json({ error: "payment_id required" }, { status: 400 });

    const admin = supabaseAdmin();

    // 1) DB kaydı var mı + sahibini kontrol et
    const { data: row, error: rowErr } = await admin
      .from("pi_payments")
      .select("payment_id,user_id,purpose,status")
      .eq("payment_id", payment_id)
      .single();

    if (rowErr || !row) return NextResponse.json({ error: "payment not found" }, { status: 404 });
    if (row.user_id !== uid) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    if (row.purpose !== "seller_membership_yearly")
      return NextResponse.json({ error: "invalid purpose" }, { status: 400 });

    // 2) Idempotency: zaten completed/cancelled/failed ise approve yapma
    if (["completed", "cancelled", "failed"].includes(row.status)) {
      return NextResponse.json({ ok: true, status: row.status, already: true });
    }

    // 3) Pi API approve çağır
    const pi = await piApprovePayment(payment_id);

    // 4) DB status güncelle (created -> server_approved)
    // Not: aynı anda 2 istek gelirse bile, ikisi de update etmeye çalışır; sorun değil.
    const { error: upErr } = await admin
      .from("pi_payments")
      .update({ status: "server_approved", raw: pi.raw })
      .eq("payment_id", payment_id)
      .in("status", ["created", "server_approved"]); // idempotent

    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

    return NextResponse.json({ ok: true, payment_id, status: "server_approved" });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "approve failed" }, { status: 400 });
  }
    }
