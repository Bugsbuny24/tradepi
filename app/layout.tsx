import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://snaplogic.io'),
  title: {
    default: 'SnapLogic.io | B2B Veri Görselleştirme ve Grafik Platformu',
    template: '%s | SnapLogic.io'
  },
  description: 'Ham verilerini profesyonel grafiklere dönüştür. API ile besle, Snap Script ile işle ve her platforma saniyeler içinde göm.',
  keywords: ['b2b data visualization', 'api charts', 'dynamic graphs', 'snaplogic', 'data analytics turkey', 'embeddable charts'],
  authors: [{ name: 'SnapLogic Team' }],
  creator: 'SnapLogic.io',
  
  // Sosyal Medya Paylaşımları (OG Tags)
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://snaplogic.io',
    siteName: 'SnapLogic.io',
    title: 'SnapLogic.io | Verilerini Canlandır',
    description: 'B2B dünyasının en güçlü veri görselleştirme motoru.',
    images: [
      {
        url: '/og-image.jpg', // Public klasörüne şık bir kapak resmi atmayı unutma
        width: 1200,
        height: 630,
        alt: 'SnapLogic.io Dashboard Preview'
      }
    ]
  },

  // Twitter (X) Kartları
  twitter: {
    card: 'summary_large_image',
    title: 'SnapLogic.io | B2B Data Engine',
    description: 'Verilerini her platforma göm ve analiz et.',
    images: ['/og-image.jpg'],
  },

  // Arama Motoru Botları
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
}
