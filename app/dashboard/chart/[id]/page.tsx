"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Lock, Zap, Activity } from "lucide-react";
import Link from "next/link";

export default function ChartDetailPage({ params }: { params: { id: string } }) {
  const [chart, setChart] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDetails() {
      const { data: c } = await supabase.from("charts").select("*, chart_scripts(script)").eq("id", params.id).single();
      const { data: d } = await supabase.from("data_entries").select("*").eq("chart_id", params.id);
      setChart(c); setData(d || []); setLoading(false);
    }
    fetchDetails();
  }, [params.id]);

  const handlePayment = async () => {
    try {
      // Pi SDK Ödeme Tetikleyici
      const payment = await (window as any).Pi.createPayment({
        amount: 1.0, memo: "Analiz Kilidi", metadata: { chartId: params.id }
      }, {
        onReadyForServerApproval: (pId: string) => console.log("Onay Bekliyor:", pId),
        onReadyForServerCompletion: (pId: string) => { setHasPaid(true); alert("Ödeme Başarılı! 🔓"); },
        onCancel: () => console.log("İptal"), onError: (e: any) => alert(e.message)
      });
    } catch (e) { alert("Pi Browser ile açmalısın kanka!"); }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 font-black italic animate-pulse">SİNYAL ARANIYOR...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-mono">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 mb-10 text-[9px] font-black uppercase"><ArrowLeft size={14}/> Terminale Dön</Link>
        <div className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[40px] min-h-[400px] flex items-center justify-center relative overflow-hidden shadow-2xl">
          {chart?.is_locked && !hasPaid ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black mb-6 mx-auto shadow-[0_0_30px_rgba(234,179,8,0.3)]"><Lock size={32}/></div>
              <h2 className="text-xl font-black italic uppercase mb-2">ANALİZ KİLİTLİ</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-8 tracking-widest">Erişim Bedeli: 1 PI</p>
              <button onClick={handlePayment} className="bg-yellow-500 text-black px-10 py-4 rounded-2xl font-black text-[11px] hover:scale-105 transition-all">Pİ CÜZDANI İLE AÇ</button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <Activity className="text-yellow-500/20 mb-6" size={80} />
              <h2 className="text-2xl font-black italic uppercase text-yellow-500">{chart?.title}</h2>
              <div className="w-full mt-12 flex items-end justify-center gap-2 h-32 px-10">
                {data.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-yellow-500 rounded-t-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]" style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }} />
                    <span className="text-[8px] text-gray-700 font-black uppercase">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
