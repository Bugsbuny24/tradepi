'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Market() {
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('packages').select('*').order('price_try', { ascending: true });
      if (data) setPackages(data);
    }
    load();
  }, []);

  const handlePayment = (pkg: any) => {
    const paymentUrl = pkg.grants?.payment_link;
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
      alert("Ödeme sayfası yeni sekmede açıldı. Ödemeniz onaylandıktan sonra krediniz otomatik yüklenecektir.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <h1 className="text-3xl font-bold mb-12 text-green-500 tracking-tighter uppercase">// SnapLogic_Market_V1</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-green-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white uppercase">{pkg.title}</h3>
                <span className="text-[10px] text-gray-600 font-mono">{pkg.code}</span>
              </div>
              <p className="text-4xl font-black text-green-500 my-6">₺{pkg.price_try}</p>
              <ul className="space-y-3 text-sm text-gray-400 mb-8 border-t border-gray-800 pt-4">
                <li>💎 {pkg.grants?.credits.toLocaleString()} Kredi</li>
                <li>👁️ {pkg.grants?.views.toLocaleString()} İzlenme</li>
                <li>⚙️ SnapScript: {pkg.grants?.snapscript === 'full' ? 'FULL UNLOCKED' : pkg.grants?.snapscript === 'basic' ? 'BASIC' : 'LOCKED'}</li>
              </ul>
            </div>
            <button 
              onClick={() => handlePayment(pkg)}
              className="w-full bg-green-600 hover:bg-green-400 text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest"
            >
              Hemen Öde
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
