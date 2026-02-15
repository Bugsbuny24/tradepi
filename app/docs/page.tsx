import React from 'react'
import { 
  Book, Code, Zap, Share2, Terminal, 
  ChevronRight, Copy, Info, AlertTriangle 
} from 'lucide-react'
import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Üst Navigasyon - Basit ve Net */}
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-blue-600 italic">SnapLogic.io</Link>
          <Link href="/dashboard" className="text-sm font-bold text-slate-600 hover:text-blue-600">Dashboard'a Dön</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Sol Menü: Navigasyon */}
        <aside className="lg:col-span-1 space-y-8">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Başlangıç</h4>
            <ul className="space-y-2 text-sm font-bold text-slate-600">
              <li className="text-blue-600 flex items-center gap-2"><ChevronRight size={14} /> Giriş</li>
              <li className="hover:text-blue-600 cursor-pointer flex items-center gap-2"><ChevronRight size={14} /> Hızlı Kurulum</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Geliştirici Araçları</h4>
            <ul className="space-y-2 text-sm font-bold text-slate-600">
              <li className="hover:text-blue-600 cursor-pointer flex items-center gap-2"><ChevronRight size={14} /> API Reference</li>
              <li className="hover:text-blue-600 cursor-pointer flex items-center gap-2"><ChevronRight size={14} /> Snap Scripts</li>
              <li className="hover:text-blue-600 cursor-pointer flex items-center gap-2"><ChevronRight size={14} /> Embed Options</li>
            </ul>
          </div>
        </aside>

        {/* Sağ İçerik: Ana Döküman */}
        <main className="lg:col-span-3 space-y-16">
          
          {/* 1. Bölüm: API Reference */}
          <section id="api" className="space-y-6">
            <div className="flex items-center gap-3 text-purple-600">
              <Zap size={32} />
              <h2 className="text-4xl font-black tracking-tight">API Reference</h2>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed">
              SnapLogic API'si, grafik verilerini harici sistemlerden (ERP, CRM, E-ticaret) otomatik olarak güncellemenizi sağlar.
            </p>
            
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative group">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                <span className="text-emerald-400 font-bold">POST /api/v1/update-data</span>
                <Copy size={18} className="text-slate-500 cursor-pointer hover:text-white" />
              </div>
              <pre className="text-sm font-mono leading-6 overflow-x-auto">
{`{
  "api_key": "YOUR_SNAP_KEY",
  "chart_id": "CHART_UUID",
  "data": [
    { "label": "Ocak", "value": 4500 },
    { "label": "Şubat", "value": 5200 }
  ]
}`}
              </pre>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 2. Bölüm: Snap Scripts */}
          <section id="scripts" className="space-y-6">
            <div className="flex items-center gap-3 text-amber-500">
              <Terminal size={32} />
              <h2 className="text-4xl font-black tracking-tight">Snap Scripts Logic</h2>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed">
              Verilerinizi render etmeden önce manipüle etmek için JavaScript tabanlı motorumuzu kullanın. 
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <h4 className="font-black text-blue-900 mb-2 italic">Örnek: Kur Çevirici</h4>
                <code className="text-xs text-blue-700 block bg-white p-4 rounded-xl shadow-sm">
                  data = data.map(i =&gt; ({`{ ...i, value: i.value * 31.45 }`}));
                </code>
              </div>
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                <h4 className="font-black text-emerald-900 mb-2 italic">Örnek: Vergi Hesaplama</h4>
                <code className="text-xs text-emerald-700 block bg-white p-4 rounded-xl shadow-sm">
                  data = data.map(i =&gt; ({`{ ...i, value: i.value * 1.20 }`}));
                </code>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 3. Bölüm: Embedding */}
          <section id="embed" className="space-y-6">
            <div className="flex items-center gap-3 text-blue-600">
              <Share2 size={32} />
              <h2 className="text-4xl font-black tracking-tight">Embedding Guide</h2>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed">
              Grafiklerinizi herhangi bir siteye gömmek için Iframe parametrelerini özelleştirebilirsiniz.
            </p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs font-black uppercase text-slate-400 italic">
                  <th className="py-4">Parametre</th>
                  <th className="py-4">Açıklama</th>
                  <th className="py-4">Varsayılan</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-slate-600">
                <tr className="border-b"><td className="py-4 text-blue-600">theme</td><td className="py-4">dark / light</td><td className="py-4 italic">light</td></tr>
                <tr className="border-b"><td className="py-4 text-blue-600">animate</td><td className="py-4">true / false</td><td className="py-4 italic">true</td></tr>
                <tr className="border-b"><td className="py-4 text-blue-600">refresh</td><td className="py-4">Saniye cinsinden auto-refresh</td><td className="py-4 italic">null</td></tr>
              </tbody>
            </table>
          </section>

          {/* Uyarı Kutusu */}
          <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[2.5rem] flex items-start gap-4">
            <AlertTriangle className="text-red-500 shrink-0" size={24} />
            <div>
              <h4 className="font-black text-red-900 uppercase tracking-widest text-xs mb-2">Güvenlik Uyarısı</h4>
              <p className="text-red-700 text-sm font-medium">
                API anahtarınızı (Secret Key) asla istemci taraflı (Client-Side) kodlarda kullanmayın. Tüm API çağrılarını sunucu tarafında (Server-Side) mühürleyin.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
