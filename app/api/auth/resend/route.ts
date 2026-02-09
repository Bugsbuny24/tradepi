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
  const nextVal = formData.get("next");

  const email = typeof emailVal === "string" ? emailVal : "";
  const nextPath = typeof nextVal === "string" && nextVal.startsWith("/") ? nextVal : "/dashboard";

  if (!email) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_fields`, { status: 303 });
  }

  const okResponse = NextResponse.redirect(
    `${origin}/auth/login?checkEmail=1&next=${encodeURIComponent(nextPath)}`,
    { status: 303 }
  );
  const supabase = makeSupabase(request, okResponse);

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    // Supabase rate-limit falan: “after 59 seconds” gibi şeyler burada gelir.
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error.message || "resend_failed")}`,
      { status: 303 }
    );
  }

  return okResponse;
}
