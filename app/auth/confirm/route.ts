import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Supabase email confirmation can land here. If you add token exchange later,
  // handle it here. For now, just go to login.
  return NextResponse.redirect(new URL("/auth/login", url.origin));
}
