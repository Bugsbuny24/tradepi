import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/dashboard");

  if (!email || !password) {
    return NextResponse.redirect(`${origin}/auth/register?error=missing_fields`, { status: 303 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Email confirmation açıksa bu şart:
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/register?error=${encodeURIComponent(error.message)}`,
      { status: 303 }
    );
  }

  // Eğer Supabase email confirm istiyorsa session null gelir.
  if (!data.session) {
    return NextResponse.redirect(`${origin}/auth/login?checkEmail=1`, { status: 303 });
  }

  return NextResponse.redirect(`${origin}${nextPath}`, { status: 303 });
}
