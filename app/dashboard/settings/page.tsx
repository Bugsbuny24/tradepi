import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, Shield, Bell, Trash2 } from 'lucide-react'
import APIKeySection from '@/components/dashboard/APIKeySection'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  // 1. Profil bilgilerini çek
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 2. API Anahtarlarını 'chart_tokens' tablosundan çek (Çoğul liste)
  const { data: apiKeys } = await supabase
    .from('chart_tokens')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hesap Ayarları</h1>
        <p className="text-slate-500 mt-2 font-medium">Profilinizi ve geliştirici erişimlerini yönetin.</p>
      </header>

      <div className="grid grid-cols-1 gap-12">
        
        {/* PROFİL BÖLÜMÜ */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Kişisel Bilgiler</h3>
              <p className="text-xs text-slate-400 font-medium">Görünür isminiz ve e-posta adresiniz.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tam İsim</label>
              <input 
                type="text" 
                defaultValue={profile?.full_name || ''} 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-Posta</label>
              <input 
                type="email" 
                disabled 
                value={user.email} 
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-500 cursor-not-allowed font-medium"
              />
            </div>
          </div>
        </div>

        {/* API ANAHTARLARI (Geliştirici Portalı) */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 ml-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Geliştirici Erişimi</h3>
              <p className="text-xs text-slate-400 font-medium">API üzerinden verilerinize erişim anahtarları.</p>
            </div>
          </div>
          
          {/* ✅ TYPESCRIPT FIX: initialKeys (çoğul) ve apiKeys listesini gönderiyoruz */}
          <APIKeySection initialKeys={apiKeys || []} />
        </div>

        {/* TEHLİKELİ BÖLGE */}
        <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-red-900">Hesabı Kapat</h3>
              <p className="text-xs text-red-400 font-medium">Bu işlem geri alınamaz ve tüm verileriniz silinir.</p>
            </div>
          </div>
          <button className="bg-white text-red-600 border border-red-200 px-6 py-3 rounded-2xl text-xs font-black hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest shadow-sm">
            Hesabımı Kalıcı Olarak Sil
          </button>
        </div>

      </div>
    </div>
  )
}
