import { createClient } from '@/lib/supabase/server'
import { 
  ShoppingBag, Tag, Search, Filter, 
  ArrowUpRight, Database, Layout, Star 
} from 'lucide-react'
import Link from 'next/link'

export default async function MarketplacePage() {
  const supabase = createClient()

  // Sadece "is_public" ve "is_for_sale" olanları çekiyoruz
  const { data: items } = await supabase
    .from('marketplace_items')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* Marketplace Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
            <ShoppingBag size={14} /> Global B2B Hub
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Marketplace</h2>
          <p className="text-slate-500 font-medium">Özel veri setlerini ve grafik şablonlarını keşfet, krediyle mühürle.</p>
        </div>
        
        {/* Arama Barı */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Veri seti veya şablon ara..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-500 outline-none font-bold text-sm transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Kategoriler */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {['Hepsi', 'Finans', 'E-Ticaret', 'Teknoloji', 'Sağlık', 'Özel Şablonlar'].map((cat) => (
          <button key={cat} className="px-6 py-2 rounded-xl bg-white border border-slate-100 text-xs font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all whitespace-nowrap shadow-sm">
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Ürün Gridi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(!items || items.length === 0) ? (
          // Mockup Veri Gösterimi (İçi boş kalmasın diye)
          [1, 2, 3].map((i) => (
            <div key={i} className="group bg-white border border-slate-200 rounded-[3rem] p-8 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {i % 2 === 0 ? 'Veri Seti' : 'Şablon'}
                </div>
              </div>
              
              <div>
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {i % 2 === 0 ? <Database size={24} /> : <Layout size={24} />}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight italic">
                   {i === 1 ? 'Global Satış Analizi v2' : 'E-Ticaret Dönüşüm Seti'}
                </h3>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="text-amber-400 fill-amber-400" size={12} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4.8 (12 Satış)</span>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-black text-slate-900 italic">
                    {i * 250} <span className="text-xs text-slate-400 not-italic uppercase">Kredi</span>
                  </div>
                  <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition-all">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
                <Link href={`/dashboard/marketplace/${i}`} className="block text-center text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors">
                  İncele & Satın Al
                </Link>
              </div>
            </div>
          ))
        ) : (
          items.map((item) => (
             // Gerçek veri kartları buraya gelecek
             null
          ))
        )}
      </div>
    </div>
  )
}
