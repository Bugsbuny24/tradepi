import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAuthedUserId } from "@/lib/getAuthedUserId";

export async function GET(req: Request) {
  const userId = await getAuthedUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const admin = supabaseAdmin(); // 🔥 KRİTİK SATIR

  const { data, error } = await admin
    .from("profiles")
    .select(
      "id, username, display_name, is_seller, is_member, membership_plan, membership_expires_at"
    )
    .eq("id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, profile: data });
}
