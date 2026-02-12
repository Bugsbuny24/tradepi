"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Activity, Share2, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default function ChartDetailPage({ params }: { params: { id: string } }) {
  const [chart, setChart] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [hasPaid, setHasPaid] = useState(false); // Ödeme kontrolü
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDetails() {
      const { data: chartData } = await supabase
        .from("charts")
        .select("*, chart_scripts(script)")
        .eq("id", params.id)
        .single();

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
        <div className="flex justify-between items-center mb-10">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all uppercase text-[9px] font-black">
            <ArrowLeft size={14} /> Terminale Dön
          </Link>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all">
            <Share2 size={14} /> Paylaş
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-20" />
              
              {/* KİLİT MEKANİZMASI */}
              {chart?.is_locked && !hasPaid ? (
                <div className="text-center p-8 bg-yellow-500/5 rounded-[32px] border border-dashed border-yellow-500/20">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black mb-6 mx-auto shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                    <Lock size={32} />
                  </div>
                  <h2 className="text-xl font-black italic uppercase tracking-tighter mb-2">Analiz Kilitli</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-8">Bu veriye erişmek için 1 PI ödemen gerekiyor.</p>
                  <button 
                    onClick={() => alert("Pi Ödeme Başlatılıyor...")}
                    className="bg-yellow-500 text-black px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    1 PI İLE KİLİDİ AÇ
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <Activity className="text-yellow-500/20 mb-6 mx-auto" size={80} />
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{chart?.title}</h2>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">SnapScript v0 Motoru Devrede</p>
                  </div>
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
                </>
              )}
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px]">
             <div className="text-yellow-500 text-[9px] font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Veri Kayıtları</div>
             {chart?.is_locked && !hasPaid ? (
                <div className="text-center py-10 opacity-20 select-none">*************</div>
             ) : (
                <div className="space-y-4">
                  {data.map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.label}</span>
                      <span className="text-sm font-black italic text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
