"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage() {
  const [charts, setCharts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // PORTAL ONAY FONKSİYONU - EN BASİT HALİ
  const handlePortalTestPayment = async () => {
    try {
      if (!(window as any).Pi) {
        return alert("Kanka Pi Browser ile girmelisin!");
      }

      // Pi SDK'yı uyandırıyoruz
      const payment = await (window as any).Pi.createPayment({
        amount: 1, 
        memo: "Portal Onay Testi",
        metadata: { type: "portal_validation" }
      }, {
        onReadyForServerApproval: (pId: string) => console.log("Onay:", pId),
        onReadyForServerCompletion: (pId: string, txid: string) => {
          alert("MÜHÜR SÖKÜLDÜ! 🚀 Portalda 10. adım yeşil oldu.");
        },
        onCancel: () => console.log("İptal"),
        onError: (e: any) => alert("SDK Hatası: " + e.message)
      });
    } catch (e) {
      alert("Cüzdan tetiklenemedi, Pi SDK yüklenmemiş olabilir!");
    }
  };

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("charts").select("*");
      setCharts(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-black italic">SNAPCORE TERMINAL</h1>
          
          <div className="flex gap-4">
            {/* PORTAL ONAY BUTONU - İKONSUZ VE HATASIZ */}
            <button 
              onClick={handlePortalTestPayment}
              className="bg-orange-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
            >
              PORTAL ONAY (10. ADIM)
            </button>

            <Link href="/dashboard/designer" className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase">
              YENİ GRAFİK
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {charts.map((chart) => (
            <div key={chart.id} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[30px]">
              <h3 className="text-sm font-black uppercase text-yellow-500">{chart.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
