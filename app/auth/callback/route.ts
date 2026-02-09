import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(next: string | null) {
  if (!next) return "/dashboard";
  // open-redirect koruması: sadece internal path
  if (!next.startsWith("/")) return "/dashboard";
  return next;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type"); // signup | magiclink | recovery | email_change
  const nextPath = safeNextPath(url.searchParams.get("next"));

  const supabase = await createClient();

  // 1) OAuth/PKCE gibi akışlar -> code
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${origin}/auth/login?error=${encodeURIComponent(error.code ?? "auth_callback_failed")}`,
        { status: 303 }
      );
    }
  }

  // 2) Email verify / magic link -> token_hash + type
  if (!code && token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (error) {
      return NextResponse.redirect(
        `${origin}/auth/login?error=${encodeURIComponent(error.code ?? "verify_otp_failed")}`,
        { status: 303 }
      );
    }
  }

  return NextResponse.redirect(`${origin}${nextPath}`, { status: 303 });
}
