// app/api/auth/update-password/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Update password failed" },
      { status: 500 }
    );
  }
}
