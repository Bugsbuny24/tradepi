import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border p-6 bg-white shadow-sm text-center">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-6">Hoşgeldin {user.email}</p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl border px-4 py-2 font-semibold"
          >
            Ana Sayfa
          </Link>

          <form action="/auth/signout" method="post">
            <button className="rounded-xl bg-black text-white px-4 py-2 font-semibold">
              Çıkış Yap
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
