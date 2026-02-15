import { createClient } from '@/lib/supabase'
import { ShoppingCart, Check, Zap, Eye, Code2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function StorePage() {
  const supabase = createClient()
  
  // 1. Veritabanından gerçek paketleri çekiyoruz
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('price_try', { ascending: true })

  if (error) {
    return <div className="p-8 text-red-500 font-bold">Paketler yüklenirken hata oluştu kanka!</div>
  }

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Snap-Store</h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Gücü mühürle. Kredi ve izlenme limitlerini ihtiyacına göre belirle, B2B grafik motorunu tam kapasite çalıştır.
        </p>
      </div>

      {/* Paket Izgarası */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages?.map((pkg) => (
          <div 
            key={pkg.id} 
            className="group relative bg-white border-2 border-slate-100 p-8 rounded-[3rem] hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-2xl flex flex-col justify-between"
          >
            {/* Popüler Paket Rozeti (Örneğin 250 TL ve üzeri için) */}
            {pkg.price_try >= 250 && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                EN ÇOK TERCİH EDİLEN
              </div>
            )}

            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-blue-50 transition-colors">
                  <Zap className="text-slate-400 group-hover:text-blue-600" size={24} />
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-black text-slate-900 leading-none">₺{pkg.price_try}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Tek Seferlik</span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-6">{pkg.title}</h3>

              {/* Paket Özellikleri (Grants JSON'ından çekiliyor) */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full"><Check size={12} strokeWidth={4} /></div>
                  <Eye size={16} className="text-slate-400" /> {pkg.grants?.views?.toLocaleString()} Embed İzlenme
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full"><Check size={12} strokeWidth={4} /></div>
                  <Zap size={16} className="text-slate-400" /> {pkg.grants?.credits?.toLocaleString()} API Kredisi
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full"><Check size={12} strokeWidth={4} /></div>
                  <Code2 size={16} className="text-slate-400" /> SnapScript: {pkg.grants?.snapscript === 'full' ? 'Sınırsız Access' : 'Temel Seviye'}
                </li>
              </ul>
            </div>

            {/* Shopier Linki - Gerçek URL'ye Gider */}
            <a 
              href={pkg.shopier_url} 
              target="_blank" 
              className="w-full bg-slate-900 text-white py-4 rounded-[1.5rem] font-black text-center flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-all shadow-lg hover:-translate-y-1"
            >
              SATIN AL <ArrowRight size={18} />
            </a>
          </div>
        ))}
      </div>

      {/* Alt Bilgi */}
      <div className="bg-blue-50 p-8 rounded-[2.5rem] text-center">
        <p className="text-sm font-bold text-blue-900">
          Ödeme yaptıktan sonra kredilerin anında hesabına mühürlenir. Kurumsal fatura taleplerin için destek birimiyle iletişime geç kanka.
        </p>
      </div>
    </div>
  )
}
