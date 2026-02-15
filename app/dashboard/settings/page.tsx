import { createClient } from '@/lib/supabase'
import { User, Mail, Shield, Trash2, Bell } from 'lucide-react'
import APIKeySection from '@/components/dashboard/APIKeySection'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic text-center md:text-left">
          Hesap Ayarları
        </h2>
        <p className="text-slate-500 font-medium text-center md:text-left mt-1">
          Profilini ve geliştirici tercihlerini buradan mühürle.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Profil Bilgileri */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
              <User size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 italic">Profil Bilgileri</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Tam İsim</label>
              <div className="bg-slate-50 p-4 rounded-2xl font-bold text-slate-800 border border-slate-100">
                {profile?.full_name || 'Snap User'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">E-Posta</label>
              <div className="bg-slate-50 p-4 rounded-2xl font-bold text-slate-800 border border-slate-100 flex items-center gap-2">
                <Mail size={16} className="text-slate-400" /> {user?.email}
              </div>
            </div>
          </div>
        </div>

        {/* API Key Section (Client Component) */}
        <APIKeySection initialKey={profile?.api_key} />

        {/* Tehlikeli Bölge */}
        <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 space-y-6">
          <div className="flex items-center gap-3 text-red-600">
            <Shield size={24} />
            <h3 className="text-xl font-black italic">Tehlikeli Bölge</h3>
          </div>
          <p className="text-sm text-red-700 font-medium">
            Hesabını sildiğinde tüm grafiklerin, verilerin ve aboneliklerin kalıcı olarak yok olur. Bu işlemin geri dönüşü yoktur kanka.
          </p>
          <button className="bg-white border-2 border-red-200 text-red-600 px-8 py-4 rounded-2xl font-black text-xs hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
            <Trash2 size={16} /> HESABI KALICI OLARAK SİL
          </button>
        </div>

      </div>

      <div className="text-center pb-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          SnapLogic.io Engine v1.0.4-Stable
        </p>
      </div>
    </div>
  )
}
