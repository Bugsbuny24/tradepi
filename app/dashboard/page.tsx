import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/auth/login");

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-black">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Giriş yapan kullanıcı: <span className="font-semibold">{user.email}</span>
        </p>

        <div className="mt-8 rounded-3xl border border-gray-100 p-6">
          <h2 className="text-xl font-extrabold">Hızlı İşlemler</h2>
          <p className="mt-2 text-gray-600">
            Şimdilik sadece normal login (Supabase) var. Pi SDK / Pi ödeme entegrasyonu kaldırıldı.
          </p>

          <form action="/api/auth/logout" method="post" className="mt-5">
            <button className="rounded-2xl bg-black px-5 py-3 font-extrabold text-white hover:opacity-90">
              Çıkış Yap
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
