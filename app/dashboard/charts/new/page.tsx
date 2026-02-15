'use client'
import React, { useState } from 'react'
import { 
  BarChart3, LineChart, PieChart, AreaChart, 
  ArrowRight, Check, Settings2 
} from 'lucide-react'
import { useRouter } from 'next/navigation'
// Importu buraya sabitledik, lib/supabase/client içindeki createClient'ı kullanacak
import { createClient } from '@/lib/supabase/client'

const chartTypes = [
  { id: 'bar', name: 'Sütun Grafiği', icon: BarChart3, desc: 'Kategorik karşılaştırmalar için ideal.' },
  { id: 'line', name: 'Çizgi Grafiği', icon: LineChart, desc: 'Zaman içindeki değişimleri izlemek için.' },
  { id: 'area', name: 'Alan Grafiği', icon: AreaChart, desc: 'Hacimsel verileri vurgulamak için.' },
  { id: 'pie', name: 'Pasta Grafiği', icon: PieChart, desc: 'Yüzdesel dağılımları göstermek için.' },
]

export default function NewChartPage() {
  const router = useRouter()
  const supabase = createClient() // Artık hata vermeyecek kanka
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
          config: {} 
        }
      ])
      .select()

    if (error) {
      alert('Hata: ' + error.message)
      setLoading(false)
    } else {
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

      {step === 1 ? (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Grafiğini Tanımla</h2>
            <p className="text-slate-500 font-medium">Önce grafiğine bir isim ver kanka.</p>
          </div>
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
            <input 
              type="text"
              placeholder="Örn: 2026 Satış Analizi"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[1.5rem] p-5 text-xl font-bold transition-all outline-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chartTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFormData({...formData, type: t.id})}
                  className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-center gap-5 ${formData.type === t.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'}`}
                >
                  <t.icon size={24} className={formData.type === t.id ? 'text-blue-600' : 'text-slate-400'} />
                  <div>
                    <h4 className="font-black text-slate-900">{t.name}</h4>
                    <p className="text-[10px] text-slate-400 uppercase">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setStep(2)}
              disabled={!formData.title}
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black hover:bg-blue-600 transition-all disabled:opacity-50"
            >
              SONRAKİ ADIM
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-8">
          <Settings2 size={64} className="mx-auto text-blue-600 animate-spin-slow" />
          <h2 className="text-4xl font-black text-slate-900 italic">Mühürlemeye Hazırız!</h2>
          <button 
            onClick={handleCreate}
            disabled={loading}
            className="w-full max-w-md bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl hover:bg-slate-900 transition-all"
          >
            {loading ? 'YÜKLENİYOR...' : 'GRAFİĞİ OLUŞTUR'}
          </button>
        </div>
      )}
    </div>
  )
}
