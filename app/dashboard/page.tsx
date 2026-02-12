import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Zap, Activity, BarChart3, Globe, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Şemadaki user_quotas tablosundan verileri çekiyoruz
  const { data: quota } = await supabase
    .from("user_quotas")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Şemadaki charts tablosundan son projeleri çekiyoruz
  const { data: charts } = await supabase
    .from("charts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Kalan Kredi", value: quota?.credits_remaining || 0, icon: ShieldCheck, color: "text-blue-500" },
    { label: "API Hakkı", value: quota?.api_call_remaining || 0, icon: Activity, color: "text-green-500" },
    { label: "Embed İzlenim", value: quota?.embed_view_remaining || 0, icon: Globe, color: "text-purple-500" },
    { label: "Widget Yükleme", value: quota?.widget_load_remaining || 0, icon: Zap, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">
              Snap<span className="text-yellow-500">Core</span> Terminal
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
              ID: {user.id.slice(0, 8)} • Sistem Aktif
            </p>
          </div>
          <Link href="/dashboard/designer" className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            + Yeni Grafik Oluştur
          </Link>
        </div>

        {/* STATS GRID - Şemadaki Quota Verileri */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-[32px] hover:border-white/10 transition-all">
              <stat.icon className={`${stat.color} mb-4`} size={20} />
              <div className="text-2xl font-black italic tracking-tighter">{stat.value.toLocaleString()}</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ALT ALAN: PROJELER & AKTİVİTE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[40px] p-8">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-8">Aktif Projeler</h2>
            <div className="space-y-4">
              {charts?.length ? charts.map(chart => (
                <div key={chart.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-transparent hover:border-yellow-500/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <BarChart3 className="text-yellow-500" size={18} />
                    <span className="text-sm font-bold uppercase tracking-tight">{chart.title || "İsimsiz Analiz"}</span>
                  </div>
                  <div className="text-[9px] font-black text-gray-600 group-hover:text-white transition-colors uppercase">Düzenle</div>
                </div>
              )) : (
                <p className="text-gray-700 text-xs uppercase font-bold text-center py-10 tracking-widest">Henüz veri mühürlenmedi.</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0A0A0A] to-black border border-white/5 rounded-[40px] p-8">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-6">Paket Durumu</h2>
            <div className="text-center py-6">
                <div className="text-sm font-black uppercase italic text-yellow-500 mb-2">PRO PLAN</div>
                <div className="text-[10px] text-gray-500 font-bold tracking-widest mb-6 underline">GÜNCELLEME: 24.02.2026</div>
                <Link href="/dashboard/billing" className="block w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">
                  Kredi Yükle (Pi)
                </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
