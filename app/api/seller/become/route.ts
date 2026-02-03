// app/api/seller/become/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { pi_uid } = await req.json();
    if (!pi_uid) return NextResponse.json({ error: "pi_uid required" }, { status: 400 });

    const admin = supabaseAdmin();

    const { data: prof } = await admin
      .from("profiles")
      .select("id,is_seller")
      .eq("pi_uid", pi_uid)
      .maybeSingle();

    if (prof) {
      if (prof.is_seller) return NextResponse.json({ ok: true, already: true });
      const upd = await admin
        .from("profiles")
        .update({ is_seller: true, updated_at: new Date().toISOString() })
        .eq("id", prof.id);
      if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    // Yeni profil aç (bu route'u gerçekten kullanıyorsan, burada auth bağlamak daha doğru olur)
    const id = crypto.randomUUID();

    const ins = await admin.from("profiles").insert({
      id,
      pi_uid,
      is_seller: true,
      is_member: false,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 400 });

    return NextResponse.json({ ok: true, created: true, id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "failed" }, { status: 500 });
  }
}
