import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',       // Patronun gizli odası
        '/dashboard/',   // Kullanıcı özel paneli
        '/api/',         // API uçları
        '/private/',     // Gizli dosyalar
      ],
    },
    sitemap: 'https://www.tradepigloball.co/sitemap.xml',
  }
}
