import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SnapLogic Engine | The World's First Pi-Native Data Terminal",
  description: "SnapLogic Engine - Pi Network native data visualization platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Pi Browser SDK - KRİTİK! */}
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        {children}

        {/* Google Analytics (opsiyonel) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX');
          `}
        </Script>

        {/* Pi SDK Initialization */}
        <Script id="pi-sdk-init" strategy="afterInteractive">
          {`
            // Pi SDK hazır olduğunda auth başlat
            if (typeof window !== 'undefined' && window.Pi) {
              window.Pi.init({ 
                version: "2.0",
                sandbox: ${process.env.NODE_ENV !== 'production'} 
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
