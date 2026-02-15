import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ChartEngine from '@/components/embed/ChartEngine'

export default async function EmbedPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // 1. Verileri Paralel Çek (Hız için)
  const [chartRes, entriesRes, scriptRes] = await Promise.all([
    supabase.from('charts').select('*').eq('id', params.id).single(),
    supabase.from('data_entries').select('label, value').eq('chart_id', params.id).order('sort_order'),
    supabase.from('chart_scripts').select('script').eq('chart_id', params.id).maybeSingle()
  ])

  if (!chartRes.data) return notFound()

  // 2. Analitik Sayacı Artır (RPC ile - Daha önce SQL'de yazmıştık)
  await supabase.rpc('increment_embed_view', { p_chart_id: params.id })

  return (
    <div className="w-full h-screen bg-transparent overflow-hidden flex flex-col p-4 font-sans">
      {/* Başlık (İsteğe bağlı, Dashboard'dan kapatılabilir) */}
      {!chartRes.data.is_locked && (
        <div className="mb-4">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">
            {chartRes.data.title}
          </h2>
          <div className="h-1 w-12 bg-blue-600 rounded-full mt-1" />
        </div>
      )}

      {/* Ana Grafik Motoru */}
      <div className="flex-1 w-full h-full">
        <ChartEngine 
          chart={chartRes.data} 
          entries={entriesRes.data || []} 
          script={scriptRes.data} 
        />
      </div>

      {/* Watermark (SaaS modelinde para kazanma noktası!) */}
      <div className="mt-2 flex justify-end">
        <a href="https://snaplogic.io" target="_blank" className="text-[10px] font-bold text-slate-300 hover:text-blue-500 transition-colors">
          POWERED BY SNAPLOGIC
        </a>
      </div>
    </div>
  )
}
