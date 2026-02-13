"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { BarChart3, Plus, ArrowUpRight, ShieldCheck, Wallet, Globe, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [charts, setCharts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState<'explore' | 'my'>('explore');
  const supabase = createClient();

  // --- PORTAL ONAY FONKSİYONU (BURADA OLMASI ŞART) ---
  const handlePortalTestPayment = async () => {
    try {
      if (!(window as any).Pi) return alert("Kanka Pi Browser ile girmelisin!");

      const payment = await (window as any).Pi.createPayment({
        amount: 1, 
        memo: "Portal Onay Test Ödemesi",
        metadata: { type: "portal_validation" }
      }, {
        onReadyForServerApproval: (pId: string) => console.log("Onay Bekliyor:", pId),
        onReadyForServerCompletion: (pId: string, txid: string) => {
          alert("İŞLEM BAŞARILI! 🚀\nŞimdi Portala git, 10. adım yeşil olmuş olacak.");
        },
        onCancel: () => console.log("İptal edildi"),
        onError: (e: any) => alert("Pi Hatası: " + e.message)
      });
    } catch (e) {
      alert("Cüzdan tetiklenemedi kanka!");
    }
  };
  // ------------------------------------------------

  useEffect(() => {
    async function fetchData() {
      const { data: adminData } = await supabase.rpc('is_admin');
      setIsAdmin(adminData);

      const { data } = await supabase
        .from("charts")
        .select("*")
        .order("created_at", { ascending: false });
      setCharts(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-mono">
      <div className="max-w-7xl mx-auto">
        
        {/* ÜST PANEL */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">
              Snap<span className="text-yellow-500">Core</span> Terminal
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
              Sistem Çevrimiçi • Portal Doğrulama Modu
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* PORTAL ONAY BUTONU - TAM BURADA */}
            <button 
              onClick={handlePortalTestPayment}
              className="bg-orange-500 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              <Zap size={14} /> PORTAL ONAY (10. ADIM)
            </button>

            {isAdmin && (
              <Link href="/dashboard/admin" className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} />
              </Link>
            )}
            <Link href="/dashboard/designer" className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
              <Plus size={14} /> Yeni Grafik
            </Link>
          </div>
        </div>

        {/* SEKMELER */}
        <div className="flex gap-8 mb-10 border-b border-white/5">
          <button 
            onClick={() => setView('explore')}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'explore' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-600'}`}
          >
            Analiz Pazarı
          </button>
          <button 
            onClick={() => setView('my')}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'my' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-600'}`}
          >
            Veri Madenlerim
          </button>
        </div>

        {/* LİSTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center animate-pulse text-gray-700 font-black uppercase text-[10px]">Veriler Mühürleniyor...</div>
          ) : charts.length > 0 ? (
            charts.map((chart) => (
              <Link key={chart.id} href={`/dashboard/chart/${chart.id}`}>
                <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px] hover:border-yellow-500/30 transition-all group relative">
                  <BarChart3 className="text-yellow-500 mb-6" size={24} />
                  <h3 className="text-sm font-black uppercase italic tracking-widest mb-4 group-hover:text-yellow-500 transition-all">
                    {chart.title}
                  </h3>
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                    <span className="text-[7px] text-gray-700 font-black uppercase">Erişim Bedeli</span>
                    <span className="text-xs font-black italic text-yellow-500">
                        {chart.is_locked ? `${chart.price || '1.0'} PI` : "AÇIK"}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <Globe className="mx-auto text-gray-800 mb-6" size={48} />
              <p className="text-gray-600 text-[10px] font-black uppercase">Sistemde henüz mühürlü analiz yok.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
