import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Kullanıcı yoksa ve protected route'daysa /auth'a yönlendir
  if (
    !user &&
    (
      request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/create') ||
      request.nextUrl.pathname.startsWith('/pricing') ||
      request.nextUrl.pathname.startsWith('/admin')
    )
  ) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Kullanıcı varsa ve /auth'daysa /dashboard'a yönlendir
  if (user && request.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/create/:path*', '/pricing/:path*', '/admin/:path*', '/auth'],
}
