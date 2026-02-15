import { createClient } from '@/lib/supabase'
import { Database, FileUp, Table as TableIcon, Trash2, BarChart } from 'lucide-react'
import Link from 'next/link'

export default async function DataManagerPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Kullanıcının verisi olan grafiklerini çekiyoruz
  const { data: charts } = await supabase
    .from('charts')
    .select('*, data_entries(count)')
    .eq('user_id', user?.id)

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Data Manager</h1>
          <p className="text-slate-500 mt-2">Ham verilerini yönet, Excel/CSV dosyalarını içeri aktar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon: Veri Kaynakları Listesi */}
        <div className="lg:col-span-2 space-y-4">
          {charts?.map((chart) => (
            <div key={chart.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <TableIcon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{chart.title || 'Adsız Veri Seti'}</h3>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    {chart.data_entries[0]?.count || 0} Satır Veri • {chart.chart_type}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/data/upload?id=${chart.id}`} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                  <FileUp size={20} />
                </Link>
                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sağ Kolon: Bilgi Paneli */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <Database className="absolute -right-4 -bottom-4 text-white/10" size={120} />
            <h3 className="text-xl font-bold mb-2">B2B Veri Gücü</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Verilerini API üzerinden bağlayarak anlık (real-time) grafikler oluşturabilirsin.
            </p>
            <button className="mt-6 bg-emerald-500 text-white w-full py-3 rounded-xl font-bold text-sm">
              API Dökümantasyonu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

