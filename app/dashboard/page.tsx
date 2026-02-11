import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Hoşgeldin {user.email}</p>

        <div className="mt-6 flex gap-3">
          <a
            href="/"
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Ana Sayfa
          </a>

          <form action="/api/auth/logout" method="post">
            <button className="rounded-lg bg-black px-4 py-2 text-sm text-white">
              Çıkış Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
