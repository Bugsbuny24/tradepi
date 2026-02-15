import { createClient } from '@/lib/supabase'
import { Eye, TrendingUp, Users, BarChart3, Clock } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Toplam izlenme ve grafik başlıklarını çekiyoruz
  // Supabase'de join işlemleri (charts(title)) dizi olarak döner.
  const { data: stats } = await supabase
    .from('embed_counters')
    .select(`
      view_count, 
      last_view_at, 
      charts (
        title
      )
    `)
    .eq('owner_id', user?.id)

  // Toplam izlenmeyi hesapla
  const totalViews = stats?.reduce((acc, curr) => acc + (Number(curr.view_count) || 0), 0) || 0

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Analytics</h1>
        <p className="text-slate-500 font-medium mt-1">Grafiklerinin performansını ve erişim verilerini anlık izle.</p>
      </div>

      {/* Üst Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-hover hover:shadow-md">
          <div className="flex items-center gap-3 text-blue-600 mb-4">
            <Eye size={22} strokeWidth={3} /> 
            <span className="text-xs font-black uppercase tracking-widest">Toplam İzlenme</span>
          </div>
          <div className="text-5xl font-black text-slate-900">{totalViews.toLocaleString()}</div>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-hover hover:shadow-md">
          <div className="flex items-center gap-3 text-purple-600 mb-4">
            <Users size={22} strokeWidth={3} /> 
            <span className="text-xs font-black uppercase tracking-widest">Tekil Tahmin</span>
          </div>
          <div className="text-5xl font-black text-slate-900">{(totalViews * 0.78).toFixed(0)}</div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-hover hover:shadow-md">
          <div className="flex items-center gap-3 text-emerald-600 mb-4">
            <TrendingUp size={22} strokeWidth={3} /> 
            <span className="text-xs font-black uppercase tracking-widest">Büyüme Oranı</span>
          </div>
          <div className="text-5xl font-black text-slate-900">+%12.4</div>
        </div>
      </div>

      {/* Detaylı Veri Tablosu */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 italic">
          <BarChart3 size={20} className="text-blue-600" /> Grafik Bazlı Performans
        </h3>
        
        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b font-black text-slate-400 uppercase tracking-tighter italic">
              <tr>
                <th className="p-8">Grafik Başlığı</th>
                <th className="p-8 text-center">İzlenme Sayısı</th>
                <th className="p-8 text-right">Son Etkileşim</th>
              </tr>
            </thead>
            <tbody className="font-bold">
              {(!stats || stats.length === 0) ? (
                <tr>
                  <td colSpan={3} className="p-20 text-center text-slate-400">
                    Henüz analitik verisi toplanmamış kanka.
                  </td>
                </tr>
              ) : (
                stats.map((s: any, i: number) => {
                  // Supabase'den gelen dizi yapısını burada çözüyoruz:
                  const chartTitle = Array.isArray(s.charts) 
                    ? s.charts[0]?.title 
                    : (s.charts?.title || 'Adsız Grafik');

                  return (
                    <tr key={i} className="border-b last:border-0 hover:bg-blue-50/30 transition-all">
                      <td className="p-8 text-slate-900 text-lg tracking-tight">
                        {chartTitle}
                      </td>
                      <td className="p-8 text-center">
                        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-black">
                          {s.view_count?.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-8 text-right text-slate-400 flex items-center justify-end gap-2">
                        <Clock size={14} />
                        {s.last_view_at ? new Date(s.last_view_at).toLocaleDateString('tr-TR') : '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
