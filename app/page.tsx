export default function HomePage() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">TradePi / SnapLogic</h1>
      <p className="mt-2 text-sm text-gray-600">
        Topup sayfasına git:
      </p>

      <a
        href="/topup"
        className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
      >
        /topup
      </a>
    </main>
  );
}
