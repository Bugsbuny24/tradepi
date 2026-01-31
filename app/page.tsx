import Link from 'next/link'
import { 
  ShoppingBag, 
  Coins, 
  MessageSquare, 
  Wallet, 
  ShieldCheck, 
  Zap,
  BarChart3,
  Globe
} from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-yellow-900/20 to-gray-950 pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
            TRADEPI<span className="text-yellow-500 underline decoration-yellow-600">GLOBALL</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Pi Network Ekosisteminin En Gelişmiş B2B Ticaret ve Meme Coin Üretim Merkezi.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/listings" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-full flex items-center gap-2 transition">
              <ShoppingBag size={20} /> İlanları Keşfet
            </Link>
            <Link href="/forge" className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-full font-bold flex items-center gap-2 transition">
              <Coins size={20} /> Coin Oluştur (Forge)
            </Link>
          </div>
        </div>
      </div>

      {/* Şemaya Göre Modüller (Dashboard) */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Zap className="text-yellow-500" /> Platform Özellikleri
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* B2B & RFQ Modülü */}
          <Link href="/rfq/new" className="group bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-500 transition">
            <div className="bg-yellow-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-yellow-500/20 transition">
              <Globe className="text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">B2B Ticaret</h3>
            <p className="text-gray-400 text-sm">RFQ (Teklif İsteği) oluştur, toptan alım yap ve küresel tedarikçilere ulaş.</p>
          </Link>

          {/* Meme Coin Modülü */}
          <Link href="/tokens" className="group bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-500 transition">
            <div className="bg-blue-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-blue-500/20 transition">
              <Coins className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Coin Treasury</h3>
            <p className="text-gray-400 text-sm">Pi Network üzerinde kendi meme coin'ini bas, yak (burn) ve arzı yönet.</p>
          </Link>

          {/* Wallet & Escrow Modülü */}
          <Link href="/wallet" className="group bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-500 transition">
            <div className="bg-green-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-green-500/20 transition">
              <Wallet className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Pi Cüzdanım</h3>
            <p className="text-gray-400 text-sm">Bakiyeni gör, Escrow (Güvenli Ödeme) işlemlerini takip et ve ödeme yap.</p>
          </Link>

          {/* Dispute & Admin Panel */}
          <Link href="/disputes" className="group bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-500 transition">
            <div className="bg-red-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-red-500/20 transition">
              <ShieldCheck className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Güvenlik Merkezi</h3>
            <p className="text-gray-400 text-sm">İtirazları (Dispute) yönet, KYC durumunu gör ve güvenle ticaret yap.</p>
          </Link>

        </div>

        {/* Alt Bilgi - İstatistikler (Şemadaki seller_stats ve admin_overview'dan) */}
        <div className="mt-12 bg-gray-900/50 rounded-3xl p-8 border border-gray-800 flex flex-wrap justify-around gap-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">Aktif İlan</p>
            <p className="text-3xl font-bold">1,250+</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">Kayıtlı Şirket</p>
            <p className="text-3xl font-bold">450+</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">Pi Ödemeleri</p>
            <p className="text-3xl font-bold text-yellow-500">12.5K π</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1 uppercase tracking-widest">Toplam Kullanıcı</p>
            <p className="text-3xl font-bold">5,000+</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-8 text-center text-gray-500 text-sm">
        <p>&copy; 2026 Tradepigloball.co - Built on Pi Network</p>
      </footer>
    </main>
  )
}
