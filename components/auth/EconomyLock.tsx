// components/auth/EconomyLock.tsx
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export async function EconomyLock({ children, minCredits }: { children: React.ReactNode, minCredits: number }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user?.id).single()

  if (!profile || profile.credits < minCredits) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 space-y-6">
        <div className="bg-red-100 p-6 rounded-full text-red-600 shadow-xl italic font-black">LOCKED</div>
        <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">Mühür Eksik Kanka!</h2>
        <p className="text-slate-500 font-bold text-center max-w-sm uppercase text-[10px] tracking-widest">
          Bu işlemi gerçekleştirmek için en az {minCredits} Kredi gerekiyor. Mevcut kredin: {profile?.credits || 0}
        </p>
        <Link href="/dashboard/store" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-slate-900 transition-all">
          KREDİ MÜHÜRLE (MAĞAZA)
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
