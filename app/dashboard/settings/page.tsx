import { createClient } from '@/lib/supabase'
import { User, Key, Shield, Trash2, Mail, CreditCard, RefreshCcw } from 'lucide-react'
import LogoutButton from '@/components/dashboard/LogoutButton'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ayarlar</h1>
        <p className="text-slate-500 font-medium">Hesap tercihlerini ve güvenlik ayarlarını yönet.</p>
      </div>

      {/* 1. Profil Bilgileri */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-slate-900 font-black uppercase text-xs tracking-widest">
          <User size={18} className="text-blue-600" /> Profil Bilgileri
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">Tam İsim</label>
            <input 
              disabled 
              value={profile?.full_name || 'Snap User'} 
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">E-Posta Adresi</label>
            <div className="flex items-center bg-slate-50 rounded-2xl p-4 gap-3">
              <Mail size={18} className="text-slate-400" />
              <span className="font-bold text-slate-900">{user?.email}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. API & Güvenlik */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-slate-900 font-black uppercase text-xs tracking-widest">
          <Key size={18} className="text-purple-600" /> API & Güvenlik
        </div>
        
        <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] text-white">
          <div>
            <h4 className="font-bold text-sm">Geliştirici Modu</h4>
            <p className="text-xs text-slate-400 mt-1">API anahtarlarını ve webhook loglarını yönet.</p>
          </div>
          <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-xs font-black transition-all">
            ANAHTARLARI RESETLE
          </button>
        </div>
      </section>

      {/* 3. Tehlikeli Bölge */}
      <section className="bg-red-50/50 p-8 rounded-[2.5rem] border border-red-100 space-y-6">
        <div className="flex items-center gap-3 text-red-600 font-black uppercase text-xs tracking-widest">
          <Shield size={18} /> Tehlikeli Bölge
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <LogoutButton />
          <button className="flex-1 flex items-center justify-center gap-2 p-4 bg-white border border-red-200 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all">
            <Trash2 size={18} /> Hesabı Kalıcı Olarak Sil
          </button>
        </div>
      </section>

      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          SnapLogic v1.0.4-beta • 2026 Global Trade PI Engine
        </p>
      </div>
    </div>
  )
}

