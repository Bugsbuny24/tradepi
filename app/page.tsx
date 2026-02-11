import PiLoginButton from "@/components/PiLoginButton";

export default function HomePage() {
  return (
    <main className="p-8 max-w-3xl mx-auto space-y-10">
      <div className="space-y-2">
        <div className="text-xl">SnapLogic</div>
        <h1 className="text-5xl font-black leading-tight">
          Veri Analitiğinde
          <br />
          Yeni Standart.
        </h1>
        <p className="text-gray-600">
          SnapScript v0 motoruyla güçlendirilmiş, dünyanın ilk Pi-Native veri
          görselleştirme terminali ile tanışın.
        </p>

        <a className="underline text-blue-600" href="/dashboard/designer">
          Sistemi Keşfet
        </a>

        <div className="pt-2">
          <PiLoginButton />
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-3xl font-black">SnapScript Engine</h2>
        <p className="text-gray-600">
          Veriler arası reaktif bağıntılar kuran özel düşük-seviyeli kodlama dili.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-black">Universal Embed</h2>
        <p className="text-gray-600">
          Görselleştirmelerinizi her türlü dijital ortama tek satır kodla entegre edin.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-black">Pi-Native Billing</h2>
        <p className="text-gray-600">
          Tamamen blokzincir tabanlı, şeffaf ve güvenli abonelik yönetim sistemi.
        </p>
      </section>
    </main>
  );
}
