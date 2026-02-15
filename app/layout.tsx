import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://snaplogic.io'),
  title: {
    default: 'SnapLogic.io | B2B Veri Görselleştirme',
    template: '%s | SnapLogic.io'
  },
  description: 'Verilerini profesyonel grafiklere dönüştür ve her yere mühürle.',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://snaplogic.io',
    siteName: 'SnapLogic.io',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
