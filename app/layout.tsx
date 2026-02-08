import "./globals.css";

export const metadata = {
  title: "TradePi / SnapLogic",
  description: "Pi payments + quotas"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
