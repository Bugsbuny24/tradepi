import Link from "next/link";
import { BarChart3, ShieldCheck, Zap, Globe, Cpu, CreditCard } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* HERO SECTION */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 space-y-6 max-w-5xl">
          <div className="inline-block px-4 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">
            Pi Network Ekosistemi v1.0
          </div>
          <h1 className="text-7xl md:text-[110px] font-black italic tracking-tighter uppercase leading-[0.85]">
            Snap<span className="text-yellow-500">Logic</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
            Verilerinizi blokzincir gücüyle fütüristik grafiklere dönüştüren terminal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
            <Link href="/auth/login" className="w-full sm:w-auto px-12 py-5 bg-yellow-500 text-black font-black uppercase text-xs rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-yellow-500/20">
              Giriş Yap
            </Link>
            <Link href="/auth/register" className="w-full sm:w-auto px-12 py-5 border border-white/10 text-white font-black uppercase text-xs rounded-2xl transition-all hover:bg-white/5 active:scale-95">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </section>

      {/* MODÜLLER SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all">
            <BarChart3 className="text-yellow-500 mb-6" size={24} />
            <h3 className="text-xl font-black italic uppercase italic">Snap-Designer</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed italic">Excel verilerinizi saniyeler içinde fütüristik widgetlara dönüştürün.</p>
          </div>

          <div className="group p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all">
            <CreditCard className="text-yellow-500 mb-6" size={24} />
            <h3 className="text-xl font-black italic uppercase italic">Pi-Pay Billing</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed italic">Abonelik ve kota işlemlerinizi Pi Mainnet üzerinden güvenle yönetin.</p>
          </div>

          <div className="group p-8 rounded-[40px] border border-white/5 bg-[#050505] hover:border-yellow-500/20 transition-all">
            <Globe className="text-yellow-500 mb-6" size={24} />
            <h3 className="text-xl font-black uppercase italic">Universal Embed</h3>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed italic">Oluşturduğunuz grafikleri her türlü web platformuna tek kodla entegre edin.</p>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-[10px] text-gray-700 uppercase tracking-[0.5em] font-bold">
        © 2026 SnapLogic Operations • Built for Pi Network
      </footer>
    </main>
  );
}
