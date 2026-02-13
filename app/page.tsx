'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Az önce oluşturduğumuz dosya
import Link from 'next/link';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    chartCount: 0,
    credits: 0,
    packageName: 'Ücretsiz',
    totalSpent: 0
  });

  useEffect(() => {
    async function loadData() {
      // 1. Oturum açmış kullanıcıyı al
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/login'; // Giriş yapmamışsa at
        return;
      }
      setUser(user);

      // 2. ŞEMADAN VERİ ÇEKME OPERASYONU 🚀
      
      // A) Profil ve Kota Bilgisi (user_quotas tablosu)
      const { data: quota } = await supabase
        .from('user_quotas')
        .select('credits_remaining')
        .eq('user_id', user.id)
        .single();

      // B) Grafik Sayısı (charts tablosu)
      const { count } = await supabase
        .from('charts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // C) Aktif Paket (active_packages tablosu)
      const { data: activePkg } = await supabase
        .from('active_packages')
        .select('title')
        .eq('id', user.id) // Genelde user_id ile eşleşir veya relation kurulur
        .single();

      // D) Cüzdan Harcaması (usd_wallets tablosu - Şemada var!)
      const { data: wallet } = await supabase
        .from('usd_wallets')
        .select('total_usd_spent')
        .eq('user_id', user.id)
        .single();

      // Verileri State'e kaydet
      setStats({
        chartCount: count || 0,
        credits: quota?.credits_remaining || 0,
        packageName: activePkg?.title || 'Başlangıç Paketi',
        totalSpent: wallet?.total_usd_spent || 0
      });

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Veriler Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-black text-gray-100 p-8">
      {/* Üst Başlık */}
      <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Komuta Merkezi</h1>
          <p className="text-gray-400">Hoş geldin, {user.email}</p>
        </div>
        <Link href="/dashboard/designer" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2">
          + Yeni Grafik Oluştur
        </Link>
      </header>

      {/* İstatistik Kartları (Şemadan Gelen Gerçek Veriler) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Aktif Paket" value={stats.packageName} icon="📦" />
        <StatCard title="Toplam Grafik" value={stats.chartCount.toString()} icon="bar_chart" />
        <StatCard title="Kalan Kredi" value={stats.credits.toString()} icon="bolt" color="text-yellow-400" />
        <StatCard title="Toplam Harcama" value={`$${stats.totalSpent}`} icon="attach_money" color="text-green-400" />
      </div>

      {/* Hızlı Erişim Menüsü */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MenuCard 
          title="Market & Ürünler" 
          desc="Şemadaki 'products' tablosundan hazır şablonlar al." 
          href="/dashboard/market"
        />
        <MenuCard 
          title="Görevler (Human Tasks)" 
          desc="Görev yaparak kredi kazan veya iş ver." 
          href="/dashboard/tasks"
        />
        <MenuCard 
          title="Ayarlar & Profil" 
          desc="Hesap detaylarını ve API anahtarlarını yönet." 
          href="/dashboard/settings"
        />
      </div>
    </div>
  );
}

// Basit Kart Bileşeni
function StatCard({ title, value, icon, color = "text-white" }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <span className="material-icons text-gray-500 text-xl">{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function MenuCard({ title, desc, href }: any) {
  return (
    <Link href={href} className="group bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:bg-gray-800 transition-all">
      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">{title} →</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </Link>
  );
}
