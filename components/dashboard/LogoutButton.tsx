'use client'
import { createClient } from '@/lib/supabase' // Buradaki yolu kontrol et kanka
import { Activity, ArrowRight } from 'lucide-react'

export default function LogoutButton() {
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return (
    <button onClick={handleSignOut} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all w-full group">
      <span className="font-bold text-sm">Çıkış Yap</span>
      <Activity size={18} className="text-slate-400 group-hover:text-red-600" />
    </button>
  )
}
