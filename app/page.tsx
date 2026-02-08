import Link from "next/link";
import { BarChart3, ShieldCheck, Zap, Globe, Cpu, CreditCard } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* 1. HERO SECTION: GİRİŞ VE ANA SLOGAN */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Arka Plan Efekti */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 space-y-6 max-w-5xl">
          <div className="inline-block px-4 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
            Pi Network Ekosistemi v1.0
          </div>
          <h1 className="text-7xl md:text-[120px] font-black italic tracking-tighter uppercase leading-[0.85]">
            Snap<span className="text-yellow-500">Logic</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
            Verilerinizi blokzincir gücüyle fütüristik grafiklere dönüştüren, 
            dünyanın ilk Pi-Native veri görselleştirme terminali.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
            <Link href="/auth/login" className="w-full sm:w-auto px-12 py-5 bg-yellow-500 text-black font-black uppercase text-xs rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.5)] active:scale-95">
              Sisteme Giriş Yap
            </Link>
            <Link href="/auth/register" className="w-full sm:w-auto px-12 py-5 border border-white/10 text-white font-black uppercase text-xs rounded-2xl transition-all hover:bg-white/5 hover:border-white/20 active:scale-95">
              Ücretsiz Kayıt Ol
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MODÜLLER SECTİON: NELER YAPABİLİRİZ? */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Modül 1: Designer */}
          <div className="group p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="text-yellow-500" size={24} />
            </div>
            <h3 className="text-xl font-black italic uppercase italic">Snap-Designer</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Verilerinizi sürükle-bırak yöntemiyle veya Excel entegrasyonuyla anlık olarak fütüristik grafiklere dönüştürün.
            </p>
          </div>

          {/* Modül 2: Pi Pay Entegrasyonu */}
          <div className="group p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CreditCard className="text-yellow-500" size={24} />
            </div>
            <h3 className="text-xl font-black italic uppercase italic">Pi-Native Billing</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Tamamen Pi Network üzerinde çalışan abonelik sistemi. Kota alımlarınızı saniyeler içinde Pi Mainnet üzerinden gerçekleştirin.
            </p>
          </div>

          {/* Modül 3: Embed Motoru */}
          <div className="group p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="text-yellow-500" size={24} />
            </div>
            <h3 className="text-xl font-black italic uppercase italic">Universal Embed</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Oluşturduğunuz grafikleri kendi web sitenize veya Pi Browser uygulamanıza tek satır kodla yerleştirin.
            </p>
          </div>

        </div>
      </section>

      {/* 3. TEKNOLOJİ KATMANI (FOOTER ÖNCESİ) */}
      <section className="py-20 border-t border-white/5 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 grayscale opacity-40 hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 font-black italic uppercase tracking-tighter">
            <Cpu size={18} className="text-yellow-500" /> SnapScript Engine
          </div>
          <div className="flex items-center gap-2 font-black italic uppercase tracking-tighter">
            <ShieldCheck size={18} className="text-yellow-500" /> Supabase Secure
          </div>
          <div className="flex items-center gap-2 font-black italic uppercase tracking-tighter">
            <Zap size={18} className="text-yellow-500" /> Vercel Edge
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-[10px] text-gray-700 uppercase tracking-[0.5em] font-bold">
        © 2026 SnapLogic Global Operations • Built for Pi Network
      </footer>

    </main>
  );
}
