'use client'
import { createClient } from '@/lib/supabase'
import { useState } from 'react'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        // KAYIT OL
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        })
        if (error) throw error
        setMessage('✅ Kayıt başarılı! Şimdi giriş yapabilirsin.')
        setMode('login')
        setPassword('')
      } else {
        // GİRİŞ YAP
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        })
        
        if (error) throw error
        
        // BAŞARILI - Sayfayı yenile ve yönlendir
        console.log('✅ Giriş başarılı, yönlendiriliyor...')
        
        // Önce cookie'yi ayarla, sonra yönlendir
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 500)
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
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </h1>
          <p className="text-slate-600">
            {mode === 'login' ? 'Hesabına erişim sağla' : 'Yeni hesap oluştur'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ornek@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
              message.startsWith('✅') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Yükleniyor...
              </span>
            ) : (
              mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setMessage('')
              setPassword('')
            }}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            {mode === 'login' 
              ? 'Hesabın yok mu? Kayıt ol →' 
              : '← Zaten hesabın var mı? Giriş yap'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-center text-slate-500">
            Devam ederek{' '}
            <a href="#" className="text-blue-600 hover:underline">Kullanım Koşulları</a>
            {' '}ve{' '}
            <a href="#" className="text-blue-600 hover:underline">Gizlilik Politikası</a>
            'nı kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  )
}
