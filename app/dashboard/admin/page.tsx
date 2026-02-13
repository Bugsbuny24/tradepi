"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ShieldCheck, Users, BarChart3, Lock, Eye, Trash2 } from "lucide-react";

export default function AdminPanel() {
  const [stats, setStats] = useState({ users: 0, charts: 0, locked: 0 });
  const [recentCharts, setRecentCharts] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAdminData() {
      // 1. Genel İstatistikleri Çek
      const { count: userCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
      const { count: chartCount } = await supabase.from("charts").select("*", { count: 'exact', head: true });
      const { count: lockedCount } = await supabase.from("charts").select("*", { count: 'exact', head: true }).eq("is_locked", true);
      
      setStats({ users: userCount || 0, charts: chartCount || 0, locked: lockedCount || 0 });

      // 2. Son Oluşturulan Grafikleri Listele
      const { data: charts } = await supabase
        .from("charts")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false })
        .limit(10);
      
      setRecentCharts(charts || []);
    }
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-mono">
      <div className="max-w-6xl mx-auto">
        
        {/* ADMIN HEADER */}
        <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Master <span className="text-red-500">Admin</span></h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">SnapCore Tüm Sistem Denetimi</p>
          </div>
        </div>

        {/* İSTATİSTİK KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px]">
            <Users className="text-gray-600 mb-4" size={20} />
            <div className="text-3xl font-black italic text-white">{stats.users}</div>
            <div className="text-[9px] text-gray-700 font-bold uppercase mt-1">Toplam Kullanıcı</div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px]">
            <BarChart3 className="text-yellow-500 mb-4" size={20} />
            <div className="text-3xl font-black italic text-white">{stats.charts}</div>
            <div className="text-[9px] text-gray-700 font-bold uppercase mt-1">Üretilen Analiz</div>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px]">
            <Lock className="text-red-500 mb-4" size={20} />
            <div className="text-3xl font-black italic text-white">{stats.locked}</div>
            <div className="text-[9px] text-gray-700 font-bold uppercase mt-1">Kilitli (Premium)</div>
          </div>
        </div>

        {/* SON ANALİZLER TABLOSU */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Sistem Akışı (Son 10 Analiz)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9px] text-gray-700 font-black uppercase tracking-widest border-b border-white/5">
                  <th className="p-6">Analiz Başlığı</th>
                  <th className="p-6">Oluşturan</th>
                  <th className="p-6">Durum</th>
                  <th className="p-6">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {recentCharts.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                    <td className="p-6 font-bold uppercase italic">{item.title}</td>
                    <td className="p-6 text-gray-500">{item.profiles?.email || 'Anonim'}</td>
                    <td className="p-6">
                      {item.is_locked ? 
                        <span className="text-red-500 flex items-center gap-1 text-[9px] font-black"><Lock size={10}/> KİLİTLİ</span> : 
                        <span className="text-green-500 flex items-center gap-1 text-[9px] font-black"><Eye size={10}/> AÇIK</span>
                      }
                    </td>
                    <td className="p-6">
                      <button className="p-2 text-gray-700 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
