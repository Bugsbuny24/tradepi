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
  const token = decodeURIComponent(params.token ?? "").trim();

  if (!token) {
    return NextResponse.json({ error: "TOKEN_REQUIRED" }, { status: 400 });
  }

  let tokenId: string | null = null;
  let chartId: string | null = null;
  let ownerId: string | null = null;

  // 1) Token Çözümleme
  if (isUuid(token)) {
    chartId = token; 
  } else {
    const prefix = token.slice(0, 8);
    const hash = sha256Hex(token);

    const { data: tData } = await admin
      .from("chart_tokens")
      .select("id, chart_id, user_id")
      .eq("token_prefix", prefix)
      .eq("token_hash", hash)
      .is("revoked_at", null)
      .maybeSingle();

    if (!tData) return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 403 });
    
    tokenId = tData.id;
    chartId = tData.chart_id;
    ownerId = tData.user_id;
  }

  // 2) Grafik ve Ayarları Çek
  const { data: chart, error: chartErr } = await admin
    .from("charts")
    .select("*, data_entries(*), embed_settings(*)")
    .eq("id", chartId)
    .single();

  if (chartErr || !chart) {
    return NextResponse.json({ error: "CHART_NOT_FOUND" }, { status: 404 });
  }

  // 3) Kredi Tüketimi (TypeScript Uyumlu Obje Yapısı)
  try {
    const wantsNoWatermark = chart.embed_settings?.remove_watermark || false;
    
    await consumeCredits({
      userId: ownerId || chart.user_id,
      meter: wantsNoWatermark ? "watermark_off_views_remaining" : "embed_view_remaining",
      amount: 1,
      refType: "chart_view",
      refId: chartId,
      meta: { token_id: tokenId, ua: req.headers.get("user-agent") }
    });
    
  } catch (e: any) {
    return NextResponse.json(
      { 
        error: "TOPUP_REQUIRED", 
        message: e?.message || "Kredi yetersiz.",
        meter: chart.embed_settings?.remove_watermark ? "watermark_off_views_remaining" : "embed_view_remaining"
      }, 
      { status: 402 }
    );
  }

  // 4) Analytics Kaydı (Embed Counter)
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
        chart_id: chartId,
        owner_id: ownerId || chart.user_id,
        view_count: 1,
        last_view_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  // 5) Başarılı Yanıt
  return NextResponse.json({ ok: true, chart });
}
