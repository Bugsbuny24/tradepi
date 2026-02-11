import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  // Eğer callback’e error geldiyse login’e geri bas
  const error = url.searchParams.get("error");
  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error)}`, origin)
    );
  }

  // İstersen callback sonrası gideceği yer
  const next = url.searchParams.get("next") || "/dashboard";

  return NextResponse.redirect(new URL(next, origin));
}
