import { createClient } from '@/lib/supabase'
import { Plus, Share2, Zap, Code, Layout, BarChart2, ArrowRight, Settings, Database } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: quotas } = await supabase.from('user_quotas').select('*').eq('user_id', user?.id).maybeSingle()
  const { data: charts } = await supabase.from('charts').select('*').eq('user_id', user?.id).limit(4)

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Üst Bar */}
      <nav className="bg-white border-b px-8 h-20 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-2xl font-black text-blue-600 italic">SnapLogic.io</h1>
        <div className="flex gap-4">
          <Link href="/create" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all">+ Yeni Grafik</Link>
          <LogoutButton />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 space-y-10">
        {/* Kotalar & Durum */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between mb-4"><Zap className="text-amber-500" /> <span className="text-xs font-bold text-slate-400">API LIMIT</span></div>
            <div className="text-3xl font-black">{quotas?.api_call_remaining?.toLocaleString() || 0}</div>
            <p className="text-sm text-slate-500 mt-1">Kalan API Çağrısı</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between mb-4"><Share2 className="text-blue-500" /> <span className="text-xs font-bold text-slate-400">EMBED LIMIT</span></div>
            <div className="text-3xl font-black">{quotas?.embed_view_remaining?.toLocaleString() || 0}</div>
            <p className="text-sm text-slate-500 mt-1">Görüntüleme Hakkı</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between mb-4"><Database className="text-emerald-500" /> <span className="text-xs font-bold text-slate-400">CREDITS</span></div>
            <div className="text-3xl font-black">{quotas?.credits_remaining || 0}</div>
            <p className="text-sm text-slate-500 mt-1">Hesap Bakiyesi</p>
          </div>
        </div>

        {/* Aksiyon Menüsü: "Kullanıcı Ne Bok Yiyecek?" Buradan Seçer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/embeds" className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-blue-500 transition-all group">
            <Layout className="text-blue-600 mb-4" size={32} />
            <h3 className="font-black text-lg">Embed Center</h3>
            <p className="text-sm text-slate-500 mt-2">Grafikleri sitene göm, widget'ları yönet.</p>
          </Link>
          <Link href="/dashboard/api" className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-purple-500 transition-all group">
            <Code className="text-purple-600 mb-4" size={32} />
            <h3 className="font-black text-lg">API Access</h3>
            <p className="text-sm text-slate-500 mt-2">Dış veri kaynaklarını SnapLogic'e bağla.</p>
          </Link>
          <Link href="/dashboard/scripts" className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-amber-500 transition-all group">
            <Terminal className="text-amber-600 mb-4" size={32} />
            <h3 className="font-black text-lg">Snap Scripts</h3>
            <p className="text-sm text-slate-500 mt-2">Veri işleme ve manipülasyon kodları.</p>
          </Link>
          <Link href="/dashboard/data" className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-emerald-500 transition-all group">
            <Database className="text-emerald-600 mb-4" size={32} />
            <h3 className="font-black text-lg">Data Manager</h3>
            <p className="text-sm text-slate-500 mt-2">Ham verileri düzenle ve senkronize et.</p>
          </Link>
        </div>

        {/* Son Projeler */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black italic">Recent Projects</h2>
          {(!charts || charts.length === 0) ? (
            <div className="bg-white rounded-[3rem] p-20 border-2 border-dashed text-center">
              <BarChart2 className="mx-auto text-slate-200 mb-6" size={64} />
              <h3 className="text-xl font-bold">Burada henüz bir veri yok kanka.</h3>
              <p className="text-slate-400 mb-8">İlk grafiğini oluşturarak B2B dünyasına adım at.</p>
              <Link href="/create" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all">Grafik Oluştur</Link>
            </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {charts.map(c => (
                 <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center">
                   <span className="font-bold">{c.title}</span>
                   <Link href={`/dashboard/charts/${c.id}`} className="p-2 hover:bg-slate-100 rounded-full"><ArrowRight size={20}/></Link>
                 </div>
               ))}
             </div>
          )}
        </div>
      </main>
    </div>
  )
}
