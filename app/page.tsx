import Link from "next/link";
import { BarChart3, ShieldCheck, Cpu, CreditCard, Globe, Zap, MousePointer2, Check } from "lucide-react";
import PiAuthButton from "../components/PiAuthButton";
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#000] text-white selection:bg-yellow-500 selection:text-black font-sans tracking-tight">
      
      {/* --- NAV BAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-black italic tracking-tighter uppercase">
            Snap<span className="text-yellow-500">Logic</span>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/auth/login" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Oturum Aç</Link>
            <Link href="/auth/register" className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all">Başla</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO: VİZYON --- */}
      <section className="relative pt-40 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-yellow-500/5 blur-[120px] rounded-full opacity-50"></div>
        <div className="flex justify-center gap-4 pt-4">
  <PiAuthButton />
</div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.9] tracking-tighter">
            Veri Analitiğinde <br />
            <span className="text-yellow-500">Yeni Standart.</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed italic">
            SnapScript v0 motoruyla güçlendirilmiş, dünyanın ilk Pi-Native veri görselleştirme terminali ile tanışın.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/auth/register" className="group relative px-10 py-4 bg-yellow-500 text-black font-black uppercase text-[11px] rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-yellow-500/20">
              Sistemi Keşfet
            </Link>
          </div>
        </div>
      </section>

      {/* --- MODULES: TEKNOLOJİ --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="space-y-4">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
              <Cpu className="text-yellow-500" size={20} />
            </div>
            <h3 className="text-lg font-black uppercase italic">SnapScript Engine</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Veriler arası reaktif bağıntılar kuran özel düşük-seviyeli kodlama dili.</p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
              <Globe className="text-yellow-500" size={20} />
            </div>
            <h3 className="text-lg font-black uppercase italic">Universal Embed</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Görselleştirmelerinizi her türlü dijital ortama tek satır kodla entegre edin.</p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
              <ShieldCheck className="text-yellow-500" size={20} />
            </div>
            <h3 className="text-lg font-black uppercase italic">Pi-Native Billing</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Tamamen blokzincir tabanlı, şeffaf ve güvenli abonelik yönetim sistemi.</p>
          </div>

        </div>
      </section>

      {/* --- PRICING: ELİT PLANLAR --- */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Plan 1 */}
          <div className="p-8 rounded-3xl bg-[#080808] border border-white/5 flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest">Aşama 01 / Spark</span>
              <div className="text-4xl font-black">15 <span className="text-yellow-500 text-sm">PI</span></div>
              <ul className="space-y-3 text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                <li className="flex gap-2 items-center"><Check size={14} className="text-yellow-500"/> 2,000 İzlenim</li>
                <li className="flex gap-2 items-center"><Check size={14} className="text-yellow-500"/> Temel Modüller</li>
              </ul>
            </div>
            <Link href="/auth/register" className="mt-12 block w-full text-center py-4 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition-all">Seç</Link>
          </div>

          {/* Plan 2: CORE */}
          <div className="p-8 rounded-3xl bg-white text-black flex flex-col justify-between transform md:scale-105 shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Aşama 02 / Pro</span>
                <span className="bg-black text-white px-3 py-1 rounded-full text-[8px] font-black uppercase">Popüler</span>
              </div>
              <div className="text-5xl font-black italic">85 <span className="text-gray-500 text-sm">PI</span></div>
              <ul className="space-y-3 text-[11px] font-black uppercase tracking-wider">
                <li className="flex gap-2 items-center text-yellow-600"><Check size={14}/> SnapScript v0 Erişimi</li>
                <li className="flex gap-2 items-center"><Check size={14}/> 20,000 İzlenim</li>
                <li className="flex gap-2 items-center"><Check size={14}/> Logo Kaldırma</li>
              </ul>
            </div>
            <Link href="/auth/register" className="mt-12 block w-full text-center py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase hover:opacity-90 transition-all">Hemen Edin</Link>
          </div>

          {/* Plan 3 */}
          <div className="p-8 rounded-3xl bg-[#080808] border border-white/5 flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest">Aşama 03 / Nova</span>
              <div className="text-4xl font-black">350 <span className="text-yellow-500 text-sm">PI</span></div>
              <ul className="space-y-3 text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                <li className="flex gap-2 items-center"><Check size={14} className="text-yellow-500"/> Sınırsız Akış</li>
                <li className="flex gap-2 items-center"><Check size={14} className="text-yellow-500"/> Özel Domain</li>
                <li className="flex gap-2 items-center"><Check size={14} className="text-yellow-500"/> 7/24 Destek</li>
              </ul>
            </div>
            <Link href="/auth/register" className="mt-12 block w-full text-center py-4 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition-all">İletişim</Link>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-[10px] text-gray-800 font-black uppercase tracking-[0.5em] italic">
          SnapLogic v1.0 • Global Terminal • Bursa, Türkiye
        </p>
      </footer>

    </main>
  );
}
