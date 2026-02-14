// app/layout.tsx
import './globals.css' // CSS dosyanın yolu doğru olduğundan emin ol
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SnapLogic.io | Veri Görselleştirme',
  description: 'B2B veri görselleştirme ve pazar yeri platformu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {/* Navbar veya ortak bileşenleri buraya ekleyebilirsin */}
        <main>{children}</main>
      </body>
    </html>
  )
}
