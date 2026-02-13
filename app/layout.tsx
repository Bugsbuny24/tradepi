// layout.tsx (Güncellenmiş Versiyon)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

[span_5](start_span)const inter = Inter({ subsets: ["latin"] });[span_5](end_span)

export const metadata: Metadata = {
  title: "SnapLogic Engine | The World's First Pi-Native Data Terminal",
  description: "Ignite your data with SnapScript v0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
[span_6](start_span)}) {[span_6](end_span)
  return (
    <html lang="tr" className="dark">
      <head>
        {/* Pi Network SDK - Strateji ve Başlatma Mantığı Güncellendi */}
        <Script 
          src="https://sdk.minepi.com/pi-sdk.js" 
          strategy="afterInteractive" 
          onLoad={() => {
            if (window.Pi) {
              // Pi Browser içinde uygulamanın tanınması için init şarttır
              window.Pi.init({ version: "1.5", sandbox: true });
              console.log("SnapLogic: Pi SDK Başlatıldı");
            }
          }}
        />
      </head>
      <body className={`${inter.className} bg-black antialiased`}>
        [span_7](start_span){children}[span_7](end_span)
      </body>
    </html>
  );
}
