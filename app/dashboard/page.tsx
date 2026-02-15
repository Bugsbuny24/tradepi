import { createClient } from '@/lib/supabase'
import { Plus, BarChart2, TrendingUp, Wallet, Eye, Zap, ArrowRight, ShoppingCart, Activity, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  // Middleware zaten kontrol ediyor, tekrar redirect gereksiz

  // Quotas
  const { data: quotas } = await supabase
    .from('user_quotas')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  // Charts
  const { data: charts } = await supabase
    .from('charts')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(6)

  const { count: totalCharts } = await supabase
    .from('charts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)

  const { count: publicCharts } = await supabase
    .from('charts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)
    .eq('is_public', true)

  const credits = quotas?.credits_remaining || 0
  const views = quotas?.embed_view_remaining || 0
  const needsCredits = credits < 500

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
              <p className="text-slate-600 text-sm mt-1">Hoş geldin, {user?.email?.split('@')[0]} 👋</p>
            </div>
            <Link 
              href="/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              Yeni Grafik
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Low Credits Warning */}
        {needsCredits && (
          <div className="bg-gradient-to-r from-amber-500 to-red-500 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg">Kredin Azalıyor!</h3>
                  <p className="text-white/90 text-sm">Daha fazla grafik oluşturmak için kredi satın al</p>
                </div>
              </div>
              <Link 
                href="/pricing"
                className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2"
              >
                <ShoppingCart size={18} />
                Kredi Al
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Credits */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Wallet className="text-green-600" size={24} />
              </div>
              <Link href="/pricing" className="text-green-600 hover:text-green-700">
                <Plus size={20} />
              </Link>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">
              {credits.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 font-medium">Krediler</div>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                style={{ width: `${Math.min((credits / 5000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Views */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="text-blue-600" size={24} />
              </div>
              <Activity className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">
              {views.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 font-medium">Görüntüleme Hakkı</div>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                style={{ width: `${Math.min((views / 50000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Total Charts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart2 className="text-purple-600" size={24} />
              </div>
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">
              {totalCharts || 0}
            </div>
            <div className="text-sm text-slate-600 font-medium">Toplam Grafik</div>
            <div className="mt-3 text-xs text-purple-600 font-semibold">
              {publicCharts || 0} tanesi herkese açık
            </div>
          </div>

          {/* Quick Buy */}
          <Link 
            href="/pricing"
            className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CreditCard className="text-white" size={24} />
              </div>
              <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" size={20} />
            </div>
            <div className="text-2xl font-black mb-1">Paketler</div>
            <div className="text-sm text-blue-100">₺50'den başlayan fiyatlar</div>
          </Link>
        </div>

        {/* Charts Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900">Son Grafiklerim</h2>
            <Link 
              href="/create" 
              className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-2"
            >
              Tümünü Gör
              <ArrowRight size={16} />
            </Link>
          </div>

          {!charts || charts.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BarChart2 className="text-slate-400" size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Henüz grafik yok</h3>
              <p className="text-slate-600 mb-6">İlk grafiğini oluştur ve verilerini görselleştir!</p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all"
              >
                <Plus size={20} />
                İlk Grafiği Oluştur
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {charts.map((chart) => (
                <Link
                  key={chart.id}
                  href={`/charts/${chart.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <BarChart2 className="text-blue-600" size={24} />
                    </div>
                    {chart.is_public ? (
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                        Herkese Açık
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-bold">
                        Özel
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {chart.title || 'Adsız Grafik'}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{chart.chart_type?.toUpperCase() || 'BAR'}</span>
                    <span>{new Date(chart.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/pricing"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="text-yellow-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  Kredi Paketi Al
                </h3>
                <p className="text-sm text-slate-600">₺50'den başlayan fiyatlar</p>
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
            </div>
          </Link>

          <Link
            href="/create"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Plus className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  Yeni Grafik
                </h3>
                <p className="text-sm text-slate-600">Hemen oluşturmaya başla</p>
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
            </div>
          </Link>

          <Link
            href="/auth"
            onClick={async (e) => {
              e.preventDefault()
              const supabase = createClient()
              await supabase.auth.signOut()
              window.location.href = '/auth'
            }}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-red-300 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Activity className="text-red-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-900 group-hover:text-red-600 transition-colors">
                  Çıkış Yap
                </h3>
                <p className="text-sm text-slate-600">Hesaptan çık</p>
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" size={20} />
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}
