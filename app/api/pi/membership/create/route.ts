import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MEMBERSHIP_AMOUNT = 100; // yıllık 100 Pi

export async function POST(req: Request) {
  try {
    const { userId, plan } = await req.json(); // plan: "yearly" (şimdilik)
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const apiKey = process.env.PI_API_KEY;
    const appBaseUrl = process.env.APP_BASE_URL; // örn: https://tradepigloball.co
    if (!apiKey) return NextResponse.json({ error: "PI_API_KEY missing" }, { status: 500 });
    if (!appBaseUrl) return NextResponse.json({ error: "APP_BASE_URL missing" }, { status: 500 });

    const amount = MEMBERSHIP_AMOUNT;
    const purpose = "membership_yearly";

    // Pi "create payment"
    const r = await fetch("https://api.minepi.com/v2/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${apiKey}`,
      },
      body: JSON.stringify({
        amount,
        memo: "TradePiGloball yearly membership",
        metadata: { purpose, userId, plan: plan ?? "yearly" },
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: "pi create failed", details: data }, { status: 400 });
    }

    const paymentId = data?.identifier;
    if (!paymentId) {
      return NextResponse.json({ error: "Pi did not return payment identifier", details: data }, { status: 400 });
    }

    // DB’ye yaz (txid henüz yok => '' basıyoruz)
    const { error: dbErr } = await supabaseAdmin.from("pi_payments").insert({
      payment_id: paymentId,
      txid: "",
      user_id: userId,
      purpose,
      order_id: null,
      amount,
      status: "created",
      memo: "TradePiGloball yearly membership",
      raw: data
    });

    if (dbErr) {
      return NextResponse.json({ error: "db insert failed", details: dbErr.message }, { status: 500 });
    }

    // Frontend Pi SDK'ya bu paymentId'yi verecek.
    return NextResponse.json({
      paymentId,
      amount,
      purpose,
      callbackUrl: `${appBaseUrl}/` // istersen özel callback sayfası yaparız
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown error" }, { status: 500 });
  }
}
