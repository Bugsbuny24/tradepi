// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { getSharedCookieDomain } from "@/lib/site-url";

export async function POST() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  await supabase.auth.signOut();

  const host = headers().get("host") || undefined;
  const domain = getSharedCookieDomain(host);

  const res = NextResponse.json({ ok: true });

  // tüm cookie’leri temizle
  const all = res.cookies.getAll();
  for (const c of all) {
    res.cookies.set({
      name: c.name,
      value: "",
      path: c.path ?? "/",
      httpOnly: c.httpOnly ?? true,
      secure: true,
      sameSite: "lax",
      domain,
      expires: new Date(0),
    });
  }

  return res;
}
