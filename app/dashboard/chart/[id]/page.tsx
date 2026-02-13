"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Lock, Activity, Wallet, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ChartDetailPage({ params }: { params: { id: string } }) {
  const [chart, setChart] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchChart() {
      const { data: c } = await supabase.from("charts").select("*, profiles(pi_wallet)").eq("id", params.id).single();
      const { data: d } = await supabase.from("data_entries").select("*").eq("chart_id", params.id);
      setChart(c); setData(d || []); setLoading(false);
    }
    fetchChart();
  }, [params.id]);

  const handlePiPayment = async () => {
    try {
      const payment = await (window as any).Pi.createPayment({
        amount: chart.price || 1.0,
        memo: `${chart.title} Analiz Erişimi`,
        metadata: { chartId: params.id }
      }, {
        onReadyForServerApproval: (id: string) => console.log("Onay Bekliyor:", id),
        onReadyForServerCompletion: (id: string) => { setHasPaid(true); alert("Analiz Kilidi Açıldı! 🔓"); },
        onCancel: () => console.log("İptal"),
        onError: (e: any) => alert("Pi Hatası: " + e.message)
      });
    } catch (e) { alert("Pi Browser ile açmalısın kanka!"); }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-black animate-pulse uppercase italic">Sinyal Aranıyor...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-mono">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 mb-10 text-[9px] font-black uppercase"><ArrowLeft size={14}/> Terminale Dön</Link>
        <div className="bg-[#0A0A0A] border border-white/5 p-12 rounded-[50px] relative overflow-hidden shadow-2xl">
          {chart?.is_locked && !hasPaid ? (
            <div className="text-center py-20 animate-in fade-in duration-1000">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-black mb-8 mx-auto shadow-[0_0_50px_rgba(234,179,8,0.4)]"><Lock size={40}/></div>
              <h2 className="text-3xl font-black italic uppercase mb-4 tracking-tighter">Analiz Kilitli</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-10 tracking-[0.3em]">Erişim Bedeli: {chart.price} PI</p>
              <button onClick={handlePiPayment} className="bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 mx-auto shadow-xl">
                <Wallet size={18}/> PI İLE KİLİDİ AÇ
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in duration-700">
              <div className="flex flex-col items-center">
                <Activity className="text-yellow-500/10 mb-8" size={100} />
                <h2 className="text-3xl font-black italic uppercase text-yellow-500 mb-16 tracking-tighter">{chart?.title}</h2>
                <div className="w-full flex items-end justify-center gap-3 h-48 px-4">
                  {data.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                      <div className="w-full bg-yellow-500/80 rounded-t-md hover:bg-yellow-500 transition-all shadow-[0_0_20px_rgba(234,179,8,0.1)]" style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }} />
                      <span className="text-[8px] text-gray-700 font-black uppercase tracking-tighter">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
