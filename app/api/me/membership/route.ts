import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { userId } = await req.json(); // Supabase user uuid bekliyoruz

  if (!userId) return NextResponse.json({ ok: false, error: "userId missing" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("membership_expires_at, selected_category_id")
    .eq("id", userId)
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const expires = data?.membership_expires_at ? new Date(data.membership_expires_at).getTime() : 0;
  const isMember = expires > Date.now();

  return NextResponse.json({
    ok: true,
    isMember,
    expires_at: data.membership_expires_at,
    selected_category_id: data.selected_category_id,
  });
}
