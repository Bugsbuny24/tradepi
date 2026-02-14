"use client";
import { useState } from 'react';
import { Database, Layout, Save, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateChartClient({ userId, currentQuota }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    chart_type: 'area',
    data_json: '[{"name": "Örnek", "v": 400}, {"name": "Veri", "v": 700}]',
    is_public: true,
    price: 0
  });

  const handleCreate = async () => {
    if (currentQuota?.credits_remaining <= 0) {
        alert("Enterprise uyarısı: Yetersiz kredi!");
        return;
    }
    setLoading(true);
    // Burada Supabase'e kayıt işlemi yapılacak...
    setTimeout(() => {
        setLoading(false);
        router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="bg-black min-h-screen text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black italic mb-8 tracking-tighter uppercase">SnapLogic Engine <span className="text-purple-500 text-sm not-italic">V3.0</span></h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* AYARLAR */}
          <div className="space-y-6">
            <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 space-y-4">
               <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 ml-2">Analiz Başlığı</label>
                  <input 
                    type="text" 
                    placeholder="Örn: 2026 Satış Raporu"
                    className="w-full bg-black border border-white/10 rounded-xl p-4 mt-1 focus:border-purple-500 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
               </div>

               <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500 ml-2">Grafik Tipi</label>
                  <select 
                    className="w-full bg-black border border-white/10 rounded-xl p-4 mt-1 outline-none"
                    onChange={(e) => setFormData({...formData, chart_type: e.target.value})}
                  >
                    <option value="area">Area (Elite)</option>
                    <option value="bar">Bar (Pro)</option>
                    <option value="line">Line (Simple)</option>
                  </select>
               </div>

               <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500 ml-2">Satış Fiyatı (₺)</label>
                    <input type="number" placeholder="0" className="w-full bg-black border border-white/10 rounded-xl p-4 mt-1 outline-none" onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}/>
                  </div>
                  <div className="flex items-end pb-4">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.is_public} onChange={(e) => setFormData({...formData, is_public: e.target.checked})} className="w-5 h-5 accent-purple-500"/>
                        <span className="text-xs font-bold uppercase text-gray-400">Markette Yayınla</span>
                     </label>
                  </div>
               </div>
            </div>
          </div>

          {/* VERİ GİRİŞİ */}
          <div className="space-y-6">
             <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-bold uppercase text-gray-500">JSON Veri Girişi</label>
                    <Database size={16} className="text-purple-500" />
                </div>
                <textarea 
                  className="flex-1 w-full bg-black border border-white/10 rounded-xl p-4 font-mono text-xs text-green-500 outline-none focus:border-green-500/50 transition-all resize-none"
                  value={formData.data_json}
                  onChange={(e) => setFormData({...formData, data_json: e.target.value})}
                />
                <button 
                  onClick={handleCreate}
                  disabled={loading}
                  className="w-full bg-white text-black font-black py-4 rounded-2xl mt-6 flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'İŞLENİYOR...' : <><Save size={18} /> ANALİZİ OLUŞTUR</>}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
