import PiLoginButton from "@/components/PiLoginButton";

export default function HomePage() {
  return (
    <main className="relative">
      {/* Üst Bar (logo/ikon alanın varsa burada kalabilir) */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <span className="text-xl font-extrabold">SnapLogic</span>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-20 pb-10">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight">
          Veri Analitiğinde
          <br />
          Yeni Standart.
        </h1>

        <p className="mt-6 text-base md:text-lg opacity-80">
          SnapScript v0 motoruyla güçlendirilmiş, dünyanın ilk Pi-Native veri
          görselleştirme terminali ile tanışın.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <a
            href="#kesfet"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-3 font-bold"
          >
            Sistemi Keşfet
          </a>

          {/* ✅ Pi Auth butonu (client component) */}
          <PiLoginButton />
        </div>
      </section>

      {/* İçerik */}
      <section id="kesfet" className="mx-auto max-w-4xl px-4 pb-24">
        <div className="py-8">
          <h2 className="text-2xl font-extrabold">SnapScript Engine</h2>
          <p className="mt-2 opacity-80">
            Veriler arası reaktif bağıntılar kuran özel düşük-seviyeli kodlama dili.
          </p>
        </div>

        <div className="py-8">
          <h2 className="text-2xl font-extrabold">Universal Embed</h2>
          <p className="mt-2 opacity-80">
            Görselleştirmelerinizi her türlü dijital ortama tek satır kodla entegre edin.
          </p>
        </div>

        <div className="py-8">
          <h2 className="text-2xl font-extrabold">Pi-Native Billing</h2>
          <p className="mt-2 opacity-80">
            Tamamen blokzincir tabanlı, şeffaf ve güvenli abonelik yönetim sistemi.
          </p>
        </div>
      </section>
    </main>
  );
}
