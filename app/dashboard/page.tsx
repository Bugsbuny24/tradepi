import Link from "next/link";
import { redirect } from "next/navigation";
import TestPiPaymentButton from "./TestPiPaymentButton";
import { createServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border text-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Hoşgeldin {user.email}</p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Ana Sayfa
          </Link>
          <form action="/auth/logout" method="post">
            <button className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900">
              Çıkış Yap
            </button>
          </form>
        </div>

        <TestPiPaymentButton />
      </div>
    </div>
  );
}
