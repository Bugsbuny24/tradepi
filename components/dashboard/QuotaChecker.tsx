'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client' // BURASI DÜZELDİ
import { Zap, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function QuotaChecker() {
  const [quota, setQuota] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchQuota = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // MÜHÜR: user_quotas tablosuna bakıyoruz
        const { data } = await supabase
          .from('user_quotas')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setQuota(data)
      }
    }
    fetchQuota()
  }, [])

  if (!quota) return <Loader2 className="animate-spin text-slate-300" size={20} />

  const isLow = quota.credits_remaining < 5

  return (
    <div className={`p-4 rounded-[2rem] border-2 transition-all ${isLow ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center justify-between mb-2 font-black italic text-[10px] uppercase tracking-widest text-slate-400">
        <span>Kredi Durumu</span>
        {isLow && <AlertCircle size={14} className="text-amber-500 animate-pulse" />}
      </div>
      <div className="flex items-center gap-2">
        <Zap size={20} className={isLow ? 'text-amber-500' : 'text-blue-600'} fill="currentColor" />
        <span className="text-xl font-black text-slate-900 tracking-tighter">{quota.credits_remaining} Birim</span>
      </div>
    </div>
  )
}
