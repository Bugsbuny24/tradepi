import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-sm text-gray-500 mb-6">SnapLogic</div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Veri Analitiğinde
          <br />
          Yeni Standart.
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          SnapScript v0 motoruyla güçlendirilmiş, dünyanın ilk Pi-Native veri
          görselleştirme terminali ile tanışın.
        </p>

        <Link className="text-blue-600 underline" href="/dashboard">
          Sistemi Keşfet
        </Link>

        <div className="mt-10">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-2xl bg-yellow-500 px-8 py-4 font-bold text-black shadow-sm"
          >
            Pi Network ile Giriş Yap
          </Link>

          <div className="text-sm text-gray-400 mt-2">
            SDK: Loading... • sandbox: false • Pi SDK yok. Bu buton sadece Pi
            Browser’da çalışır.
          </div>
        </div>

        <div className="mt-16 space-y-12">
          <div>
            <h2 className="text-4xl font-extrabold mb-3">SnapScript Engine</h2>
            <p className="text-gray-600">
              Veriler arası reaktif bağıntılar kuran özel düşük-seviyeli
              kodlama dili.
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-extrabold mb-3">Universal Embed</h2>
            <p className="text-gray-600">
              Görselleştirmelerinizi her türlü dijital ortama tek satır kodla
              entegre edin.
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-extrabold mb-3">Pi-Native Billing</h2>
            <p className="text-gray-600">
              Tamamen blokzincir tabanlı, şeffaf ve güvenli abonelik yönetim
              sistemi.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
