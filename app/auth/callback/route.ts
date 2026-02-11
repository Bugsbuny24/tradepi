import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // You can safely redirect to home or dashboard.
  // If you later add OAuth providers, you can handle code/state here.
  return NextResponse.redirect(new URL("/", url.origin));
}
