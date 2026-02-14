'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createChartAction } from '@/app/actions/charts'
import { BarChart2, LineChart, PieChart, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const CHART_TYPES = [
  { id: 'bar', label: 'Sütun Grafiği', icon: BarChart2, desc: 'Kategorik karşılaştırmalar için idealdir.' },
  { id: 'line', label: 'Çizgi Grafiği', icon: LineChart, desc: 'Zaman içindeki değişimleri gösterir.' },
  { id: 'pie', label: 'Pasta Grafiği', icon: PieChart, desc: 'Yüzdesel dağılımları göstermek için kullanılır.' },
]

export default function CreateChartPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = await createChartAction(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // Başarılıysa düzenleme sayfasına yönlendir
      router.push(`/charts/${result.chartId}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors">
        <ArrowLeft size={20} />
        Dashboard'a Dön
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Yeni Grafik Oluştur</h1>
        <p className="text-slate-500">Görselleştirmek istediğiniz verinin tipini seçerek başlayın.</p>
      </div>

      <form action={handleSubmit} className="space-y-8">
        {/* Başlık Girişi */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-semibold text-slate-700">Grafik Başlığı</ts-label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Örn: 2024 Satış Raporu"
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Tip Seçimi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CHART_TYPES.map((type) => (
            <label key={type.id} className="relative cursor-pointer group">
              <input type="radio" name="chart_type" value={type.id} className="peer sr-only" required />
              <div className="p-6 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-200 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all h-full">
                <type.icon className="text-slate-400 group-hover:text-blue-500 peer-checked:text-blue-600 mb-4" size={32} />
                <h3 className="font-bold text-slate-800">{type.label}</h3>
                <p className="text-xs text-slate-500 mt-2">{type.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Devam Et'}
        </button>
      </form>
    </div>
  )
}
