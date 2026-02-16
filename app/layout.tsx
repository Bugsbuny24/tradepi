import Navbar from '@/components/Navbar'
import ToastProvider from '@/components/providers/ToastProvider'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="antialiased text-slate-900 bg-[#f8fafc]">
        <ToastProvider /> {/* Bildirimler her zaman üstte */}
        <div className="flex flex-col min-h-screen">
          <Navbar /> {/* Mobil uyumlu menü her zaman hazır */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
