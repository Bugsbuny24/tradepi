import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/auth/login");

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-xl rounded-2xl border p-6">
        <h1 className="text-2xl font-black">Dashboard</h1>

        <p className="mt-2 text-sm text-gray-600">
          Hoşgeldin <b>{session.user.email}</b>
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl border hover:bg-gray-50 transition"
          >
            Ana Sayfa
          </Link>

          <form action="/api/auth/logout" method="post">
            <button className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 transition">
              Çıkış Yap
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
