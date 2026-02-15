'use client'
import React, { useState } from 'react'
import { 
  Code2, Copy, Check, Globe, 
  Terminal, ShieldCheck, ExternalLink, Zap // ShieldLock -> ShieldCheck yapıldı
} from 'lucide-react'

export default function ApiEmbedPage({ searchParams }: { searchParams: { id?: string } }) {
  const [copied, setCopied] = useState<string | null>(null)
  const chartId = searchParams.id || 'CHART_ID_SECILMEDI'
  
  // Embed Kodu ve Linkleri
  const embedUrl = `https://snaplogic.io/embed/${chartId}`
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="400" frameborder="0"></iframe>`
  const apiKey = `sl_live_7492${Math.random().toString(36).substring(7)}`

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto py-12 space-y-12 px-6">
      
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">API & Dağıtım</h2>
        <p className="text-slate-500 font-medium italic uppercase text-[10px] tracking-[0.2em]">Grafiklerini Dünyaya Mühürle</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. Embed Bölümü (Iframe) */}
        <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 space-y-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 text-blue-600">
             <Globe size={24} />
             <h3 className="font-black text-xl italic text-slate-900">Web Sitesine Göm</h3>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Bu kodu kopyalayıp web sitendeki herhangi bir HTML alanına yapıştır kanka. Grafik anında orada mühürlenir.
          </p>
          
          <div className="relative group">
            <pre className="bg-slate-900 text-blue-400 p-6 rounded-3xl text-[11px] font-mono overflow-x-auto border-4 border-slate-800">
              {iframeCode}
            </pre>
            <button 
              onClick={() => copyToClipboard(iframeCode, 'embed')}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-xl text-white transition-all"
            >
              {copied === 'embed' ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* 2. API Anahtarı Bölümü */}
        <div className="bg-slate-900 rounded-[3rem] p-10 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 text-blue-500">
             <ShieldCheck size={24} /> {/* ShieldLock -> ShieldCheck yapıldı */}
             <h3 className="font-black text-xl italic text-white">Snap-API Access</h3>
          </div>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Dış servislerden veri basmak veya grafiğini otomatik güncellemek için bu anahtarı kullan.
          </p>
          
          <div className="relative">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl font-mono text-blue-300 text-sm blur-[2px] hover:blur-0 transition-all cursor-pointer">
              {apiKey}
            </div>
            <button 
              onClick={() => copyToClipboard(apiKey, 'api')}
              className="absolute top-1/2 -translate-y-1/2 right-6 text-white/40 hover:text-white"
            >
              {copied === 'api' ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <Zap size={12} fill="currentColor" /> Sadece sana özel, kimseyle paylaşma kanka!
          </div>
        </div>

      </div>

      {/* 3. Dokümantasyon ve Quick Help */}
      <div className="bg-blue-50 border border-blue-100 rounded-[3rem] p-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-black italic">
              <Terminal size={20} /> NASIL KULLANILIR?
            </div>
            <ul className="space-y-2 text-sm text-blue-900 font-medium italic">
              <li>• Grafiğin her zaman en güncel veriyi gösterir.</li>
              <li>• Mobil uyumludur (Responsive), her cihazda pırlanta gibi durur.</li>
              <li>• Herhangi bir platform (WordPress, Webflow, Custom HTML) desteklenir.</li>
            </ul>
          </div>
          <button className="bg-blue-600 text-white px-8 py-5 rounded-[2rem] font-black text-xs flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl">
             DOKÜMANTASYONU İNCELE <ExternalLink size={16} />
          </button>
        </div>
      </div>

    </div>
  )
}
