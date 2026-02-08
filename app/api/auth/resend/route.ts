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
  const next = String(formData.get("next") || "/dashboard");

  const origin = request.headers.get("origin") || "http://localhost:3000";

  if (!email) {
    return NextResponse.redirect(
      redirectUrl(origin, "/auth/login", { error: "missing_email", next }),
      { status: 303 }
    );
  }

  const emailRedirectTo = redirectUrl(origin, "/auth/callback", { next });

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo },
  });

  if (error) {
    return NextResponse.redirect(
      redirectUrl(origin, "/auth/login", {
        error: encodeURIComponent(error.message),
        checkEmail: "1",
        email,
        next,
      }),
      { status: 303 }
    );
  }

  return NextResponse.redirect(
    redirectUrl(origin, "/auth/login", {
      info: "resend_ok",
      checkEmail: "1",
      email,
      next,
    }),
    { status: 303 }
  );
}
