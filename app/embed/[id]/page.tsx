import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie } from 'recharts'

export default async function EmbedPage({ params, searchParams }: { params: { id: string }, searchParams: { theme?: string } }) {
  const supabase = createClient()
  const isDark = searchParams.theme === 'dark'

  // 1. Grafik ve ayarları çek
  const { data: chart } = await supabase
    .from('charts')
    .select(`*, data_entries(*), embed_settings(*)`)
    .eq('id', params.id)
    .single()

  if (!chart || !chart.is_public) return notFound()
// app/embed/[id]/page.tsx içinde uygun yere ekle:
await supabase.from('project_analytics').insert({
  chart_id: params.id,
  viewer_ip: 'Kullanıcı IP', // (Next.js headers'dan alınabilir)
  user_agent: 'Tarayıcı Bilgisi'
})

  // Domain Kontrolü (Gelecekte buraya Request Header kontrolü eklenecek)

  return (
    <div className={`w-screen h-screen flex flex-col ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chart.chart_type === 'bar' ? (
            <BarChart data={chart.data_entries}>
              <XAxis dataKey="label" hide />
              <YAxis hide />
              <Bar dataKey="value" fill={isDark ? '#3b82f6' : '#2563eb'} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            /* Diğer tipler buraya gelecek... */
            <LineChart data={chart.data_entries}>
               <Line type="monotone" dataKey="value" stroke="#3b82f6" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {/* Watermark: Sadece ayar kapalıysa gösterilir */}
      {!chart.embed_settings?.[0]?.remove_watermark && (
        <div className="text-[10px] text-center pb-1 opacity-50">
          Powered by <span className="font-bold">SnapLogic.io</span>
        </div>
      )}
    </div>
  )
}
