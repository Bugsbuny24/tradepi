'use client'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts'

export default function DesignerPage() {
  const [chartTitle, setChartTitle] = useState("Piyasa Analiz Verisi")
  const [data, setData] = useState([
    { name: '01:00', value: 340 },
    { name: '02:00', value: 520 },
    { name: '03:00', value: 480 },
    { name: '04:00', value: 890 },
    { name: '05:00', value: 720 },
  ])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col lg:flex-row font-sans">
      
      {/* SOL PANEL: KONTROL MERKEZİ */}
      <div className="w-full lg:w-[400px] border-r border-white/5 bg-[#050505] p-10 flex flex-col justify-between">
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter text-yellow-500 uppercase">Designer</h2>
            <div className="h-1 w-12 bg-yellow-500 mt-2"></div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Grafik İsmi</label>
              <input 
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                className="w-full mt-3 bg-black border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-yellow-500/40 transition-all shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
               <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Motor Modu</label>
               <div className="p-4 bg-black rounded-2xl border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-widest text-center cursor-not-allowed">
                 Live Matrix Engine (v1.0)
               </div>
            </div>
          </div>
        </div>

        <button className="w-full bg-yellow-500 text-black font-black py-5 rounded-3xl text-xs uppercase hover:bg-yellow-400 transition-all shadow-2xl shadow-yellow-500/10 active:scale-95">
          Veriyi Blokzincire Kaydet
        </button>
      </div>

      {/* SAĞ PANEL: CANLI ÖNİZLEME */}
      <div className="flex-1 p-8 lg:p-20 bg-[radial-gradient(circle_at_30%_30%,_rgba(251,191,36,0.05),_transparent)]">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-black tracking-tighter italic uppercase text-white/90">{chartTitle}</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500/50">Canlı Yayında</span>
            </div>
          </div>

          <div className="h-[500px] w-full bg-[#050505] border border-white/5 rounded-[50px] p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,1)]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                <XAxis dataKey="name" stroke="#333" fontSize={10} tickLine={false} axisLine={false} dy={20} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fbbf24', fontSize: '12px', fontWeight: '900' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#fbbf24" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  )
}
