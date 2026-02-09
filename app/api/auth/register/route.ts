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
    return NextResponse.redirect(`${origin}/auth/register?error=missing_fields`, { status: 303 });
  }

  // signUp sonrası cookie basma ihtimali var (bazı akışlarda session dönebiliyor)
  const okResponse = NextResponse.redirect(
    `${origin}/auth/login?checkEmail=1&next=${encodeURIComponent(nextPath)}`,
    { status: 303 }
  );
  const supabase = makeSupabase(request, okResponse);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Email doğrulama linki buraya düşecek:
      // app/auth/callback/route.ts
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    const msg = (error.message || "").toLowerCase();
    const code =
      msg.includes("already registered") ? "email_already_registered" :
      msg.includes("user already registered") ? "email_already_registered" :
      "register_failed";

    return NextResponse.redirect(`${origin}/auth/register?error=${encodeURIComponent(code)}`, { status: 303 });
  }

  return okResponse;
}
