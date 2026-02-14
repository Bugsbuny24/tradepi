import { createClient } from '@/lib/supabase' // Senin lib yapın
import { Plus, BarChart2, PieChart, LineChart, Globe, Lock, Settings } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // 1. Kullanıcı oturumunu kontrol et
  const { data: { user } } = await supabase.auth.getUser()
  
  // 2. Grafikleri çek
  const { data: charts, error } = await supabase
    .from('charts')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Kısmı */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Grafiklerim</h1>
          <p className="text-slate-500">Tüm projelerini buradan yönetebilirsin.</p>
        </div>
        <Link 
          href="/create" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={20} />
          Yeni Grafik Oluştur
        </Link>
      </div>

      {/* Liste / Boş Durum Kontrolü */}
      {!charts || charts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <BarChart2 className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Henüz grafik oluşturmamışsın</h3>
          <p className="text-slate-500 mb-6">İlk verini görselleştirmeye hemen başla!</p>
          <Link href="/create" className="text-blue-600 font-medium hover:underline">
            Hemen oluştur →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charts.map((chart) => (
            <div key={chart.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  {chart.chart_type === 'pie' ? <PieChart size={24} /> : 
                   chart.chart_type === 'line' ? <LineChart size={24} /> : 
                   <BarChart2 size={24} />}
                </div>
                <div className="flex gap-2">
                  <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${chart.is_public ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {chart.is_public ? <Globe size={12} /> : <Lock size={12} />}
                    {chart.is_public ? 'Genel' : 'Özel'}
                  </span>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                {chart.title || 'Adsız Grafik'}
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Oluşturma: {new Date(chart.created_at).toLocaleDateString('tr-TR')}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Link 
                  href={`/charts/${chart.id}`} 
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600"
                >
                  Düzenle
                </Link>
                <div className="flex gap-3">
                   <Link href={`/charts/${chart.id}/settings`} className="text-slate-400 hover:text-slate-600">
                     <Settings size={18} />
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

