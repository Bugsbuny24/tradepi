"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ShoppingCart, Zap, ArrowLeft, Wallet } from "lucide-react";
import Link from "next/link";

export default function MarketPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPackages() {
      // Şemandaki active_packages tablosundan çekiyoruz
      const { data } = await supabase.from("active_packages").select("*").order("price_pi", { ascending: true });
      setPackages(data || []);
    }
    fetchPackages();
  }, []);

  const handleTestPayment = async (pkg: any) => {
    try {
      if (!(window as any).Pi) return alert("Pi Browser ile aç kanka!");

      // 10. Adım: Portal ödemeyi bu fonksiyonla yakalayacak
      const payment = await (window as any).Pi.createPayment({
        amount: pkg.price_pi,
        memo: `${pkg.title} Paketi Test Ödemesi`,
        metadata: { pkgCode: pkg.code }
      }, {
        onReadyForServerApproval: (pId: string) => console.log("Onay Bekliyor:", pId),
        onReadyForServerCompletion: (pId: string, txid: string) => {
          alert("TEST BAŞARILI! 🚀\nPortal onayı yakaladı.");
        },
        onCancel: () => console.log("İptal"),
        onError: (e: any) => alert("Pi Hatası: " + e.message)
      });
    } catch (e) { alert("Cüzdan tetiklenemedi!"); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black italic text-yellow-500 uppercase">SnapCore Market</h1>
          <p className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-[0.3em]">Portal Test Terminali</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[40px] hover:border-yellow-500/30 transition-all">
              <div className="text-[9px] text-gray-700 font-black mb-2 uppercase">{pkg.code}</div>
              <h3 className="text-lg font-black uppercase italic mb-6">{pkg.title}</h3>
              <div className="text-2xl font-black text-yellow-500 mb-8">{pkg.price_pi} PI</div>
              <button onClick={() => handleTestPayment(pkg)} className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-yellow-500 transition-all">TEST ET</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
