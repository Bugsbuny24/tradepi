import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { paymentId } = await req.json();

  const PI_API_KEY = process.env.PI_API_KEY!;

  // Pi server API'den ödeme bilgisini çek
  const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
    headers: {
      Authorization: `Key ${PI_API_KEY}`
    }
  });

  const payment = await res.json();

  // burada gerçek kontrol yapılır
  if (payment.status === "completed") {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false });
}
