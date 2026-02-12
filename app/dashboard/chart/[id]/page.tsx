"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Activity, Share2 } from "lucide-react";
import Link from "next/link";

export default function ChartDetailPage({ params }: { params: { id: string } }) {
  const [chart, setChart] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDetails() {
      // 1. Grafik bilgilerini ve scriptini çek
      const { data: chartData } = await supabase
        .from("charts")
        .select("*, chart_scripts(script)")
        .eq("id", params.id)
        .single();

      // 2. Bu grafiğe ait verileri çek
      const { data: entryData } = await supabase
        .from("data_entries")
        .select("*")
        .eq("chart_id", params.id);

      setChart(chartData);
      setData(entryData || []);
      setLoading(false);
    }
    fetchDetails();
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-black italic uppercase animate-pulse">Sinyal Aranıyor...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-mono">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all uppercase text-[9px] font-black">
            <ArrowLeft size={14} /> Terminale Dön
          </Link>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all">
            <Share2 size={14} /> Paylaş
          </button>
        </div>

        {/* ANALİZ GÖVDESİ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL: GRAFİK ALANI */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-20" />
                
                {/* Burası ileride SnapScript'in render edildiği yer olacak */}
                <div className="text-center">
                    <Activity className="text-yellow-500/20 mb-6 mx-auto" size={80} />
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{chart?.title}</h2>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">SnapScript v0 Motoru Devrede</p>
                </div>

                {/* VERİ BARLARI (GEÇİCİ GÖRSELLEŞTİRME) */}
                <div className="w-full mt-12 flex items-end justify-center gap-2 h-32">
                    {data.map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                             <div 
                                className="w-8 bg-yellow-500 rounded-t-lg transition-all duration-1000" 
                                style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}px` }}
                             />
                             <span className="text-[8px] text-gray-700 font-black uppercase tracking-tighter">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* SAĞ: VERİ DETAYLARI */}
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px]">
             <div className="text-yellow-500 text-[9px] font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Veri Kayıtları</div>
             <div className="space-y-4">
                {data.map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.label}</span>
                        <span className="text-sm font-black italic text-white">{item.value}</span>
                    </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
