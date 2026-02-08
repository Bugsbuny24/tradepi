import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");

  const supabase = await createClient();
  
  // Kayıt denemesi
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("Kayıt Hatası:", error.message);
    return NextResponse.redirect(new URL("/auth/register?error=" + encodeURIComponent(error.message), req.url), { status: 303 });
  }

  // Kayıt başarılı!
  return NextResponse.redirect(new URL("/dashboard", req.url), { status: 303 });
}
