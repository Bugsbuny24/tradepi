import { createClient } from '@/lib/supabase'
import { Plus, Layout, Code, Terminal, Zap, Share2, BarChart2, ArrowRight, Settings } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from './LogoutButton' // Daha önce oluşturduğumuz Client Component

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // .maybeSingle() kullanıyoruz ki satır yoksa sayfa patlamasın!
  const { data: quotas } = await supabase
    .from('user_quotas')
    .select('*')
    .eq('user_id', user?.id)
    .maybeSingle()

  const { data: charts } = await supabase
    .from('charts')
    .select('*')
    .eq('user_id', user?.id)
    .limit(5)

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Üst Navigasyon */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black text-blue-600 tracking-tighter italic">SnapLogic.io</h1>
            <div className="hidden md:flex gap-6 text-sm font-bold text-slate-500">
              <Link href="/dashboard" className="text-blue-600">Overview</Link>
              <Link href="/dashboard/embeds" className="hover:text-blue-600">Embeds</Link>
              <Link href="/dashboard/api" className="hover:text-blue-600">API Keys</Link>
              <Link href="/dashboard/scripts" className="hover:text-blue-600">Scripts</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/create" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:scale-105 transition-all">
              + Create New
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* Hızlı Erişim Kartları (Embed, API, Widget vb.) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <Share2 size={24} className="text-blue-600 group-hover:text-white" />
            </div>
            <h3 className="font-black text-slate-900">Embed Center</h3>
            <p className="text-sm text-slate-500 mt-2">Grafiklerini sitene göm (iframe/widget)</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
              <Zap size={24} className="text-purple-600 group-hover:text-white" />
            </div>
            <h3 className="font-black text-slate-900">API Access</h3>
            <h4 className="text-xs font-bold text-slate-400 mt-1 uppercase">Kalan: {quotas?.api_call_remaining || 0}</h4>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-600 transition-colors">
              <Code size={24} className="text-amber-600 group-hover:text-white" />
            </div>
            <h3 className="font-black text-slate-900">Snap Scripts</h3>
            <p className="text-sm text-slate-500 mt-2">Özel veri işleme scriptlerini yönet</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
              <Layout size={24} className="text-emerald-600 group-hover:text-white" />
            </div>
            <h3 className="font-black text-slate-900">Widgets</h3>
            <p className="text-sm text-slate-500 mt-2">Gelişmiş veri widget'larını kur</p>
          </div>
        </div>

        {/* Ana İçerik Alanı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Son Grafikler */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 italic">Recent Projects</h2>
              <Link href="/dashboard/charts" className="text-sm font-bold text-blue-600">View All</Link>
            </div>

            {(!charts || charts.length === 0) ? (
              <div className="bg-white rounded-[3rem] p-16 border-2 border-dashed border-slate-200 text-center">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart2 className="text-slate-300" size={48} />
                </div>
                <h3 className="text-xl font-black text-slate-800">Henüz bir veri yok kanka!</h3>
                <p className="text-slate-500 mt-2 mb-8">Hemen ilk grafiğini oluştur ve API'lerini bağla.</p>
                <Link href="/create" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all">
                  Get Started Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {charts.map(chart => (
                  <div key={chart.id} className="bg-white p-6 rounded-3xl border border-slate-200">
                    <h4 className="font-black text-slate-900">{chart.title}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Yan Panel: Ayarlar ve Profil */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-200 text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full mx-auto mb-4 border-4 border-white shadow-xl" />
              <h3 className="font-black text-slate-900">{user?.email?.split('@')[0]}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Free Tier User</p>
              
              <div className="mt-8 space-y-4">
                <Link href="/settings" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all">
                  <span className="font-bold text-sm text-slate-700">Account Settings</span>
                  <Settings size={18} className="text-slate-400" />
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
