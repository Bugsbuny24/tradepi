import React from 'react'
import { 
  BarChart3, Zap, Share2, Terminal, ShieldCheck, 
  ArrowRight, Globe, Code2, CheckCircle2 
} from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600">
      
      {/* 1. HERO SECTION: İlk İzlenim */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black tracking-widest uppercase mb-8 animate-fade-in">
            <Zap size={14} /> B2B Veri Görselleştirme Platformu
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9]">
            Verilerini <span className="text-blue-600 italic">Canlandır.</span> <br />
            Her Yere <span className="underline decoration-blue-200">Mühürle.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium mb-10 leading-relaxed">
            SnapLogic ile ham verilerini profesyonel grafiklere dönüştür, API ile besle ve dilediğin platforma saniyeler içinde göm.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/auth" className="w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Hemen Başla <ArrowRight size={20} />
            </Link>
            <Link href="#features" className="w-full md:w-auto bg-white border border-slate-200 text-slate-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all">
              Özellikleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURES: "Bok Yenecek" Özellikler */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Share2 size={28} />
              </div>
              <h3 className="text-xl font-black mb-3">Sınırsız Embed</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Grafiklerini WordPress, Webflow veya özel yazılımlarına tek tıkla göm.</p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-purple-200 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Code2 size={28} />
              </div>
              <h3 className="text-xl font-black mb-3">Powerful API</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Verilerini manuel girmeyi bırak. API anahtarlarınla otomasyonu başlat.</p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-amber-200 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Terminal size={28} />
              </div>
              <h3 className="text-xl font-black mb-3">Snap Scripts</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Verilerini render etmeden önce JS motorumuzla gerçek zamanlı işle.</p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-black mb-3">Global Analytics</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Kim, nereden, ne zaman izledi? Tüm döküm anlık olarak dashboard'unda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRICING: Kredi Paketleri (Satış Noktası) */}
      <section className="py-24 bg-slate-900 rounded-[4rem] mx-4 my-10 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Ödediğin Kadar Kullan</h2>
            <p className="text-slate-400 font-medium">Aylık abonelik stresi yok. İhtiyacın kadar kredi al, dilediğin zaman kullan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Starter', price: '₺0', credits: '100', features: ['5 Grafik', 'Temel Analitik', 'Watermark'] },
              { title: 'Professional', price: '₺249', credits: '5,000', features: ['Sınırsız Grafik', 'Gelişmiş API', 'Snap Scripts', 'No Watermark'] },
              { title: 'Enterprise', price: '₺899', credits: '25,000', features: ['Öncelikli Destek', 'Özel Domain Lock', 'Full Analitik', 'API Rate Limit+'] },
            ].map((plan, i) => (
              <div key={i} className={`p-10 rounded-[3rem] border ${i === 1 ? 'bg-white text-slate-900 border-white' : 'bg-slate-800/50 border-slate-700'} flex flex-col`}>
                <h4 className="text-xl font-black mb-2">{plan.title}</h4>
                <div className="text-4xl font-black mb-8">{plan.price} <span className="text-sm font-normal opacity-50">/ paket</span></div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-bold">
                      <CheckCircle2 size={18} className={i === 1 ? 'text-blue-600' : 'text-slate-500'} /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth" className={`w-full py-4 rounded-2xl font-black text-center transition-all ${i === 1 ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white text-slate-900'}`}>
                  Satın Al
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
// app/page.tsx içine ekle:
export const metadata = {
  title: 'SnapLogic.io | Verilerini Canlandır, Her Yere Mühürle',
  description: 'SnapLogic ile ham verilerini saniyeler içinde profesyonel grafiklere dönüştür. B2B ticaretin görsel gücünü keşfet.',
}

      {/* 4. FOOTER */}
      <footer className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-black italic tracking-tighter text-blue-600">SnapLogic.io</h2>
            <p className="text-slate-400 text-sm font-medium">© 2026 Tüm Hakları Mühürlenmiştir kanka.</p>
          </div>
          <div className="flex gap-8 text-sm font-black text-slate-600 uppercase tracking-widest">
            <Link href="/docs" className="hover:text-blue-600 transition-colors">Dökümanlar</Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Gizlilik</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">İletişim</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
