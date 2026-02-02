export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function piGetPayment(paymentId: string) {
  const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${process.env.PI_API_KEY}`,
    },
  });
  const text = await r.text();
  if (!r.ok) throw new Error(text);
  return JSON.parse(text);
}

async function piComplete(paymentId: string, txid: string) {
  const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${process.env.PI_API_KEY}`,
    },
    body: JSON.stringify({ txid }),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(text);
  return text;
}

export async function POST(req: Request) {
  const { paymentId, txid } = await req.json();
  if (!paymentId || !txid) {
    return NextResponse.json({ error: "paymentId & txid required" }, { status: 400 });
  }

  const appWallet = process.env.PI_APP_WALLET_ADDRESS!;
  if (!appWallet) return NextResponse.json({ error: "PI_APP_WALLET_ADDRESS missing" }, { status: 500 });

  // DB satırı
  const { data: row, error } = await supabaseAdmin
    .from("pi_payments")
    .select("payment_id, user_id, amount, purpose, status, txid")
    .eq("payment_id", paymentId)
    .maybeSingle();

  if (error || !row) return NextResponse.json({ error: "payment not found" }, { status: 404 });
  if (row.purpose !== "membership") return NextResponse.json({ error: "wrong purpose" }, { status: 400 });

  // idempotent: zaten completed ise OK dön
  if (row.status === "completed") {
    return NextResponse.json({ ok: true, alreadyCompleted: true, txid: row.txid });
  }

  // Pi complete çağır
  try {
    await piComplete(paymentId, txid);
  } catch (e: any) {
    return NextResponse.json({ error: "pi_complete_failed", detail: String(e?.message ?? e) }, { status: 400 });
  }

  // Pi'den gerçek payment çek (kanıt)
  let piPayment: any;
  try {
    piPayment = await piGetPayment(paymentId);
  } catch (e: any) {
    return NextResponse.json({ error: "pi_fetch_failed", detail: String(e?.message ?? e) }, { status: 400 });
  }

  // Alanlar API'ye göre değişebildiği için esnek okuyalım
  const amount = Number(piPayment?.amount ?? piPayment?.payment?.amount ?? 0);
  const piTxid = String(piPayment?.txid ?? piPayment?.payment?.txid ?? "").trim();
  const toAddress = String(piPayment?.to_address ?? piPayment?.payment?.to_address ?? "").trim();
  const status = String(piPayment?.status ?? piPayment?.payment?.status ?? "").toLowerCase();

  // Kontroller (en kritik)
  if (amount !== 100) return NextResponse.json({ error: "amount_mismatch", amount }, { status: 400 });
  if (piTxid !== txid) return NextResponse.json({ error: "txid_mismatch", piTxid, txid }, { status: 400 });
  if (toAddress && toAddress !== appWallet) {
    return NextResponse.json({ error: "recipient_mismatch", toAddress }, { status: 400 });
  }
  if (!(status.includes("complete") || status.includes("completed"))) {
    return NextResponse.json({ error: "not_completed", status }, { status: 400 });
  }

  // DB güncelle
  const upd = await supabaseAdmin
    .from("pi_payments")
    .update({
      txid,
      status: "completed",
      raw: piPayment,
    })
    .eq("payment_id", paymentId);

  if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 500 });

  // 1 yıllık üyelik aç
  const now = new Date();
  const expires = new Date(now);
  expires.setFullYear(expires.getFullYear() + 1);

  // Eğer mevcut üyelik varsa uzatmak istiyorsan:
  // - membership_expires_at > now ise, oradan +1 yıl yaparız
  const prof = await supabaseAdmin
    .from("profiles")
    .select("membership_expires_at")
    .eq("id", row.user_id)
    .maybeSingle();

  let base = now;
  const currentExp = prof.data?.membership_expires_at ? new Date(prof.data.membership_expires_at) : null;
  if (currentExp && currentExp > now) base = currentExp;

  const newExp = new Date(base);
  newExp.setFullYear(newExp.getFullYear() + 1);

  const updProfile = await supabaseAdmin
    .from("profiles")
    .update({
      is_member: true,
      membership_started_at: now.toISOString(),
      membership_expires_at: newExp.toISOString(),
    })
    .eq("id", row.user_id);

  if (updProfile.error) {
    return NextResponse.json({ ok: true, warning: "profile_update_failed", detail: updProfile.error.message }, { status: 200 });
  }

  return NextResponse.json({ ok: true, txid, membership_expires_at: newExp.toISOString() });
                                           }
