import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { payment_id, raw } = await req.json().catch(() => ({}));
  if (!payment_id) return NextResponse.json({ error: "payment_id required" }, { status: 400 });

  const admin = supabaseAdmin();
  const upd = await admin.from("pi_payments").update({
    status: "server_approved",
    raw: raw ?? null,
    updated_at: new Date().toISOString(),
  }).eq("payment_id", payment_id);

  if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
