import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");

  if (!email || !password) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const u = new URL("/auth/login", req.url);
    u.searchParams.set("error", error.message);
    return NextResponse.redirect(u);
  }

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
