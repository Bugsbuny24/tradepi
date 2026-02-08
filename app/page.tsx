import Link from "next/link";
import { BarChart3, ShieldCheck, Zap, Globe, Cpu, CreditCard, Layers, MousePointer2, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* 1. HERO: ANA GİRİŞ */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 space-y-6 max-w-5xl">
          <div className="inline-block px-4 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
            Next-Gen Data Engine v1.0
          </div>
          <h1 className="text-7xl md:text-[120px] font-black italic tracking-tighter uppercase leading-[0.85]">
            VERİYİ <span className="text-yellow-500">ATEŞLE</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
            SnapLogic, karmaşık verilerinizi <span className="text-white">SnapScript v0</span> motoruyla fütüristik grafiklere ve canlı widgetlara dönüştürür.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
            <Link href="/auth/register" className="w-full sm:w-auto px-12 py-5 bg-yellow-500 text-black font-black uppercase text-xs rounded-2xl transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(251,191,36,0.5)] active:scale-95">
              ÜCRETSİZ BAŞLA
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto px-12 py-5 border border-white/10 text-white font-black uppercase text-xs rounded-2xl transition-all hover:bg-white/5 active:scale-95">
              GİRİŞ YAP
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MODÜLLER: NELER YAPABİLİRSİN? */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-yellow-500">TEKNOLOJİ KATMANLARI</h2>
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em] mt-2 italic font-bold">Dünyanın İlk Pi-Native Veri Terminali</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all group">
            <MousePointer2 className="text-yellow-500 mb-6" size={32} />
            <h3 className="text-xl font-black italic uppercase italic">Snap-Designer</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed italic">Kod yazmadan, sürükle-bırak ile profesyonel grafikler. Excel/CSV desteği tam entegre.</p>
          </div>

          <div className="p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all group border-yellow-500/30">
            <Cpu className="text-yellow-500 mb-6" size={32} />
            <h3 className="text-xl font-black italic uppercase italic text-yellow-500">SnapScript v0</h3>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed italic">Kendi reaktif dilimiz. Veriler arası matematiksel bağıntılar ve akıllı tetikleyiciler kurun.</p>
          </div>

          <div className="p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all group">
            <CreditCard className="text-yellow-500 mb-6" size={32} />
            <h3 className="text-xl font-black italic uppercase italic">Pi-Pay Billing</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed italic">Kota ve abonelik işlemlerinizi Pi Browser üzerinden blokzincir güvencesiyle halledin.</p>
          </div>
        </div>
      </section>

      {/* 3. PRICING: FİYATLANDIRMA (ELİT MODEL) */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-[#020202] rounded-[60px] border border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter">YATIRIM <span className="text-yellow-500">PLANLARI</span></h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mt-4 font-bold italic">Geleceğin Veri Ekonomisinde Yerinizi Ayırın</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          
          {/* LITE */}
          <div className="p-10 rounded-[48px] border border-white/5 bg-black flex flex-col h-full">
            <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest mb-6 italic">Spark / Bireysel</div>
            <h3 className="text-3xl font-black uppercase italic italic">15 <span className="text-yellow-500 text-sm">PI</span></h3>
            <ul className="mt-10 space-y-5 text-xs text-gray-500 font-bold uppercase tracking-widest">
              <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500"/> 2,000 İzlenim</li>
              <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500"/> Standart Modüller</li>
              <li className="flex gap-2 text-gray-800 line-through"><CheckCircle2 size={14}/> SnapScript v0</li>
            </ul>
            <Link href="/auth/register" className="mt-auto pt-10 w-full text-center text-yellow-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Sisteme Katıl →</Link>
          </div>

          {/* CORE - ÖNERİLEN */}
          <div className="p-12 rounded-[50px] border-2 border-yellow-500 bg-yellow-500/5 shadow-[0_0_80px_-20px_rgba(251,191,36,0.4)] relative flex flex-col h-[110%] z-10">
            <div className="absolute top-8 right-8 bg-yellow-500 text-black text-[9px] font-black py-1 px-4 rounded-full uppercase italic">En Çok Tercih Edilen</div>
            <div className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6 italic">Pro / Geliştirici</div>
            <h3 className="text-5xl font-black uppercase italic text-white">85 <span className="text-yellow-500 text-xl font-black uppercase italic">PI</span></h3>
            <ul className="mt-12 space-y-6 text-xs text-white/90 font-bold uppercase tracking-[0.15em]">
              <li className="flex gap-3 text-yellow-500"><CheckCircle2 size={16}/> SnapScript v0 Erişimi</li>
              <li className="flex gap-3"><CheckCircle2 size={16}/> 20,000 Grafik İzlenimi</li>
              <li className="flex gap-3"><CheckCircle2 size={16}/> Watermark Kaldırma</li>
              <li className="flex gap-3"><CheckCircle2 size={16}/> Pro Widget Seti</li>
            </ul>
            <Link href="/auth/register" className="mt-auto w-full py-5 bg-yellow-500 text-black text-center text-[10px] font-black uppercase rounded-2xl hover:scale-105 transition-all shadow-xl shadow-yellow-500/20">HEMEN CORE'A GEÇ</Link>
          </div>

          {/* NOVA */}
          <div className="p-10 rounded-[48px] border border-white/5 bg-black flex flex-col h-full">
            <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest mb-6 italic">Enterprise / İşletme</div>
            <h3 className="text-3xl font-black uppercase italic italic">350 <span className="text-yellow-500 text-sm font-black uppercase italic">PI</span></h3>
            <ul className="mt-10 space-y-5 text-xs text-gray-500 font-bold uppercase tracking-widest">
              <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500"/> Sınırsız Veri Akışı</li>
              <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500"/> Özel Domain</li>
              <li className="flex gap-2"><CheckCircle2 size={14} className="text-yellow-500"/> 7/24 Teknik Destek</li>
            </ul>
            <Link href="/auth/register" className="mt-auto pt-10 w-full text-center text-white text-[10px] font-black uppercase tracking-widest hover:text-yellow-500 transition-all">İletişime Geç →</Link>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center border-t border-white/5">
        <div className="text-[10px] text-gray-800 uppercase tracking-[0.6em] font-black italic">
          SnapLogic v1.0 • Bursa Terminal • built on Pi Network
        </div>
      </footer>

    </main>
  );
}
