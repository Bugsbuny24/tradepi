import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { token: string } }) {
  // Placeholder chart endpoint
  return NextResponse.json({
    ok: true,
    token: params.token,
    data: [
      { name: "A", value: 10 },
      { name: "B", value: 25 },
      { name: "C", value: 15 },
    ],
  });
}
