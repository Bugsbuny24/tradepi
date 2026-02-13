import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-200 selection:bg-indigo-500 selection:text-white">
      
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/50 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Logo Icon (SVG) */}
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">SnapLogic</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-sm hover:text-white transition-colors">Giriş Yap</Link>
          <Link href="/register" className="px-4 py-2 text-sm bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors">
            Kayıt Ol
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Arka plan glow efekti */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-800 bg-gray-900/50 text-xs text-gray-400 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Sistem Online v2.0
        </div>

        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-6 max-w-4xl">
          Veri Görselleştirmenin <br /> Yeni Motoru
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Karmaşık SQL sorgularını unutun. SnapLogic Engine ile Supabase verilerinizi 
          saniyeler içinde görselleştirin ve yönetin.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 group">
            Hemen Başla 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
          <button className="px-8 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 rounded-xl font-medium transition-all">
            Dokümantasyon
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl px-4 text-left">
          <FeatureCard 
            title="Supabase Entegrasyonu"
            desc="Veritabanınıza saniyeler içinde bağlanın. packages ve profiles tablolarınızla tam uyumlu."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
            }
          />
          <FeatureCard 
            title="Kurumsal Güvenlik"
            desc="RLS (Row Level Security) ve şifreleme katmanları ile verileriniz güvende."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            }
          />
          <FeatureCard 
            title="Canlı Analitik"
            desc="Embed settings ve API counters ile kullanım detaylarını anlık takip edin."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
              </svg>
            }
          />
        </div>
      </main>

      <footer className="border-t border-gray-900 py-8 text-center text-gray-600 text-sm">
        <p>© 2026 SnapLogic Engine. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

// Yardımcı Bileşen (Type hatası almamak için basitleştirildi)
function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 transition-colors">
      <div className="mb-4 bg-gray-800 w-12 h-12 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
