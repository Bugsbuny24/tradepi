import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { piGetPayment } from "@/lib/piVerify";

export async function POST(req: Request) {
  try {
    const { payment_id } = await req.json();
    if (!payment_id) return NextResponse.json({ error: "payment_id required" }, { status: 400 });

    const piPayment = await piGetPayment(payment_id);

    // piPayment içinden txid / amount / user vb alanlar Pi API formatına göre değişebilir.
    // Bu yüzden güvenli çekelim:
    const txid = piPayment?.transaction?.txid ?? piPayment?.txid ?? null;

    // DB’den payment kaydını çek
    const row = await supabaseAdmin
      .from("pi_payments")
      .select("id,user_id,purpose,amount,status")
      .eq("payment_id", payment_id)
      .single();

    if (row.error || !row.data) throw new Error("payment record not found");

    const { user_id, purpose } = row.data;
    if (!user_id) throw new Error("payment has no user_id");

    // pi_payments completed + txid
    const up = await supabaseAdmin
      .from("pi_payments")
      .update({
        status: "completed",
        txid,
        raw: piPayment,
      })
      .eq("payment_id", payment_id);

    if (up.error) throw new Error(up.error.message);

    // profiles update: plan’a göre
    if (purpose === "buyer_activation") {
      const p = await supabaseAdmin.from("profiles").update({
        is_member: true,
        membership_plan: "buyer_activation",
        membership_started_at: new Date().toISOString(),
        membership_expires_at: null,
      }).eq("id", user_id);
      if (p.error) throw new Error(p.error.message);
    }

    if (purpose === "seller_yearly") {
      const now = new Date();
      const expires = new Date(now);
      expires.setFullYear(now.getFullYear() + 1);

      const p = await supabaseAdmin.from("profiles").update({
        is_member: true,
        is_seller: true,
        membership_plan: "seller_yearly",
        membership_started_at: now.toISOString(),
        membership_expires_at: expires.toISOString(),
      }).eq("id", user_id);
      if (p.error) throw new Error(p.error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "complete failed" }, { status: 500 });
  }
}
