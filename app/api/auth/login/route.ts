import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  const { supabase, response } = createRouteClient(req);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url);
  }

  const redirectUrl = new URL(next, req.url);
  const redirect = NextResponse.redirect(redirectUrl);

  // Supabase'in response'a yazdığı cookie'leri redirect response'una taşı
  response.cookies.getAll().forEach((c) => {
    redirect.cookies.set(c);
  });

  return redirect;
}
