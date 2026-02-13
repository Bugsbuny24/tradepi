'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Dashboard Verileri
  const [stats, setStats] = useState({
    credits: 0,
    totalProjects: 0,
    views: 0,
    plan: 'Free'
  });
  
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      // 1. Kullanıcı Kontrolü
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // 2. İstatistikleri Çek (Paralel Sorgu)
      const [quotaRes, chartsRes] = await Promise.all([
        supabase.from('user_quotas').select('*').eq('user_id', user.id).single(),
        supabase.from('charts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      ]);

      const quota = quotaRes.data;
      const projects = chartsRes.data || [];

      // 3. State'i Güncelle
      setStats({
        credits: quota?.credits_remaining || 0,
        totalProjects: projects.length, // Gerçek count için count query atılabilir ama şimdilik bu yeter
        views: quota?.embed_view_remaining || 0, // Veya harcanan miktar
        plan: 'Başlangıç' // İleride packages tablosundan çekeriz
      });

      setRecentProjects(projects);
      setLoading(false);
    }

    loadDashboardData();
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4 md:p-8">
      
      {/* Üst Başlık */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Genel Bakış</h1>
          <p className="text-gray-400">Hoş geldin, {user.email}</p>
        </div>
        <div className="flex gap-3">
            <Link href="/dashboard/market" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-gray-700">
                ⚡ Kredi Yükle
            </Link>
            <Link href="/dashboard/designer" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-indigo-900/20">
                + Yeni Proje
            </Link>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
            title="Kalan Kredi" 
            value={stats.credits.toLocaleString()} 
            icon="💎" 
            desc="Her işlemde harcanır"
            color="text-indigo-400" 
        />
        <StatCard 
            title="Aktif Projeler" 
            value={stats.totalProjects.toString()} 
            icon="📊" 
            desc="Tasarladığın grafikler"
            color="text-green-400" 
        />
        <StatCard 
            title="Görüntülenme" 
            value="0" 
            icon="👁️" 
            desc="Embed izlenmeleri"
            color="text-yellow-400" 
        />
        <StatCard 
            title="Mevcut Plan" 
            value={stats.plan} 
            icon="🚀" 
            desc="Sana özel özellikler"
            color="text-pink-400" 
        />
      </div>

      {/* Alt Bölüm: Son Projeler & Hızlı Eğitim */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Son Projeler Tablosu */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-white">Son Çalışmaların</h3>
                <Link href="/dashboard/projects" className="text-sm text-indigo-400 hover:text-indigo-300">Tümünü Gör →</Link>
            </div>
            
            {recentProjects.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                    <p>Henüz hiç projen yok.</p>
                    <Link href="/dashboard/designer" className="text-indigo-400 underline mt-2 inline-block">İlk grafiğini tasarla</Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-800/50 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">Proje Adı</th>
                                <th className="px-6 py-3">Tip</th>
                                <th className="px-6 py-3">Tarih</th>
                                <th className="px-6 py-3">Durum</th>
                                <th className="px-6 py-3">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {recentProjects.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{p.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-800 px-2 py-1 rounded text-xs border border-gray-700">
                                            {p.chart_type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(p.created_at).toLocaleDateString('tr-TR')}</td>
                                    <td className="px-6 py-4">
                                        {p.is_public ? (
                                            <span className="text-green-400 flex items-center gap-1 text-xs">● Yayında</span>
                                        ) : (
                                            <span className="text-gray-500 flex items-center gap-1 text-xs">○ Gizli</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/dashboard/designer?id=${p.id}`} className="text-white hover:text-indigo-400 mr-3">Düzenle</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* Sağ Taraf: Duyurular / İpuçları */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
            <h3 className="font-bold text-indigo-400 mb-4">💡 Biliyor muydun?</h3>
            <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-3">
                    <span className="text-xl">🎨</span>
                    <span>Grafiklerini sitene gömmek için <b>Embed Kodu</b> oluşturabilirsin. (Yakında)</span>
                </li>
                <li className="flex gap-3">
                    <span className="text-xl">🔒</span>
                    <span>Kurumsal pakette "Domain Kilidi" özelliği ile verilerini koruyabilirsin.</span>
                </li>
                <li className="flex gap-3">
                    <span className="text-xl">💰</span>
                    <span>Arkadaşını davet et, her üye için <b>500 Kredi</b> kazan!</span>
                </li>
            </ul>
            <button className="w-full mt-6 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 py-3 rounded-lg border border-indigo-500/50 transition-all text-sm font-bold">
                Dokümantasyonu Oku
            </button>
        </div>

      </div>
    </div>
  );
}

// Kart Bileşeni
function StatCard({ title, value, icon, desc, color }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
            <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
            <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
        </div>
        <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</span>
      </div>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}
