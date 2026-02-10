import { piCancelPayment as cancelPayment } from "@/lib/pi/pi-api";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { paymentId } = (await req.json()) as { paymentId?: string };

    if (!paymentId) {
      return Response.json({ error: "paymentId is required" }, { status: 400 });
    }

    const data = await cancelPayment(paymentId);
    return Response.json({ ok: true, data });
  } catch (e: any) {
    return Response.json(
      { error: e?.message || "cancel failed" },
      { status: 500 }
    );
  }
}
