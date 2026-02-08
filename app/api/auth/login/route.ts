import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

function redirectUrl(origin: string, path: string, params?: Record<string, string>) {
  const url = new URL(path, origin);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  return url.toString();
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  const origin = request.headers.get("origin") || "http://localhost:3000";

  if (!email || !password) {
    return NextResponse.redirect(
      redirectUrl(origin, "/auth/login", { error: "missing_fields", next, email }),
      { status: 303 }
    );
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msg = (error.message || "").toLowerCase();

    // email doğrulaması gerekiyorsa:
    if (msg.includes("confirm") || msg.includes("not confirmed")) {
      return NextResponse.redirect(
        redirectUrl(origin, "/auth/login", {
          error: "email_not_confirmed",
          checkEmail: "1",
          email,
          next,
        }),
        { status: 303 }
      );
    }

    // klasik yanlış şifre/mail
    return NextResponse.redirect(
      redirectUrl(origin, "/auth/login", {
        error: encodeURIComponent(error.message),
        email,
        next,
      }),
      { status: 303 }
    );
  }

  return NextResponse.redirect(redirectUrl(origin, next), { status: 303 });
}
