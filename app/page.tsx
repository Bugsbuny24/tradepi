import React from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Users, PenTool, 
  Database, Code, Terminal, 
  ExternalLink, ChevronRight 
} from 'lucide-react';

export default function GlobalTradePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono selection:bg-yellow-500/30">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-6 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">π</div>
          <span className="text-xl font-bold tracking-tighter uppercase italic">Tradepi<span className="text-yellow-500">globall</span></span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
          <Link href="/listings" className="hover:text-white transition">İlanlar</Link>
          <Link href="/services" className="hover:text-white transition">Hizmetler</Link>
          <button className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-4 py-1.5 rounded-full hover:bg-yellow-500 hover:text-black transition">Giriş Yap</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-20 pb-10 text-center px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/10 blur-[120px] rounded-full -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">
          Global Ticaret + <span className="text-yellow-500">Yeni Ekonomi</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base mb-8 uppercase tracking-widest">
          Pi Network Global Exchange | Meme Coin Forge Merkezi
        </p>
      </section>

      {/* 6 ANA MODÜL (Görseldeki Gibi) */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* B2B & B2C */}
        <div className="group border border-white/10 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent hover:border-yellow-500/50 transition-all duration-300">
          <ShoppingBag className="text-yellow-500 mb-4" />
          <h3 className="font-bold text-lg mb-2 uppercase">B2B & B2C Ticaret</h3>
          <p className="text-gray-500 text-xs leading-relaxed uppercase">Toptan alım, dropshipping ve global tedarik zinciri yönetimi.</p>
        </div>

        {/* C2C & Freelance */}
        <div className="group border border-white/10 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent hover:border-blue-500/50 transition-all duration-300">
          <Users className="text-blue-500 mb-4" />
          <h3 className="font-bold text-lg mb-2 uppercase">C2C & Freelance</h3>
          <p className="text-gray-500 text-xs leading-relaxed uppercase">Bireysel satış, ilanlar ve yeteneklerin Pi ile pazarlanması.</p>
        </div>

        {/* Fiverr & Video Edit */}
        <div className="group border border-white/10 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent hover:border-green-500/50 transition-all duration-300">
          <PenTool className="text-green-500 mb-4" />
          <h3 className="font-bold text-lg mb-2 uppercase">Fiverr & Edit</h3>
          <p className="text-gray-500 text-xs leading-relaxed uppercase">Video düzenleme ve dijital sanat ürünleri satış paneli.</p>
        </div>

        {/* CodeCanyon & Scripts */}
        <div className="group border border-white/10 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent hover:border-purple-500/50 transition-all duration-300">
          <Code className="text-purple-500 mb-4" />
          <h3 className="font-bold text-lg mb-2 uppercase">CodeCanyon</h3>
          <p className="text-gray-500 text-xs leading-relaxed uppercase">Hazır scriptler, yazılım modülleri ve lisanslı dijital ürünler.</p>
        </div>

        {/* Printify & POD */}
        <div className="group border border-white/10 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent hover:border-orange-500/50 transition-all duration-300">
          <Database className="text-orange-500 mb-4" />
          <h3 className="font-bold text-lg mb-2 uppercase">Printify & Dropship</h3>
          <p className="text-gray-500 text-xs leading-relaxed uppercase">Stoksuz satış, kişiye özel baskı ve global sevkiyat ağı.</p>
        </div>

        {/* Login & Auth */}
        <div className="group border border-white/10 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent hover:border-red-500/50 transition-all duration-300">
          <ExternalLink className="text-red-500 mb-4" />
          <h3 className="font-bold text-lg mb-2 uppercase">Giriş Panelleri</h3>
          <p className="text-gray-500 text-xs leading-relaxed uppercase">Pi App Auth, Satıcı Paneli ve Kullanıcı Yönetim Sistemi.</p>
        </div>

      </section>

      {/* TERMINAL / LOG SCREEN (Görselin altındaki bölüm) */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-black border border-white/10 rounded-lg overflow-hidden font-mono shadow-2xl">
          <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] text-gray-500 ml-2 uppercase">TRADEPI_GLOBAL_CLI: connected PI_MAINNET</span>
          </div>
          <div className="p-4 text-green-500 text-xs space-y-1">
            <p>// Yeni bir ticaret emri bağlandı...</p>
            <p className="text-white">agent function section = orient_cent_reader(alert);</p>
            <p className="text-yellow-500">&gt;&gt;&gt; READY. Awaiting commands...</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 border-t border-white/5 text-[10px] text-gray-600 tracking-widest uppercase">
        © 2026 TRADEPIGLOBALL.CO - POWERED BY PI NETWORK
      </footer>

    </div>
  );
}
