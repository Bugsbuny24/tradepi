import React from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, BarChart3, Database, 
  LineChart, Key, ShoppingCart, Settings, 
  LogOut, Zap 
} from 'lucide-react'
import LogoutButton from '@/components/dashboard/LogoutButton'

const menuItems = [
  { name: 'Genel Bakış', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Grafiklerim', icon: BarChart3, href: '/dashboard/charts' },
  { name: 'Veri Yönetimi', icon: Database, href: '/dashboard/data' },
  { name: 'Analitik', icon: LineChart, href: '/dashboard/analytics' },
  { name: 'API & Embed', icon: Key, href: '/dashboard/api' },
  { name: 'Mağaza', icon: ShoppingCart, href: '/dashboard/store' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* SOL SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        
        {/* Logo Alanı */}
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-black italic tracking-tighter text-slate-900 underline decoration-blue-500">
              SnapLogic
            </span>
          </Link>
        </div>

        {/* Menü Linkleri */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-600 font-bold hover:bg-blue-50 hover:text-blue-600 transition-all group"
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Alt Menü (Settings & Logout) */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link 
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 transition-all"
          >
            <Settings size={20} />
            <span className="text-sm">Ayarlar</span>
          </Link>
          
          <div className="w-full">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1 overflow-y-auto">
        {/* Üst Bar (İsteğe bağlı, örneğin hoşgeldin mesajı için) */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-end">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xs">
                SL
             </div>
          </div>
        </header>

        {/* Sayfa İçeriği */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
