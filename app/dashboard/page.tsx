import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <pre>{JSON.stringify(data.user, null, 2)}</pre>
    </div>
  );
}
