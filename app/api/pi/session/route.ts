import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = String(body?.username || "").trim();

    if (!username) {
      return NextResponse.json({ ok: false, error: "username_required" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });

    // www / apex arasında sorun yaşamamak için domain’i env’den yönet
    // Vercel env: NEXT_PUBLIC_COOKIE_DOMAIN=.tradepigloball.co
    const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;

    const common = {
      path: "/",
      sameSite: "lax" as const,
      secure: true,
      maxAge: 60 * 60 * 24 * 30, // 30 gün
      domain,
    };

    // middleware cookie görecek
    res.cookies.set({ name: "pi_session", value: "1", httpOnly: true, ...common });
    res.cookies.set({ name: "pi_username", value: username, httpOnly: true, ...common });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "unknown" },
      { status: 500 }
    );
  }
}
