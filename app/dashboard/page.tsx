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

  // Profil ve Kota verilerinin çekilmesi
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, user_quotas(*)')
    .eq('id', user.id)
    .single()

  // Veri yapısının doğrulanması ve kota bilgilerinin ayrıştırılması
  // @ts-ignore
  const quotaData = Array.isArray(profile?.user_quotas) ? profile?.user_quotas[0] : profile?.user_quotas;

  const credits = quotaData?.credits_remaining || 0
  const tier = quotaData?.tier || 'Standart'

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      
      {/* Yan Menü (Navigation) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-slate-50">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">S</div>
          <span className="text-xl font-bold tracking-tight text-slate-900">SnapLogic</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-slate-50 text-blue-700 rounded-xl font-semibold text-sm">
            <LayoutDashboard size={18} /> Kontrol Paneli
          </Link>
          <Link href="/dashboard/widgets" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold text-sm transition-colors">
            <BarChart3 size={18} /> Araçlarım
          </Link>
          <Link href="/dashboard/marketplace" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold text-sm transition-colors">
            <Globe size={18} /> Mağaza
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold text-sm transition-colors">
            <Settings size={18} /> Ayarlar
          </Link>
        </nav>

        {/* Mevcut Plan Özeti */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Mevcut Plan</p>
              <h4 className="text-base font-bold mb-4">{tier} Paket</h4>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">{credits.toLocaleString()} Kredi</span>
                <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/5">
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <Zap className="absolute -bottom-4 -right-4 text-white/5" size={80} />
          </div>
        </div>
      </aside>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tekrar Hoş Geldiniz, {profile?.full_name || 'Kullanıcı'}</h1>
            <p className="text-slate-500 text-sm mt-1">Sistem ve operasyon verileriniz aşağıda listelenmiştir.</p>
          </div>
          <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm transition-all text-sm">
            <Plus size={18} /> Yeni Araç Oluştur
          </button>
        </header>

        {/* Temel Metrikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Aktif Araçlar', value: '0', detail: 'Son 30 gün', color: 'text-blue-700' },
            { label: 'Toplam Gösterim', value: '0', detail: 'Limit: 50.000', color: 'text-slate-600' },
            { label: 'Kredi Kullanımı', value: '0', detail: 'Aylık Veri', color: 'text-slate-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                <span className={`text-xs font-medium ${stat.color}`}>{stat.detail}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Veri Bulunmama Durumu (Empty State) */}
        <div className="bg-white border border-slate-200 border-dashed rounded-[2rem] p-16 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <BarChart3 size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Henüz Aktif Bir Araç Bulunmuyor</h2>
          <p className="text-slate-500 max-w-sm mb-8 text-sm leading-relaxed">
            Verilerinizi görselleştirmek ve sitenize entegre etmek için ilk aracınızı oluşturarak başlayabilirsiniz.
          </p>
          <button className="flex items-center gap-2 text-blue-700 font-semibold hover:gap-3 transition-all text-sm">
            Hızlı başlangıç rehberini görüntüle <ArrowUpRight size={16} />
          </button>
        </div>
      </main>
    </div>
  )
}
