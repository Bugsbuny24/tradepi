'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Market() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPackages() {
      // Sadece aktif paketleri çek
      const { data } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('price_try', { ascending: true }); // TL fiyatına göre sırala

      if (data) setPackages(data);
      setLoading(false);
    }
    loadPackages();
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-100 p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Paket Market</h1>
      <p className="text-gray-400 mb-8">İhtiyacına uygun paketi seç, hemen başla.</p>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col hover:border-indigo-500 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">{pkg.title}</h3>
              <div className="text-3xl font-bold text-white mb-4">
                {pkg.price_try ? `₺${pkg.price_try}` : 'Ücretsiz'}
                <span className="text-sm text-gray-500 font-normal"> /tek seferlik</span>
              </div>
              
              {/* Özellik Listesi (JSONB'den gelebilir ama şimdilik statik gösterelim) */}
              <ul className="text-gray-400 text-sm space-y-2 mb-8 flex-1">
                <li>✅ {pkg.code} Erişim</li>
                <li>⚡ Hızlı Destek</li>
                <li>🔒 Güvenli Ödeme</li>
              </ul>

              <button 
                onClick={() => alert('Ödeme entegrasyonu (Iyzico/Stripe) yakında eklenecek!')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Satın Al (₺)
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
