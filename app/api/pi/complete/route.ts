import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { paymentId, txid } = await req.json();

  if (!paymentId || !txid) {
    return NextResponse.json(
      { error: "paymentId and txid required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.PI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PI_API_KEY missing" }, { status: 500 });
  }

  const r = await fetch(
    `https://api.minepi.com/v2/payments/${paymentId}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${apiKey}`,
      },
      body: JSON.stringify({ txid }),
    }
  );

  const text = await r.text();

  // /complete OK dönmeden "paid" sayma
  if (!r.ok) return new NextResponse(text, { status: 400 });

  return new NextResponse(text, { status: 200 });
}
