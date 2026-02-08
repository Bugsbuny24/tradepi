import TopupClient from "./topup-client";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TopupPage() {
  const supabase = await createClient();

  // packages tablosu RLS yüzünden okunamıyorsa:
  // geçici olarak admin client ile çekebilirsin. Şimdilik anon/SSR ile deniyoruz.
  const { data: packages } = await supabase
    .from("packages")
    .select("code,title,price_pi,is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const safe = (packages ?? []).map((p: any) => ({
    code: p.code,
    title: p.title,
    price_pi: Number(p.price_pi ?? 0)
  }));

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">Topup</h1>
      <p className="mt-2 text-sm text-gray-600">
        Otomatik ödeme Pi Browser içinde çalışır.
      </p>

      <div className="mt-6">
        <TopupClient packages={safe} disabled={safe.length === 0} />
      </div>

      {safe.length === 0 && (
        <p className="mt-4 text-sm text-red-600">
          packages tablosu boş ya da RLS yüzünden okunamıyor.
        </p>
      )}
    </main>
  );
}
