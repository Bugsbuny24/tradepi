import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { 
  BarChart3, 
  Zap, 
  Activity, 
  Layers, 
  Plus, 
  ArrowUpRight, 
  Clock 
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Burada kullanıcının kotalarını ve grafik sayılarını DB'den çekebiliriz
  // Şimdilik tasarım için statik verilerle "Premium" görünümü kuralım
  const stats = [
    { label: "Aktif Grafikler", value: "12", icon: BarChart3, color: "text-yellow-500" },
    { label: "Kalan Kota", value: "18.4k", icon: Zap, color: "text-blue-500" },
    { label: "API Çağrıları", value: "450", icon: Activity, color: "text-green-500" },
    { label: "Toplam İzlenim", value: "1.2M", icon: Layers, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      {/* ÜST BAR */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            OPERASYON <span className="text-yellow-500">MERKEZİ</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Hoş geldin, {user.email?.split('@')[0]} • Terminal v1.0
          </p>
        </div>
        
        <Link 
          href="/dashboard/designer" 
          className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_30px_-10px_rgba(251,191,36,0.4)]"
        >
          <Plus size={16} strokeWidth={3} />
          YENİ GRAFİK OLUŞTUR
        </Link>
      </div>

      {/* İSTATİSTİK KARTLARI */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <ArrowUpRight className="text-gray-700 group-hover:text-white transition-colors" size={16} />
            </div>
            <div className="text-3xl font-black italic tracking-tighter mb-1">{stat.value}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ALT ALAN: SON ÇALIŞMALAR & AKTİVİTE */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: SON GRAFİKLER */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-6">Son Projeler</h2>
          
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-6 rounded-[24px] bg-[#080808] border border-white/5 hover:bg-[#0A0A0A] transition-all cursor-pointer group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                  <BarChart3 size={20} className="text-yellow-500" />
                </div>
                <div>
                  <div className="font-bold text-sm uppercase tracking-tight group-hover:text-yellow-500 transition-colors">Satış Analizi v{item}</div>
                  <div className="text-[10px] text-gray-600 font-medium uppercase mt-1 flex items-center gap-2">
                    <Clock size={10} /> 2 saat önce düzenlendi
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest border border-white/10 px-4 py-2 rounded-lg group-hover:border-yellow-500/50 transition-all">Düzenle</div>
            </div>
          ))}
        </div>

        {/* SAĞ: HIZLI BİLGİ / KOTA DURUMU */}
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-6">Sistem Durumu</h2>
          <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#0A0A0A] to-black border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl"></div>
            <h3 className="text-sm font-black uppercase italic mb-4">Plan: <span className="text-yellow-500">PRO (85 PI)</span></h3>
            <div className="space-y-4">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-[65%] shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-gray-500">
                <span>Kota Kullanımı</span>
                <span className="text-white">65%</span>
              </div>
            </div>
            <Link href="/pricing" className="mt-8 block w-full text-center py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">
              KOTAYI YÜKSELT
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
