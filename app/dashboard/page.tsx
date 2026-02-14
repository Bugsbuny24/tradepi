// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { Plus, BarChart2 } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // 1. Kullanıcıyı ve Session'ı doğrula
  const { data: { user } } = await supabase.auth.getUser()
  
  // Eğer kullanıcı yoksa (oturum düşmüşse) login'e at
  if (!user) {
    redirect('/login')
  }

  // 2. Grafikleri çek (user_id filtresi ile)
  const { data: charts, error } = await supabase
    .from('charts')
    .select('*')
    .eq('user_id', user.id) // Kendi verilerini çektiğinden emin ol
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-7xl mx-auto text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Panonuz</h1>
        <Link href="/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Yeni Grafik
        </Link>
      </div>

      {!charts || charts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed rounded-2xl">
          <BarChart2 className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500">Henüz bir grafiğiniz yok.</p>
          <Link href="/create" className="text-blue-600 font-bold mt-2 inline-block">İlkini oluşturun →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {charts.map((chart) => (
            <div key={chart.id} className="p-4 bg-white border rounded-xl shadow-sm">
              <h3 className="font-bold">{chart.title || 'Adsız Grafik'}</h3>
              <p className="text-xs text-slate-400">{chart.chart_type}</p>
              <Link href={`/charts/${chart.id}`} className="text-blue-600 text-sm mt-4 inline-block font-semibold">Düzenle</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
