import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapLogic",
  description: "The Universal Data Visualization Bridge for Modern Web & No-Code Apps",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
