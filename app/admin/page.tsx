export const dynamic = 'force-dynamic'
export const revalidate = 0

import { checkAdmin } from '@/lib/admin'
import { getUsers, addCredits } from '@/app/actions/admin'
import { ShieldCheck, User, Zap, AlertTriangle } from 'lucide-react'

export default async function AdminPage() {
  // 🛡️ HATA KAPANI: Bir sorun çıkarsa ekrana basacağız
  try {
    // 1. Güvenlik ve Veri Çekme
    await checkAdmin()
    const users = await getUsers()

    // --- HER ŞEY YOLUNDAYSA BURASI ÇALIŞIR ---
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
                <th className="p-6 font-black uppercase text-xs tracking-widest">Kredi</th>
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
                      {user.user_quotas?.credits_remaining || 0}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <form action={async () => {
                      'use server'
                      await addCredits(user.id, 100)
                    }}>
                      <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-green-600 transition-colors shadow-lg active:scale-95">
                        +100
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

  } catch (error: any) {
    // 🔥 HATA VARSA BURASI ÇALIŞIR
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full border-l-8 border-red-600">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-red-600 shrink-0" size={48} />
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">BİR SORUN VAR PATRON!</h1>
              <div className="p-4 bg-red-100 rounded-xl border border-red-200 text-red-900 font-mono text-sm mb-4 break-all">
                {error.message}
              </div>
              <p className="text-slate-500 text-sm">
                Yukarıdaki hata mesajını bana kopyala veya fotoğrafını at, hemen çözelim.
              </p>
              
              <a href="/dashboard" className="inline-block mt-6 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">
                Dashboard'a Dön
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
