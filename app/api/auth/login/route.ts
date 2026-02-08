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
      `${origin}/auth/login?error=missing_fields&next=${encodeURIComponent(next)}`,
      { status: 303 }
    );
  }

  // ✅ Next.js cookie store
  const cookieStore = cookies();

  // ✅ Supabase SSR client (cookie refresh/set here)
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

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(
        next
      )}`,
      { status: 303 }
    );
  }

  return NextResponse.redirect(`${origin}${next}`, { status: 303 });
}
