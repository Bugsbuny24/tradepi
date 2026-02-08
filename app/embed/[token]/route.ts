import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { consumeCredits } from "@/lib/billing/consume";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  const admin = createAdminClient();
  const url = new URL(req.url);

  const token = decodeURIComponent(params.token ?? "").trim();
  if (!token) {
    return NextResponse.json({ error: "TOKEN_REQUIRED" }, { status: 400 });
  }

  // 1) Token çöz
  let tokenId: string | null = null;
  let chartId: string | null = null;
  let ownerId: string | null = null;
  let tokenPrefix: string | null = null;

  if (isUuid(token)) {
    // UUID geldiyse: direkt chart id gibi davran (public chart için)
    chartId = token;
    tokenPrefix = "direct";
  } else {
    const prefix = token.slice(0, 8);
    const hash = sha256Hex(token);

    const { data: tok, error: tokErr } = await admin
      .from("chart_tokens")
      .select("id, chart_id, user_id, token_prefix, revoked_at, expires_at, scope")
      .eq("token_prefix", prefix)
      .eq("token_hash", hash)
      .is("revoked_at", null)
      .maybeSingle();

    if (tokErr) {
      return NextResponse.json({ error: tokErr.message }, { status: 500 });
    }
    if (!tok) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 404 });
    }
    if (tok.expires_at && new Date(tok.expires_at).getTime() <= Date.now()) {
      return NextResponse.json({ error: "TOKEN_EXPIRED" }, { status: 403 });
    }

    tokenId = tok.id;
    chartId = tok.chart_id;
    ownerId = tok.user_id;
    tokenPrefix = tok.token_prefix;
  }

  // 2) Chart çek
  const { data: chart, error: chartErr } = await admin
    .from("charts")
    .select("id, user_id, title, chart_type, is_public, created_at")
    .eq("id", chartId)
    .maybeSingle();

  if (chartErr) return NextResponse.json({ error: chartErr.message }, { status: 500 });
  if (!chart) return NextResponse.json({ error: "CHART_NOT_FOUND" }, { status: 404 });

  // ownerId yoksa chart'tan al
  ownerId = ownerId ?? chart.user_id;

  // 3) Embed settings + data entries çek
  const [{ data: settings, error: setErr }, { data: entries, error: entErr }] =
    await Promise.all([
      admin
        .from("embed_settings")
        .select("*")
        .eq("chart_id", chart.id)
        .maybeSingle(),
      admin
        .from("data_entries")
        .select("id, label, value, sort_order")
        .eq("chart_id", chart.id)
        .order("sort_order", { ascending: true }),
    ]);

  if (setErr) return NextResponse.json({ error: setErr.message }, { status: 500 });
  if (entErr) return NextResponse.json({ error: entErr.message }, { status: 500 });

  // 4) Public kontrol (istersen bunu sıkılaştır)
  // - Token ile geliyorsa zaten erişim var.
  // - UUID direct chart id ile geliyorsa public olsun.
  if (isUuid(token)) {
    const isPublic = Boolean(chart.is_public) || Boolean(settings?.is_public);
    if (!isPublic) {
      return NextResponse.json({ error: "NOT_PUBLIC" }, { status: 403 });
    }
  }

  // 5) Krediyi düş (para motoru)
  // Watermark kapalıysa: watermark_off_views_remaining
  // Normal embed: embed_view_remaining
  const wantsNoWatermark = Boolean(settings?.remove_watermark);

  try {
    await consumeCredits(admin, {
      userId: ownerId!,
      meter: wantsNoWatermark ? "watermark_off_views_remaining" : "embed_view_remaining",
      amount: 1,
      refType: "embed_view",
      refId: chart.id,
      meta: {
        token_prefix: tokenPrefix,
        token_id: tokenId,
        mode: wantsNoWatermark ? "no_watermark" : "normal",
        ua: req.headers.get("user-agent") ?? null,
      },
    });
  } catch (e: any) {
    // kredi yoksa topup
    return NextResponse.json(
      {
        error: "TOPUP_REQUIRED",
        message: e?.message ?? "Insufficient credits",
        meter: wantsNoWatermark ? "watermark_off_views_remaining" : "embed_view_remaining",
      },
      { status: 402 }
    );
  }

  // 6) Embed counters (analytics) — tokenId varsa say
  if (tokenId) {
    const { data: existing, error: exErr } = await admin
      .from("embed_counters")
      .select("view_count")
      .eq("token_id", tokenId)
      .maybeSingle();

    if (!exErr) {
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
  }

  // 7) JSON dön (widget/embed client bunu kullanır)
  return NextResponse.json({
    chart,
    entries: entries ?? [],
    settings: settings ?? null,
    watermark: !wantsNoWatermark,
  });
}
