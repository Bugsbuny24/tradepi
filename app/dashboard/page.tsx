import { createClient } from '@/lib/supabase'
import { 
  Zap, Eye, BarChart3, Plus, 
  ArrowUpRight, TrendingUp, Activity, Layout
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Kullanıcının kota ve grafik verilerini paralel olarak çekiyoruz
  const [quotaRes, chartsRes] = await Promise.all([
    supabase.from('user_quotas').select('*').eq('user_id', user?.id).single(),
    supabase.from('charts').select('id, title, created_at').eq('user_id', user?.id).order('created_at', { ascending: false }).limit(3)
  ])

  const quota = quotaRes.data
  const recentCharts = chartsRes.data || []

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* 1. Hoşgeldin ve Hızlı Eylem */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">
            Dashboard
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            SnapLogic sistemine hoş geldin. Verilerin şu an güvende ve mühürlü.
          </p>
        </div>
        <Link href="/dashboard/charts/new" className="bg-blue-600 text-white px-8 py-4 rounded-[2rem] font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-xl hover:-translate-y-1">
          <Plus size={20} /> YENİ GRAFİK OLUŞTUR
        </Link>
      </div>

      {/* 2. İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Kredi Kartı */}
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden group">
          <Zap className="absolute -right-4 -top-4 text-white/5 group-hover:text-blue-500/10 transition-colors" size={160} />
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">API Kredi Durumu</span>
            <div className="flex items-baseline gap-2 mt-4">
              <h3 className="text-5xl font-black tracking-tighter">
                {quota?.credits_remaining?.toLocaleString() || 0}
              </h3>
              <span className="text-sm font-bold text-slate-400">units</span>
            </div>
            <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase">
              <span>Usage Level</span>
              <span className="text-blue-400">Optimal</span>
            </div>
            <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-2/3" />
            </div>
          </div>
        </div>

        {/* İzlenme Kartı */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Toplam Gömülü İzlenme</span>
            <div className="flex items-center gap-4 mt-4">
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                <Activity size={24} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                {quota?.embed_view_remaining === -1 ? 'UNLIMITED' : 'ACTIVE'}
              </h3>
            </div>
          </div>
          <Link href="/dashboard/analytics" className="mt-8 flex items-center gap-2 text-xs font-black text-blue-600 hover:gap-3 transition-all">
            DETAYLI ANALİZ <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Grafik Sayısı Kartı */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Aktif Grafiklerim</span>
            <div className="flex items-center gap-4 mt-4">
              <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl">
                <Layout size={24} />
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                {chartsRes.count || 0}
              </h3>
            </div>
          </div>
          <Link href="/dashboard/charts" className="mt-8 flex items-center gap-2 text-xs font-black text-purple-600 hover:gap-3 transition-all">
            TÜMÜNÜ YÖNET <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* 3. Son Oluşturulan Grafikler ve Quick List */}
      <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-lg font-black text-slate-900 italic flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" /> Son Çalışmaların
          </h4>
          <Link href="/dashboard/charts" className="text-xs font-black text-slate-400 hover:text-blue-600 transition-colors">
            TÜMÜNÜ GÖR
          </Link>
        </div>
        
        <div className="divide-y divide-slate-100">
          {recentCharts.length > 0 ? (
            recentCharts.map((chart) => (
              <div key={chart.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xs">
                    ID
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">{chart.title || 'Adsız Grafik'}</h5>
                    <p className="text-[10px] font-medium text-slate-400">
                      {new Date(chart.created_at).toLocaleDateString('tr-TR')} tarihinde mühürlendi
                    </p>
                  </div>
                </div>
                <Link href={`/dashboard/charts/${chart.id}`} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-slate-400 font-bold">
              Henüz bir grafik oluşturmamışsın kanka. İlkini mühürlemeye ne dersin?
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
