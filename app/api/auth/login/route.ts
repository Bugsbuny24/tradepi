import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

type CookieOptions = Parameters<NextResponse["cookies"]["set"]>[2];
type CookieToSet = { name: string; value: string; options?: CookieOptions };

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  // JSON response’u EN BAŞTA oluşturuyoruz ki cookie’ler direkt buna yazılsın
  const res = NextResponse.json({ success: false });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        const isProd = process.env.NODE_ENV === "production";
        const hostname = req.nextUrl.hostname;
        const sharedDomain = hostname.endsWith("tradepigloball.co")
          ? ".tradepigloball.co"
          : undefined;

        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, {
            ...options,
            sameSite: "lax",
            secure: isProd,
            ...(sharedDomain ? { domain: sharedDomain } : {}),
            path: "/",
          });
        });
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, next }, { headers: res.headers });
}
