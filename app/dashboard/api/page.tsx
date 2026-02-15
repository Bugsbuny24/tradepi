import { createClient } from '@/lib/supabase'
import { Key, Copy, ShieldCheck } from 'lucide-react'

export default async function ApiPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: quotas } = await supabase.from('user_quotas').select('*').eq('user_id', user?.id).maybeSingle()

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900">API Access</h1>
          <p className="text-slate-500 mt-2">Dış sistemlerden SnapLogic'e veri basmak için anahtarlarını yönet.</p>
        </div>
        <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold">Yeni Key Oluştur</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
          <ShieldCheck className="text-emerald-600 mb-2" />
          <h4 className="font-bold text-emerald-900">Kalan Kota</h4>
          <p className="text-2xl font-black text-emerald-600">{quotas?.api_call_remaining || 0}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden">
        <div className="p-8 text-center text-slate-400 font-medium">
          Henüz aktif bir API anahtarın yok kanka.
        </div>
      </div>
    </div>
  )
}
