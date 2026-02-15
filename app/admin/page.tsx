import { createClient } from '@/lib/supabase/server'
import { 
  Users, ShoppingBag, Activity, ShieldCheck, 
  ArrowUpRight, CreditCard, BarChart, Globe 
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createClient()

  // Sistem Geneli Verileri Çekiyoruz
  const [usersCount, packagesSold, totalViews] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact' }),
    supabase.from('checkout_intents').select('id', { count: 'exact' }).eq('status', 'completed'),
    supabase.from('charts').select('view_count.sum()') // Bu bir RPC veya View gerektirebilir
  ])

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-8 space-y-10">
      
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-2xl">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Admin Protocol</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">SnapLogic System Control</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black border border-emerald-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> SYSTEM LIVE
          </div>
        </div>
      </div>

      {/* Büyük İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <Users className="absolute -right-4 -bottom-4 text-slate-50 opacity-10 group-hover:scale-110 transition-transform" size={120} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toplam Kullanıcı</p>
          <h3 className="text-4xl font-black mt-2">{usersCount.count || 0}</h3>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <ShoppingBag className="absolute -right-4 -bottom-4 text-slate-50 opacity-10 group-hover:scale-110 transition-transform" size={120} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Satış Adedi</p>
          <h3 className="text-4xl font-black mt-2 text-blue-600">{packagesSold.count || 0}</h3>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <Activity className="absolute -right-4 -bottom-4 text-slate-50 opacity-10 group-hover:scale-110 transition-transform" size={120} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem İzlenmesi</p>
          <h3 className="text-4xl font-black mt-2 italic text-purple-600">842K+</h3>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <CreditCard className="absolute -right-4 -bottom-4 text-white opacity-5 group-hover:scale-110 transition-transform" size={120} />
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Net Gelir (Tahmini)</p>
          <h3 className="text-4xl font-black mt-2 text-white italic">₺14.250</h3>
        </div>
      </div>

      {/* Admin Navigasyon ve Detaylı Yönetim */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Hızlı Menü */}
        <div className="lg:col-span-1 space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Yönetim Araçları</h4>
          <div className="bg-white border border-slate-200 rounded-[3rem] p-4 space-y-2">
            {[
              { label: 'Kullanıcıları Yönet', icon: Users, href: '/admin/users' },
              { label: 'Ödeme Bekleyenler', icon: ShoppingBag, href: '/admin/orders' },
              { label: 'Grafik Performansları', icon: BarChart, href: '/admin/charts' },
              { label: 'Marketplace Ayarları', icon: Globe, href: '/admin/marketplace' },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center justify-between p-5 rounded-3xl hover:bg-slate-50 group transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-white transition-colors">
                    <item.icon size={20} className="text-slate-600" />
                  </div>
                  <span className="font-bold text-slate-800">{item.label}</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Son Kayıt Olanlar (Table) */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Son Mühürlenen Kullanıcılar</h4>
          <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Kullanıcı</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Kredi</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Durum</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* Bu kısım map ile dönecek kanka */}
                {[1,2,3,4,5].map((i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-xs">U{i}</div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm italic underline decoration-blue-500/30">user_{i}@tradepi.com</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-slate-600 text-sm italic">{i * 1200} CR</td>
                    <td className="px-8 py-5">
                      <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black">AKTİF</span>
                    </td>
                    <td className="px-8 py-5">
                      <button className="text-slate-300 hover:text-blue-600 transition-colors">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
