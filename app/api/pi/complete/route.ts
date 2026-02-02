import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { addOneYear } from "@/lib/membership";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { paymentId, txid } = await req.json();
    if (!paymentId || !txid) return NextResponse.json({ error: "paymentId & txid required" }, { status: 400 });

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "PI_API_KEY missing" }, { status: 500 });

    // Pi complete
    const completeRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Key ${apiKey}` },
      body: JSON.stringify({ txid }),
    });
    const completeText = await completeRes.text();
    if (!completeRes.ok) return new NextResponse(completeText, { status: 400 });

    // payment detay (metadata içinden pi_uid alacağız)
    const getRes = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Key ${apiKey}` },
    });
    const pay = await getRes.json();
    if (!getRes.ok) return NextResponse.json({ error: "payment_fetch_failed", raw: pay }, { status: 400 });

    const meta = pay?.metadata || {};
    const pi_uid = String(meta?.pi_uid || "");
    if (!pi_uid) return NextResponse.json({ error: "metadata.pi_uid missing" }, { status: 400 });

    // profili bul
    const { data: prof } = await supabaseAdmin
      .from("profiles")
      .select("id,is_seller,membership_expires_at")
      .eq("pi_uid", pi_uid)
      .maybeSingle();

    if (!prof?.id) return NextResponse.json({ error: "profile_not_found" }, { status: 404 });
    if (!prof.is_seller) return NextResponse.json({ error: "only_sellers_can_pay_membership" }, { status: 403 });

    // +1 yıl
    const now = new Date();
    const current = prof.membership_expires_at ? new Date(prof.membership_expires_at) : null;
    const base = current && current > now ? current : now;
    const nextExp = addOneYear(base);

    await supabaseAdmin
      .from("profiles")
      .update({
        is_member: true,
        membership_started_at: current ? prof.membership_expires_at : now.toISOString(),
        membership_expires_at: nextExp.toISOString(),
        membership_plan: "yearly",
      })
      .eq("id", prof.id);

    // pi_payments update
    await supabaseAdmin
      .from("pi_payments")
      .upsert(
        {
          payment_id: paymentId,
          txid,
          user_id: prof.id,
          purpose: "membership",
          amount: Number(pay?.amount ?? 100),
          status: "completed",
          memo: pay?.memo ?? null,
          raw: pay,
        },
        { onConflict: "payment_id" }
      );

    return NextResponse.json({ ok: true, expires_at: nextExp.toISOString() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "error" }, { status: 500 });
  }
}
