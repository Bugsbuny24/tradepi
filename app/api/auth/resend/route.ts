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

  if (!email) {
    return NextResponse.redirect(new URL('/auth/login?error=missing_fields', request.url), { status: 303 })
  }

  const origin = request.headers.get('origin') ?? new URL(request.url).origin
  const emailRedirectTo = `${origin}/auth/callback`

  // Resend genelde cookie yazmaz ama pattern aynı kalsın
  const response = NextResponse.redirect(new URL('/auth/login?checkEmail=1', request.url), { status: 303 })
  const supabase = getSupabaseRouteClient(request, response)

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo },
  })

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url),
      { status: 303 }
    )
  }

  return response
}
