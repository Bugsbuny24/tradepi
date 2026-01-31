export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <nav className="p-4 border-b flex gap-6">
          <a href="/">Home</a>
          <a href="/listings">Listings</a>
          <a href="/wallet">Wallet</a>
          <a href="/dashboard">Dashboard</a>
        </nav>

        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}
