import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  if (!email || !password) {
    return NextResponse.redirect(
      new URL(`/auth/register?error=${encodeURIComponent("missing_fields")}`, req.url)
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/register?error=${encodeURIComponent(error.message)}`, req.url)
    );
  }

  // Email confirmation açıksa session null olabilir.
  if (!data.session) {
    return NextResponse.redirect(
      new URL(
        `/auth/login?message=${encodeURIComponent(
          "Kayıt tamam. E-postanı kontrol edip doğruladıktan sonra giriş yap."
        )}`,
        req.url
      )
    );
  }

  return NextResponse.redirect(new URL(next, req.url));
}
