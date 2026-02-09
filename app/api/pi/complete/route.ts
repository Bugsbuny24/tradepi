import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PI_API_BASE = "https://api.minepi.com/v2";

export async function POST(req: Request) {
  try {
    const { paymentId, txid } = await req.json();
    if (!paymentId || !txid) {
      return NextResponse.json({ error: "paymentId & txid required" }, { status: 400 });
    }

    const key = process.env.PI_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "PI_API_KEY missing" }, { status: 500 });
    }

    const r = await fetch(`${PI_API_BASE}/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    const text = await r.text();
    if (!r.ok) {
      return NextResponse.json(
        { error: `Pi complete failed: ${r.status} ${text}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
