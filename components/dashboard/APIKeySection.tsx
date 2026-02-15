'use client'
import { useState } from 'react'
import { Key, Copy, RefreshCcw, Check, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function APIKeySection({ initialKey }: { initialKey: string }) {
  const [apiKey, setApiKey] = useState(initialKey || 'Henüz anahtar oluşturulmadı')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  const generateKey = async () => {
    setLoading(true)
    const newKey = `sl_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('profiles')
      .update({ api_key: newKey })
      .eq('id', user?.id)

    if (!error) {
      setApiKey(newKey)
    } else {
      alert('Anahtar güncellenirken hata oluştu!')
    }
    setLoading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl">
            <Key size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 italic">API Secret Key</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Geliştirici Erişimi</p>
          </div>
        </div>
        <button 
          onClick={generateKey}
          disabled={loading}
          className="p-3 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
          title="Anahtarı Yenile"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="relative group">
        <div className="w-full bg-slate-900 text-slate-300 p-5 rounded-[1.5rem] font-mono text-sm break-all border-2 border-transparent group-hover:border-purple-500/50 transition-all">
          {apiKey}
        </div>
        <button 
          onClick={copyToClipboard}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-all"
        >
          {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
        <ShieldAlert className="text-amber-600 shrink-0" size={20} />
        <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase">
          BU ANAHTARI KİMSEMLE PAYLAŞMA KANKA. BU ANAHTARLA VERİLERİNE DIŞARIDAN ERİŞİLEBİLİR.
        </p>
      </div>
    </div>
  )
}
