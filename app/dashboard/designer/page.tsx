'use client'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function DesignerPage() {
  const [chartTitle, setChartTitle] = useState("Satış Analizi")
  const [data, setData] = useState([
    { name: 'Oca', value: 400 },
    { name: 'Şub', value: 700 },
    { name: 'Mar', value: 500 },
    { name: 'Nis', value: 900 },
  ])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      
      {/* SOL PANEL: AYARLAR */}
      <div className="w-full lg:w-96 border-r border-white/5 bg-[#050505] p-8 space-y-8 overflow-y-auto">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-yellow-500 uppercase">Designer v1</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Grafik Motoru Yapılandırması</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Grafik Başlığı</label>
            <input 
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="w-full mt-2 bg-black border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-yellow-500/50"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Grafik Tipi</label>
            <select className="w-full mt-2 bg-black border border-white/10 rounded-xl p-3 text-sm outline-none text-white">
              <option>Line Chart (Çizgi)</option>
              <option>Bar Chart (Sütun)</option>
              <option>Area Chart (Alan)</option>
            </select>
          </div>

          <div className="pt-6">
            <button className="w-full bg-yellow-500 text-black font-black py-4 rounded-2xl text-xs uppercase hover:scale-[1.02] transition-transform">
              Sisteme Kaydet ve Yayınla
            </button>
          </div>
        </div>
      </div>

      {/* SAĞ PANEL: CANLI ÖNİZLEME */}
      <div className="flex-1 p-12 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent">
        <div className="w-full max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-3xl font-bold tracking-tighter italic uppercase">{chartTitle}</h3>
            <span className="bg-white/5 text-[10px] px-3 py-1 rounded-full text-yellow-500 border border-yellow-500/20 uppercase font-bold tracking-widest">Live Preview</span>
          </div>

          <div className="h-[400px] w-full bg-[#050505] border border-white/5 rounded-[40px] p-8 shadow-2xl">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                <XAxis dataKey="name" stroke="#444" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fbbf24' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#fbbf24" 
                  strokeWidth={5} 
                  dot={{ r: 6, fill: '#fbbf24', strokeWidth: 0 }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em]">Snap-Logic Engine Core v1.0.4</p>
          </div>
        </div>
      </div>

    </main>
  )
}
