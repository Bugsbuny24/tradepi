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
  const next = String(formData.get('next') ?? '/dashboard')

  if (!email || !password) {
    return NextResponse.redirect(new URL('/auth/login?error=missing_fields', request.url), { status: 303 })
  }

  // Success redirect response'u ÖNDEN oluşturuyoruz ki Supabase cookie'leri buna yazabilsin.
  const successResponse = NextResponse.redirect(new URL(next, request.url), { status: 303 })
  const supabase = getSupabaseRouteClient(request, successResponse)

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const msg = (error.message || '').toLowerCase()
    if (msg.includes('email') && msg.includes('confirm')) {
      return NextResponse.redirect(new URL('/auth/login?error=email_not_confirmed', request.url), { status: 303 })
    }
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url),
      { status: 303 }
    )
  }

  return successResponse
}
