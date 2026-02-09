import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email") || "").trim();
  const next = String(formData.get("next") || "/dashboard");

  const url = new URL(req.url);
  const origin = url.origin;

  if (!email) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=missing_email&next=${encodeURIComponent(next)}`,
      { status: 303 }
    );
  }

  const supabase = await createClient();
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error.code ?? "resend_failed")}&next=${encodeURIComponent(next)}`,
      { status: 303 }
    );
  }

  return NextResponse.redirect(
    `${origin}/auth/login?checkEmail=1&next=${encodeURIComponent(next)}`,
    { status: 303 }
  );
}
