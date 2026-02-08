import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // sende nasıl ise bunu uyarlarsın

function ip(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}

export async function GET(req: Request, ctx: { params: { token: string } }) {
  const supabase = await createClient();
  const token = (ctx.params.token ?? "").trim();
  if (!token) return NextResponse.json({ error: "missing_token" }, { status: 400 });

  // TODO: burada token_hash hesaplamalısın (sha256 vs)
  const token_prefix = token.slice(0, 10);
  const token_hash = token; // <-- prod: hash(token)

  const { data: t, error: tErr } = await supabase
    .from("chart_tokens")
    .select("id, user_id, chart_id, revoked_at, expires_at, scope")
    .eq("token_prefix", token_prefix)
    .eq("token_hash", token_hash)
    .maybeSingle();

  if (tErr || !t) return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  if (t.revoked_at) return NextResponse.json({ error: "revoked" }, { status: 403 });
  if (t.expires_at && new Date(t.expires_at).getTime() < Date.now())
    return NextResponse.json({ error: "expired" }, { status: 403 });

  // kredi düş (E1)
  const { error: consumeErr } = await supabase.rpc("consume_credits", {
    p_user_id: t.user_id,
    p_meter: "api_call",
    p_units: 1,
    p_ref_type: "chart",
    p_ref_id: t.chart_id,
    p_meta: { ip: ip(req), ua: req.headers.get("user-agent") }
  });

  if (consumeErr) {
    return NextResponse.json({ error: "no_credits" }, { status: 402 });
  }

  const { data: chart, error: cErr } = await supabase
    .from("charts")
    .select("id, title, chart_type")
    .eq("id", t.chart_id)
    .maybeSingle();

  if (cErr || !chart) return NextResponse.json({ error: "chart_not_found" }, { status: 404 });

  const { data: rows, error: rErr } = await supabase
    .from("data_entries")
    .select("label, value, sort_order")
    .eq("chart_id", t.chart_id)
    .order("sort_order", { ascending: true });

  if (rErr) return NextResponse.json({ error: "data_error" }, { status: 500 });

  return NextResponse.json({ chart, data: rows ?? [] });
}
