import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // 1. Yol Kontrolü
  const pathname = request.nextUrl.pathname
  const isApiRoute = pathname.startsWith('/api')

  // 2. API Rate Limiting (Sadece API rotaları için)
  if (isApiRoute) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1'
    
    // Veritabanı fonksiyonunu çağır (Dakikada max 60 istek)
    const { data: isAllowed, error } = await supabase.rpc('check_rate_limit', {
      p_key: `rate_limit_ip_${ip}`,
      p_limit_count: 60,
      p_window_seconds: 60
    })

    if (error || !isAllowed) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderildi. Lütfen bir süre bekleyin.' },
        { status: 429 } // Too Many Requests
      )
    }
  }

  // 3. Mevcut Auth Kontrolleri (Önceki kodların devamı buraya gelir)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
