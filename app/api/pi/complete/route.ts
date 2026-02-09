import { NextRequest, NextResponse } from "next/server";
import { piCompletePayment } from "@/lib/pi/pi-api";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const paymentId = body?.paymentId;
    const txid = body?.txid;

    if (!paymentId || !txid) {
      return NextResponse.json(
        { error: "missing paymentId/txid" },
        { status: 400 }
      );
    }

    const result = await piCompletePayment(String(paymentId), String(txid));
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "complete error" },
      { status: 500 }
    );
  }
}
