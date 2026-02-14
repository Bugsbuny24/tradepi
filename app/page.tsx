import Link from 'next/link';
import { ArrowRight, BarChart3, ShoppingCart, Zap, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-purple-500/30">
      {/* NAV BAR */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="text-2xl font-black tracking-tighter italic">TRADEPIGLOBALL</div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <Link href="/market" className="hover:text-white transition-colors">Market</Link>
          <Link href="#features" className="hover:text-white transition-colors">Özellikler</Link>
          <Link href="https://x.com/KreatifZihin" target="_blank" className="hover:text-white transition-colors">Topluluk</Link>
        </div>
        <Link href="/dashboard" className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-purple-500 hover:text-white transition-all">
          Panele Git
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6">
        <div className="bg-purple-500/10 text-purple-400 px-4 py-1 rounded-full text-xs font-bold mb-6 border border-purple-500/20">
          V3.0 ELITE SÜRÜM YAYINDA 🚀
        </div>
        <h1 className="text-5xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
          VERİNİ GÖRSELLEŞTİR <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
            PAZARDA NAKDE ÇEVİR
          </span>
        </h1>
        <p className="max-w-2xl text-gray-500 text-lg md:text-xl mb-12 font-medium">
          SnapLogic motoruyla verilerini saniyeler içinde profesyonel analizlere dönüştür. 
          Tradepigloball Marketplace ile analizlerini tüm dünyaya sat.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 transition-transform active:scale-95 shadow-2xl shadow-purple-500/20">
            Hemen Ücretsiz Başla <ArrowRight size={20} />
          </Link>
          <Link href="/market" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all">
            Marketi Gez
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<BarChart3 className="text-purple-500" size={32} />} 
          title="SnapLogic Analiz" 
          desc="Karmaşık verileri saniyeler içinde etkileyici grafiklere dönüştüren yapay zeka destekli motor."
        />
        <FeatureCard 
          icon={<ShoppingCart className="text-blue-500" size={32} />} 
          title="Global Marketplace" 
          desc="Hazırladığın analizleri Shopier entegrasyonu ile TL bazında tüm dünyaya satma imkanı."
        />
        <FeatureCard 
          icon={<Zap className="text-yellow-500" size={32} />} 
          title="Hızlı Entegrasyon" 
          desc="Oluşturduğun grafikleri kendi sitene veya projerine tek satır kodla göm."
        />
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 text-center text-gray-600 text-sm">
        <p>© 2026 Tradepigloball.co - KreatifZihin Tarafından Geliştirildi.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-all">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
