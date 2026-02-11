import { NextResponse } from "next/server";

export const runtime = "nodejs";
const PI_API = "https://api.minepi.com/v2";

function getApiKey() {
  const key = process.env.PI_PLATFORM_API_KEY || process.env.PI_API_KEY || "";
  if (!key) throw new Error("Missing PI_PLATFORM_API_KEY (or PI_API_KEY) env var");
  return key;
}

export async function POST(req: Request) {
  try {
    const { paymentId } = (await req.json()) as { paymentId?: string };
    if (!paymentId) {
      return NextResponse.json({ ok: false, error: "paymentId is required" }, { status: 400 });
    }

    const apiKey = getApiKey();
    const res = await fetch(`${PI_API}/payments/${paymentId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${apiKey}`,
      },
    });

    const text = await res.text();
    return NextResponse.json(
      { ok: res.ok, status: res.status, body: safeJson(text) },
      { status: res.ok ? 200 : 500 }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
