import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Hata varsa URL'ye hata mesajını ekleyip geri fırlat
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, req.url),
      { status: 303 } // 303 status kodu yönlendirmeyi zorunlu kılar
    );
  }

  // BAŞARILI: Dashboard'a uçur
  return NextResponse.redirect(new URL("/dashboard", req.url), { status: 303 });
}
