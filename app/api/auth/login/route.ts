// app/api/auth/login/route.ts
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

  // BURASI KRİTİK: Redirect yerine JSON dönüyoruz
  // Ama öncesinde çerezleri bu JSON yanıtına mühürlememiz lazım
  const finalResponse = NextResponse.json({ success: true, next });

  initialResponse.cookies.getAll().forEach((c) => {
    finalResponse.cookies.set(c.name, c.value, {
      ...c.options,
      sameSite: "lax", // Pi Browser Lax seviyor
      secure: true,
      path: "/",
    });
  });

  return finalResponse;
}
