import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// TypeScript hata vermesin diye tipleri tanımlıyoruz
type CookieOptions = Parameters<NextResponse["cookies"]["set"]>[2];
type CookieToSet = { name: string; value: string; options?: CookieOptions };

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // Buradaki tipi açıkça belirttik: (cookiesToSet: CookieToSet[])
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, {
              ...options,
              sameSite: "lax",
              secure: true,
              path: "/",
            });
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Pi Browser'da takılmaması için yönlendirme mantığı
  if (user && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
