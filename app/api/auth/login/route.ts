import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");

  const url = new URL(req.url);
  const origin = url.origin;

  if (!email || !password) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=missing_fields&next=${encodeURIComponent(next)}`,
      { status: 303 }
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error.code ?? "login_failed")}&next=${encodeURIComponent(next)}`,
      { status: 303 }
    );
  }

  return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/dashboard"}`, {
    status: 303,
  });
}
