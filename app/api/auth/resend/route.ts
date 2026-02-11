import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/route";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const supabase = await createClient();

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}
