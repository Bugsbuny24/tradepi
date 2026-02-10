import { piCancelPayment } from "@/lib/pi/pi-api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const paymentId = body?.paymentId;

    if (!paymentId || typeof paymentId !== "string") {
      return Response.json({ error: "paymentId required" }, { status: 400 });
    }

    const res = await piCancelPayment(paymentId);
    return Response.json({ ok: true, res });
  } catch (e: any) {
    return Response.json(
      { error: e?.message || "cancel failed" },
      { status: 500 }
    );
  }
}
