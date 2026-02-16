export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { ShoppingBag, Star, Layout, ArrowRight } from 'lucide-react'

export default async function MarketplacePage() {
  const supabase = createClient()
  
  // Öne çıkan paketlerin veya araçların çekilmesi
  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)

  return (
    <div className="p-8 md:p-12 bg-[#f8fafc] min-h-screen">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Çözüm Mağazası</h1>
        <p className="text-slate-500 mt-2">İş akışınızı hızlandıracak hazır veri görselleştirme şablonlarını inceleyin.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages?.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-300">
              <Layout size={48} />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                  {item.code}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                Bu paket, yüksek hacimli veri girişlerini profesyonel grafiklere dönüştürmek için optimize edilmiştir.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xl font-bold text-slate-900">{item.price_try} TL</span>
                <button className="flex items-center gap-2 text-sm font-semibold text-blue-700 group-hover:gap-3 transition-all">
                  İncele <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

