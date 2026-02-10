import { NextResponse, type NextRequest } from "next/server";
import { createRouteClient } from "@/lib/supabase/route";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  const { supabase, response } = createRouteClient(req);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: new URL("/auth/callback", req.url).toString(),
    },
  });

  if (error) {
    const url = new URL("/auth/register", req.url);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url);
  }

  // Eğer email confirm AÇIKSA, user oluşturulur ama session gelmez.
  // Confirm KAPALIYSA, bazen session gelir → direkt dashboard’a geçebiliriz.
  const hasSession = !!data?.session;

  const url = hasSession
    ? new URL(next, req.url)
    : new URL("/auth/login", req.url);

  if (!hasSession) {
    url.searchParams.set(
      "success",
      "Kayıt başarılı. Email onayı gerekiyorsa mailini kontrol et."
    );
  }

  const redirect = NextResponse.redirect(url);

  response.cookies.getAll().forEach((c) => {
    redirect.cookies.set(c);
  });

  return redirect;
}
