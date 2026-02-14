import { createClient } from '@/lib/supabase'
import { Check } from 'lucide-react'
import { createCheckoutIntent } from '@/app/actions/billing'

export default async function PricingPage() {
  const supabase = createClient()
  
  // 1. Aktif paketleri çek
  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('price_try', { ascending: true })

  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Size Uygun Planı Seçin</h1>
        <p className="text-slate-500">İhtiyacınıza göre kredi yükleyin, grafiklerinizi sınırsızca paylaşın.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages?.map((pkg) => (
          <div key={pkg.id} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{pkg.title}</h3>
            <div className="mb-6">
              <span className="text-4xl font-black text-slate-900">₺{pkg.price_try}</span>
              <span className="text-slate-500 text-sm ml-1">/tek seferlik</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {Object.entries(pkg.grants || {}).map(([key, value]: any) => (
                <li key={key} className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check size={12} className="text-green-600" />
                  </div>
                  {value} {key.replace('_', ' ')}
                </li>
              ))}
            </ul>

            <form action={createCheckoutIntent}>
              <input type="hidden" name="package_code" value={pkg.code} />
              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Satın Al
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
