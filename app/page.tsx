import Link from "next/link";
import { BarChart3, Zap, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Arka Plan Efekti */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* Navigasyon */}
      <nav className="relative z-10 max-w-7xl mx-auto p-8 flex justify-between items-center">
        <div className="text-xl font-black italic tracking-tighter uppercase">
          Snap<span className="text-yellow-500">Core</span>
        </div>
        <Link 
          href="/auth" 
          className="bg-white text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 transition-all"
        >
          Terminali Aç
        </Link>
      </nav>

      {/* Hero Alanı */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-block bg-yellow-500/10 border border-yellow-500/20 px-4 py-1 rounded-full text-[9px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-8 animate-pulse">
          Pi Network Ekosistemi v1.0
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] mb-8">
          Veriyi <span className="text-yellow-500 underline decoration-yellow-500/30">Ateşleme</span> Vakti
        </h1>
        
        <p className="max-w-2xl text-gray-500 text-sm md:text-lg font-medium mb-12 leading-relaxed">
          SnapScript v0 ile verilerinize ruh üfleyin. Dünyanın ilk Pi-Native veri görselleştirme motoruyla tanışın. Statik olan her şeyi geride bırakın.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <Link 
            href="/auth" 
            className="bg-yellow-500 text-black px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(234,179,8,0.4)]"
          >
            Hemen Başla
          </Link>
        </div>
      </main>

      {/* Özellikler */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
          <Zap className="text-yellow-500 mb-6" size={32} />
          <h3 className="text-sm font-black uppercase mb-2 italic">SnapScript v0</h3>
          <p className="text-xs text-gray-500 font-bold leading-relaxed">Kendi veri mantığınızı saniyeler içinde kodlayın.</p>
        </div>
        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
          <BarChart3 className="text-blue-500 mb-6" size={32} />
          <h3 className="text-sm font-black uppercase mb-2 italic">Reaktif Grafikler</h3>
          <p className="text-xs text-gray-500 font-bold leading-relaxed">Veri değiştikçe grafikleriniz otonom tepki verir.</p>
        </div>
        <div className="p-8 rounded-[40px] bg-white/5 border border-white/10">
          <Shield className="text-purple-500 mb-6" size={32} />
          <h3 className="text-sm font-black uppercase mb-2 italic">Pi Secure</h3>
          <p className="text-xs text-gray-500 font-bold leading-relaxed">Tüm işlemler Pi Network blokzinciri ile mühürlenir.</p>
        </div>
      </section>
    </div>
  );
}
