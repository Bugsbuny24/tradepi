import { NextRequest, NextResponse } from "next/server";
import { piApprovePayment } from "@/lib/pi/pi-api";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const paymentId = body?.paymentId;

    if (!paymentId) {
      return NextResponse.json({ error: "missing paymentId" }, { status: 400 });
    }

    const result = await piApprovePayment(String(paymentId));
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "approve error" },
      { status: 500 }
    );
  }
}
