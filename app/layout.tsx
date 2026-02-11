import "./globals.css";

export const metadata = {
  title: "SnapLogic",
  description: "The Universal Data Visualization Bridge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
