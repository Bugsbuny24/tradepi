import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">
        Giriş yapan: <b>{user.email}</b>
      </p>

      <div className="mt-6 flex gap-3">
        <a
          href="/topup"
          className="rounded-lg border px-4 py-2 text-sm font-semibold"
        >
          Topup
        </a>

        <form action="/auth/logout" method="post">
          <button className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white">
            Çıkış
          </button>
        </form>
      </div>
    </main>
  );
}
