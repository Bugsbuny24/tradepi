import React from 'react'
import { 
  BarChart3, Zap, Share2, Terminal, ShieldCheck, 
  ArrowRight, Globe, Code2, CheckCircle2 
} from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black tracking-widest uppercase mb-8">
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

      {/* 2. FEATURES */}
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

      {/* 3. FOOTER */}
      <footer className="py-20 border-t border-slate-100 text-center">
        <h2 className="text-2xl font-black italic text-blue-600">SnapLogic.io</h2>
        <p className="text-slate-400 text-sm mt-2">© 2026 SnapLogic B2B Engine.</p>
      </footer>
    </div>
  )
}
