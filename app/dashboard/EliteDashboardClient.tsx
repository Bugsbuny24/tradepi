"use client";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function EliteDashboardClient({ quota, marketCharts }: any) {
  // Örnek grafik verisi (Statik, hata vermemesi için)
  const chartData = [
    { name: 'Pzt', views: 15 }, { name: 'Sal', views: 30 }, { name: 'Çar', views: 40 },
    { name: 'Per', views: 35 }, { name: 'Cum', views: 60 }, { name: 'Cmt', views: 90 }, { name: 'Paz', views: 55 }
  ];

  return (
    <div className="p-6 space-y-8 bg-black min-h-screen text-white font-sans">
      {/* ÜST İSTATİSTİK KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Kalan İzlenme</p>
          <h2 className="text-4xl font-black text-blue-500">{quota?.embed_view_remaining || 0}</h2>
        </div>
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Kalan Kredi</p>
          <h2 className="text-4xl font-black text-purple-500">{quota?.credits_remaining || 0}</h2>
        </div>
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Cüzdan</p>
          <h2 className="text-4xl font-black text-green-500">₺{quota?.total_spent || 0}</h2>
        </div>
        <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold">Hesap</p>
          <h2 className="text-4xl font-black text-yellow-500">{quota?.tier || 'Free'}</h2>
        </div>
      </div>

      {/* GRAFİK ANALİZ ALANI */}
      <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5">
        <h3 className="text-xl font-bold mb-8 text-gray-400">Trafik Analizi</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <XAxis dataKey="name" stroke="#333" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{background: '#000', border: 'none', borderRadius: '12px'}} />
              <Area type="monotone" dataKey="views" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PAZARYERİ */}
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
