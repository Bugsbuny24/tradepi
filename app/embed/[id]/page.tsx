'use client' // Sayfayı client component'e çeviriyoruz

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'

// Recharts bileşenlerini dinamik olarak, SSR kapalı şekilde yüklüyoruz
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false })
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false })
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false })
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false })

export default function EmbedPage({ params, searchParams }: { params: { id: string }, searchParams: { theme?: string } }) {
  const [chart, setChart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const isDark = searchParams.theme === 'dark'

  useEffect(() => {
    async function fetchChart() {
      const { data } = await supabase
        .from('charts')
        .select(`*, data_entries(*), embed_settings(*)`)
        .eq('id', params.id)
        .single()
      
      if (data && data.is_public) {
        setChart(data)
      }
      setLoading(false)
    }
    fetchChart()
  }, [params.id])

  if (loading) return null // Veya bir loading spinner
  if (!chart) return notFound()

  return (
    <div className={`w-screen h-screen flex flex-col ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      <div className="flex-1 p-4">
        {/* ResponsiveContainer'ın düzgün çalışması için Client-Side beklemesi şart */}
        <ResponsiveContainer width="100%" height="100%">
          {chart.chart_type === 'bar' ? (
            <BarChart data={chart.data_entries}>
              <XAxis dataKey="label" hide />
              <YAxis hide />
              <Bar dataKey="value" fill={isDark ? '#3b82f6' : '#2563eb'} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={chart.data_entries}>
              <XAxis dataKey="label" hide />
              <YAxis hide />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {!chart.embed_settings?.[0]?.remove_watermark && (
        <div className="text-[10px] text-center pb-2 opacity-50 font-sans">
          Powered by <span className="font-bold">SnapLogic.io</span>
        </div>
      )}
    </div>
  )
}
