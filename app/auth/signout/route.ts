import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createServerClient();
  await supabase.auth.signOut();

  const url = new URL(request.url);
  return NextResponse.redirect(new URL("/", url.origin), {
    status: 303,
  });
}
