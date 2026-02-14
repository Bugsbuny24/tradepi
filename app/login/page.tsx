"use client"
import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleAuth = async (type: 'login' | 'signup') => {
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    
    if (error) alert(error.message)
    else router.push('/dashboard')
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-6 text-white">
      <div className="bg-[#111] border border-white/5 p-10 rounded-[2.5rem] w-full max-w-md">
        <h1 className="text-2xl font-black italic mb-8 text-center uppercase tracking-tighter">TRADEPIGLOBALL</h1>
        <div className="space-y-4">
          <input type="email" placeholder="E-posta" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Şifre" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => handleAuth('login')} className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all">GİRİŞ YAP</button>
          <button onClick={() => handleAuth('signup')} className="w-full text-gray-500 font-bold text-[10px] uppercase text-center mt-4 tracking-widest hover:text-white transition-colors">KAYIT OL</button>
        </div>
      </div>
    </div>
  )
}
