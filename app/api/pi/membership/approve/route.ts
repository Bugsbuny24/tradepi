import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { piGetPayment } from "@/lib/piVerify";

export async function POST(req: Request) {
  try {
    const { payment_id } = await req.json();
    if (!payment_id) return NextResponse.json({ error: "payment_id required" }, { status: 400 });

    // Pi'den doğrula
    const piPayment = await piGetPayment(payment_id);

    // Burada istersen kontrol:
    // - amount doğru mu
    // - recipient doğru mu (senin app wallet)
    // - status vs
    // Şimdilik raw'a yazıyoruz.
    const { error } = await supabaseAdmin
      .from("pi_payments")
      .update({ status: "server_approved", raw: piPayment })
      .eq("payment_id", payment_id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "approve failed" }, { status: 500 });
  }
}
