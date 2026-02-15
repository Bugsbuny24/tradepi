import { createClient } from '@/lib/supabase'
import { 
  BarChart3, LineChart, PieChart, AreaChart, 
  Plus, ExternalLink, Trash2, Code, Calendar
} from 'lucide-react'
import Link from 'next/link'
import EmbedButton from '@/components/dashboard/EmbedButton'

const iconMap: any = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  area: AreaChart,
}

export default async function ChartsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: charts } = await supabase
    .from('charts')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* Başlık ve Eylem Butonu */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Grafiklerim</h2>
          <p className="text-slate-500 font-medium mt-1">Oluşturduğun tüm görselleştirmeleri buradan yönet ve mühürle.</p>
        </div>
        <Link href="/dashboard/charts/new" className="bg-blue-600 text-white px-8 py-4 rounded-[2rem] font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-xl">
          <Plus size={20} /> YENİ GRAFİK
        </Link>
      </div>

      {/* Grafik Listesi */}
      {(!charts || charts.length === 0) ? (
        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-6">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <BarChart3 size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">Henüz Grafik Yok Kanka</h3>
            <p className="text-slate-500 max-w-xs mx-auto">İlk grafiğini oluşturarak verilerini dünyaya duyurmaya başla.</p>
          </div>
          <Link href="/dashboard/charts/new" className="inline-block text-blue-600 font-black text-sm underline decoration-2 underline-offset-4">
            Hemen Bir Tane Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {charts.map((chart) => {
            const ChartIcon = iconMap[chart.chart_type] || BarChart3
            return (
              <div key={chart.id} className="group bg-white border border-slate-200 rounded-[3rem] p-8 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <ChartIcon size={24} />
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {chart.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">
                    <Calendar size={12} />
                    {new Date(chart.created_at).toLocaleDateString('tr-TR')} Mühürlendi
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Embed Butonu - Client Component olacak */}
                  <EmbedButton chartId={chart.id} />
                  
                  <Link 
                    href={`/dashboard/charts/${chart.id}`}
                    className="w-full border-2 border-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                  >
                    DETAYLARI DÜZENLE <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
