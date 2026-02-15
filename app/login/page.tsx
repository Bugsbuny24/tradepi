'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Zap, Github, Mail, ArrowRight, 
  ShieldCheck, Lock, ChevronRight 
} from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  // Google ile Giriş
  const handleSocialLogin = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  // Magic Link (Şifresiz Giriş)
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) setMessage('Hata oluştu kanka, tekrar dene.')
    else setMessage('Giriş bağlantısı e-postana gönderildi! 🚀')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* Sol Panel: Marka Görseli (Sadece Masaüstü) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
           <Zap size={600} className="translate-x-1/3 -translate-y-1/4" />
        </div>
        
        <Link href="/" className="relative z-10 flex items-center gap-2 text-white italic font-black text-2xl tracking-tighter">
          <Zap className="text-blue-500 fill-blue-500" /> SnapLogic.io
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="text-6xl font-black text-white leading-none tracking-tighter italic">
            VERİYİ <br /> <span className="text-blue-500 text-7xl">MÜHÜRLE.</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-md text-lg">
            Global B2B veri ekosistemine hoş geldin kanka. Grafiklerim, Marketplace ve Görev Havuzu seni bekliyor.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8">
           <div className="flex flex-col">
             <span className="text-white font-black text-2xl italic">14K+</span>
             <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Aktif Mühür</span>
           </div>
           <div className="w-[1px] h-10 bg-slate-800" />
           <div className="flex flex-col">
             <span className="text-white font-black text-2xl italic">₺2M+</span>
             <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">İşlem Hacmi</span>
           </div>
        </div>
      </div>

      {/* Sağ Panel: Giriş Formu */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-24 bg-white">
        <div className="w-full max-w-sm space-y-10">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 italic tracking-tight">Tekrar Hoş Geldin!</h1>
            <p className="text-slate-500 font-medium text-sm">SnapLogic hesabına mühürlü giriş yap.</p>
          </div>

          {/* Sosyal Giriş Butonları */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-black text-xs uppercase tracking-widest text-slate-700"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              className="flex items-center justify-center gap-2 py-4 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-black text-xs uppercase tracking-widest text-slate-700"
            >
              <Github size={18} /> GitHub
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-100" />
            <span className="absolute bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Veya E-Posta</span>
          </div>

          {/* Magic Link Formu */}
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Posta Adresin</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="kanka@snaplogic.io"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent border-2 focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'MÜHÜRLENİYOR...' : 'SİSTEME GİRİŞ YAP'} <ArrowRight size={18} />
            </button>
          </form>

          {message && (
            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl text-xs font-bold text-center border border-blue-100">
              {message}
            </div>
          )}

          <div className="pt-6 text-center">
             <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
               <ShieldCheck size={14} /> End-to-End Encrypted
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
