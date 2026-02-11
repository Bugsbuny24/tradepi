import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // You can protect routes here if needed.
  // For now, just pass through.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
