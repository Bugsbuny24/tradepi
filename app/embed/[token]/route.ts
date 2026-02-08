import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { consumeCredits } from "@/lib/billing/consume";
import { renderEmbedHtml } from "@/lib/embed/runtime";
import { tokenPrefix, tokenHashSha256 } from "@/lib/token";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export async function GET(req: Request, { params }: { params: { token: string } }) {
  const admin = createAdminClient();
  const token = decodeURIComponent(params.token ?? "").trim();

  if (!token) return NextResponse.json({ error: "TOKEN_REQUIRED" }, { status: 400 });

  let tokenId: string | null = null;
  let chartId: string | null = null;
  let ownerId: string | null = null;
  let tokenPref: string | null = null;

  // 1) token çöz
  if (isUuid(token)) {
    chartId = token;
    tokenPref = "direct";
  } else {
    // ✅ DB check: token_prefix_len_10 → ilk 10 karakter olmalı
    const prefix = tokenPrefix(token);
    const hash = tokenHashSha256(token);

    const { data: tok, error: tokErr } = await admin
      .from("chart_tokens")
      .select("id, chart_id, user_id, token_prefix, revoked_at, expires_at, scope")
      .eq("token_prefix", prefix)
      .eq("token_hash", hash)
      .is("revoked_at", null)
      .maybeSingle();

    if (tokErr) return NextResponse.json({ error: tokErr.message }, { status: 500 });
    if (!tok) return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 404 });

    if (tok.expires_at && new Date(tok.expires_at).getTime() <= Date.now()) {
      return NextResponse.json({ error: "TOKEN_EXPIRED" }, { status: 403 });
    }

    // scope kontrol
    if (tok.scope && !["embed", "all", "read"].includes(String(tok.scope))) {
      return NextResponse.json({ error: "TOKEN_SCOPE_FORBIDDEN" }, { status: 403 });
    }

    tokenId = tok.id;
    chartId = tok.chart_id;
    ownerId = tok.user_id;
    tokenPref = tok.token_prefix;
  }

  // 2) chart + settings + entries çek
  const { data: chart, error: chartErr } = await admin
    .from("charts")
    .select("id, user_id, title, chart_type, is_public")
    .eq("id", chartId)
    .maybeSingle();

  if (chartErr) return NextResponse.json({ error: chartErr.message }, { status: 500 });
  if (!chart) return NextResponse.json({ error: "CHART_NOT_FOUND" }, { status: 404 });

  ownerId = ownerId ?? chart.user_id;

  const [{ data: settings, error: setErr }, { data: entries, error: entErr }] = await Promise.all([
    admin.from("embed_settings").select("*").eq("chart_id", chart.id).maybeSingle(),
    admin
      .from("data_entries")
      .select("label,value,sort_order")
      .eq("chart_id", chart.id)
      .order("sort_order", { ascending: true }),
  ]);

  if (setErr) return NextResponse.json({ error: setErr.message }, { status: 500 });
  if (entErr) return NextResponse.json({ error: entErr.message }, { status: 500 });

  // UUID direct ise public şart
  if (isUuid(token)) {
    const isPublic = Boolean(chart.is_public) || Boolean(settings?.is_public);
    if (!isPublic) return NextResponse.json({ error: "NOT_PUBLIC" }, { status: 403 });
  }

  // 3) watermark kararı
  let wantsNoWatermark = Boolean(settings?.remove_watermark);

  // branding_remove entitlement yoksa watermark kapatma izin verme
  if (wantsNoWatermark) {
    const { data: ent } = await admin
      .from("user_entitlements")
      .select("amount")
      .eq("user_id", ownerId)
      .eq("meter", "branding_remove")
      .maybeSingle();

    if (!ent || (ent.amount ?? 0) <= 0) wantsNoWatermark = false;
  }

  // 4) ✅ embed view kredisi düş (bel kemiği)
  try {
    await consumeCredits(admin, {
      userId: ownerId!,
      meter: "embed_view",
      units: 1,
      refType: "embed_view",
      refId: chart.id,
      meta: {
        token_id: tokenId,
        token_prefix: tokenPref,
        mode: wantsNoWatermark ? "no_watermark" : "normal",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "NO_CREDITS", message: "Not enough credits for embed view" },
      { status: 402 }
    );
  }

  // 5) embed analytics (counter)
  if (tokenId) {
    const { data: existing } = await admin
      .from("embed_counters")
      .select("view_count")
      .eq("token_id", tokenId)
      .maybeSingle();

    if (existing) {
      await admin
        .from("embed_counters")
        .update({
          view_count: (existing.view_count ?? 0) + 1,
          last_view_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("token_id", tokenId);
    } else {
      await admin.from("embed_counters").insert({
        token_id: tokenId,
        chart_id: chart.id,
        owner_id: ownerId,
        view_count: 1,
        last_view_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  // 6) HTML render
  const html = renderEmbedHtml({
    chart,
    settings: settings ?? null,
    entries: entries ?? [],
    watermark: !wantsNoWatermark,
  });

  return new NextResponse(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
      
