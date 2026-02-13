"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    chartCount: 0,
    credits: 0,
    packageName: 'Ücretsiz Plan',
    packagePrice: 0
  });

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);

      // 1. Kalan Krediler (user_quotas)
      const { data: quota } = await supabase
        .from('user_quotas')
        .select('credits_remaining')
        .eq('user_id', user.id)
        .single();

      // 2. Grafik Sayısı (charts)
      const { count } = await supabase
        .from('charts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // 3. Aktif Paket Bilgisi (packages tablosundan TRY fiyatını alalım)
      // Not: Normalde active_packages join yapılmalı ama şimdilik basitleştiriyoruz
      const { data: activePkg } = await supabase
        .from('active_packages')
        .select('title, price_pi') // Şemada price_try yoksa price_pi'yi placeholder yaparız
        .eq('id', user.id) // active_packages id ile user_id eşleşiyor varsayıyoruz
        .maybeSingle();

      setStats({
        chartCount: count || 0,
        credits: quota?.credits_remaining || 0,
        packageName: activePkg?.title || 'Başlangıç Paketi',
        packagePrice: 0 // Şimdilik 0 gösteriyoruz
      });

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-black text-gray-100 p-8">
      <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Genel Bakış</h1>
          <p className="text-gray-400">Hoş geldin, {user.email}</p>
        </div>
        <Link href="/dashboard/market" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2">
          Paket Yükselt (TL)
        </Link>
      </header>

      {/* İstatistikler - Sadece TL ve Kredi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Mevcut Paket" value={stats.packageName} icon="📦" />
        <StatCard title="Kalan Kredi" value={stats.credits.toString()} icon="⚡" color="text-yellow-400" />
        <StatCard title="Toplam Grafik" value={stats.chartCount.toString()} icon="bar_chart" color="text-indigo-400" />
      </div>

      <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Hızlı İşlemler</h3>
        <p className="text-gray-400 mb-6">Projeni büyütmek için kredi yükle veya yeni grafik oluştur.</p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard/designer" className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">
            Grafik Oluştur
          </Link>
          <Link href="/dashboard/market" className="border border-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            Mağazaya Git
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color = "text-white" }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
