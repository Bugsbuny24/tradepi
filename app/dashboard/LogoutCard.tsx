'use client' // Bu satır şart!

import { createClient } from '@/lib/supabase'
import { Activity, ArrowRight } from 'lucide-react'

export default function LogoutCard() {
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return (
    <button
      onClick={handleSignOut}
      className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-red-300 transition-all group w-full text-left"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <Activity className="text-red-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-black text-slate-900 group-hover:text-red-600 transition-colors">Çıkış Yap</h3>
          <p className="text-sm text-slate-600">Hesaptan çık</p>
        </div>
        <ArrowRight className="text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" size={20} />
      </div>
    </button>
  )
}
