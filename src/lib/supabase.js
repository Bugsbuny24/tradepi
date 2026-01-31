import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured
  ? createClient(url, key)
  : null;

/**
 * Güvenli çağrı:
 * - supabase yoksa: { data:null, error: { message:"SUPABASE_NOT_CONFIGURED" } }
 * - supabase varsa: callback'i çalıştırır
 */
export async function withSupabase(cb) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: { message: "SUPABASE_NOT_CONFIGURED" } };
  }
  try {
    return await cb(supabase);
  } catch (e) {
    return { data: null, error: { message: e?.message || "UNKNOWN_ERROR" } };
  }
}
