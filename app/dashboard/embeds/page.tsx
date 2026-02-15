import { createClient } from '@/lib/supabase'
import { Share2, Copy, ExternalLink, Layout } from 'lucide-react'

export default async function EmbedCenter() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: charts } = await supabase
    .from('charts')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900">Embed Center</h1>
        <p className="text-slate-500 mt-2">Grafiklerini dünyaya açmak için Iframe kodlarını buradan al.</p>
      </div>

      <div className="grid gap-6">
        {(!charts || charts.length === 0) ? (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed text-center text-slate-400">
            Henüz grafiğin yok kanka, önce bir tane oluştur.
          </div>
        ) : (
          charts.map(chart => (
            <div key={chart.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="font-black text-xl">{chart.title || 'Adsız Grafik'}</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">{chart.chart_type}</span>
              </div>
              
              <div className="flex-[2] w-full">
                <div className="bg-slate-900 p-5 rounded-2xl relative">
                  <code className="text-emerald-400 text-xs break-all">
                    {`<iframe src="https://tradepigloball.co/embed/${chart.id}" width="100%" height="500" frameborder="0"></iframe>`}
                  </code>
                </div>
              </div>

              <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all">
                Kodu Kopyala
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
