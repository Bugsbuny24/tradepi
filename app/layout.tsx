// app/layout.tsx
import Script from "next/script";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        {/* Pi SDK should be available ASAP (Pi Browser) */}
        <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="beforeInteractive" />
      </head>
      <body>{children}</body>
    </html>
  );
}
