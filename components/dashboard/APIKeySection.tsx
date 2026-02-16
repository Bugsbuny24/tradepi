'use client'

import { useState } from 'react'
import { Key, Copy, Trash2, Plus, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { createApiKeyAction, revokeApiKey } from '@/app/actions/api-keys'
import { toast } from 'sonner'

export default function APIKeySection({ initialKeys }: { initialKeys: any[] }) {
  const [newKeyName, setNewKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!newKeyName) return toast.error('Lütfen bir isim verin (örn: Üretim API)')
    
    const res = await createApiKeyAction(newKeyName)
    if (res.success && res.fullKey) {
      setGeneratedKey(res.fullKey)
      setNewKeyName('')
      toast.success('API Anahtarı başarıyla oluşturuldu!')
    }
  }

  return (
    <div className="space-y-8">
      {/* Yeni Anahtar Oluşturma */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Key className="text-blue-600" size={20} /> Yeni API Anahtarı
        </h3>
        <p className="text-sm text-slate-500 mb-6">Uygulamalarınızı SnapLogic altyapısına bağlamak için anahtar oluşturun.</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Anahtar İsmi (örn: Mobil Uygulama)" 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <button 
            onClick={handleCreate}
            className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Anahtar Oluştur
          </button>
        </div>

        {/* Yeni Oluşturulan Anahtar (GÜVENLİK UYARISI) */}
        {generatedKey && (
          <div className="mt-6 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-800 font-bold mb-2">
              <ShieldCheck size={18} /> Lütfen bu anahtarı kaydedin!
            </div>
            <p className="text-xs text-amber-700 mb-4">Güvenliğiniz için bu anahtarı bir daha göstermeyeceğiz.</p>
            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-amber-200">
              <code className="flex-1 text-xs font-mono break-all">{generatedKey}</code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedKey)
                  toast.success('Kopyalandı!')
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                <Copy size={16} className="text-slate-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mevcut Anahtarlar */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="p-6">İsim</th>
              <th className="p-6">Anahtar</th>
              <th className="p-6">Oluşturulma</th>
              <th className="p-6">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {initialKeys.map((key) => (
              <tr key={key.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6 text-sm font-bold text-slate-700">{key.name}</td>
                <td className="p-6">
                  <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">
                    {key.token_prefix}••••••••••••••••
                  </code>
                </td>
                <td className="p-6 text-xs text-slate-400">
                  {new Date(key.created_at).toLocaleDateString('tr-TR')}
                </td>
                <td className="p-6">
                  <button 
                    onClick={() => revokeApiKey(key.id)}
                    className="text-slate-300 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
