import { createClient } from '@/lib/supabase'
import { Database, Table as TableIcon, CheckCircle2 } from 'lucide-react'
import CSVUploader from '@/components/dashboard/CSVUploader'

export default async function DataManagerPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Kullanıcının grafiklerini ve içindeki veri sayısını çekiyoruz
  const { data: charts } = await supabase
    .from('charts')
    .select('*, data_entries(count)')
    .eq('user_id', user?.id)

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Data Manager</h1>
          <p className="text-slate-500 font-medium mt-1">Veri setlerini yönet ve toplu yüklemeleri mühürle.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {(!charts || charts.length === 0) ? (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
            <Database className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold text-lg">Henüz bir veri kaynağı oluşturulmamış kanka.</p>
          </div>
        ) : (
          charts.map(chart => (
            <div key={chart.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 transition-hover hover:shadow-md">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600">
                  <TableIcon size={32} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xl leading-none mb-2">
                    {chart.title || 'Adsız Veri Seti'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-white bg-slate-900 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                      {chart.chart_type}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {chart.data_entries?.[0]?.count || 0} Satır Veri
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                {/* CSV Yükleme Bileşeni */}
                <div className="w-full md:w-auto">
                  <CSVUploader chartId={chart.id} />
                </div>

                <div className="h-10 w-[1px] bg-slate-100 hidden md:block" />

                <div className="flex flex-col items-center md:items-end">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sistem Durumu</span>
                  <span className="text-emerald-500 font-bold text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={16} strokeWidth={3} /> Aktif
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Veri Kotası Bilgilendirme */}
      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
        <div className="bg-blue-600 text-white p-3 rounded-2xl">
          <Database size={20} />
        </div>
        <div>
          <h4 className="font-black text-slate-900 text-sm">B2B Veri Depolama</h4>
          <p className="text-xs text-slate-500 font-medium">
            Veri setlerin SnapLogic Cloud üzerinde 256-bit şifreleme ile mühürlenmiştir.
          </p>
        </div>
      </div>
    </div>
  )
}
