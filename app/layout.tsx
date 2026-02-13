import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SnapLogic Engine | Pi-Native Data Terminal",
  description: "SnapLogic Engine - Pi Network native platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Pi SDK - CRITICAL! Must be in HEAD */}
        <script src="https://sdk.minepi.com/pi-sdk.js"></script>
      </head>
      <body className={inter.className}>
        {children}

        {/* Pi SDK Init */}
        <Script id="pi-init" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined') {
              window.Pi.init({ 
                version: "2.0",
                sandbox: false
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
