'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, 
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, 
  Tooltip, CartesianGrid 
} from 'recharts'
import { Zap } from 'lucide-react'

export default function EmbedPage({ params }: { params: { id: string } }) {
  const [chart, setChart] = useState<any>(null)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchChart() {
      // 1. Grafiği ve Verileri Çek
      const { data: chartData } = await supabase
        .from('charts')
        .select('*, data_entries(*)')
        .eq('id', params.id)
        .single()

      if (chartData) {
        setChart(chartData)
        // Verileri recharts'ın anlayacağı formata sokuyoruz
        const formattedData = chartData.data_entries?.map((d: any) => ({
          name: d.label,
          value: Number(d.value)
        })) || []
        setData(formattedData)

        // 2. İzlenme Sayısını Artır (Analitik Mühürleme)
        await supabase.rpc('increment_view_count', { chart_id: params.id })
      }
      setLoading(false)
    }
    fetchChart()
  }, [params.id])

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-transparent">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (!chart) return (
    <div className="h-screen flex flex-col items-center justify-center text-slate-400 font-bold text-xs">
      <Zap size={24} className="mb-2 opacity-20" />
      GRAFİK BULUNAMADI
    </div>
  )

  // Renk Paleti (B2B Standartları)
  const COLORS = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

  const renderChart = () => {
    const type = chart.chart_type
    
    if (type === 'bar') return (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
        <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
      </BarChart>
    )

    if (type === 'line') return (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
        <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} dot={{r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
      </LineChart>
    )

    if (type === 'area') return (
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
        <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    )

    if (type === 'pie') return (
      <PieChart>
        <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
      </PieChart>
    )
  }

  return (
    <div className="w-screen h-screen bg-white p-4 overflow-hidden">
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="90%">
          {renderChart() as React.ReactElement}
        </ResponsiveContainer>
        
        {/* SnapLogic Branding (Marka Bilinci) */}
        <div className="h-[10%] flex items-center justify-between px-2">
          <span className="text-[10px] font-black text-slate-900 tracking-tighter italic">
            {chart.title}
          </span>
          <a href="https://snaplogic.io" target="_blank" className="flex items-center gap-1 opacity-30 hover:opacity-100 transition-opacity">
            <Zap size={10} className="text-blue-600" />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Powered by SnapLogic</span>
          </a>
        </div>
      </div>
    </div>
  )
}
