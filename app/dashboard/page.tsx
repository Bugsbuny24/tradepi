"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { BarChart3, Plus, ArrowUpRight, ShieldCheck, Wallet, Globe } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [charts, setCharts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState<'explore' | 'my'>('explore');
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // 1. Admin Kontrolü
      const { data: adminData } = await supabase.rpc('is_admin');
      setIsAdmin(adminData);

      // 2. Grafikleri Çek
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
              Sistem Çevrimiçi • Veri Borsası v1.0
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link href="/dashboard/admin" className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                <ShieldCheck size={14} /> Master Admin
              </Link>
            )}
            <Link href="/dashboard/settings" className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-500 hover:text-yellow-500 transition-all">
              <Wallet size={18} />
            </Link>
            <Link href="/dashboard/designer" className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
              <Plus size={14} /> Yeni Grafik
            </Link>
          </div>
        </div>

        {/* SEKMELER - İnsanlar için Kazanç Alanı */}
        <div className="flex gap-8 mb-10 border-b border-white/5">
          <button 
            onClick={() => setView('explore')}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'explore' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-600'}`}
          >
            Analiz Pazarı (Keşfet)
          </button>
          <button 
            onClick={() => setView('my')}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${view === 'my' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-600'}`}
          >
            Veri Madenlerim
          </button>
        </div>

        {/* ANALİZ LİSTESİ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center animate-pulse text-gray-700 font-black uppercase text-[10px]">Sinyal taranıyor...</div>
          ) : charts.length > 0 ? (
            charts.map((chart) => (
              <Link key={chart.id} href={`/dashboard/chart/${chart.id}`}>
                <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px] hover:border-yellow-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-all">
                    <ArrowUpRight size={20} className="text-yellow-500" />
                  </div>
                  <BarChart3 className="text-yellow-500 mb-6" size={24} />
                  <h3 className="text-sm font-black uppercase italic tracking-widest mb-4 group-hover:text-yellow-500 transition-all">
                    {chart.title}
                  </h3>
                  
                  {/* Fiyat Bilgisi */}
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[7px] text-gray-700 font-black uppercase tracking-widest">Erişim Bedeli</span>
                        <span className="text-xs font-black italic text-yellow-500">
                            {chart.is_locked ? `${chart.price || '1.0'} PI` : "ÜCRETSİZ"}
                        </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[7px] font-black uppercase ${chart.is_locked ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {chart.is_locked ? "Kilitli" : "Açık"}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full bg-[#0A0A0A] border border-white/5 rounded-[40px] p-20 text-center">
              <Globe className="mx-auto text-gray-800 mb-6" size={48} />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Pazarda Henüz Analiz Yok</h2>
              <Link href="/dashboard/designer" className="text-yellow-500 text-[10px] font-black uppercase tracking-widest border-b border-yellow-500/20 pb-1">
                İLK VERİNİ MÜHÜRLE VE KAZANMAYA BAŞLA →
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
