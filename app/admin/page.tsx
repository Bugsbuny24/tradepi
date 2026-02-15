export const dynamic = 'force-dynamic'
export const revalidate = 0

import { checkAdmin } from '@/lib/admin'
import { getTableData } from '@/app/actions/admin'
import { Database, Users, CreditCard, Layout, Terminal, Activity, Search, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPage({ 
  searchParams 
}: { 
  searchParams: { table?: string } 
}) {
  // 1. Patron kontrolü
  await checkAdmin()
  
  // 2. Tabloyu seç veya varsayılan olarak 'profiles' getir
  const currentTable = searchParams.table || 'profiles'
  const data = await getTableData(currentTable)

  // 3. Menüdeki tablo listesi (İhtiyaca göre burayı artırabilirsin)
  const menuItems = [
    { id: 'profiles', label: 'Kullanıcılar', icon: <Users size={18}/> },
    { id: 'user_quotas', label: 'Krediler', icon: <CreditCard size={18}/> },
    { id: 'charts', label: 'Grafikler', icon: <Layout size={18}/> },
    { id: 'chart_scripts', label: 'Scriptler', icon: <Terminal size={18}/> },
    { id: 'usage_logs', label: 'Loglar', icon: <Activity size={18}/> },
    { id: 'checkout_intents', label: 'Ödemeler', icon: <Database size={18}/> },
    { id: 'packages', label: 'Paketler', icon: <Search size={18}/> },
  ]

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      
      {/* SOL MENÜ */}
      <aside className="w-72 border-r border-slate-800 bg-[#020617] p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-black tracking-tighter italic text-white">SNAP OPS</h2>
        </div>
        
        <nav className="space-y-2 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-2">Veritabanı Tabloları</p>
          {menuItems.map(item => (
            <Link
              key={item.id}
              href={`/admin?table=${item.id}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all border ${
                currentTable === item.id 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-900/40' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ANA İÇERİK */}
      <main className="flex-1 p-10 overflow-hidden flex flex-col">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{currentTable}</h1>
            <p className="text-slate-500 font-bold mt-1">Snapshot: {data.length} kayıt bulundu.</p>
          </div>
          <div className="text-xs font-mono text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Live Database Access
          </div>
        </div>

        {/* VERİ TABLOSU */}
        <div className="flex-1 bg-[#020617] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                  {data[0] ? Object.keys(data[0]).map(key => (
                    <th key={key} className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] whitespace-nowrap">
                      {key}
                    </th>
                  )) : <th className="p-5 text-slate-500 font-bold italic">Sütun bulunamadı...</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-blue-500/5 transition-colors group">
                    {Object.values(row).map((val: any, j: number) => (
                      <td key={j} className="p-5 text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors max-w-[250px] truncate">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {data.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-600">
              <Database size={48} className="mb-4 opacity-20" />
              <p className="font-bold italic opacity-50 text-lg">Bu tabloda henüz veri yok patron.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
