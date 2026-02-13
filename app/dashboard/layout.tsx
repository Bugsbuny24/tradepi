'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Menü Linkleri (Buradan yönetirsin)
  const menuItems = [
    { name: 'Genel Bakış', href: '/dashboard', icon: '📊' },
    { name: 'Tasarım Stüdyosu', href: '/dashboard/designer', icon: '🎨' },
    { name: 'Projelerim', href: '/dashboard/projects', icon: '📁' },
    { name: 'Market (TL)', href: '/dashboard/market', icon: '🛒' },
    { name: 'Ayarlar', href: '/dashboard/settings', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex font-sans">
      
      {/* SOL MENÜ (Sidebar) - Masaüstü */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-800 bg-black fixed h-full z-10">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="text-xl font-bold tracking-tight text-white">SnapLogic</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-600/30' 
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Alt Kısım: Çıkış Yap */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
          >
            <span>🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* SAĞ TARAF (İçerik Alanı) */}
      <main className="flex-1 md:ml-64 relative">
        
        {/* Mobil Menü Başlığı (Sadece telefonda görünür) */}
        <div className="md:hidden p-4 border-b border-gray-800 flex justify-between items-center bg-black sticky top-0 z-20">
          <span className="font-bold text-white">SnapLogic</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-400 text-2xl">
            ☰
          </button>
        </div>

        {/* Mobil Menü Açılırsa */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 w-full bg-black border-b border-gray-800 p-4 z-30 shadow-2xl">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 text-gray-400 hover:bg-gray-900 rounded-lg mb-1"
              >
                {item.icon} {item.name}
              </Link>
            ))}
            <button 
                onClick={handleLogout}
                className="w-full text-left py-3 px-4 text-red-400 hover:bg-red-500/10 rounded-lg mt-2"
            >
                🚪 Çıkış Yap
            </button>
          </div>
        )}

        {/* SAYFA İÇERİĞİ BURAYA GELİR */}
        <div className="p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
