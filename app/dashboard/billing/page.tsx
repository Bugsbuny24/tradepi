"use client";

import { CreditCard, Check, Zap, Shield } from "lucide-react";

const PLANS = [
  { id: "spark", name: "Spark", price: "15", quota: "2.000", color: "border-white/5" },
  { id: "pro", name: "Pro", price: "85", quota: "20.000", color: "border-yellow-500", popular: true },
  { id: "nova", name: "Nova", price: "350", quota: "Sınırsız", color: "border-white/5" },
];

export default function BillingPage() {
  const handlePayment = async (planId: string, amount: string) => {
    // Kanka burası Pi SDK'nın tetiklendiği yer olacak
    alert(`${amount} Pi ödeme işlemi başlatılıyor...`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Enerji <span className="text-yellow-500">Merkezi</span></h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Abonelik ve Kota Yönetimi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`p-8 rounded-[40px] bg-[#0A0A0A] border-2 ${plan.color} relative flex flex-col`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[9px] font-black px-4 py-1 rounded-full uppercase italic">En Çok Tercih Edilen</div>
              )}
              <h3 className="text-xl font-black uppercase italic mb-2">{plan.name}</h3>
              <div className="text-4xl font-black italic mb-8">{plan.price} <span className="text-yellow-500 text-sm italic">PI</span></div>
              
              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <Check size={14} className="text-yellow-500" /> {plan.quota} İzlenim
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <Check size={14} className="text-yellow-500" /> SnapScript v0
                </li>
              </ul>

              <button 
                onClick={() => handlePayment(plan.id, plan.price)}
                className="w-full py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-yellow-500 transition-all active:scale-95"
              >
                HEMEN YÜKLE
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
