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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Bu mesaj Supabase’ten gelir: invalid / email not confirmed vs.
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url);
  }

  // Eğer login olduysa session cookie set edilmiş olmalı
  const redirectUrl = new URL(next, req.url);
  const redirect = NextResponse.redirect(redirectUrl);

  response.cookies.getAll().forEach((c) => {
    redirect.cookies.set(c);
  });

  // Bonus: oturum gerçekten var mı diye debug için
  // console.log("Signed in user:", data?.user?.id);

  return redirect;
}
