'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Monitor, Smartphone, Tablet, TrendingUp } from 'lucide-react'

export default function AnalyticsEngine({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Üst Trend Grafiği */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Görüntülenme Trendi</h3>
            <p className="text-sm text-slate-500 font-medium">Son 7 günlük performans verileri</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <TrendingUp size={16} /> +12% Artış
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.daily_trend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
              />
              <Line type="monotone" dataKey="views" stroke="#1d4ed8" strokeWidth={4} dot={{ r: 6, fill: '#1d4ed8' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cihaz ve Popülerlik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cihaz Dağılımı */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-900 mb-6">Cihaz Dağılımı</h4>
          <div className="space-y-4">
            {Object.entries(data.device_stats).map(([device, count]: [string, any]) => (
              <div key={device} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {device === 'Mobil' ? <Smartphone size={18} className="text-slate-400" /> : 
                   device === 'Tablet' ? <Tablet size={18} className="text-slate-400" /> : 
                   <Monitor size={18} className="text-slate-400" />}
                  <span className="text-sm font-semibold text-slate-600">{device}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{count} Görüntülenme</span>
              </div>
            ))}
          </div>
        </div>

        {/* En Popüler Widgetlar */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-900 mb-6">En Popüler Widgetlar</h4>
          <div className="space-y-4">
            {data.top_charts?.map((chart: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 truncate max-w-[150px]">{chart.title}</span>
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${(chart.view_count / data.total_views) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-900">{chart.view_count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
