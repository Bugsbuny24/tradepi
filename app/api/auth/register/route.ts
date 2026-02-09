import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  const url = new URL(req.url);
  const origin = url.origin;

  if (!email || !password) {
    return NextResponse.redirect(
      `${origin}/auth/register?error=missing_fields&next=${encodeURIComponent(next)}`,
      { status: 303 }
    );
  }

  const supabase = await createClient();
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/register?error=${encodeURIComponent(error.code ?? "signup_failed")}&next=${encodeURIComponent(next)}`,
      { status: 303 }
    );
  }

  // Supabase bazen “kullanıcı var/yok” sızdırmamak için aynı response döner.
  // O yüzden net: "mail gitti" ekranına yolla.
  const checkEmail = !data.session;

  if (checkEmail) {
    return NextResponse.redirect(
      `${origin}/auth/login?checkEmail=1&next=${encodeURIComponent(next)}`,
      { status: 303 }
    );
  }

  // Confirm email kapalıysa direkt session gelir -> dashboard’a
  return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/dashboard"}`, {
    status: 303,
  });
}
