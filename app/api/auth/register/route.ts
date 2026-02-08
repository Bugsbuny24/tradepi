import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

function redirectUrl(origin: string, path: string, params?: Record<string, string>) {
  const url = new URL(path, origin);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  return url.toString();
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  const origin = request.headers.get("origin") || "http://localhost:3000";

  if (!email || !password) {
    return NextResponse.redirect(
      redirectUrl(origin, "/auth/register", { error: "missing_fields", next }),
      { status: 303 }
    );
  }

  // Email doğrulama linki buraya dönecek
  const emailRedirectTo = redirectUrl(origin, "/auth/callback", { next });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  });

  if (error) {
    return NextResponse.redirect(
      redirectUrl(origin, "/auth/register", { error: encodeURIComponent(error.message), next }),
      { status: 303 }
    );
  }

  // Supabase: Kullanıcı zaten varsa bazen identities boş geliyor (error yok)
  const alreadyExists = data?.user && Array.isArray((data.user as any).identities) && (data.user as any).identities.length === 0;

  if (alreadyExists) {
    return NextResponse.redirect(
      redirectUrl(origin, "/auth/login", {
        error: "account_exists",
        email,
        next,
      }),
      { status: 303 }
    );
  }

  // Email confirmation kapalıysa session dönebilir → direkt içeri
  if (data?.session) {
    return NextResponse.redirect(redirectUrl(origin, next), { status: 303 });
  }

  // Email confirmation açıksa → login sayfasında “mailine bak” bannerı
  return NextResponse.redirect(
    redirectUrl(origin, "/auth/login", { checkEmail: "1", email, next }),
    { status: 303 }
  );
     }
