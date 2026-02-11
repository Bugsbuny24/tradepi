import Link from "next/link";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const piUsername = cookies().get("pi_username")?.value;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-black">Dashboard</h1>

      {piUsername ? (
        <div className="text-sm">
          Pi kullanıcı: <b>@{piUsername}</b>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          Supabase oturumu veya Pi cookie bulunamadı.
        </div>
      )}

      <div className="flex gap-3">
        <Link className="underline" href="/dashboard/designer">
          Designer
        </Link>
        <Link className="underline" href="/dashboard/billing">
          Billing
        </Link>
        <Link className="underline" href="/auth/login">
          Login
        </Link>
      </div>
    </div>
  );
}
