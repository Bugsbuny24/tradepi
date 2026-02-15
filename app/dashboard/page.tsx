export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { 
  LayoutDashboard, 
  Plus, 
  Zap, 
  Globe, 
  BarChart3, 
  Settings, 
  ArrowUpRight 
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // Profil ve Kota bilgisini çekiyoruz
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, user_quotas(*)')
    .eq('id', user.id)
    .single()

  // 🛡️ TYPESCRIPT FIX: user_quotas bazen dizi bazen nesne gibi göründüğü için zorla ayıklıyoruz
  // @ts-ignore
  const quotaData = Array.isArray(profile?.user_quotas) ? profile?.user_quotas[0] : profile?.user_quotas;

  const credits = quotaData?.credits_remaining || 0
  const tier = quotaData?.tier || 'Free'

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      
      {/* SIDEBAR (SOL MENÜ) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-slate-50">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">S</div>
          <span className="text-xl font-black tracking-tighter italic">SnapLogic.io</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/dashboard/charts" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all text-slate-400">
            <BarChart3 size={18} /> My Widgets
          </Link>
          <Link href="/dashboard/marketplace" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all text-slate-400">
            <Globe size={18} /> Marketplace
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all text-slate-400">
            <Settings size={18} /> Settings
          </Link>
        </nav>

        {/* ALT KISIM: PLAN KARTI */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
              <h4 className="text-lg font-black mb-4">{tier} Tier</h4>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{credits.toLocaleString()} Credits</span>
                <button className="p-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <Zap className="absolute -bottom-4 -right-4 text-white/5 rotate-12" size={80} />
          </div>
        </div>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hoş geldin, {profile?.full_name?.split(' ')[0] || 'Patron'}! 👋</h1>
            <p className="text-slate-500 font-medium">İşte projenin bugünkü performans özeti.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-sm">
            <Plus size={20} strokeWidth={3} /> Yeni Widget Oluştur
          </button>
        </header>

        {/* İSTATİSTİKLER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Aktif Widgetlar', value: '0', sub: 'Bu ay +0', color: 'text-blue-600' },
            { label: 'Widget Gösterimi', value: '0', sub: 'Limit: 50k', color: 'text-purple-600' },
            { label: 'Harcanan Kredi', value: '0', sub: 'Paket: Business', color: 'text-emerald-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-4xl font-black text-slate-900 leading-none">{stat.value}</h3>
                <span className={`text-xs font-bold ${stat.color} mb-1`}>{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* BOŞ DURUM MESAJI */}
        <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
            <BarChart3 size={40} />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Henüz bir Widget oluşturmadın</h2>
          <p className="text-slate-500 max-w-sm mb-8 font-medium italic">
            Saniyeler içinde verilerini şık grafiklere dönüştür ve istediğin web sitesine göm.
          </p>
          <button className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
            Hemen bir örnek oluştur <ArrowUpRight size={18} />
          </button>
        </div>
      </main>
    </div>
  )
}
