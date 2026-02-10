import { NextResponse } from "next/server";
import { cancelPayment } from "@/lib/pi/pi-api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ error: "paymentId missing" }, { status: 400 });
    }

    const result = await cancelPayment(String(paymentId));
    return NextResponse.json({ ok: true, result });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "cancel failed" }, { status: 500 });
  }
}
