"use client";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { Share2, Download, ShieldCheck, User } from 'lucide-react';

export default function ChartViewClient({ chart }: any) {
  // Veriyi JSON'dan objeye çevir
  const data = JSON.parse(chart.data_json || '[]');

  // Grafik tipine göre hangi componenti render edeceğimizi seçelim
  const renderChart = () => {
    const commonProps = { data, margin: { top: 10, right: 0, left: 0, bottom: 0 } };
    
    if (chart.chart_type === 'bar') {
      return (
        <BarChart {...commonProps}>
          <Bar dataKey="v" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
          <Tooltip contentStyle={{background: '#000', border: 'none', borderRadius: '12px'}} />
        </BarChart>
      );
    }
    
    if (chart.chart_type === 'line') {
      return (
        <LineChart {...commonProps}>
          <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, fill: '#8b5cf6' }} />
          <Tooltip contentStyle={{background: '#000', border: 'none', borderRadius: '12px'}} />
        </LineChart>
      );
    }

    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Tooltip contentStyle={{background: '#000', border: 'none', borderRadius: '12px'}} />
        <Area type="monotone" dataKey="v" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorV)" strokeWidth={3} />
      </AreaChart>
    );
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* SOL TARAF: GRAFİK ALANI */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">{chart.title}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <div className="w-5 h-5 rounded-full bg-purple-600 italic flex items-center justify-center text-[10px] text-white font-bold">P</div>
                <span className="text-sm font-bold">@{chart.profiles?.username || 'analist'} tarafından yayınlandı</span>
              </div>
            </div>
            <div className="flex gap-3">
               <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"><Share2 size={20} /></button>
               <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"><Download size={20} /></button>
            </div>
          </div>

          <div className="bg-[#0c0c0c] border border-white/5 rounded-[3rem] p-10 h-[500px] shadow-2xl shadow-purple-500/5">
             <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
             </ResponsiveContainer>
          </div>
        </div>

        {/* SAĞ TARAF: BİLGİ VE SATIN ALMA PANELİ */}
        <div className="space-y-6">
          <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Analiz Değeri</p>
            <h2 className="text-5xl font-black text-green-400 mb-6">₺{chart.price || 0}</h2>
            
            <button className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-purple-600 hover:text-white transition-all active:scale-95 mb-4 shadow-xl">
               ŞİMDİ SATIN AL
            </button>
            <p className="text-[10px] text-gray-600 text-center font-medium">Bu analiz SnapLogic Enterprise V3.0 güvencesiyle korunmaktadır.</p>
          </div>

          <div className="bg-[#0c0c0c] p-6 rounded-[2rem] border border-white/5 space-y-4">
            <h4 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
              <ShieldCheck size={14} className="text-purple-500" /> Sertifikalı Analiz
            </h4>
            <div className="space-y-2">
               <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Oluşturulma</span>
                  <span className="font-bold">{new Date(chart.created_at).toLocaleDateString()}</span>
               </div>
               <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Veri Kaynağı</span>
                  <span className="font-bold text-blue-400">JSON Verified</span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
