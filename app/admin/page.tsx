export const dynamic = 'force-dynamic'
export const revalidate = 0
import { checkAdmin } from '@/lib/admin'
import { getTableData } from '@/app/actions/admin'
import { Database, Users, CreditCard, Layout, Terminal, Activity } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminPage({ searchParams }: { searchParams: { table?: string } }) {
  await checkAdmin()
  
  const currentTable = searchParams.table || 'profiles'
  const data = await getTableData(currentTable)

  const tables = [
    { id: 'profiles', label: 'Kullanıcılar', icon: <Users size={18}/>, cat: 'Core' },
    { id: 'user_quotas', label: 'Kredi/Kota', icon: <CreditCard size={18}/>, cat: 'Billing' },
    { id: 'charts', label: 'Grafikler', icon: <Layout size={18}/>, cat: 'Product' },
    { id: 'chart_scripts', label: 'Scriptler', icon: <Terminal size={18}/>, cat: 'Product' },
    { id: 'usage_logs', label: 'Kullanım Kayıtları', icon: <Activity size={18}/>, cat: 'Analytics' },
    { id: 'checkout_intents', label: 'Ödemeler', icon: <Database size={18}/>, cat: 'Billing' },
    // Diğer tüm tabloları buraya ekleyebilirsin...
  ]

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* SOL MENÜ: TABLOLAR */}
      <aside className="w-64 border-r border-slate-800 p-6 bg-slate-950">
        <h2 className="text-xl font-black italic mb-8 flex items-center gap-2 text-blue-500">
          <Database /> SNAP OPS
        </h2>
        
        <nav className="space-y-1">
          {tables.map(t => (
            <a
              key={t.id}
              href={`/admin?table=${t.id}`}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                currentTable === t.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              {t.icon} {t.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* SAĞ TARAF: VERİ TABLOSU */}
      <main className="flex-1 p-8 overflow-x-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter">{currentTable} Verileri</h1>
          <p className="text-slate-500 font-bold">Toplam {data.length} kayıt listeleniyor.</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                {data[0] && Object.keys(data[0]).map(key => (
                  <th key={key} className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {data.map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-900/30 transition-colors">
                  {Object.values(row).map((val: any, j: number) => (
                    <td key={j} className="p-4 text-sm font-medium text-slate-300 max-w-[200px] truncate">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {data.length === 0 && (
            <div className="p-20 text-center font-bold italic text-slate-600">
              Bu tabloda henüz veri yok patron.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
