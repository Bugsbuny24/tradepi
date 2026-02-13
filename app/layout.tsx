import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

[span_0](start_span)const inter = Inter({ subsets: ["latin"] });[span_0](end_span)

export const metadata: Metadata = {
  title: "SnapLogic Engine | The World's First Pi-Native Data Terminal",
  description: "Ignite your data with SnapScript v0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
[span_1](start_span)}) {[span_1](end_span)
  return (
    <html lang="tr" className="dark">
      <head>
        {/* Pi SDK - Strateji 'afterInteractive' olarak güncellendi */}
        <Script 
          src="https://sdk.minepi.com/pi-sdk.js" 
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-black antialiased`}>
        [span_2](start_span){children}[span_2](end_span)
      </body>
    </html>
  );
}
