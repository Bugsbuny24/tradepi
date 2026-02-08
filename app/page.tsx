import Link from "next/link";
import { BarChart3, ShieldCheck, Zap, Globe, Cpu, CreditCard, Layers, MousePointer2 } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* 1. HERO: ANA GİRİŞ */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 space-y-6 max-w-5xl">
          <h1 className="text-6xl md:text-[100px] font-black italic tracking-tighter uppercase leading-[0.85]">
            VERİYİ <span className="text-yellow-500">ATEŞLE</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium">
            SnapLogic, karmaşık verilerinizi Pi Network gücüyle fütüristik grafiklere ve canlı widgetlara dönüştürür.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
            <Link href="/auth/register" className="w-full sm:w-auto px-12 py-5 bg-yellow-500 text-black font-black uppercase text-xs rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-yellow-500/20">
              ÜCRETSİZ BAŞLA
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto px-12 py-5 border border-white/10 text-white font-black uppercase text-xs rounded-2xl transition-all hover:bg-white/5">
              GİRİŞ YAP
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MODÜLLER: NELER YAPABİLİRSİN? */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-yellow-500">EKOSİSTEM MODÜLLERİ</h2>
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em] mt-2">Uçtan uca veri analitiği çözümleri</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Modül 1: Designer */}
          <div className="p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all group">
            <MousePointer2 className="text-yellow-500 mb-6" size={32} />
            <h3 className="text-xl font-black italic uppercase">Snap-Designer</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Kod yazmadan, sadece sürükleyip bırakarak profesyonel grafikler oluşturun. Excel ve CSV desteğiyle verinizi saniyeler içinde görselleştirin.
            </p>
          </div>

          {/* Modül 2: Pi-Pay */}
          <div className="p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all group">
            <CreditCard className="text-yellow-500 mb-6" size={32} />
            <h3 className="text-xl font-black italic uppercase">Pi-Pay Billing</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Kredi ve kota işlemlerinizi doğrudan Pi Browser üzerinden gerçekleştirin. Blokzincir onaylı güvenli ödeme sistemi.
            </p>
          </div>

          {/* Modül 3: SnapScript */}
          <div className="p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all group">
            <Cpu className="text-yellow-500 mb-6" size={32} />
            <h3 className="text-xl font-black italic uppercase">SnapScript v0</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Kendi geliştirdiğimiz reaktif dil ile veriler arası matematiksel bağıntılar kurun. Akıllı veriler, akıllı grafikler.
            </p>
          </div>

          {/* Modül 4: API & Embed */}
          <div className="p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all group">
            <Globe className="text-yellow-500 mb-6" size={32} />
            <h3 className="text-xl font-black italic uppercase">Global Embed</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Oluşturduğunuz grafikleri Iframe veya Script etiketiyle istediğiniz web sitesine, bloga veya Pi uygulamasına gömün.
            </p>
          </div>

          {/* Modül 5: Kota Yönetimi */}
          <div className="p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all group">
            <Layers className="text-yellow-500 mb-6" size={32} />
            <h3 className="text-xl font-black italic uppercase">Usage Analytics</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Grafiklerinizin kaç kez izlendiğini, hangi bölgelerden trafik aldığını ve kota kullanımınızı canlı olarak takip edin.
            </p>
          </div>

          {/* Modül 6: White Label */}
          <div className="p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all group">
            <ShieldCheck className="text-yellow-500 mb-6" size={32} />
            <h3 className="text-xl font-black italic uppercase">Snap-Secure</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Verileriniz Supabase ve RLS koruması altında. Grafiklerinize kimlerin erişebileceğini token bazlı sistemle siz belirleyin.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-white/5">
        <div className="text-[10px] text-gray-700 uppercase tracking-[0.5em] font-bold">
          SnapLogic v1.0 • Bursa, Türkiye • Pi Network Utility
        </div>
      </footer>

    </main>
  );
}
