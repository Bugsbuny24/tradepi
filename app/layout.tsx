import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tradepigloball.co'),
  title: {
    default: 'Tradepigloball | SnapLogic Veri Analiz & Marketplace',
    template: '%s | Tradepigloball'
  },
  description: 'SnapLogic motoru ile verilerinizi profesyonel grafiklere dönüştürün ve Marketplace üzerinde nakde çevirin. Enterprise V3.0 veri çözümleri.',
  keywords: ['veri görselleştirme', 'data visualization', 'snaplogic', 'marketplace', 'bursa yazılım', 'pi network', 'kreatifzihin'],
  authors: [{ name: 'KreatifZihin' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://www.tradepigloball.co',
    siteName: 'Tradepigloball',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Tradepigloball V3.0' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tradepigloball | Elite Veri Çözümleri',
    description: 'Verini görselleştir, dünyayla paylaş.',
    creator: '@KreatifZihin',
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SnapLogic Engine | Enterprise Data',
  description: 'Professional Data Visualization Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
