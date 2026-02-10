import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // 1. Başlangıç yanıtını oluştur
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
        setAll(cookiesToSet) {
          // Çerezleri hem isteğe (request) hem yanıta (response) mühürle
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value); // Middleware içi kullanım için
            response.cookies.set(name, value, {
              ...options,
              sameSite: "lax", // Pi Browser için en stabil ayar
              secure: true,
              path: "/",
            });
          });
        },
      },
    }
  );

  // Oturumu kontrol et
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Pi Browser Yönlendirme Koruması
  // Eğer kullanıcı giriş yapmışsa ve /auth sayfalarındaysa dashboard'a at
  if (user && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Eğer kullanıcı giriş yapmamışsa ve korumalı sayfaya gidiyorsa login'e at
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
