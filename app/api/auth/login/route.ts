import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient } from "@/lib/supabase/route"; // route (5).ts dosyan

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  // 1. Client ve başlangıç response objesini al
  const { supabase, response } = createRouteClient(req);

  // 2. Giriş yap (Çerezler arka planda 'response' objesine yazılır)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url);
  }

  // 3. Yönlendirme objesini hazırla
  const redirectUrl = new URL(next, req.url);
  const finalResponse = NextResponse.redirect(redirectUrl);

  // 4. KRİTİK ADIM: Çerez aktarımı
  // Supabase'in 'response' içine yazdığı auth çerezlerini 'finalResponse'a kopyalıyoruz
  response.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value, {
      ...cookie,
      // Bazı tarayıcı problemleri için ek güvenlik:
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  });

  return finalResponse;
}
