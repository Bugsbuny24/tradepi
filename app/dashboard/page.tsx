'use client'

import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <p className="mb-6 text-slate-600">
        Giriş başarılı 🎉
      </p>

      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-600 text-white rounded-xl"
      >
        Logout
      </button>
    </div>
  )
}
