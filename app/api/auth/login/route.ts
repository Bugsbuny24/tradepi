// app/api/auth/login/route.ts (veya senin login route dosyan)
import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient } from "@/lib/supabase/route"; // route (5).ts'deki yer

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  // 1. Kendi oluşturduğun route client'ı çağır
  const { supabase, response } = createRouteClient(req);

  // 2. Giriş yap
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url);
  }

  // 3. BURASI KRİTİK: Redirect objesini oluştur
  const redirectUrl = new URL(next, req.url);
  // ÖNEMLİ: createRouteClient'tan dönen 'response' objesini temel alarak redirect yapmalısın
  // Çünkü çerezler o 'response' objesinin içinde birikti.
  const finalResponse = NextResponse.redirect(redirectUrl);

  // Çerezleri tek tek elle kopyalamak yerine response üzerinden yönetmek daha garantidir
  // Ama senin yapıya göre şu aktarım en sağlamı:
  response.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return finalResponse;
}
