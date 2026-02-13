"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ShoppingCart, Zap, ShieldCheck, ArrowLeft, Wallet } from "lucide-react";
import Link from "next/link";

export default function MarketPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      // Senin attığın tablodaki ürünleri çekiyoruz
      const { data } = await supabase.from("products").select("*").order("price_pi", { ascending: true });
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleTestPayment = async (product: any) => {
    try {
      if (!(window as any).Pi) return alert("Pi Browser ile açmalısın kanka!");

      const payment = await (window as any).Pi.createPayment({
        amount: product.price_pi,
        memo: `Satın Alım: ${product.title}`,
        metadata: { productId: product.id, code: product.code },
      }, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log("Sunucu onayı bekleniyor...", paymentId);
          // Backend onayı burada devreye girecek
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          alert(`MÜHÜR SÖKÜLDÜ! 🚀\nÜrün: ${product.title}\nİşlem ID: ${txid}\nKota hesabına tanımlandı.`);
          // Veritabanındaki 'grants' kısmını burada aktif edeceğiz
        },
        onCancel: (paymentId: string) => console.log("İptal edildi"),
        onError: (error: any) => alert("Hata: " + error.message),
      });
    } catch (err) {
      alert("Cüzdan tetiklenemedi!");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-mono">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 text-[9px] font-black uppercase tracking-widest"><ArrowLeft size={14}/> Terminal</Link>
          <div className="flex items-center gap-4">
             <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                <Wallet className="text-yellow-500" size={14}/>
                <span className="text-[10px] font-black text-yellow-500 uppercase italic">Testnet Modu</span>
             </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Snap<span className="text-yellow-500">Core</span> Market</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">Kota ve İzlenim Borsası</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p.id} className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[50px] hover:border-yellow-500/30 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-100 transition-all text-yellow-500">
                  <Zap size={24} />
               </div>
               <div className="text-[9px] text-gray-700 font-black uppercase mb-2 tracking-widest">{p.code}</div>
               <h3 className="text-xl font-black italic uppercase text-white mb-6 tracking-tighter">{p.title}</h3>
               <div className="flex items-end gap-1 mb-8">
                  <span className="text-3xl font-black italic text-yellow-500">{p.price_pi}</span>
                  <span className="text-[10px] font-black text-gray-600 mb-2 uppercase italic">PI</span>
               </div>
               <button 
                onClick={() => handleTestPayment(p)}
                className="w-full bg-white text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-xl"
               >
                 TEST ÖDEMESİ YAP
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
