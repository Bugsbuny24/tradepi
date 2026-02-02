export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  const paymentId = body?.paymentId;
  if (!paymentId) {
    return NextResponse.json({ error: "paymentId required" }, { status: 400 });
  }

  const apiKey = process.env.PI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PI_API_KEY missing" }, { status: 500 });
  }

  const r = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${apiKey}`,
    },
    body: JSON.stringify({}),
  });

  const text = await r.text();
  if (!r.ok) return new NextResponse(text, { status: 400 });
  return new NextResponse(text, { status: 200 });
}
