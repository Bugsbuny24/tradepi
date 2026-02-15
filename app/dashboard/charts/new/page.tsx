'use client'
import React, { useState } from 'react'
import { 
  BarChart3, LineChart, PieChart, AreaChart, 
  ArrowRight, Check, Upload, Database, Settings2 
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const chartTypes = [
  { id: 'bar', name: 'Sütun Grafiği', icon: BarChart3, desc: 'Kategorik karşılaştırmalar için ideal.' },
  { id: 'line', name: 'Çizgi Grafiği', icon: LineChart, desc: 'Zaman içindeki değişimleri izlemek için.' },
  { id: 'area', name: 'Alan Grafiği', icon: AreaChart, desc: 'Hacimsel verileri vurgulamak için.' },
  { id: 'pie', name: 'Pasta Grafiği', icon: PieChart, desc: 'Yüzdesel dağılımları göstermek için.' },
]

export default function NewChartPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'bar',
  })

  const handleCreate = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('charts')
      .insert([
        { 
          title: formData.title || 'Adsız Grafik', 
          chart_type: formData.type,
          user_id: user?.id,
          config: {} // Varsayılan boş config
        }
      ])
      .select()

    if (error) {
      alert('Hata oluştu kanka: ' + error.message)
      setLoading(false)
    } else {
      // Grafik oluştu, şimdi veri yükleme ekranına (Data Manager) yönlendir
      router.push(`/dashboard/data?new=${data[0].id}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all ${step >= i ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}>
              {step > i ? <Check size={18} /> : i}
            </div>
            {i === 1 && <div className={`w-20 h-1 rounded-full ${step > 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Başlık ve Tip */}
      {step === 1 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Grafiğini Tanımla</h2>
            <p className="text-slate-500 font-medium">Önce grafiğine bir isim ver ve görselleştirme tipini seç kanka.</p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Grafik Başlığı</label>
              <input 
                type="text"
                placeholder="Örn: 2026 Satış Analizi"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[1.5rem] p-5 text-xl font-bold transition-all outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Görselleştirme Tipi</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chartTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFormData({...formData, type: t.id})}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-center gap-5 ${formData.type === t.id ? 'border-blue-600 bg-blue-50/50 shadow-inner' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                  >
                    <div className={`p-4 rounded-2xl ${formData.type === t.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <t.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 leading-none mb-1">{t.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!formData.title}
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            >
              SONRAKİ ADIM <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Onay ve Oluşturma */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center">
          <div className="bg-blue-600 w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl">
            <Settings2 size={48} className="animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Mühürlemeye Hazırız!</h2>
            <p className="text-slate-500 font-medium">"{formData.title}" isimli {formData.type} grafiğini sisteme kaydediyoruz.</p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm max-w-md mx-auto">
            <p className="text-sm text-slate-400 font-medium mb-8">
              Oluşturduktan sonra veri yönetim paneline yönlendirileceksin, orada CSV yükleyerek grafiğini canlandırabilirsin.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleCreate}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl"
              >
                {loading ? 'MÜHÜRLENİYOR...' : 'GRAFİĞİ OLUŞTUR'}
              </button>
              <button 
                onClick={() => setStep(1)}
                className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
              >
                Geri Dön ve Düzenle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
