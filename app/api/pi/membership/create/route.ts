export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import crypto from "crypto";

export async function POST(req: Request) {
  // Burada auth kontrolünü kendi sistemine göre yap:
  // - Pi SDK user info
  // - Supabase auth (en temiz: Authorization header JWT)
  // Şimdilik body'den alıyoruz (sonradan JWT ile sabitle)
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const amount = 100;
  const paymentId = crypto.randomUUID();

  const memo = "membership_annual_100pi";

  const ins = await supabaseAdmin.from("pi_payments").insert({
    payment_id: paymentId,
    user_id: userId,
    purpose: "membership",
    amount,
    status: "created",
    memo,
  });

  if (ins.error) {
    return NextResponse.json({ error: ins.error.message }, { status: 500 });
  }

  // Client bu paymentId'yi Pi SDK createPayment'ta identifier olarak kullanır
  return NextResponse.json({
    paymentId,
    amount,
    memo,
  });
}
