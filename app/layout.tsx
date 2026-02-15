import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tradepigloball.co'),
  title: 'Tradepigloball | Enterprise V3',
  description: 'SnapLogic Veri Borsası ve Analiz Platformu',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
