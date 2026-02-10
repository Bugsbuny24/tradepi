import { NextResponse, type NextRequest } from "next/server";

import { createRouteClient } from "@/lib/supabase/route";

/**
 * Handles Supabase email confirmation / magic-link callbacks.
 * Supabase redirects here with ?code=... and we exchange it for a session.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    const redirectUrl = new URL("/auth/login", url.origin);
    redirectUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(redirectUrl);
  }

  const { supabase, response } = createRouteClient(req);

  // Exchange the auth code for a session (sets cookies via Supabase SSR).
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const redirectUrl = new URL("/auth/login", url.origin);
    redirectUrl.searchParams.set("error", error.message);
    return NextResponse.redirect(redirectUrl);
  }

  // Carry cookies from `response` onto the redirect response.
  const redirectUrl = new URL(next, url.origin);
  const redirect = NextResponse.redirect(redirectUrl);
  response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
  return redirect;
}
