'use client'
import React from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react'

export default function AnalyticsEngine({ data }: { data: any[] }) {
  // Veri Seti Analizi
  const stats = data.map(d => d.value)
  const mean = stats.reduce((a, b) => a + b, 0) / stats.length
  
  return (
    <div className="space-y-8">
      {/* 1. Büyük Görselleştirme Alanı */}
      <div className="h-[450px] w-full bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
            <Tooltip 
              contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
              itemStyle={{color: '#1e293b', fontWeight: 'bold'}}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Anomaliler ve Veri Tablosu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 italic">Veri Anomalileri</h4>
          <div className="space-y-4">
            {data.map((d, i) => {
              const isAnomaly = d.value > mean * 1.5
              if (!isAnomaly) return null
              return (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                      <ArrowUpRight size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{d.name} periyodunda sıra dışı artış!</span>
                  </div>
                  <span className="text-blue-600 font-black text-xs">%{Math.round((d.value/mean)*100)} Hacim</span>
                </div>
              )
            })}
            <div className="flex items-start gap-2 text-[10px] text-slate-400 font-bold uppercase p-2">
              <Info size={14} className="shrink-0" />
              Sistem ortalamanın %50 üzerindeki verileri anomali olarak mühürler.
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 italic">Ham Veri İnceleme</h4>
          <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {data.map((d, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <span className="text-xs font-bold text-slate-500">{d.name}</span>
                <span className="text-xs font-black text-slate-900 italic underline decoration-blue-500/20">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
