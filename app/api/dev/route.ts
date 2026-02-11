import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Lightweight health endpoint for checking the deployment from Pi Browser / Vercel.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    ts: new Date().toISOString(),
  });
}
