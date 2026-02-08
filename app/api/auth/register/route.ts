import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

function getSupabaseRouteClient(request: NextRequest, response: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return NextResponse.redirect(new URL('/auth/register?error=missing_fields', request.url), { status: 303 })
  }

  const origin = request.headers.get('origin') ?? new URL(request.url).origin
  const emailRedirectTo = `${origin}/auth/callback`

  // Önce dashboard'a redirect response'u hazırla (cookie yazılması gerekiyorsa diye)
  const successResponse = NextResponse.redirect(new URL('/dashboard', request.url), { status: 303 })
  const supabase = getSupabaseRouteClient(request, successResponse)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  })

  if (error) {
    const msg = (error.message || '').toLowerCase()
    if (msg.includes('already') || msg.includes('registered')) {
      return NextResponse.redirect(new URL('/auth/register?error=account_exists', request.url), { status: 303 })
    }
    return NextResponse.redirect(
      new URL(`/auth/register?error=${encodeURIComponent(error.message)}`, request.url),
      { status: 303 }
    )
  }

  // Email confirmation açıksa session gelmez -> login sayfasında "mail doğrula" mesajı göster.
  if (!data.session) {
    return NextResponse.redirect(new URL('/auth/login?checkEmail=1', request.url), { status: 303 })
  }

  // Confirmation kapalıysa session gelir -> cookie set edilmiş olur -> dashboard
  return successResponse
}
