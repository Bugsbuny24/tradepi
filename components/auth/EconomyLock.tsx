import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export async function EconomyLock({ children, minCredits }: { children: React.ReactNode, minCredits: number }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // MÜHÜR DÜZELTİLDİ
  const { data: quota } = await supabase
    .from('user_quotas')
    .select('credits_remaining')
    .eq('user_id', user?.id)
    .single()

  const currentCredits = quota?.credits_remaining || 0

  if (currentCredits < minCredits) {
    return (
      <div className="p-20 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 text-center space-y-6">
        <div className="inline-block bg-red-100 p-4 rounded-2xl text-red-600 font-black italic">LOCKED</div>
        <h2 className="text-3xl font-black italic italic tracking-tighter">Yetersiz Kredi!</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">En az {minCredits} kredi gerekiyor. Sende olan: {currentCredits}</p>
        <Link href="/dashboard/store" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-black hover:bg-slate-900 transition-all">KREDİ YÜKLE</Link>
      </div>
    )
  }

  return <>{children}</>
}
