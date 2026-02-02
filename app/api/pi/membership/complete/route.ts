import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { paymentId, txid } = await req.json();
    if (!paymentId || !txid) {
      return NextResponse.json({ error: "paymentId and txid required" }, { status: 400 });
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "PI_API_KEY missing" }, { status: 500 });

    // Pi complete
    const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${apiKey}`,
      },
      body: JSON.stringify({ txid }),
    });

    const resultText = await r.text();
    if (!r.ok) {
      return new NextResponse(resultText, { status: 400 });
    }

    // DB'den payment'ı çek (user_id lazım)
    const { data: payRow, error: payErr } = await supabaseAdmin
      .from("pi_payments")
      .select("user_id, amount, purpose")
      .eq("payment_id", paymentId)
      .single();

    if (payErr || !payRow?.user_id) {
      return NextResponse.json({ error: "payment not found in db", details: payErr?.message }, { status: 404 });
    }

    // pi_payments güncelle
    const { error: upErr } = await supabaseAdmin
      .from("pi_payments")
      .update({
        status: "completed",
        txid,
        raw: { complete_response: resultText }
      })
      .eq("payment_id", paymentId);

    if (upErr) {
      return NextResponse.json({ error: "db update failed", details: upErr.message }, { status: 500 });
    }

    // Üyelik aç (1 yıl)
    const now = new Date();
    const expires = new Date(now);
    expires.setFullYear(expires.getFullYear() + 1);

    const { error: profErr } = await supabaseAdmin
      .from("profiles")
      .update({
        is_member: true,
        membership_started_at: now.toISOString(),
        membership_expires_at: expires.toISOString(),
      })
      .eq("id", payRow.user_id);

    if (profErr) {
      return NextResponse.json({ error: "profile update failed", details: profErr.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      paymentId,
      txid,
      membership: {
        started_at: now.toISOString(),
        expires_at: expires.toISOString(),
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown error" }, { status: 500 });
  }
}
