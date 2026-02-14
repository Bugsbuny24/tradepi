'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Zap, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function QuotaChecker() {
  const [quota, setQuota] = useState<any>(null)

  useEffect(() => {
    const fetchQuota = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
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

  if (!quota) return null

  const isLow = quota.credits_remaining < 5

  return (
    <div className={`p-4 rounded-xl border ${isLow ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kullanım Özeti</span>
        {isLow && <AlertCircle size={14} className="text-amber-500" />}
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <Zap size={18} className={isLow ? 'text-amber-500' : 'text-blue-600'} />
        <span className="text-lg font-bold text-slate-800">{quota.credits_remaining} Kredi</span>
      </div>

      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all ${isLow ? 'bg-amber-500' : 'bg-blue-600'}`} 
          style={{ width: `${(quota.credits_remaining / 100) * 100}%` }} // Varsayılan 100 üzerinden
        />
      </div>

      <Link 
        href="/pricing" 
        className="block text-center mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 underline"
      >
        Kredi Satın Al
      </Link>
    </div>
  )
}
