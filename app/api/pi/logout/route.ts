import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;

  // cookie sil
  res.cookies.set({
    name: "pi_session",
    value: "",
    path: "/",
    maxAge: 0,
    domain,
  });

  res.cookies.set({
    name: "pi_username",
    value: "",
    path: "/",
    maxAge: 0,
    domain,
  });

  return res;
}
