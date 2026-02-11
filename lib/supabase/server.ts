import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * Server Components için Supabase client.
 * Not: async değil; direkt client döndürür.
 */
export const createClient = () => {
  return createServerComponentClient({ cookies });
};

/**
 * Projede bazı yerler createServerClient import ediyor.
 * Uyumluluk için alias olarak export ediyoruz.
 */
export const createServerClient = createClient;
