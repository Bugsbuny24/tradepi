// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { getSharedCookieDomain } from "@/lib/site-url";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 401 }
      );
    }

    // Cookie domain fix (www + apex ortak)
    const host = headers().get("host") || undefined;
    const domain = getSharedCookieDomain(host);

    const res = NextResponse.json({ ok: true });

    // auth-helpers cookie’leri zaten set ediyor; burada domain override edelim
    // Not: Bu override, Pi Browser gibi garip ortamlarda aşırı işe yarıyor.
    const all = res.cookies.getAll();
    for (const c of all) {
      res.cookies.set({
        name: c.name,
        value: c.value,
        path: c.path ?? "/",
        httpOnly: c.httpOnly ?? true,
        secure: true,
        sameSite: "lax",
        domain: domain,
        expires: c.expires,
      });
    }

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Login failed" },
      { status: 500 }
    );
  }
}
