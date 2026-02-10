import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  const { supabase, response: initialResponse } = createRouteClient(req);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url);
  }

  // Pi Browser için JSON dönüyoruz ki frontend'de window.location yapabilelim
  const finalResponse = NextResponse.json({ success: true, next });

  // Çerez aktarımı (TypeScript hatası giderildi)
  initialResponse.cookies.getAll().forEach((c) => {
    finalResponse.cookies.set(c.name, c.value, {
      // Options yerine doğrudan c'nin kendisini yayıyoruz
      ...c, 
      sameSite: "lax", 
      secure: true,
      path: "/",
    });
  });

  return finalResponse;
}
