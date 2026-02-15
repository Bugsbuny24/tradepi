import { createClient } from '@/lib/supabase'
import { Database, Table as TableIcon, BarChart3 } from 'lucide-react'
import CSVUploader from '@/components/dashboard/CSVUploader'

export default async function DataManagerPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: charts } = await supabase
    .from('charts')
    .select('*, data_entries(count)')
    .eq('user_id', user?.id)

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-black text-slate-900">Data Manager</h1>
        <p className="text-slate-500 mt-2">Grafik verilerini toplu olarak yönet ve güncelle.</p>
      </div>

      <div className="grid gap-6">
        {charts?.map(chart => (
          <div key={chart.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <TableIcon size={28} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg">{chart.title || 'Adsız Veri Seti'}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {chart.data_entries[0]?.count || 0} Satır Veri İşlendi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <CSVUploader chartId={chart.id} />
              <div className="h-10 w-[1px] bg-slate-100 hidden md:block" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-300 uppercase">Durum</span>
                <span className="text-emerald-500 font-bold text-sm flex items-center gap-1">
                  <CheckCircle2 size={14} /> Aktif
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
