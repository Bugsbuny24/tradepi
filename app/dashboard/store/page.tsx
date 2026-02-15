import { createClient } from '@/lib/supabase'
import { ShoppingCart, Check, Zap, Shield, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default async function StorePage() {
  const supabase = createClient()
  
  // Aktif paketleri çekiyoruz
  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('price_try', { ascending: true })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight italic">
          Kredi Paketleri
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
          Verilerini görselleştirmeye devam etmek için ihtiyacına en uygun paketi seç.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages?.map((pkg) => (
          <div key={pkg.id} className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 shadow-xl hover:border-blue-500 transition-all flex flex-col relative group">
            {pkg.code === 'PRO' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                En Popüler
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-2xl font-black text-slate-900">{pkg.title}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">₺{pkg.price_try}</span>
                <span className="text-slate-400 font-bold text-sm">/ tek seferlik</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {Object.entries(pkg.grants || {}).map(([key, value]) => (
                <li key={key} className="flex items-center gap-3 text-slate-600 font-medium">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <Check size={14} strokeWidth={4} />
                  </div>
                  <span>{value as string} {key.replace('_', ' ')}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/dashboard/checkout/${pkg.code}`}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-center group-hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Şimdi Satın Al
            </Link>
          </div>
        ))}
      </div>

      {/* Güven Veren İkonlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t">
        <div className="flex items-center gap-4 text-slate-400">
          <Shield size={24} />
          <span className="text-xs font-bold uppercase tracking-wider">256-Bit SSL Güvenli Ödeme</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <Zap size={24} />
          <span className="text-xs font-bold uppercase tracking-wider">Anında Kredi Tanımlama</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <CreditCard size={24} />
          <span className="text-xs font-bold uppercase tracking-wider">Tüm Kartlara Taksit İmkanı</span>
        </div>
      </div>
    </div>
  )
}
