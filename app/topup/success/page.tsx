export default function TopupSuccessPage() {
  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-bold">✅ Ödeme Başarılı</h1>
      <p className="mt-2 text-sm text-gray-600">
        Paket ve kotaların otomatik yüklendi. Dashboard’a dönebilirsin.
      </p>

      <a
        href="/dashboard"
        className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
      >
        Dashboard
      </a>
    </div>
  );
}
