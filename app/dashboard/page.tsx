import { createClient } from '@/lib/supabase' // Büyük İ düzeltildi
import { Plus, BarChart2, TrendingUp, Wallet, Eye, Zap, ArrowRight, ShoppingCart, Activity, CreditCard } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from './LogoutButton' // Yeni bileşeni import et

export default async function DashboardPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  const { data: quotas } = await supabase
    .from('user_quotas')
    .select('*')
    .eq('user_id', user?.id)
    .single()

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
      {/* ... Üst kısımlar aynı kalıyor ... */}
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* ... Stats Grid ve Charts Section aynı ... */}

        {/* Quick Actions Bölümü - Düzenlendi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/pricing"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all group"
          >
            {/* ... Kredi içeriği ... */}
          </Link>

          <Link
            href="/create"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all group"
          >
            {/* ... Yeni Grafik içeriği ... */}
          </Link>

          {/* HATALI LİNK YERİNE TERTEMİZ COMPONENT */}
          <LogoutButton /> 
        </div>
      </div>
    </div>
  )
}
