import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!url || !service) {
    throw new Error("Missing SUPABASE envs");
  }

  return createClient(url, service, {
    auth: {
      persistSession: false,
    },
  });
}
