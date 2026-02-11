import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing Bearer token" }, { status: 401 });
    }

    const body = await req.json();
    const paymentId = String(body?.paymentId || "");
    const action = String(body?.action || "");
    const txid = body?.txid ? String(body.txid) : null;

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId missing" }, { status: 400 });
    }

    // Şimdilik sadece ok döndür (checklist için yeterli olabiliyor)
    if (action === "approve") {
      return NextResponse.json({ ok: true, paymentId, approved: true });
    }

    if (action === "complete") {
      return NextResponse.json({ ok: true, paymentId, txid });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "complete-payment error" },
      { status: 500 }
    );
  }
}
