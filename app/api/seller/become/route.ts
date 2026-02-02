import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { pi_uid } = await req.json();
    if (!pi_uid) return NextResponse.json({ error: "pi_uid required" }, { status: 400 });

    // profil varsa bul yoksa oluştur (kısaca upsert)
    const { data: prof } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("pi_uid", pi_uid)
      .maybeSingle();

    if (prof?.id) {
      const { error } = await supabaseAdmin.from("profiles").update({ is_seller: true }).eq("id", prof.id);
      if (error) throw new Error(error.message);
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabaseAdmin.from("profiles").insert({
      pi_uid,
      is_seller: true,
      is_member: false,
      is_verified: false,
    });

    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "error" }, { status: 500 });
  }
}
