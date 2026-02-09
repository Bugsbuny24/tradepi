import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieOptions = Parameters<NextResponse["cookies"]["set"]>[2];
type CookieToSet = { name: string; value: string; options: CookieOptions };

function makeSupabase(request: NextRequest, response: NextResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;

  const formData = await request.formData();
  const emailVal = formData.get("email");
  const passVal = formData.get("password");
  const nextVal = formData.get("next");

  const email = typeof emailVal === "string" ? emailVal : "";
  const password = typeof passVal === "string" ? passVal : "";
  const nextPath = typeof nextVal === "string" && nextVal.startsWith("/") ? nextVal : "/dashboard";

  if (!email || !password) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_fields`, { status: 303 });
  }

  // Success path response (cookies will be written into THIS response)
  const successResponse = NextResponse.redirect(`${origin}${nextPath}`, { status: 303 });
  const supabase = makeSupabase(request, successResponse);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msg = (error.message || "").toLowerCase();

    // Daha temiz UI için kodlara indiriyoruz
    const code =
      msg.includes("invalid login credentials") ? "invalid_login_credentials" :
      msg.includes("email not confirmed") ? "email_not_confirmed" :
      "login_failed";

    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(code)}`, { status: 303 });
  }

  return successResponse;
}
