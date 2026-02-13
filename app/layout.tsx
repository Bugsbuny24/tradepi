import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SnapLogic Engine | The World's First Pi-Native Data Terminal",
  description: "Ignite your data with SnapScript v0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <head>
        {/* Pi SDK - afterInteractive stratejisi Pi Browser uyumluluğu için en güvenlisidir */}
        <Script 
          src="https://sdk.minepi.com/pi-sdk.js" 
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-black antialiased`}>
        {children}
      </body>
    </html>
  );
}
