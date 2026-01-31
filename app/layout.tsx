export const metadata = {
  title: 'Tradepigloball',
  description: 'B2B Trade and Meme Coin Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        {/* Tüm sayfalar bu children içine basılır */}
        {children}
      </body>
    </html>
  )
}
