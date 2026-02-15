// app/embed/[id]/page.tsx
import { createClient } from '@/lib/supabase'
import { headers } from 'next/headers'

export default async function PublicEmbed({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const headerList = headers()
  
  // 1. Ziyaretçi bilgilerini al
  const ip = headerList.get('x-forwarded-for') || 'unknown'
  const userAgent = headerList.get('user-agent') || 'unknown'

  // 2. Analitik kaydı at ve sayacı artır (RPC ile)
  // Bu iki işlemi arka planda yapıyoruz, grafik yüklenmesini beklemesin
  await Promise.all([
    supabase.rpc('increment_embed_view', { target_chart_id: params.id }),
    supabase.from('project_analytics').insert({
      chart_id: params.id,
      viewer_ip: ip,
      user_agent: userAgent,
      viewed_at: new Date().toISOString()
    })
  ])

  // 3. Grafik verisini çek
  const { data: chart } = await supabase
    .from('charts')
    .select('*, data_entries(*)')
    .eq('id', params.id)
    .single()

  if (!chart) return <div>Grafik Bulunamadı</div>

  return (
    <div className="w-full h-screen p-4 flex flex-col">
       <h2 className="text-xl font-black mb-4">{chart.title}</h2>
       {/* Recharts Bileşeni Buraya Gelecek */}
       <div className="flex-1 bg-slate-50 rounded-2xl border-2 border-dashed flex items-center justify-center">
          <p className="text-slate-400">Grafik Motoru Aktif: {chart.chart_type}</p>
       </div>
    </div>
  )
}
