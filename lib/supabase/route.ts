import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function createClient() {
  return createRouteHandlerClient({ cookies });
}
