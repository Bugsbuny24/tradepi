'use client'
import { createClient } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight } from 'lucide-react'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        })
        if (error) throw error
        setMessage('✅ Kayıt başarılı! Email\'inizi kontrol edin.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      setMessage(`❌ ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </h1>
          <p className="text-slate-600 text-sm">
            {mode === 'login' ? 'Hesabına erişim sağla' : 'Yeni hesap oluştur'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Mail size={16} className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ornek@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Lock size={16} className="inline mr-2" />
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
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.startsWith('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"
          >
            {loading ? 'Yükleniyor...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setMessage('')
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {mode === 'login' 
              ? 'Hesabın yok mu? Kayıt ol →' 
              : '← Zaten hesabın var mı? Giriş yap'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
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
