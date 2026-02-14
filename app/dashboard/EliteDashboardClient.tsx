"use client";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function EliteDashboardClient({ quota, chartStats, marketCharts }) {
  // Veriyi grafik formatına sok
  const chartData = [
    { name: 'Pzt', views: 10 }, { name: 'Sal', views: 25 }, { name: 'Çar', views: 45 },
    { name: 'Per', views: 30 }, { name: 'Cum', views: 70 }, { name: 'Cmt', views: 85 }, { name: 'Paz', views: 60 }
  ];

  return (
    <div className="p-6 space-y-8 bg-black min-h-screen text-white font-sans">
      {/* KOTASALLAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Kalan İzlenme</p>
            <h2 className="text-4xl font-black text-blue-500">{quota.embed_view_remaining || 0}</h2>
        </div>
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Kalan Kredi</p>
            <h2 className="text-4xl font-black text-purple-500">{quota.credits_remaining || 0}</h2>
        </div>
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Cüzdan</p>
            <h2 className="text-4xl font-black text-green-500">₺{quota.total_spent || 0}</h2>
        </div>
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
            <p className="text-[10px] text-gray-500 uppercase font-bold">Hesap Türü</p>
            <h2 className="text-4xl font-black text-yellow-500">{quota.tier || 'Free'}</h2>
        </div>
      </div>

      {/* ANALİZ */}
      <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5">
        <h3 className="text-xl font-bold mb-8">Haftalık Trafik</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#333" />
              <Tooltip contentStyle={{background: '#000', border: 'none', borderRadius: '12px'}} />
              <Area type="monotone" dataKey="views" stroke="#8b5cf6" fill="url(#colorV)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MARKET */}
      <h3 className="text-2xl font-black italic">SnapLogic Marketplace</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketCharts.map((item: any) => (
          <div key={item.id} className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-white/10 hover:border-purple-500 transition-all group">
            <div className="h-32 bg-gray-900 rounded-2xl mb-4 flex items-center justify-center text-gray-700 font-black italic">
               {item.chart_type} PREVIEW
            </div>
            <h4 className="font-bold text-lg">{item.title || 'İsimsiz Proje'}</h4>
            <div className="flex justify-between items-center mt-6">
              <span className="text-3xl font-black text-green-400">₺{item.price || 0}</span>
              <button className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-purple-500 hover:text-white transition-colors">SATIN AL</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
