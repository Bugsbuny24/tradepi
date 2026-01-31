import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4 text-yellow-500">Tradepigloball</h1>
      <p className="text-xl mb-8 text-center text-gray-300">
        Geleceğin Ticaret Ağı: B2B ve Meme Coin Forge bir arada.
      </p>
      <div className="flex gap-4">
        <Link href="/listings" className="bg-yellow-600 px-6 py-3 rounded-lg font-bold">
          İlanları Gez
        </Link>
        <Link href="/login" className="bg-blue-600 px-6 py-3 rounded-lg font-bold">
          Pi ile Giriş Yap
        </Link>
      </div>
    </main>
  )
}
