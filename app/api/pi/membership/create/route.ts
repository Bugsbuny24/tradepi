import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// POST body: { user_id, plan }  plan: "buyer_first" | "seller_yearly"
export async function POST(req: Request) {
  try {
    const { user_id, plan } = await req.json();

    if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });
    if (!plan) return NextResponse.json({ error: "plan required" }, { status: 400 });

    // buyer tek sefer kuralı: zaten member ise tekrar oluşturma
    if (plan === "buyer_first") {
      const prof = await supabaseAdmin.from("profiles").select("is_member,membership_plan").eq("id", user_id).single();
      if (prof.data?.is_member && prof.data?.membership_plan === "buyer_activation") {
        return NextResponse.json({ ok: true, already: true });
      }
    }

    const amount =
      plan === "buyer_first" ? 0.1 :
      plan === "seller_yearly" ? 100 :
      null;

    if (amount === null) return NextResponse.json({ error: "invalid plan" }, { status: 400 });

    const purpose =
      plan === "buyer_first" ? "buyer_activation" :
      "seller_yearly";

    // payment_id’yi Pi SDK front üretip gönderiyor varsayımı
    // Eğer sen backend’de create edeceksen, onu da ekleriz.
    const payment_id = crypto.randomUUID(); // MVP placeholder

    const { error } = await supabaseAdmin.from("pi_payments").insert({
      payment_id,
      txid: null,
      user_id,
      purpose,
      amount,
      status: "created",
      raw: { plan },
    });

    if (error) throw new Error(error.message);

    // frontend Pi SDK'ya bunu verip payment başlatır
    return NextResponse.json({ ok: true, payment_id, amount, purpose });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "create failed" }, { status: 500 });
  }
}
