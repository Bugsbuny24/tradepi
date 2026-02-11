import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // PI payment approve webhook stub
    // TODO: verify payment on Pi server / handle business logic
    return NextResponse.json({ ok: true, received: body });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}
