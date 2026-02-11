import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <div className="text-sm font-medium text-gray-600">SnapLogic</div>

        <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
          Veri Analitiğinde
          <br />
          Yeni Standart.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          SnapScript v0 motoruyla güçlendirilmiş, canlı veri widget’larını saniyeler
          içinde üret ve her yere embed et.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-2xl bg-black px-7 py-4 text-base font-extrabold text-white shadow-sm transition hover:opacity-90 active:scale-[0.99]"
          >
            Giriş Yap
          </Link>

          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-7 py-4 text-base font-extrabold text-black shadow-sm transition hover:bg-gray-50 active:scale-[0.99]"
          >
            Kayıt Ol
          </Link>

          <Link href="/dashboard" className="text-sm font-semibold text-gray-600 underline">
            Dashboard’a Git
          </Link>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <section>
            <h2 className="text-3xl font-black">SnapScript Engine</h2>
            <p className="mt-3 text-gray-600">
              Veriler arası reaktif bağıntılar kuran özel düşük-seviyeli kodlama dili.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black">Universal Embed</h2>
            <p className="mt-3 text-gray-600">
              Görselleştirmelerinizi her türlü dijital ortama tek satır kodla entegre edin.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black">Billing</h2>
            <p className="mt-3 text-gray-600">
              Abonelik ve erişim yönetimini tek noktadan yönet.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
