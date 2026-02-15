import { createClient } from '@/lib/supabase'
import { Terminal, Code, Save, Zap, Info } from 'lucide-react'
import { saveSnapScript } from '@/app/actions/script-actions'

export default async function ScriptsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: charts } = await supabase.from('charts').select('id, title').eq('user_id', user?.id)
  const { data: existingScripts } = await supabase.from('chart_scripts').select('*')

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
          <Terminal className="text-amber-500" size={36} /> Snap Scripts
        </h1>
        <p className="text-slate-500 mt-2">Ham verilerini grafiklere basmadan önce gerçek zamanlı manipüle et.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Panel: Editör Formu */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-amber-400">
                <Code size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Logic Editor</span>
              </div>
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500" />
                 <div className="w-3 h-3 rounded-full bg-amber-500" />
                 <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
            </div>

            <form action={async (formData) => {
              'use server'
              const chartId = formData.get('chart_id') as string
              const script = formData.get('script_content') as string
              await saveSnapScript(chartId, script)
            }} className="space-y-4">
              <select name="chart_id" className="w-full bg-slate-800 text-slate-200 border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">Hedef Grafiği Seç...</option>
                {charts?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>

              <textarea 
                name="script_content"
                placeholder="// Örn: data.map(item => ({ ...item, value: item.value * 31.45 }))"
                className="w-full h-80 bg-slate-800/50 text-emerald-400 font-mono p-6 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />

              <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
                <Save size={20} /> Script'i Mühürle
              </button>
            </form>
          </div>
        </div>

        {/* Sağ Panel: Dokümantasyon */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 flex items-center gap-2 mb-4">
              <Info className="text-blue-500" size={20} /> Kütüphane
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex flex-col gap-1">
                <code className="text-pink-600 font-bold">data</code>
                <span className="text-slate-500 italic">Giriş yapan ham veri dizisi.</span>
              </li>
              <li className="flex flex-col gap-1">
                <code className="text-pink-600 font-bold">Snap.convert(val, 'USD', 'TRY')</code>
                <span className="text-slate-500 italic">Anlık kur çevirici fonksiyonu.</span>
              </li>
              <li className="flex flex-col gap-1">
                <code className="text-pink-600 font-bold">return data</code>
                <span className="text-slate-500 italic">İşlenmiş veriyi geri döndürmek zorunludur.</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem]">
             <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
                <Zap size={18} /> Pro Tip
             </div>
             <p className="text-xs text-amber-600 leading-relaxed">
                Snap Script'ler grafiğiniz render edilmeden milisaniyeler önce çalışır. Büyük veri setlerinde `map` yerine `reduce` kullanarak performansı artırabilirsin kanka.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
