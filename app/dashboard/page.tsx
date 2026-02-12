import { BarChart3, Activity, Zap, Globe, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Şimdilik örnek verilerle arayüzü ayağa kaldırıyoruz
  const stats = [
    { label: "Kalan Kredi", value: "10,000", icon: Zap, color: "text-yellow-500" },
    { label: "API Hakkı", value: "5,000", icon: Activity, color: "text-green-500" },
    { label: "Embed İzlenim", value: "25,000", icon: Globe, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* ÜST PANEL */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">
              Snap<span className="text-yellow-500">Core</span> Terminal
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Sistem Çevrimiçi</p>
          </div>
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
            + Yeni Grafik
          </button>
        </div>

        {/* KOTA KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[32px]">
              <stat.icon className={`${stat.color} mb-4`} size={24} />
              <div className="text-3xl font-black italic tracking-tighter mb-1">{stat.value}</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* BOŞ DURUM MESAJI */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-20 text-center">
          <BarChart3 className="mx-auto text-gray-800 mb-6" size={48} />
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-2">Henüz Analiz Yok</h2>
          <p className="text-[10px] text-gray-700 font-bold uppercase mb-8">Veri görselleştirme motorunu başlatmak için ilk grafiğini oluştur.</p>
          <Link href="/dashboard/designer" className="text-yellow-500 text-[10px] font-black uppercase tracking-widest border-b border-yellow-500/20 pb-1">
            Designer'ı Aç →
          </Link>
        </div>

      </div>
    </div>
  );
}
