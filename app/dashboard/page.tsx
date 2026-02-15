import { createClient } from '@/lib/supabase'
import { Plus, Share2, Zap, Code, Terminal, Database, BarChart2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from '@/components/dashboard/LogoutButton' // Doğru yerden çağırıyoruz

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: quotas } = await supabase.from('user_quotas').select('*').eq('user_id', user?.id).maybeSingle()
  const { data: charts } = await supabase.from('charts').select('*').eq('user_id', user?.id).limit(4)

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      {/* Üst Kartlar: Kotalar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* API Limit Kartı vb. buraya gelir */}
      </div>

      {/* Ana Menü: B2B Fonksiyonları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/embeds" className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-blue-500 transition-all">
          <Share2 className="text-blue-600 mb-4" size={32} />
          <h3 className="font-black text-lg">Embed Center</h3>
        </Link>
        <Link href="/dashboard/api" className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-purple-500 transition-all">
          <Zap className="text-purple-600 mb-4" size={32} />
          <h3 className="font-black text-lg">API Access</h3>
        </Link>
        <Link href="/dashboard/scripts" className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-amber-500 transition-all">
          <Terminal className="text-amber-600 mb-4" size={32} /> {/* BUILD HATASI BURADA ÇÖZÜLDÜ */}
          <h3 className="font-black text-lg">Snap Scripts</h3>
        </Link>
        <Link href="/dashboard/data" className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-emerald-500 transition-all">
          <Database className="text-emerald-600 mb-4" size={32} />
          <h3 className="font-black text-lg">Data Manager</h3>
        </Link>
      </div>

      {/* Çıkış Butonu artık component içinden geliyor */}
      <div className="max-w-xs ml-auto">
        <LogoutButton />
      </div>
    </div>
  )
}
