export default function DashboardPage() {
  return <div className="p-20 text-white font-black text-4xl">SİSTEME GİRİŞ BAŞARILI! 🚀</div>;
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BalanceCard from "@/components/dashboard/balance-card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Veritabanı verilerini çekme mantığı (Senin page.tsx (9) dosyanla aynı)
  const { data: uq } = await supabase.from("user_quotas").select("*").eq("user_id", user.id).maybeSingle();
  const quotas = uq ?? { embed_view_remaining: 2000, api_call_remaining: 500 /* ... */ };

  return (
    <main className="min-h-screen bg-black text-white p-6 lg:p-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase leading-none">Kontrol Merkezi</h1>
            <p className="mt-4 text-xs font-medium text-gray-500 uppercase tracking-widest">
              Giriş: <span className="text-yellow-500/80">{user.email}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Ayarlar</button>
            <form action="/auth/logout" method="post">
                <button className="rounded-xl border border-red-500/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-colors">Çıkış</button>
            </form>
          </div>
        </header>

        <BalanceCard planTitle="Enterprise" planCode="ENT_01" quotas={quotas} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[32px] border border-white/5 bg-[#050505] p-8 flex flex-col justify-between group cursor-pointer hover:border-yellow-500/20 transition-all">
                <h3 className="text-xl font-bold tracking-tight">Yeni Widget Oluştur</h3>
                <p className="text-sm text-gray-500 mt-2">Saniyeler içinde verini canlı grafiğe dönüştür.</p>
                <div className="mt-8 text-5xl text-yellow-500/10 group-hover:text-yellow-500/100 transition-all">+</div>
            </div>
            <div className="rounded-[32px] border border-white/5 bg-[#050505] p-8 flex flex-col justify-between group cursor-pointer hover:border-blue-500/20 transition-all">
                <h3 className="text-xl font-bold tracking-tight">API Anahtarları</h3>
                <p className="text-sm text-gray-500 mt-2">Dış sistemlerle güvenli bağlantı kurun.</p>
                <div className="mt-8 text-5xl text-blue-500/10 group-hover:text-blue-500/100 transition-all">{"{ }"}</div>
            </div>
        </div>
      </div>
    </main>
  );
}
