import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// V3: Strongly typed cookie plumbing for Supabase SSR + Next.js Middleware
type CookieOptions = Parameters<NextResponse["cookies"]["set"]>[2];
type CookieToSet = { name: string; value: string; options?: CookieOptions };

export async function middleware(request: NextRequest) {
  // IMPORTANT: response must be mutable inside setAll
  // NextResponse.next() only supports a lightweight request init (like headers).
  // Passing the full NextRequest can crash on Vercel with MIDDLEWARE_INVOCATION_FAILED.
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          // In middleware, request.cookies is not safely mutable across runtimes.
          // Only persist cookies on the outgoing response.
          response = NextResponse.next({ request: { headers: request.headers } });

          // And persist cookies on the outgoing response
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Touch auth session so Supabase can refresh tokens if needed
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
