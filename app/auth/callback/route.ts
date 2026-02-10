import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=Missing%20code", req.url)
    );
  }

  const { supabase, response } = createRouteClient(req);

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url);
  }

  const redirectUrl = new URL(next, req.url);
  const redirect = NextResponse.redirect(redirectUrl);

  response.cookies.getAll().forEach((c) => {
    redirect.cookies.set(c);
  });

  return redirect;
}
