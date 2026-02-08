import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");

  const supabase = await createClient();
  
  // Giriş denemesi
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login Hatası:", error.message);
    // Hata varsa geri gönderirken 303 şart!
    return NextResponse.redirect(new URL("/auth/login?error=" + encodeURIComponent(error.message), req.url), { status: 303 });
  }

  // Başarılıysa Dashboard'a 303 ile uçur
  return NextResponse.redirect(new URL("/dashboard", req.url), { status: 303 });
}
