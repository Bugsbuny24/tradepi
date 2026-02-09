// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client (ADMIN).
 * - Server-side ONLY
 * - Uses SUPABASE_SERVICE_ROLE_KEY
 */
export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRole) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

// Backward/compat alias (projedeki diğer dosyalar bunu kullanıyor)
export const createAdminClient = createSupabaseAdmin;
