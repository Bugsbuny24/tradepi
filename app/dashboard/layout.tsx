import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const piUsername = cookies().get("pi_username")?.value;

  // ✅ Pi cookie varsa login say
  if (piUsername) return <>{children}</>;

  // Supabase fallback
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/auth/login?next=/dashboard");

  return <>{children}</>;
}
