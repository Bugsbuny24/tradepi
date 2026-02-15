'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Kullanıcı durumunu kontrol et
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Auth değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Auth sayfalarında navbar gösterme
  if (pathname?.startsWith('/auth')) return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black italic text-blue-600">
          TradePi
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          {user ? (
            // Giriş yapmış
            <>
              <Link 
                href="/dashboard"
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/create"
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Grafik Oluştur
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.href = '/'
                }}
                className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            // Giriş yapmamış
            <>
              <Link 
                href="/auth"
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link 
                href="/auth"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
