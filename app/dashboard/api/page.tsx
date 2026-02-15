import { createClient } from '@/lib/supabase'
import { Key, Copy, Plus } from 'lucide-react'

export default async function ApiPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: tokens } = await supabase.from('chart_tokens').select('*').eq('user_id', user?.id)

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black">API Keys</h1>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
          <Plus size={20} /> New API Key
        </button>
      </div>
      
      <div className="bg-white border rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b"><tr className="text-slate-400 text-sm">
            <th className="p-6">KEY NAME</th><th className="p-6">PREFIX</th><th className="p-6">STATUS</th>
          </tr></thead>
          <tbody>
            {tokens?.length === 0 ? (
              <tr><td colSpan={3} className="p-20 text-center text-slate-400">Henüz bir API anahtarı üretilmemiş.</td></tr>
            ) : (
              tokens?.map(t => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-6 font-bold">{t.scope}</td>
                  <td className="p-6 font-mono">{t.token_prefix}...</td>
                  <td className="p-6"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
