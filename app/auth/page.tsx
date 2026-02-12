"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleAuth = async (type: 'login' | 'signup') => {
    setLoading(true)
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      alert(error.message)
    } else {
      // Giriş başarılıysa localStorage'ı zorla kontrol et ve yönlendir
      router.push("/dashboard")
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5">
        <h1 className="text-3xl font-black italic uppercase text-center tracking-tighter">
          Snap<span className="text-yellow-500">Core</span>
        </h1>
        <div className="space-y-4">
          <input 
            type="email" placeholder="Email" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Şifre" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={() => handleAuth('login')}
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
          >
            {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
          </button>
          <button 
            onClick={() => handleAuth('signup')}
            className="w-full text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-all"
          >
            Hesabın yok mu? Kayıt Ol
          </button>
        </div>
      </div>
    </div>
  )
}
