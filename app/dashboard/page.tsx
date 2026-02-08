import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BalanceCard from "./balance-card";

export const dynamic = "force-dynamic";

const FREE_QUOTAS = {
  embed_view_remaining: 2000,
  widget_load_remaining: 2000,
  api_call_remaining: 500,
  watermark_off_views_remaining: 0,
  human_task_remaining: 0,
  human_minute_remaining: 0,
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // 1) quotas
  const { data: uq } = await supabase
    .from("user_quotas")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const quotas = uq ?? FREE_QUOTAS;

  // 2) last purchase -> package_code
  const { data: lastPurchase } = await supabase
    .from("pi_purchases")
    .select("package_code, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const planCode = lastPurchase?.package_code ?? "FREE";
  let planTitle = "Free";

  if (planCode !== "FREE") {
    const { data: pkg } = await supabase
      .from("packages")
      .select("title")
      .eq("code", planCode)
      .maybeSingle();

    planTitle = pkg?.title ?? planCode;
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Giriş yapan: <b>{user.email}</b></p>
      </div>

      <BalanceCard planTitle={planTitle} planCode={planCode} quotas={quotas} />

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">Hızlı Linkler</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <a className="rounded-lg border px-3 py-2 text-sm" href="/topup">Topup</a>
          <a className="rounded-lg border px-3 py-2 text-sm" href="/charts">Charts</a>
          <form action="/api/auth/logout" method="post">
            <button className="rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white">
              Çıkış
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
