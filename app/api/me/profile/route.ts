import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { membershipActive } from "@/lib/membership";

export const runtime = "nodejs";

async function getOrCreateByPiUid(pi_uid: string) {
  // profil var mı
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id,pi_uid,is_seller,is_member,membership_expires_at,selected_category_id")
    .eq("pi_uid", pi_uid)
    .maybeSingle();

  if (existing) return existing;

  // yoksa oluştur (id uuid üretimi db defaultsa ok; değilse backend uuid üretmen gerekir)
  const { data: inserted, error } = await supabaseAdmin
    .from("profiles")
    .insert({
      pi_uid,
      is_seller: false,
      is_member: false,
      is_verified: false,
    })
    .select("id,pi_uid,is_seller,is_member,membership_expires_at,selected_category_id")
    .single();

  if (error) throw new Error(error.message);
  return inserted!;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const pi_uid = body?.pi_uid;

    if (!pi_uid) return NextResponse.json({ error: "pi_uid required" }, { status: 400 });

    const p = await getOrCreateByPiUid(pi_uid);

    return NextResponse.json({
      profile: {
        ...p,
        membership_active: membershipActive(p.membership_expires_at),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { pi_uid, selected_category_id } = body || {};
    if (!pi_uid || !selected_category_id) {
      return NextResponse.json({ error: "pi_uid & selected_category_id required" }, { status: 400 });
    }

    const p = await getOrCreateByPiUid(pi_uid);

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ selected_category_id })
      .eq("id", p.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "error" }, { status: 500 });
  }
}
