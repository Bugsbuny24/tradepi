import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing Bearer token" }, { status: 401 });
    }

    const body = await req.json();
    const amount = Number(body?.amount ?? 0.01);
    const memo = String(body?.memo ?? "Test payment");
    const metadata = body?.metadata ?? {};

    // Basit unique id (db yoksa bile çalışsın)
    const paymentId = `pay_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    return NextResponse.json({
      paymentId,
      amount,
      memo,
      metadata,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "create-payment error" },
      { status: 500 }
    );
  }
}
