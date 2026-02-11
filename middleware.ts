import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

type CookieOptions = Parameters<NextResponse["cookies"]["set"]>[2];
type CookieToSet = { name: string; value: string; options?: CookieOptions };

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = pathname.startsWith("/auth");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // ✅ Pi auth cookie kontrolü
  const piAuthed = request.cookies.get("pi_authed")?.value === "1";

  // Pi login olmuşsa auth sayfalarına sokma
  if (piAuthed && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Pi login olmuşsa dashboard’a izin ver
  if (piAuthed && isDashboardRoute) {
    return NextResponse.next();
  }

  // ---- Supabase auth (mevcut mantığın) ----
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
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, {
              ...options,
              sameSite: "lax",
              secure: true,
              path: "/",
            })
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // dashboard koruması (Supabase ile)
  if (!user && isDashboardRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // user varsa auth sayfalarından dashboard’a
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
      API, _next ve statikleri dışarıda bırak
    */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
