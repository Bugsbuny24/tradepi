import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const piUsername = cookies().get("pi_username")?.value;

  if (piUsername) return <>{children}</>;

  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/auth/login");

  return <>{children}</>;
}
