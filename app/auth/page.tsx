'use client'

// DİKKAT: Import yolunu senin projene göre ayarladım
import { createClient } from '@/lib/supabase/client' 
import { useState } from 'react'
import { useRouter } from 'next/navigation' // MÜHÜR: Next.js router'ı şart

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')
  
  const router = useRouter() // Router kancasını kurduk
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        // --- KAYIT OL ---
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            // Email doğrulama sonrası nereye gidecek?
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        if (error) throw error
        setMessage('✅ Kayıt başarılı! Lütfen email kutunu kontrol et.')
        // Kayıt sonrası modu değiştirme, email onayı beklesinler
        setPassword('')
      } else {
        // --- GİRİŞ YAP ---
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        })
        
        if (error) throw error
        
        setMessage('✅ Giriş başarılı, yönlendiriliyor...')
        
        // MÜHÜR BURASI KANKA: 
        // 1. router.refresh() -> Sunucu tarafındaki (Middleware) session bilgisini tazeler.
        // 2. router.push() -> Sayfayı SPA mantığıyla değiştirir.
        router.refresh() 
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      setMessage('❌ ' + (error.message || 'Bir hata oluştu'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter italic">
            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </h1>
          <p className="text-slate-500 font-medium">
            {mode === 'login' ? 'SnapLogic dünyasına dön.' : 'Yeni bir başlangıç yap.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Email Adresi
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none"
              placeholder="ornek@sirket.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${
              message.startsWith('✅') 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-200 hover:-translate-y-1 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                YÜKLENİYOR...
              </span>
            ) : (
              mode === 'login' ? 'GİRİŞ YAP' : 'HESAP OLUŞTUR'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setMessage('')
              setPassword('')
            }}
            className="text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors"
          >
            {mode === 'login' 
              ? 'Hesabın yok mu? Kayıt Ol' 
              : 'Zaten hesabın var mı? Giriş Yap'}
          </button>
        </div>
      </div>
    </div>
  )
}
