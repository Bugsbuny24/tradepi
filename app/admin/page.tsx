// 👇 DİKKAT: Burası küçük harfle 'export' olmalı!
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { checkAdmin } from '@/lib/admin'
import { getUsers, addCredits } from '@/app/actions/admin'
import { ShieldCheck, User, Zap } from 'lucide-react'

export default async function AdminPage() {
  // 1. Önce güvenlik kontrolü (Artık hata fırlatacak, yönlendirmeyecek)
  await checkAdmin()
  
  // 2. Kullanıcıları çek
  const users = await getUsers()

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic flex items-center gap-3">
            <ShieldCheck className="text-blue-600" size={40} />
            Yönetim Paneli
          </h1>
          <p className="text-slate-500 font-bold mt-2 ml-1">
            Toplam Kullanıcı: <span className="text-blue-600">{users.length}</span>
          </p>
        </div>
      </div>

      {/* USER LIST */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-6 font-black uppercase text-xs tracking-widest">Kullanıcı</th>
              <th className="p-6 font-black uppercase text-xs tracking-widest">Email</th>
              <th className="p-6 font-black uppercase text-xs tracking-widest">Kredi Durumu</th>
              <th className="p-6 font-black uppercase text-xs tracking-widest text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-blue-50 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">
                      <User size={20} />
                    </div>
                    <span className="font-bold text-slate-700">{user.full_name || 'İsimsiz'}</span>
                  </div>
                </td>
                <td className="p-6 font-mono text-sm text-slate-500">{user.email}</td>
                <td className="p-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg font-black text-xs uppercase">
                    <Zap size={14} fill="currentColor" />
                    {user.user_quotas?.credits_remaining || 0} Kredi
                  </div>
                </td>
                <td className="p-6 text-right">
                  <form action={async () => {
                    'use server'
                    await addCredits(user.id, 100)
                  }}>
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-green-600 transition-colors shadow-lg active:scale-95">
                      +100 Kredi Yükle
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="p-12 text-center text-slate-400 font-bold italic">
            Henüz kimse yok patron.
          </div>
        )}
      </div>
    </div>
  )
}
