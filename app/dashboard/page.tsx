"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { BarChart3, Activity, Zap, Globe, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [charts, setCharts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCharts() {
      const { data } = await supabase
        .from("charts")
        .select("*")
        .order("created_at", { ascending: false });
      setCharts(data || []);
      setLoading(false);
    }
    fetchCharts();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* ÜST PANEL */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">
              Snap<span className="text-yellow-500">Core</span> Terminal
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
              {loading ? "Sinyal Bekleniyor..." : "Sistem Çevrimiçi"}
            </p>
          </div>
          <Link href="/dashboard/designer" className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
            <Plus size={14} /> Yeni Grafik
          </Link>
        </div>

        {/* ANALİZ KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charts.length > 0 ? (
            charts.map((chart) => (
              <Link key={chart.id} href={`/dashboard/chart/${chart.id}`}>
                <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px] hover:border-yellow-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-all">
                    <ArrowUpRight size={20} className="text-yellow-500" />
                  </div>
                  <BarChart3 className="text-yellow-500 mb-6" size={24} />
                  <h3 className="text-sm font-black uppercase italic tracking-widest mb-2 group-hover:text-yellow-500 transition-all">
                    {chart.title}
                  </h3>
                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                    <span className="text-[8px] text-gray-700 font-black uppercase tracking-widest">SnapScript v0</span>
                    <span className="text-[8px] text-yellow-500/50 font-black uppercase tracking-widest">Aktif</span>
                  </div>
                </div>
              </Link>
            ))
          ) : !loading ? (
            <div className="col-span-full bg-[#0A0A0A] border border-white/5 rounded-[40px] p-20 text-center">
              <BarChart3 className="mx-auto text-gray-800 mb-6" size={48} />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-2 text-center">Henüz Analiz Yok</h2>
              <Link href="/dashboard/designer" className="text-yellow-500 text-[10px] font-black uppercase tracking-widest border-b border-yellow-500/20 pb-1">
                İLK ANALİZİNİ MÜHÜRLE →
              </Link>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
