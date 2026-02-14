import Link from 'next/link'
import { 
  BarChart3, 
  Zap, 
  Globe, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      
      {/* 1. NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <BarChart3 size={24} />
          </div>
          <span className="text-xl font-black tracking-tight">SnapLogic<span className="text-blue-600">.io</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Özellikler</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Fiyatlandırma</a>
          <Link href="/login" className="hover:text-blue-600 transition-colors">Giriş Yap</Link>
          <Link href="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all">
            Ücretsiz Başla
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-8 animate-bounce">
            <Zap size={16} /> Veri Görselleştirmede Yeni Nesil
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
            Verilerinizi Dakikalar İçinde <br />
            <span className="text-blue-600 italic">Sanata Dönüştürün.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl mb-10 leading-relaxed">
            Karmaşık verileri profesyonel grafiklere dönüştürün, web sitenize gömün ve kitlenizle paylaşın. TradeVisual ile verileriniz hiç bu kadar şık görünmemişti.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
              Şimdi Ücretsiz Dene <ArrowRight size={20} />
            </Link>
            <Link href="#pricing" className="w-full md:w-auto bg-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all">
              Paketleri İncele
            </Link>
          </div>
        </div>
      </section>

      {/* 3. MOCKUP PREVIEW */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 mb-32">
        <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl shadow-blue-200 border-8 border-slate-800">
           <div className="bg-slate-800 rounded-2xl h-[400px] flex items-center justify-center text-slate-500 font-mono text-sm">
             {/* Buraya Recharts ile yapılmış statik bir grafik gelecek */}
             [Grafik Editörü Önizlemesi]
           </div>
        </div>
      </div>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-4">Neden SnapLogic?</h2>
            <p className="text-slate-500">İhtiyacınız olan tüm araçlar tek bir platformda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 hover:shadow-xl transition-all">
              <div className="bg-blue-100 text-blue-600 w-14 h-14 flex items-center justify-center rounded-2xl mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Süper Hızlı Veri Girişi</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                İster elle girin, ister CSV yükleyin. Verilerinizi saniyeler içinde grafiğe dönüştürün.
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-slate-200 hover:shadow-xl transition-all">
              <div className="bg-purple-100 text-purple-600 w-14 h-14 flex items-center justify-center rounded-2xl mb-6">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Her Yere Gömün</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Oluşturduğunuz grafikleri iframe koduyla istediğiniz web sitesine, bloga veya panele ekleyin.
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl border border-slate-200 hover:shadow-xl transition-all">
              <div className="bg-emerald-100 text-emerald-600 w-14 h-14 flex items-center justify-center rounded-2xl mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Domain Kilidi</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Grafiklerinizin sadece sizin belirlediğiniz domainlerde çalışmasını sağlayarak güvenliğinizi koruyun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-blue-600 rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-blue-300">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Hemen Başlamaya Hazır Mısın?</h2>
            <p className="text-blue-100 mb-10 text-lg">Hemen üye ol ve ilk 10 grafiğini ücretsiz oluştur.</p>
            <Link href="/register" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all">
              Ücretsiz Kayıt Ol
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
             <BarChart3 size={20} />
             <span className="font-bold">SnapLogic.io</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 SnapLogic. Tüm hakları saklıdır.</p>
          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-blue-600">Gizlilik</a>
            <a href="#" className="hover:text-blue-600">Koşullar</a>
            <a href="#" className="hover:text-blue-600">Destek</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
