import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, any>;
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const next = String(formData.get("next") ?? "/dashboard");

  const url = new URL(request.url);
  const origin = url.origin;

  if (!email || !password) {
    return NextResponse.redirect(
      `${origin}/auth/register?error=missing_fields&next=${encodeURIComponent(next)}`,
      { status: 303 }
    );
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/register?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(
        next
      )}`,
      { status: 303 }
    );
  }

  // kayıt başarılı → kullanıcıya login'e yönlendirip mail doğrulama mesajını gösterebilirsin
  return NextResponse.redirect(
    `${origin}/auth/login?checkEmail=1&next=${encodeURIComponent(next)}`,
    { status: 303 }
  );
}
