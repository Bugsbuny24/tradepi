import React from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, Users, Palette, 
  Terminal, Cpu, Globe, 
  Zap, Shield, Layers 
} from 'lucide-react';

export default function TradepiGlobalHome() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-yellow-500/30">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-6 border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-lg flex items-center justify-center text-black font-black text-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">π</div>
          <span className="text-2xl font-black tracking-tighter uppercase italic italic">TRADEPI<span className="text-yellow-500">GLOBALL</span></span>
        </div>
        <div className="hidden lg:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500">
          <Link href="/market" className="hover:text-yellow-500 transition">Market</Link>
          <Link href="/nodes" className="hover:text-yellow-500 transition">Nodes</Link>
          <Link href="/auth" className="bg-white/5 border border-white/10 px-6 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition">Access Portal</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-24 pb-16 text-center px-4 relative">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-500/5 blur-[150px] rounded-full -z-10"></div>
        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-none">
          GLOBAL TRADE <br/> <span className="text-yellow-500 text-outline">NEW ECONOMY</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-xs md:text-sm mb-10 uppercase tracking-[0.4em] leading-relaxed">
          Powered by Pi Network | Cross-Border B2B Ecosystem
        </p>
      </section>

      {/* 6 YENİ İSİMLİ MODÜL */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        
        {/* B2B -> TRADE-CORE */}
        <div className="group border border-white/5 p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-yellow-500/30 transition-all">
          <Layers className="text-yellow-500 mb-6 w-8 h-8" />
          <h3 className="font-black text-xl mb-3 uppercase tracking-tight">Trade-Core (B2B)</h3>
          <p className="text-gray-500 text-[10px] leading-relaxed uppercase tracking-widest">Kurumsal toptan alım ve global tedarik zinciri entegrasyonu.</p>
        </div>

        {/* C2C -> USER-NODE */}
        <div className="group border border-white/5 p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all">
          <Users className="text-blue-500 mb-6 w-8 h-8" />
          <h3 className="font-black text-xl mb-3 uppercase tracking-tight">User-Node (C2C)</h3>
          <p className="text-gray-500 text-[10px] leading-relaxed uppercase tracking-widest">Bireysel ilanlar ve güvenli eşler arası (P2P) ticaret ağı.</p>
        </div>

        {/* FIVERR -> JOB-FORGE */}
        <div className="group border border-white/5 p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-green-500/30 transition-all">
          <Zap className="text-green-500 mb-6 w-8 h-8" />
          <h3 className="font-black text-xl mb-3 uppercase tracking-tight">Job-Forge (Skills)</h3>
          <p className="text-gray-500 text-[10px] leading-relaxed uppercase tracking-widest">Dijital yetenekler ve freelance hizmetlerin Pi ile takası.</p>
        </div>

        {/* CODECANYON -> SOURCE-PI */}
        <div className="group border border-white/5 p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all">
          <Cpu className="text-purple-500 mb-6 w-8 h-8" />
          <h3 className="font-black text-xl mb-3 uppercase tracking-tight">Source-Pi (Scripts)</h3>
          <p className="text-gray-500 text-[10px] leading-relaxed uppercase tracking-widest">Yazılım modülleri, hazır scriptler ve dijital varlık kütüphanesi.</p>
        </div>

        {/* PRINTIFY/DROPSHIPPING -> FLOW-SHIP */}
        <div className="group border border-white/5 p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-orange-500/30 transition-all">
          <Globe className="text-orange-500 mb-6 w-8 h-8" />
          <h3 className="font-black text-xl mb-3 uppercase tracking-tight">Flow-Ship (POD)</h3>
          <p className="text-gray-500 text-[10px] leading-relaxed uppercase tracking-widest">Stoksuz satış ve kişiselleştirilmiş ürün üretim kanalları.</p>
        </div>

        {/* LOGIN -> SECURE-AUTH */}
        <div className="group border border-white/5 p-8 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-red-500/30 transition-all">
          <Shield className="text-red-500 mb-6 w-8 h-8" />
          <h3 className="font-black text-xl mb-3 uppercase tracking-tight">Secure-Auth</h3>
          <p className="text-gray-500 text-[10px] leading-relaxed uppercase tracking-widest">Pi Mainnet entegreli satıcı ve kullanıcı giriş protokolleri.</p>
        </div>

      </section>

      {/* TERMINAL SECTION */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Mainnet Deployment Terminal</span>
          </div>
          <div className="p-6 text-[11px] font-mono leading-relaxed">
            <p className="text-blue-400"># Initializing Tradepi_Global_Engine...</p>
            <p className="text-gray-500">Checking Supabase connection... [OK]</p>
            <p className="text-gray-500">Syncing Pi Network SDK v2.0... [OK]</p>
            <p className="text-green-500 mt-2">&gt; ALL SYSTEMS OPERATIONAL. READY FOR GLOBAL SCALE.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
